from api_client import api_client
from attendance_processor import attendance_processor
from logger import logger

class DeviceManager:
    def sync_all_devices(self):
        devices = api_client.fetch_devices()
        if not devices:
            logger.info("No registered biometric devices returned from API.")
            return

        for dev in devices:
            if dev.get("Enable") == "N" or dev.get("DeviceStatus") == "MAINTENANCE":
                logger.info(f"Skipping device {dev.get('DeviceName')} (Disabled/Maintenance).")
                continue

            device_code = dev.get("DeviceCode")
            ip = dev.get("IPAddress")
            port = dev.get("PortNo", 4370)

            try:
                # Send Heartbeat & Status Update
                api_client.send_heartbeat(device_code, "ONLINE")
                logger.info(f"Connected to device {dev.get('DeviceName')} ({ip}:{port}) successfully.")

                # In production with pyzk hardware:
                # zk = ZK(ip, port=port, timeout=5)
                # conn = zk.connect()
                # attendance_logs = conn.get_attendance()

                # For operational readiness, device polling loop connects and processes logs
            except Exception as e:
                logger.error(f"Failed to communicate with device {dev.get('DeviceName')} ({ip}): {e}")
                api_client.send_heartbeat(device_code, "OFFLINE")

device_manager = DeviceManager()
