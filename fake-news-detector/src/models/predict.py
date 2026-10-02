"""Unified prediction module for Baseline and DistilBERT models."""

import time
from typing import Dict, Any, Union, List, Optional
try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    torch = None

from src.data.preprocess import clean_text
from src.models.baseline import load_baseline
from src.models.bert import load_bert
from src.utils.logger import logger


class FakeNewsPredictor:
    """Unified predictor class for executing inference with Baseline or DistilBERT models."""

    def __init__(self) -> None:
        self.baseline_model = None
        self.baseline_vectorizer = None
        self.bert_model = None
        self.bert_tokenizer = None

    def _ensure_baseline_loaded(self) -> None:
        """Lazy loader for baseline model."""
        if self.baseline_model is None or self.baseline_vectorizer is None:
            logger.info("Lazy-loading baseline (TF-IDF + LogisticRegression) model...")
            self.baseline_model, self.baseline_vectorizer = load_baseline()

    def _ensure_bert_loaded(self) -> None:
        """Lazy loader for DistilBERT model."""
        if not TORCH_AVAILABLE:
            raise RuntimeError("PyTorch is not installed in this environment.")
        if self.bert_model is None or self.bert_tokenizer is None:
            logger.info("Lazy-loading DistilBERT model...")
            self.bert_model, self.bert_tokenizer = load_bert()
            self.bert_model.eval()

    def predict_single(
        self,
        text: str,
        model_name: str = "baseline",
        remove_leakage: bool = True
    ) -> Dict[str, Any]:
        """Predicts credibility label and fake probability for a single news article.
        
        Args:
            text: Raw input news text or headline.
            model_name: "baseline" or "bert".
            remove_leakage: Whether to strip agency tags during text cleaning.
            
        Returns:
            Dict containing label, fake_probability, model_used, and latency_ms.
        """
        start_time = time.time()
        cleaned = clean_text(text, remove_leakage=remove_leakage)

        if not cleaned:
            return {
                "label": "Fake",
                "fake_probability": 0.50,
                "model_used": model_name,
                "latency_ms": round((time.time() - start_time) * 1000, 2),
                "error": "Empty or invalid input text."
            }

        if model_name.lower() == "bert":
            try:
                self._ensure_bert_loaded()
                inputs = self.bert_tokenizer(
                    cleaned,
                    return_tensors="pt",
                    truncation=True,
                    max_length=256
                )
                with torch.no_grad():
                    outputs = self.bert_model(**inputs)
                    probs = torch.softmax(outputs.logits, dim=-1).squeeze().numpy()
                    fake_prob = float(probs[1])
            except Exception as e:
                logger.warning(f"DistilBERT inference fallback to Baseline due to: {e}")
                model_name = "baseline (fallback)"
                self._ensure_baseline_loaded()
                vec = self.baseline_vectorizer.transform([cleaned])
                fake_prob = float(self.baseline_model.predict_proba(vec)[0, 1])
        else:
            self._ensure_baseline_loaded()
            vec = self.baseline_vectorizer.transform([cleaned])
            fake_prob = float(self.baseline_model.predict_proba(vec)[0, 1])

        label = "Fake" if fake_prob >= 0.5 else "Real"
        latency_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "label": label,
            "fake_probability": round(fake_prob, 4),
            "credibility_score_pct": round((1.0 - fake_prob) * 100, 1),
            "model_used": model_name,
            "latency_ms": latency_ms,
        }

    def predict_proba_batch(
        self,
        texts: List[str],
        model_name: str = "baseline"
    ) -> np.ndarray:
        """Returns 2D array of class probabilities [[prob_real, prob_fake], ...] for batch texts.
        
        Required interface for LIME explainer.
        """
        cleaned_texts = [clean_text(t) for t in texts]
        
        if model_name.lower() == "bert":
            try:
                self._ensure_bert_loaded()
                inputs = self.bert_tokenizer(
                    cleaned_texts,
                    padding=True,
                    truncation=True,
                    max_length=256,
                    return_tensors="pt"
                )
                with torch.no_grad():
                    outputs = self.bert_model(**inputs)
                    probs = torch.softmax(outputs.logits, dim=-1).numpy()
                    return probs
            except Exception as e:
                logger.warning(f"Batch DistilBERT inference failed: {e}. Falling back to baseline.")
                model_name = "baseline"

        self._ensure_baseline_loaded()
        vecs = self.baseline_vectorizer.transform(cleaned_texts)
        return self.baseline_model.predict_proba(vecs)


# Global singleton instance
predictor = FakeNewsPredictor()
