"""Text preprocessing and data leakage cleaning module."""

import re
from typing import Tuple, Dict, Any, List
import pandas as pd

from src.utils.config import RAW_DATA_DIR, PROCESSED_DATA_DIR
from src.utils.logger import logger

# Regex patterns for URL removal, whitespace normalization, and data leakage removal
URL_PATTERN = re.compile(r"https?://\S+|www\.\S+")
HTML_TAG_PATTERN = re.compile(r"<.*?>")
WHITESPACE_PATTERN = re.compile(r"\s+")

# Data leakage shortcuts common in ISOT dataset (e.g. "WASHINGTON (Reuters) - ")
REUTERS_PATTERN = re.compile(
    r"^(?:[A-Z\s,/-]+)?\((?:Reuters|REUTERS)\)\s*[-–—]\s*", re.IGNORECASE
)
AGENCY_PREFIX_PATTERN = re.compile(
    r"^[A-Z\s]{2,20}\s*[-–—]\s*"
)


def clean_text(text: str, remove_leakage: bool = True) -> str:
    """Cleans raw text input for fake news detection.
    
    Args:
        text: Raw text string.
        remove_leakage: If True, strips agency source tags (e.g. Reuters headers)
                       to prevent data leakage shortcuts.
                       
    Returns:
        Cleaned text string.
    """
    if not isinstance(text, str):
        return ""

    # Strip URLs & HTML tags
    text = URL_PATTERN.sub("", text)
    text = HTML_TAG_PATTERN.sub("", text)

    # Optional data leakage cleaning (removing source attribution shortcuts)
    if remove_leakage:
        text = REUTERS_PATTERN.sub("", text)
        text = AGENCY_PREFIX_PATTERN.sub("", text)

    # Normalize whitespace
    text = WHITESPACE_PATTERN.sub(" ", text).strip()
    
    # Lowercase text while keeping word tokens intact
    text = text.lower()
    return text


def detect_data_leakage(df: pd.DataFrame) -> Dict[str, Any]:
    """Analyzes dataset for potential data leakage indicators such as 'Reuters' tokens.
    
    Args:
        df: Merged dataframe containing 'text' and 'label' columns.
        
    Returns:
        Dict summarizing detected leakage statistics.
    """
    reuters_in_real = df[df["label"] == 0]["text"].str.contains("Reuters|REUTERS", regex=True).mean()
    reuters_in_fake = df[df["label"] == 1]["text"].str.contains("Reuters|REUTERS", regex=True).mean()
    
    dash_prefix_real = df[df["label"] == 0]["text"].str.contains(r"^[A-Z\s]+\s*[-–—]", regex=True).mean()
    dash_prefix_fake = df[df["label"] == 1]["text"].str.contains(r"^[A-Z\s]+\s*[-–—]", regex=True).mean()

    stats = {
        "reuters_mention_real_pct": round(float(reuters_in_real * 100), 2),
        "reuters_mention_fake_pct": round(float(reuters_in_fake * 100), 2),
        "agency_prefix_real_pct": round(float(dash_prefix_real * 100), 2),
        "agency_prefix_fake_pct": round(float(dash_prefix_fake * 100), 2),
    }
    logger.info(f"Data Leakage Analysis: {stats}")
    return stats


def load_and_preprocess_isot(
    raw_dir: Path = RAW_DATA_DIR,
    remove_leakage: bool = True
) -> pd.DataFrame:
    """Loads raw ISOT True.csv and Fake.csv files, cleans text, and adds binary labels.
    
    Label Mapping:
        0 = Real News
        1 = Fake News
        
    Returns:
        Merged and preprocessed DataFrame with columns ['title', 'text', 'clean_text', 'label'].
    """
    true_path = raw_dir / "True.csv"
    fake_path = raw_dir / "Fake.csv"

    if not true_path.exists() or not fake_path.exists():
        raise FileNotFoundError(
            f"Raw dataset files not found in {raw_dir}. "
            f"Run `python src/data/download.py --synthetic` to generate benchmark data."
        )

    logger.info("Loading ISOT dataset files...")
    df_true = pd.read_csv(true_path)
    df_fake = pd.read_csv(fake_path)

    df_true["label"] = 0
    df_fake["label"] = 1

    df = pd.concat([df_true, df_fake], ignore_index=True)
    df = df.dropna(subset=["text"]).reset_index(drop=True)

    # Detect data leakage before cleaning
    detect_data_leakage(df)

    logger.info(f"Preprocessing {len(df)} samples (remove_leakage={remove_leakage})...")
    # Combine title and text for richer context
    df["full_text"] = df["title"].fillna("") + " " + df["text"].fillna("")
    df["clean_text"] = df["full_text"].apply(lambda x: clean_text(x, remove_leakage=remove_leakage))
    
    # Filter out empty texts
    df = df[df["clean_text"].str.strip().str.len() > 0].reset_index(drop=True)
    logger.info(f"Preprocessing complete. Clean dataset shape: {df.shape}")

    return df


if __name__ == "__main__":
    df = load_and_preprocess_isot(remove_leakage=True)
    df.to_csv(PROCESSED_DATA_DIR / "cleaned_isot.csv", index=False)
    logger.info(f"Saved processed dataset to {PROCESSED_DATA_DIR / 'cleaned_isot.csv'}")
