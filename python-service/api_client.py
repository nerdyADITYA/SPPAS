import requests
from config import API_BASE_URL
from logger import logger

class APIClient:
    def __init__(self, base_url=API_BASE_URL):
        self.base_url = base_url

    def fetch_devices(self):
        try:
            response = requests.get(f"{self.base_url}/devices", timeout=10)
            if response.status_code == 200:
                return response.json().get("data", [])
            logger.error(f"Failed to fetch devices. Status: {response.status_code}")
            return []
        except Exception as e:
            logger.error(f"APIClient fetch_devices error: {e}")
            return []

    def upload_attendance(self, payload):
        try:
            response = requests.post(f"{self.base_url}/attendance", json=payload, timeout=10)
            if response.status_code in [200, 201]:
                return True, response.json().get("message", "Uploaded successfully")
            else:
                msg = response.json().get("message", "Upload failed")
                return False, msg
        except Exception as e:
            logger.error(f"APIClient upload_attendance error: {e}")
            return False, str(e)

    def send_heartbeat(self, device_code, status="ONLINE"):
        try:
            payload = {"deviceCode": device_code, "status": status}
            requests.post(f"{self.base_url}/devices/heartbeat", json=payload, timeout=5)
        except Exception as e:
            logger.error(f"APIClient send_heartbeat error for device {device_code}: {e}")

api_client = APIClient()
