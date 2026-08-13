import sys
import time
import socket
from logger import logger
from scheduler import start_scheduler

SINGLE_INSTANCE_PORT = 47829

def ensure_single_instance():
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(('127.0.0.1', SINGLE_INSTANCE_PORT))
        return sock
    except socket.error:
        logger.error("Another instance of Python Attendance Service is already running! Exiting.")
        sys.exit(1)

from device_manager import device_manager

def main():
    lock_socket = ensure_single_instance()
    logger.info("=======================================================")
    logger.info("Starting Independent Multithreaded Attendance Service")
    logger.info("=======================================================")

    scheduler = start_scheduler()
    # Perform initial device discovery and worker thread creation immediately
    device_manager.sync_online_devices()

    try:
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        logger.info("Shutting down Independent Multithreaded Attendance Service...")
        device_manager.stop_all_threads()
        scheduler.shutdown()

if __name__ == "__main__":
    main()
