import os
import logging
from logging.handlers import RotatingFileHandler
from config import LOG_DIRECTORY

import sys

os.makedirs(LOG_DIRECTORY, exist_ok=True)

# Ensure UTF-8 stream output for Windows PowerShell/CMD console
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

def setup_logger():
    logger = logging.getLogger("sppas_attendance_service")
    logger.setLevel(logging.INFO)

    log_format = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Prevent duplicate handlers
    if logger.hasHandlers():
        logger.handlers.clear()

    # File Handler with rotation (10 MB per file, max 5 backups)
    file_handler = RotatingFileHandler(
        os.path.join(LOG_DIRECTORY, "attendance_service.log"),
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8"
    )
    file_handler.setFormatter(log_format)
    logger.addHandler(file_handler)

    # Console Handler with UTF-8 safety
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(log_format)
    logger.addHandler(console_handler)

    return logger

logger = setup_logger()
