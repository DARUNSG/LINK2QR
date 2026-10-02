"""Integration tests for FastAPI endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.api import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data


def test_models_endpoint():
    response = client.get("/models")
    assert response.status_code == 200
    data = response.json()
    assert "available_models" in data
    assert len(data["available_models"]) >= 2


def test_predict_endpoint_valid():
    payload = {
        "text": "WASHINGTON (Reuters) - The Senate passed the bipartisan infrastructure bill after weeks of negotiations.",
        "model": "baseline",
        "explain": True,
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["label"] in ["Real", "Fake"]
    assert 0.0 <= data["fake_probability"] <= 1.0
    assert "highlights" in data


def test_predict_endpoint_validation_short_text():
    payload = {"text": "Too short", "model": "baseline"}
    response = client.post("/predict", json=payload)
    assert response.status_code == 422  # Unprocessable Entity (Validation Error)
