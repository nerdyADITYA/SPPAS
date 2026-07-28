import os
import logging
from logging.handlers import RotatingFileHandler
from config import LOG_DIRECTORY

os.makedirs(LOG_DIRECTORY, exist_ok=True)

def setup_logger():
    logger = logging.getLogger("sppas_attendance_service")
    logger.setLevel(logging.INFO)

    log_format = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # File Handler with rotation (10 MB per file, max 5 backups)
    file_handler = RotatingFileHandler(
        os.path.join(LOG_DIRECTORY, "attendance_service.log"),
        maxBytes=10 * 1024 * 1024,
        backupCount=5
    )
    file_handler.setFormatter(log_format)
    logger.addHandler(file_handler)

    # Console Handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(log_format)
    logger.addHandler(console_handler)

    return logger

logger = setup_logger()
