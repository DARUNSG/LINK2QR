"""Script to download datasets or generate synthetic benchmark data for immediate local verification."""

import argparse
import sys
from pathlib import Path
import pandas as pd
import numpy as np

from src.utils.config import RAW_DATA_DIR, RANDOM_SEED
from src.utils.logger import logger


def generate_synthetic_data(num_samples: int = 400) -> None:
    """Generates synthetic ISOT-style and LIAR-style CSV datasets for testing & local verification.
    
    Includes realistic news text with intentional data leakage markers (e.g. 'WASHINGTON (Reuters) -')
    in real news articles to verify leakage detection and cleaning.
    """
    logger.info(f"Generating {num_samples} synthetic news samples for local pipeline validation...")
    np.random.seed(RANDOM_SEED)

    real_templates = [
        "WASHINGTON (Reuters) - The Senate passed the bipartisan infrastructure bill after weeks of negotiations.",
        "LONDON (Reuters) - Economic policy makers gathered to discuss inflation targets and interest rate adjustments.",
        "BEIJING (Reuters) - Trade officials announced new tariff adjustments following multilateral economic talks.",
        "NEW YORK - Federal Reserve board members signaled interest rate hikes following economic data releases.",
        "PARIS (Reuters) - French parliament approved the new energy efficiency standards for commercial buildings.",
        "WASHINGTON - The Department of Transportation announced federal grants for regional transit expansion."
    ]

    fake_templates = [
        "BREAKING: Secret documents prove shocking government conspiracy uncovered by whistleblowers!",
        "UNBELIEVABLE! Miracle cure for all diseases hidden by corrupt big pharma executives!",
        "MUST SEE: Mainstream media refuses to report this terrifying truth about global elites!",
        "SHOCKING video shows alien spacecraft landing in secret underground military base!",
        "EXPOSED: Major political figures secretly caught celebrating illegal election tampering!",
        "BOMBSHELL report reveals hidden microchips inside public water supply systems!"
    ]

    real_articles = []
    for i in range(num_samples // 2):
        base = np.random.choice(real_templates)
        filler = f" Official statement details that item #{i} was reviewed thoroughly by independent analysts."
        real_articles.append({
            "title": f"Official News Report #{i}: Federal policy and market developments",
            "text": base + filler,
            "subject": np.random.choice(["politicsNews", "worldnews"]),
            "date": "December 31, 2017"
        })

    fake_articles = []
    for i in range(num_samples // 2):
        base = np.random.choice(fake_templates)
        filler = f" Share this article before it gets deleted by censorship algorithms! Ref #{i}."
        fake_articles.append({
            "title": f"BOMBSHELL EXPOSED #{i}: Unbelievable truth revealed!",
            "text": base + filler,
            "subject": np.random.choice(["News", "politics", "left-news", "Government News"]),
            "date": "December 31, 2017"
        })

    df_true = pd.DataFrame(real_articles)
    df_fake = pd.DataFrame(fake_articles)

    df_true.to_csv(RAW_DATA_DIR / "True.csv", index=False)
    df_fake.to_csv(RAW_DATA_DIR / "Fake.csv", index=False)
    logger.info(f"Saved synthetic True.csv ({len(df_true)}) and Fake.csv ({len(df_fake)}) to {RAW_DATA_DIR}")

    # Generate synthetic LIAR dataset for cross-dataset evaluation
    liar_samples = []
    for i in range(100):
        is_fake = np.random.rand() > 0.5
        label = "false" if is_fake else "true"
        text = (np.random.choice(fake_templates) if is_fake else np.random.choice(real_templates))
        liar_samples.append({
            "id": f"liar_{i}",
            "label": label,
            "statement": text,
            "subject": "politics",
            "speaker": "politician",
            "job_title": "senator",
            "state_info": "Texas",
            "party_affiliation": "democrat",
            "barely_true_counts": 0,
            "false_counts": 1 if is_fake else 0,
            "half_true_counts": 0,
            "mostly_true_counts": 0,
            "pants_on_fire_counts": 0,
            "context": "news interview"
        })
    pd.DataFrame(liar_samples).to_csv(RAW_DATA_DIR / "liar_test.csv", index=False)
    logger.info(f"Saved synthetic liar_test.csv ({len(liar_samples)}) to {RAW_DATA_DIR}")


def download_instructions() -> None:
    """Prints clear instructions for obtaining real datasets."""
    print("=" * 60)
    print("DATASET DOWNLOAD INSTRUCTIONS")
    print("=" * 60)
    print("1. Primary Dataset (ISOT Fake News Dataset):")
    print("   Download 'Fake.csv' and 'True.csv' from Kaggle or University of Victoria:")
    print("   https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset")
    print(f"   Place both files directly into: {RAW_DATA_DIR}")
    print("\n2. Cross-Dataset Generalization (LIAR Dataset):")
    print("   Download 'test.tsv' from LIAR dataset repository:")
    print("   https://www.cs.ucsb.edu/~william/data/liar_dataset.zip")
    print(f"   Place 'test.tsv' or 'liar_test.csv' into: {RAW_DATA_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download or generate raw datasets.")
    parser.add_argument("--synthetic", action="store_true", help="Generate synthetic data for testing.")
    args = parser.parse_args()

    if args.synthetic or not (RAW_DATA_DIR / "True.csv").exists():
        generate_synthetic_data()
    else:
        download_instructions()
