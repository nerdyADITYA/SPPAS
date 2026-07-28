# pyrefly: ignore [missing-import]
from apscheduler.schedulers.background import BackgroundScheduler
from device_manager import device_manager
from config import SYNC_INTERVAL
from logger import logger

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        device_manager.sync_all_devices,
        "interval",
        seconds=SYNC_INTERVAL,
        id="device_sync_job"
    )
    scheduler.start()
    logger.info(f"APScheduler started. Polling biometric devices every {SYNC_INTERVAL} seconds.")
    return scheduler
