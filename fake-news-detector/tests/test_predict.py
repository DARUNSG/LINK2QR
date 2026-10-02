"""Unit tests for prediction logic and edge cases."""

import pytest
from src.models.predict import FakeNewsPredictor
from src.data.download import generate_synthetic_data
from src.utils.config import RAW_DATA_DIR


@pytest.fixture(scope="module", autouse=True)
def ensure_data_and_model():
    """Ensures synthetic data exists before tests run."""
    if not (RAW_DATA_DIR / "True.csv").exists():
        generate_synthetic_data(num_samples=100)


def test_prediction_output_schema():
    predictor = FakeNewsPredictor()
    text = "The Federal Reserve announced economic interest rate guidelines today."
    res = predictor.predict_single(text, model_name="baseline")
    
    assert "label" in res
    assert res["label"] in ["Real", "Fake"]
    assert "fake_probability" in res
    assert 0.0 <= res["fake_probability"] <= 1.0
    assert "credibility_score_pct" in res
    assert "latency_ms" in res
    assert res["latency_ms"] > 0.0


def test_edge_case_empty_text():
    predictor = FakeNewsPredictor()
    res = predictor.predict_single("", model_name="baseline")
    assert res["label"] == "Fake"
    assert "error" in res


def test_edge_case_very_long_text():
    predictor = FakeNewsPredictor()
    long_text = "Breaking news announcement. " * 500
    res = predictor.predict_single(long_text, model_name="baseline")
    assert res["label"] in ["Real", "Fake"]
    assert res["latency_ms"] > 0.0


def test_edge_case_non_english_text():
    predictor = FakeNewsPredictor()
    foreign_text = "Noticias importantes del gobierno sobre la economía nacional y el mercado."
    res = predictor.predict_single(foreign_text, model_name="baseline")
    assert res["label"] in ["Real", "Fake"]
