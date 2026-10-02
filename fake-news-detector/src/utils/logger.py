"""Logging configuration module for structured, consistent logging."""

import logging
import sys
from pathlib import Path


def get_logger(name: str = "fake_news_detector") -> logging.Logger:
    """Configures and returns a standard logger instance.
    
    Args:
        name: Name of the logger module.
        
    Returns:
        logging.Logger: Configured logger instance.
    """
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        
        # Formatting
        formatter = logging.Formatter(
            "[%(asctime)s] %(levelname)s - %(name)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
        
    return logger


logger = get_logger()
