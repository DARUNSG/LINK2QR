"""Baseline TF-IDF + Logistic Regression Model training and evaluation."""

import time
from typing import Dict, Any, Tuple
import pandas as pd
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV

from src.utils.config import (
    BASELINE_MODEL_PATH,
    BASELINE_VECTORIZER_PATH,
    RANDOM_SEED,
    BASELINE_PARAMS,
    PROCESSED_DATA_DIR,
)
from src.utils.logger import logger
from src.evaluation.metrics import evaluate_predictions, plot_confusion_matrix


def train_baseline(
    train_df: pd.DataFrame,
    val_df: pd.DataFrame,
    test_df: pd.DataFrame
) -> Tuple[LogisticRegression, TfidfVectorizer, Dict[str, float]]:
    """Trains TF-IDF + Logistic Regression model with hyperparameter search.
    
    Args:
        train_df: Training DataFrame containing 'clean_text' and 'label'.
        val_df: Validation DataFrame.
        test_df: Test DataFrame.
        
    Returns:
        Tuple of (trained_model, vectorizer, test_metrics).
    """
    logger.info("Initializing TF-IDF Vectorizer...")
    start_time = time.time()
    
    vectorizer = TfidfVectorizer(
        ngram_range=BASELINE_PARAMS["ngram_range"],
        max_features=BASELINE_PARAMS["max_features"],
        stop_words="english",
    )
    
    X_train = vectorizer.fit_transform(train_df["clean_text"])
    y_train = train_df["label"].values
    
    X_val = vectorizer.transform(val_df["clean_text"])
    y_val = val_df["label"].values
    
    X_test = vectorizer.transform(test_df["clean_text"])
    y_test = test_df["label"].values

    logger.info(f"TF-IDF matrix built. Vocabulary size: {len(vectorizer.vocabulary_)}")

    # Hyperparameter Grid Search
    param_grid = {"C": [0.1, 1.0, 10.0]}
    logger.info(f"Running GridSearchCV for Logistic Regression C hyperparameter: {param_grid['C']}...")
    
    base_lr = LogisticRegression(
        max_iter=BASELINE_PARAMS["max_iter"],
        random_state=RANDOM_SEED,
        solver=BASELINE_PARAMS["solver"],
    )
    
    grid = GridSearchCV(base_lr, param_grid, cv=3, scoring="f1", n_jobs=-1)
    grid.fit(X_train, y_train)
    
    best_model: LogisticRegression = grid.best_estimator_
    train_time = round(time.time() - start_time, 2)
    logger.info(f"Best Logistic Regression parameters: {grid.best_params_} (Train time: {train_time}s)")

    # Evaluate on Test Set
    y_pred = best_model.predict(X_test)
    y_proba = best_model.predict_proba(X_test)[:, 1]
    
    metrics = evaluate_predictions(y_test, y_pred, y_proba)
    metrics["training_time_s"] = train_time
    
    logger.info(f"Baseline Test Metrics: {metrics}")

    # Plot Confusion Matrix
    plot_confusion_matrix(y_test, y_pred, title="Baseline (TF-IDF + LogReg) Confusion Matrix")

    # MLflow Logging (if available)
    try:
        import mlflow
        mlflow.set_experiment("Fake_News_Detector_Baseline")
        with mlflow.start_run(run_name="TF-IDF_LogisticRegression"):
            mlflow.log_params(BASELINE_PARAMS)
            mlflow.log_params(grid.best_params_)
            mlflow.log_metrics(metrics)
            logger.info("Logged baseline training metrics to MLflow.")
    except Exception as e:
        logger.warning(f"MLflow logging skipped: {e}")

    # Save artifacts
    save_baseline(best_model, vectorizer)
    return best_model, vectorizer, metrics


def save_baseline(model: LogisticRegression, vectorizer: TfidfVectorizer) -> None:
    """Saves serialized model and vectorizer artifacts with joblib."""
    BASELINE_MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, BASELINE_MODEL_PATH)
    joblib.dump(vectorizer, BASELINE_VECTORIZER_PATH)
    logger.info(f"Saved baseline model to {BASELINE_MODEL_PATH} and vectorizer to {BASELINE_VECTORIZER_PATH}")


def load_baseline() -> Tuple[LogisticRegression, TfidfVectorizer]:
    """Loads baseline model and vectorizer from joblib artifacts."""
    if not BASELINE_MODEL_PATH.exists() or not BASELINE_VECTORIZER_PATH.exists():
        raise FileNotFoundError(f"Baseline artifacts not found at {BASELINE_MODEL_PATH}. Run training first.")
    
    model = joblib.load(BASELINE_MODEL_PATH)
    vectorizer = joblib.load(BASELINE_VECTORIZER_PATH)
    return model, vectorizer


if __name__ == "__main__":
    from src.data.preprocess import load_and_preprocess_isot
    from src.data.split import split_data

    df = load_and_preprocess_isot(remove_leakage=True)
    train_df, val_df, test_df = split_data(df)
    train_baseline(train_df, val_df, test_df)
