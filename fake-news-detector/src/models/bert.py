"""DistilBERT Fine-tuning script with Hugging Face Trainer & PyTorch CPU/GPU fallback."""

import os
import time
from typing import Dict, Any, Tuple, Optional
import pandas as pd
import numpy as np

try:
    import torch
    from transformers import (
        AutoTokenizer,
        AutoModelForSequenceClassification,
        Trainer,
        TrainingArguments,
        DataCollatorWithPadding,
    )
    from datasets import Dataset
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    torch = None
    AutoTokenizer = None
    AutoModelForSequenceClassification = None
    Trainer = None
    TrainingArguments = None
    DataCollatorWithPadding = None
    Dataset = None

from src.utils.config import BERT_MODEL_DIR, BERT_PARAMS, RANDOM_SEED, PROCESSED_DATA_DIR
from src.utils.logger import logger
from src.evaluation.metrics import compute_huggingface_metrics, evaluate_predictions


def get_device():
    """Returns CUDA device if GPU available, else CPU."""
    if not TORCH_AVAILABLE:
        raise RuntimeError("PyTorch is not installed in this environment.")
    if torch.cuda.is_available():
        logger.info(f"CUDA GPU available: {torch.cuda.get_device_name(0)}")
        return torch.device("cuda")
    logger.info("CUDA GPU not available. Running on CPU with reduced dataset sample size.")
    return torch.device("cpu")
    if torch.cuda.is_available():
        logger.info(f"CUDA GPU available: {torch.cuda.get_device_name(0)}")
        return torch.device("cuda")
    logger.info("CUDA GPU not available. Running on CPU with reduced dataset sample size.")
    return torch.device("cpu")


def train_bert(
    train_df: pd.DataFrame,
    val_df: pd.DataFrame,
    test_df: pd.DataFrame,
    cpu_fallback_limit: Optional[int] = 100
) -> Tuple[Any, Any, Dict[str, float]]:
    """Fine-tunes DistilBERT for text classification.
    
    Args:
        train_df: Training DataFrame.
        val_df: Validation DataFrame.
        test_df: Test DataFrame.
        cpu_fallback_limit: Max samples if running on CPU to ensure quick local test run.
        
    Returns:
        Tuple of (model, tokenizer, test_metrics).
    """
    device = get_device()
    
    # Apply sample limit if on CPU to prevent long training freezes
    if device.type == "cpu" and cpu_fallback_limit and len(train_df) > cpu_fallback_limit:
        logger.info(f"Subsampling datasets to {cpu_fallback_limit} rows for fast CPU verification.")
        train_df = train_df.sample(n=cpu_fallback_limit, random_state=RANDOM_SEED)
        val_df = val_df.sample(n=min(len(val_df), 30), random_state=RANDOM_SEED)
        test_df = test_df.sample(n=min(len(test_df), 30), random_state=RANDOM_SEED)

    model_name = BERT_PARAMS["model_name"]
    logger.info(f"Loading pretrained tokenizer and model for '{model_name}'...")
    
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name,
        num_labels=2,
    )

    def tokenize_function(examples):
        return tokenizer(
            examples["clean_text"],
            truncation=True,
            max_length=BERT_PARAMS["max_length"],
        )

    # Convert pandas DataFrames to Hugging Face Datasets
    ds_train = Dataset.from_pandas(train_df[["clean_text", "label"]])
    ds_val = Dataset.from_pandas(val_df[["clean_text", "label"]])
    ds_test = Dataset.from_pandas(test_df[["clean_text", "label"]])

    ds_train = ds_train.map(tokenize_function, batched=True)
    ds_val = ds_val.map(tokenize_function, batched=True)
    ds_test = ds_test.map(tokenize_function, batched=True)

    output_dir = BERT_MODEL_DIR / "checkpoints"
    
    training_args = TrainingArguments(
        output_dir=str(output_dir),
        eval_strategy="epoch",
        save_strategy="epoch",
        learning_rate=BERT_PARAMS["learning_rate"],
        per_device_train_batch_size=BERT_PARAMS["batch_size"] if device.type == "cuda" else 4,
        per_device_eval_batch_size=BERT_PARAMS["batch_size"] if device.type == "cuda" else 4,
        num_train_epochs=BERT_PARAMS["epochs"] if device.type == "cuda" else 1,
        weight_decay=BERT_PARAMS["weight_decay"],
        warmup_ratio=BERT_PARAMS["warmup_ratio"],
        logging_steps=10,
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        seed=RANDOM_SEED,
        report_to="none",  # Disable wandb/comet integration by default
        use_cpu=(device.type == "cpu"),
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=ds_train,
        eval_dataset=ds_val,
        tokenizer=tokenizer,
        data_collator=DataCollatorWithPadding(tokenizer=tokenizer),
        compute_metrics=compute_huggingface_metrics,
    )

    logger.info("Starting DistilBERT fine-tuning...")
    start_time = time.time()
    trainer.train()
    train_time = round(time.time() - start_time, 2)
    logger.info(f"DistilBERT fine-tuning finished in {train_time}s")

    # Evaluate on Test Set
    logger.info("Evaluating DistilBERT on test set...")
    predictions = trainer.predict(ds_test)
    logits = predictions.predictions
    probs = torch.softmax(torch.tensor(logits), dim=-1).numpy()[:, 1]
    y_pred = np.argmax(logits, axis=-1)
    y_test = predictions.label_ids

    test_metrics = evaluate_predictions(y_test, y_pred, probs)
    test_metrics["training_time_s"] = train_time
    logger.info(f"DistilBERT Test Metrics: {test_metrics}")

    # Save fine-tuned model and tokenizer
    BERT_MODEL_DIR.mkdir(parents=True, exist_ok=True)
    model.save_pretrained(str(BERT_MODEL_DIR))
    tokenizer.save_pretrained(str(BERT_MODEL_DIR))
    logger.info(f"Saved DistilBERT fine-tuned model and tokenizer to {BERT_MODEL_DIR}")

    # MLflow Logging
    try:
        import mlflow
        mlflow.set_experiment("Fake_News_Detector_DistilBERT")
        with mlflow.start_run(run_name="DistilBERT_FineTuned"):
            mlflow.log_params(BERT_PARAMS)
            mlflow.log_metrics(test_metrics)
            logger.info("Logged DistilBERT training metrics to MLflow.")
    except Exception as e:
        logger.warning(f"MLflow logging skipped: {e}")

    return model, tokenizer, test_metrics


def load_bert() -> Tuple[Any, Any]:
    """Loads fine-tuned DistilBERT model and tokenizer from disk."""
    if not TORCH_AVAILABLE:
        raise RuntimeError("PyTorch is not installed in this environment.")
    if not (BERT_MODEL_DIR / "config.json").exists():
        raise FileNotFoundError(
            f"DistilBERT model not found at {BERT_MODEL_DIR}. Train model or download weights first."
        )
    
    tokenizer = AutoTokenizer.from_pretrained(str(BERT_MODEL_DIR))
    model = AutoModelForSequenceClassification.from_pretrained(str(BERT_MODEL_DIR))
    return model, tokenizer


if __name__ == "__main__":
    from src.data.preprocess import load_and_preprocess_isot
    from src.data.split import split_data

    df = load_and_preprocess_isot(remove_leakage=True)
    train_df, val_df, test_df = split_data(df)
    train_bert(train_df, val_df, test_df, cpu_fallback_limit=50)
