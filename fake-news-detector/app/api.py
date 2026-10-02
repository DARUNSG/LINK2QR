"""FastAPI Backend Server for Fake News Detector."""

import time
from typing import Dict, Any, List, Optional
from collections import defaultdict

from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.models.predict import predictor
from src.explain.lime_explainer import explainer
from src.utils.config import BASELINE_MODEL_PATH, BERT_MODEL_DIR
from src.utils.logger import logger


app = FastAPI(
    title="Fake News Detector API",
    description="Production-grade API for fake news classification & word-level LIME explainability.",
    version="1.0.0",
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory Rate Limiter (e.g. max 60 requests per minute per IP)
RATE_LIMIT_REQUESTS = 60
RATE_LIMIT_WINDOW_SEC = 60
ip_request_counts = defaultdict(list)


def check_rate_limit(request: Request):
    """Enforces basic IP rate limiting."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    
    # Filter timestamps within window
    timestamps = [ts for ts in ip_request_counts[client_ip] if now - ts < RATE_LIMIT_WINDOW_SEC]
    ip_request_counts[client_ip] = timestamps
    
    if len(timestamps) >= RATE_LIMIT_REQUESTS:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Maximum 60 requests per minute.")
    
    ip_request_counts[client_ip].append(now)


# Request & Response Pydantic Schemas
class PredictRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=10,
        max_length=10000,
        description="News article headline or text to analyze.",
        example="WASHINGTON (Reuters) - The Senate passed the bipartisan infrastructure bill after weeks of negotiations."
    )
    model: str = Field(
        default="baseline",
        pattern="^(baseline|bert)$",
        description="Model architecture to use ('baseline' or 'bert')."
    )
    explain: bool = Field(
        default=True,
        description="Whether to return LIME feature importance word highlights."
    )


class HighlightItem(BaseModel):
    token: str
    weight: float
    direction: str


class PredictResponse(BaseModel):
    label: str
    fake_probability: float
    credibility_score_pct: float
    model_used: str
    latency_ms: float
    highlights: Optional[List[HighlightItem]] = []


@app.on_event("startup")
async def startup_event():
    """Pre-loads baseline model on API server startup."""
    logger.info("FastAPI server starting... Pre-loading models.")
    try:
        predictor._ensure_baseline_loaded()
        logger.info("Baseline model loaded successfully.")
    except Exception as e:
        logger.warning(f"Baseline model lazy loading deferred: {e}")


@app.get("/health", tags=["System"])
async def health_check() -> Dict[str, Any]:
    """Health check endpoint returning system status."""
    return {
        "status": "healthy",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "baseline_artifact_present": BASELINE_MODEL_PATH.exists(),
        "bert_artifact_present": (BERT_MODEL_DIR / "config.json").exists(),
    }


@app.get("/models", tags=["System"])
async def list_models() -> Dict[str, Any]:
    """Lists available prediction models and descriptions."""
    return {
        "available_models": [
            {
                "id": "baseline",
                "name": "TF-IDF + Logistic Regression",
                "description": "Fast linear baseline model with unigram & bigram features (~1-5ms latency).",
                "artifact_size_mb": round(BASELINE_MODEL_PATH.stat().st_size / (1024*1024), 2) if BASELINE_MODEL_PATH.exists() else 0.0,
            },
            {
                "id": "bert",
                "name": "Fine-tuned DistilBERT",
                "description": "Deep transformer model fine-tuned on news content for semantic context.",
                "artifact_present": (BERT_MODEL_DIR / "config.json").exists(),
            }
        ]
    }


@app.post("/predict", response_model=PredictResponse, dependencies=[Depends(check_rate_limit)], tags=["Inference"])
async def predict(payload: PredictRequest) -> PredictResponse:
    """Predicts credibility label and highlights influential tokens for input news text."""
    try:
        res = predictor.predict_single(
            text=payload.text,
            model_name=payload.model
        )

        highlights = []
        if payload.explain:
            raw_highlights = explainer.explain(
                text=payload.text,
                model_name=payload.model,
                num_features=8
            )
            highlights = [HighlightItem(**item) for item in raw_highlights]

        return PredictResponse(
            label=res["label"],
            fake_probability=res["fake_probability"],
            credibility_score_pct=res["credibility_score_pct"],
            model_used=res["model_used"],
            latency_ms=res["latency_ms"],
            highlights=highlights,
        )

    except Exception as e:
        logger.error(f"Prediction failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Prediction server error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    from src.utils.config import API_HOST, API_PORT
    uvicorn.run("app.api:app", host=API_HOST, port=API_PORT, reload=True)
