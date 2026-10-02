"""LIME text explainer with caching and unified probability wrapper."""

import functools
from typing import Dict, Any, List, Tuple
import numpy as np

from src.models.predict import FakeNewsPredictor
from src.utils.logger import logger

try:
    from lime.lime_text import LimeTextExplainer
    LIME_AVAILABLE = True
except ImportError:
    LIME_AVAILABLE = False
    logger.warning("LIME package not found. Using internal feature-weight explainer fallback.")


class NewsExplainer:
    """Explainer for extracting top N influential words pushing toward Real vs Fake labels."""

    def __init__(self) -> None:
        self.predictor = FakeNewsPredictor()
        if LIME_AVAILABLE:
            self.lime_explainer = LimeTextExplainer(class_names=["Real", "Fake"])
        else:
            self.lime_explainer = None
        self._cache: Dict[str, List[Dict[str, Any]]] = {}

    def explain(
        self,
        text: str,
        model_name: str = "baseline",
        num_features: int = 8,
        num_samples: int = 250
    ) -> List[Dict[str, Any]]:
        """Extracts top N influential tokens with signed weights for input text.
        
        Args:
            text: Input text string.
            model_name: "baseline" or "bert".
            num_features: Number of top influential words to return.
            num_samples: Number of perturbation samples for LIME explainer.
            
        Returns:
            List of dicts: [{"token": str, "weight": float, "direction": "fake"|"real"}]
        """
        cache_key = f"{model_name}_{hash(text)}_{num_features}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        if LIME_AVAILABLE and self.lime_explainer is not None:
            try:
                # Callback closure for LIME predicting probabilities
                def predict_proba_fn(texts: List[str]) -> np.ndarray:
                    return self.predictor.predict_proba_batch(texts, model_name=model_name)

                exp = self.lime_explainer.explain_instance(
                    text_instance=text,
                    classifier_fn=predict_proba_fn,
                    num_features=num_features,
                    num_samples=num_samples,
                )

                # Extract tuples of (word, weight) where class 1 = Fake
                weights_list = exp.as_list(label=1)
                
                highlights = []
                for token, weight in weights_list:
                    highlights.append({
                        "token": token,
                        "weight": round(float(weight), 4),
                        "direction": "fake" if weight > 0 else "real"
                    })
                
                self._cache[cache_key] = highlights
                return highlights

            except Exception as e:
                logger.warning(f"LIME explainer failed: {e}. Using fast TF-IDF coefficient fallback.")

        # Fallback fast explainer for TF-IDF baseline model
        return self._fast_tfidf_fallback(text, num_features)

    def _fast_tfidf_fallback(self, text: str, num_features: int) -> List[Dict[str, Any]]:
        """Fast fallback explainer extracting LR model coefficients for TF-IDF tokens."""
        try:
            self.predictor._ensure_baseline_loaded()
            vec = self.predictor.baseline_vectorizer
            clf = self.predictor.baseline_model

            feature_names = np.array(vec.get_feature_names_out())
            coefs = clf.coef_[0]

            tokens = text.lower().split()
            highlights = []
            
            for token in set(tokens):
                if token in vec.vocabulary_:
                    idx = vec.vocabulary_[token]
                    weight = float(coefs[idx])
                    if abs(weight) > 0.01:
                        highlights.append({
                            "token": token,
                            "weight": round(weight, 4),
                            "direction": "fake" if weight > 0 else "real"
                        })

            # Sort by magnitude
            highlights.sort(key=lambda x: abs(x["weight"]), reverse=True)
            return highlights[:num_features]

        except Exception as e:
            logger.error(f"Fast fallback explainer failed: {e}")
            return []


# Global singleton instance
explainer = NewsExplainer()
