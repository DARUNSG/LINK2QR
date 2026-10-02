"""Centralized configuration for paths, parameters, and random seeds."""

import os
from pathlib import Path
from typing import Dict, Any

# Root directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Data directories
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Model directory
MODEL_DIR = BASE_DIR / "models"
BASELINE_MODEL_PATH = MODEL_DIR / "baseline_logistic_regression.joblib"
BASELINE_VECTORIZER_PATH = MODEL_DIR / "tfidf_vectorizer.joblib"
BERT_MODEL_DIR = MODEL_DIR / "bert"

# Reports directory
REPORTS_DIR = BASE_DIR / "reports"
COMPARISON_REPORT_PATH = REPORTS_DIR / "comparison.md"
COMPARISON_PLOT_PATH = REPORTS_DIR / "model_comparison.png"
CONFUSION_MATRIX_PATH = REPORTS_DIR / "baseline_confusion_matrix.png"

# Reproducibility
RANDOM_SEED: int = 42

# Dataset parameters
TRAIN_RATIO: float = 0.70
VAL_RATIO: float = 0.15
TEST_RATIO: float = 0.15

# Baseline Model Parameters
BASELINE_PARAMS: Dict[str, Any] = {
    "ngram_range": (1, 2),
    "max_features": 10000,
    "C": 1.0,
    "max_iter": 1000,
    "solver": "lbfgs",
}

# Fine-tuned DistilBERT Parameters
BERT_PARAMS: Dict[str, Any] = {
    "model_name": "distilbert-base-uncased",
    "max_length": 256,
    "epochs": 3,
    "batch_size": 16,
    "learning_rate": 2e-5,
    "warmup_ratio": 0.1,
    "weight_decay": 0.01,
}

# FastAPI Server Config
API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
API_PORT: int = int(os.getenv("API_PORT", 8000))

# Ensure required directories exist
for path in [RAW_DATA_DIR, PROCESSED_DATA_DIR, MODEL_DIR, BERT_MODEL_DIR, REPORTS_DIR]:
    path.mkdir(parents=True, exist_ok=True)
