"""Stratified train/validation/test dataset splitting module."""

from typing import Tuple
import pandas as pd
from sklearn.model_selection import train_test_split

from src.utils.config import (
    PROCESSED_DATA_DIR,
    RANDOM_SEED,
    TRAIN_RATIO,
    VAL_RATIO,
    TEST_RATIO,
)
from src.utils.logger import logger
from src.data.preprocess import load_and_preprocess_isot


def split_data(
    df: pd.DataFrame,
    seed: int = RANDOM_SEED
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Splits dataset into stratified Train (70%), Validation (15%), and Test (15%) sets.
    
    Args:
        df: Processed DataFrame containing 'clean_text' and 'label'.
        seed: Random seed for reproducibility.
        
    Returns:
        Tuple of (train_df, val_df, test_df).
    """
    logger.info("Performing 70/15/15 stratified train/val/test split...")
    
    # First split: Train (70%) vs Temp (30%)
    train_df, temp_df = train_test_split(
        df,
        test_size=(VAL_RATIO + TEST_RATIO),
        stratify=df["label"],
        random_state=seed,
    )

    # Second split: Validation (15%) vs Test (15%) -> equal 50/50 split of the remaining 30%
    val_df, test_df = train_test_split(
        temp_df,
        test_size=0.5,
        stratify=temp_df["label"],
        random_state=seed,
    )

    logger.info(
        f"Data split sizes -> Train: {len(train_df)} ({len(train_df)/len(df):.1%}), "
        f"Val: {len(val_df)} ({len(val_df)/len(df):.1%}), "
        f"Test: {len(test_df)} ({len(test_df)/len(df):.1%})"
    )
    return train_df, val_df, test_df


def save_splits(
    train_df: pd.DataFrame,
    val_df: pd.DataFrame,
    test_df: pd.DataFrame,
    output_dir=PROCESSED_DATA_DIR
) -> None:
    """Saves dataset splits to CSV files in output_dir."""
    output_dir.mkdir(parents=True, exist_ok=True)
    train_df.to_csv(output_dir / "train.csv", index=False)
    val_df.to_csv(output_dir / "val.csv", index=False)
    test_df.to_csv(output_dir / "test.csv", index=False)
    logger.info(f"Saved dataset splits successfully to {output_dir}")


if __name__ == "__main__":
    df = load_and_preprocess_isot(remove_leakage=True)
    train_df, val_df, test_df = split_data(df)
    save_splits(train_df, val_df, test_df)
