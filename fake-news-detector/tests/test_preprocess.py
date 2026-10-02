"""Unit tests for text preprocessing and leakage removal."""

import pytest
from src.data.preprocess import clean_text, URL_PATTERN, REUTERS_PATTERN


def test_clean_text_basic():
    raw_text = "Check out this link https://example.com/news !  Multiple   spaces here.  "
    cleaned = clean_text(raw_text, remove_leakage=False)
    assert "https://" not in cleaned
    assert "  " not in cleaned
    assert "check out this link" in cleaned
    assert "multiple spaces here." in cleaned


def test_reuters_leakage_removal():
    raw_news = "WASHINGTON (Reuters) - The Senate passed the bipartisan infrastructure bill after weeks of negotiations."
    cleaned = clean_text(raw_news, remove_leakage=True)
    assert "reuters" not in cleaned
    assert "washington" not in cleaned
    assert cleaned.startswith("the senate passed")


def test_clean_text_empty_input():
    assert clean_text("") == ""
    assert clean_text(None) == ""
