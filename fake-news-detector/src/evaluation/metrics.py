"""Evaluation metrics computation and plotting utilities."""

from typing import Dict, Any, Union, List
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    roc_auc_score,
    confusion_matrix,
)

from src.utils.config import CONFUSION_MATRIX_PATH, REPORTS_DIR
from src.utils.logger import logger


def evaluate_predictions(
    y_true: Union[np.ndarray, List[int]],
    y_pred: Union[np.ndarray, List[int]],
    y_proba: Optional[Union[np.ndarray, List[float]]] = None
) -> Dict[str, float]:
    """Computes comprehensive classification metrics.
    
    Args:
        y_true: True binary labels (0 = Real, 1 = Fake).
        y_pred: Predicted binary labels.
        y_proba: Predicted probabilities for the positive class (1 = Fake).
        
    Returns:
        Dict containing accuracy, precision, recall, f1, and roc_auc.
    """
    accuracy = float(accuracy_score(y_true, y_pred))
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_true, y_pred, average="binary", zero_division=0
    )

    metrics = {
        "accuracy": round(float(accuracy), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1": round(float(f1), 4),
    }

    if y_proba is not None and len(np.unique(y_true)) > 1:
        try:
            auc = float(roc_auc_score(y_true, y_proba))
            metrics["roc_auc"] = round(auc, 4)
        except Exception:
            metrics["roc_auc"] = 0.0

    return metrics


def compute_huggingface_metrics(eval_pred) -> Dict[str, float]:
    """Hugging Face Trainer metric callback wrapper function."""
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    probs = None
    try:
        import torch
        probs = torch.softmax(torch.tensor(logits), dim=-1).numpy()[:, 1]
    except Exception:
        pass
    return evaluate_predictions(labels, preds, probs)


def plot_confusion_matrix(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    title: str = "Confusion Matrix",
    output_path=CONFUSION_MATRIX_PATH
) -> None:
    """Generates and saves a seaborn heatmap plot of the confusion matrix."""
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(6, 5))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=["Real (0)", "Fake (1)"],
        yticklabels=["Real (0)", "Fake (1)"],
    )
    plt.title(title)
    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.tight_layout()
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(output_path, dpi=300)
    plt.close()
    logger.info(f"Saved confusion matrix plot to {output_path}")
