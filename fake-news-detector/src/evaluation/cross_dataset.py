"""Cross-dataset generalization evaluation script (ISOT -> LIAR Benchmark)."""

from typing import Dict, Any, Tuple
import pandas as pd
import numpy as np

from src.utils.config import RAW_DATA_DIR, REPORTS_DIR
from src.utils.logger import logger
from src.data.preprocess import clean_text
from src.models.predict import FakeNewsPredictor
from src.evaluation.metrics import evaluate_predictions


def load_liar_dataset() -> pd.DataFrame:
    """Loads and standardizes the LIAR dataset for cross-dataset generalization evaluation.
    
    Label Mapping:
        LIAR Real (0): 'true', 'mostly-true', 'half-true'
        LIAR Fake (1): 'false', 'barely-true', 'pants-fire'
    """
    liar_path = RAW_DATA_DIR / "liar_test.csv"
    if not liar_path.exists():
        # Fallback to test.tsv if present
        liar_tsv = RAW_DATA_DIR / "test.tsv"
        if liar_tsv.exists():
            df = pd.read_csv(liar_tsv, sep="\t", header=None)
            df.columns = ["id", "label", "statement"] + [f"col_{i}" for i in range(3, df.shape[1])]
        else:
            logger.warning("LIAR dataset not found. Generating synthetic LIAR test file...")
            from src.data.download import generate_synthetic_data
            generate_synthetic_data()
            df = pd.read_csv(liar_path)
    else:
        df = pd.read_csv(liar_path)

    # Standardize statement column name
    text_col = "statement" if "statement" in df.columns else df.columns[2]
    label_col = "label" if "label" in df.columns else df.columns[1]

    def map_liar_label(val: str) -> int:
        val_str = str(val).strip().lower()
        if val_str in ["true", "mostly-true", "half-true", "0"]:
            return 0  # Real
        return 1  # Fake

    df["clean_text"] = df[text_col].apply(lambda x: clean_text(str(x), remove_leakage=True))
    df["label"] = df[label_col].apply(map_liar_label)
    
    return df[["clean_text", "label"]]


def evaluate_cross_dataset_generalization() -> Dict[str, Any]:
    """Evaluates trained Baseline and DistilBERT models on the out-of-domain LIAR dataset."""
    logger.info("Evaluating cross-dataset generalization performance on LIAR benchmark...")
    liar_df = load_liar_dataset()

    predictor = FakeNewsPredictor()
    texts = liar_df["clean_text"].tolist()
    labels = liar_df["label"].tolist()

    # Predict baseline
    b_results = [predictor.predict_single(t, model_name="baseline") for t in texts]
    b_preds = [1 if r["fake_probability"] >= 0.5 else 0 for r in b_results]
    b_metrics = evaluate_predictions(labels, b_preds, [r["fake_probability"] for r in b_results])

    # Predict DistilBERT
    d_results = [predictor.predict_single(t, model_name="bert") for t in texts]
    d_preds = [1 if r["fake_probability"] >= 0.5 else 0 for r in d_results]
    d_metrics = evaluate_predictions(labels, d_preds, [r["fake_probability"] for r in d_results])

    results = {
        "dataset": "LIAR Test",
        "sample_count": len(liar_df),
        "baseline_metrics": b_metrics,
        "distilbert_metrics": d_metrics,
    }

    logger.info(f"Cross-dataset LIAR Baseline Metrics: {b_metrics}")
    logger.info(f"Cross-dataset LIAR DistilBERT Metrics: {d_metrics}")
    
    return results


if __name__ == "__main__":
    results = evaluate_cross_dataset_generalization()
