import os
from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000/api/v1")
API_EMP_NO = os.getenv("API_EMP_NO", "1004")
API_PASSWORD = os.getenv("API_PASSWORD", "Admin@123")
SYNC_INTERVAL = int(os.getenv("SYNC_INTERVAL", "10"))
DEVICE_TIMEOUT = int(os.getenv("DEVICE_TIMEOUT", "10"))
RETRY_COUNT = int(os.getenv("RETRY_COUNT", "3"))
LOG_DIRECTORY = os.getenv("LOG_DIRECTORY", "logs")
HEARTBEAT_INTERVAL = int(os.getenv("HEARTBEAT_INTERVAL", "300"))
