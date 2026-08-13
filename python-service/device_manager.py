import socket
import time
import datetime
import threading
import requests
from requests.auth import HTTPDigestAuth, HTTPBasicAuth
from api_client import api_client
from attendance_processor import attendance_processor
from logger import logger

try:
    from zk import ZK
except ImportError:
    ZK = None

def test_tcp_connection(ip, port, timeout=3):
    try:
        with socket.create_connection((ip, int(port)), timeout=timeout):
            return True
    except Exception:
        return False

class DeviceWorkerThread(threading.Thread):
    def __init__(self, dev):
        super().__init__(name=f"DeviceWorker-{dev.get('DeviceCode')}")
        self.device_code = dev.get("DeviceCode")
        self.device_name = dev.get("DeviceName")
        self.ip = dev.get("IPAddress")
        self.port = dev.get("PortNo", 4370)
        self.username = dev.get("Username") or "admin"
        self.password = dev.get("Password") or ""
        self.device_model = dev.get("DeviceModel") or ""
        self.daemon = True
        self.running = True

    def fetch_zkteco_attendance(self):
        records = []
        if not ZK:
            return records
        try:
            zk = ZK(self.ip, port=int(self.port), timeout=5)
            conn = zk.connect()
            logs = conn.get_attendance()
            conn.disconnect()

            for log in logs:
                punch_type = "OUT" if getattr(log, 'status', 0) in [1, 5] else "IN"
                records.append({
                    "empNo": str(log.user_id),
                    "punchDate": log.timestamp.strftime("%Y-%m-%d"),
                    "punchTime": log.timestamp.strftime("%H:%M:%S"),
                    "deviceCode": self.device_code,
                    "shiftCode": 1,
                    "punchType": punch_type
                })
            if records:
                logger.info(f"[{self.name}] ZKTeco PyZK query returned {len(records)} log record(s) from device {self.ip}:{self.port}.")
        except Exception as e:
            logger.debug(f"[{self.name}] PyZK query note: {e}")
        return records

    def fetch_hikvision_attendance(self):
        records = []
        try:
            url = f"http://{self.ip}:{self.port}/ISAPI/AccessControl/AcsEvent?format=json"
            now = datetime.datetime.now()
            start_time = now.strftime("%Y-%m-%dT00:00:00+05:30")
            end_time = now.strftime("%Y-%m-%dT23:59:59+05:30")

            auth = HTTPDigestAuth(self.username, self.password) if self.username and self.password else None
            position = 0

            while True:
                payload = {
                    "AcsEventCond": {
                        "searchID": "1",
                        "searchResultPosition": position,
                        "maxResults": 30,
                        "major": 5,
                        "minor": 0,
                        "startTime": start_time,
                        "endTime": end_time
                    }
                }

                response = requests.post(url, json=payload, auth=auth, timeout=5)

                if response.status_code == 401 and self.username and self.password:
                    response = requests.post(url, json=payload, auth=HTTPBasicAuth(self.username, self.password), timeout=5)

                if response.status_code == 401:
                    resp_text = response.text or ""
                    if "lock" in resp_text.lower():
                        logger.warn(f"[LOCKED] [{self.name}] Hikvision Device {self.ip}:{self.port} is LOCKED OUT due to security lockout (<lockStatus>lock</lockStatus>). Please power-cycle (reboot) terminal to unlock immediately.")
                    else:
                        logger.warn(f"[AUTH REQUIRED] [{self.name}] Hikvision Device HTTP 401 Unauthorized ({self.ip}:{self.port}). Username: '{self.username}'. Please set valid Device Password in SPPAS Biometric Devices Master page (/devices).")
                    break

                if response.status_code == 200:
                    data = response.json()
                    events = data.get("AcsEvent", {}).get("InfoList", [])
                    if not events:
                        break

                    for ev in events:
                        emp_no = ev.get("employeeNoString") or ev.get("cardNo")
                        event_time = ev.get("time")
                        verify_mode = str(ev.get("attendanceStatus") or ev.get("currentVerifyMode") or ev.get("direction") or "").lower()
                        punch_type = "OUT" if "out" in verify_mode else "IN"

                        if emp_no and event_time:
                            dt = datetime.datetime.fromisoformat(event_time.replace("Z", "+00:00"))
                            records.append({
                                "empNo": str(emp_no),
                                "punchDate": dt.strftime("%Y-%m-%d"),
                                "punchTime": dt.strftime("%H:%M:%S"),
                                "deviceCode": self.device_code,
                                "shiftCode": 1,
                                "punchType": punch_type
                            })

                    position += len(events)
                    if len(events) < 30 or position >= 300:
                        break
                else:
                    logger.debug(f"[{self.name}] Hikvision ISAPI returned status {response.status_code}: {response.text[:200]}")
                    break

            if records:
                logger.info(f"[{self.name}] Hikvision ISAPI query returned {len(records)} log record(s) across pages from device {self.ip}:{self.port}.")
        except Exception as e:
            logger.warn(f"[{self.name}] Hikvision ISAPI query exception for device {self.ip}:{self.port}: {e}")
        return records

    def run(self):
        logger.info(f"[{self.name}] Dedicated Worker Thread started for '{self.device_name}' ({self.ip}:{self.port}).")
        while self.running:
            try:
                is_online = test_tcp_connection(self.ip, self.port, timeout=4)

                if is_online:
                    api_client.send_heartbeat(self.device_code, "ONLINE")
                    logger.info(f"[POLL] [{self.name}] Querying terminal '{self.device_name}' ({self.ip}:{self.port}) for incoming punches...")

                    # Fetch live punches for this specific device
                    records = []
                    if self.port == 4370 or "ZKTeco" in str(self.device_model):
                        records = self.fetch_zkteco_attendance()
                    else:
                        records = self.fetch_hikvision_attendance()

                    new_records = [r for r in records if not attendance_processor.is_synced(r)]
                    if new_records:
                        logger.info(f"[{self.name}] Captured {len(new_records)} NEW hardware biometric punch(es) from terminal '{self.device_name}'.")
                        attendance_processor.process_and_upload(records)
                    else:
                        logger.info(f"[POLL] [{self.name}] Device '{self.device_name}' ({self.ip}:{self.port}) is ONLINE. 0 new physical punches detected.")
                else:
                    api_client.send_heartbeat(self.device_code, "OFFLINE")
                    logger.warn(f"[{self.name}] Device '{self.device_name}' ({self.ip}:{self.port}) unreachable / timed out. Status: OFFLINE.")

            except Exception as e:
                logger.error(f"[{self.name}] Exception in worker loop for '{self.device_name}': {e}")
                api_client.send_heartbeat(self.device_code, "OFFLINE")

            # Sleep 10s between device monitoring cycles
            for _ in range(10):
                if not self.running:
                    break
                time.sleep(1)

        logger.info(f"[{self.name}] Worker Thread terminated cleanly.")

    def stop(self):
        self.running = False


class ThreadedDeviceManager:
    def __init__(self):
        self.active_threads = {} # device_code -> DeviceWorkerThread

    def sync_online_devices(self):
        devices = api_client.fetch_devices()
        if not devices:
            logger.info("No registered biometric devices returned from API.")
            return

        active_codes_in_api = set()

        for dev in devices:
            device_code = dev.get("DeviceCode")
            device_name = dev.get("DeviceName")
            ip = dev.get("IPAddress")
            port = dev.get("PortNo", 4370)

            if dev.get("Enable") == "N" or dev.get("DeviceStatus") == "MAINTENANCE":
                logger.info(f"Device #{device_code} '{device_name}' is Disabled/Maintenance.")
                if device_code in self.active_threads:
                    logger.info(f"Stopping Worker Thread for disabled device #{device_code}.")
                    self.active_threads[device_code].stop()
                    del self.active_threads[device_code]
                continue

            # Test TCP connection to see if device is currently ONLINE
            is_online = test_tcp_connection(ip, port, timeout=3)

            if is_online:
                active_codes_in_api.add(device_code)
                # Spawn worker thread for online device if not already running
                if device_code not in self.active_threads or not self.active_threads[device_code].is_alive():
                    logger.info(f"ONLINE device detected: Device #{device_code} '{device_name}' ({ip}:{port}). Spawning dedicated Worker Thread...")
                    worker = DeviceWorkerThread(dev)
                    worker.start()
                    self.active_threads[device_code] = worker
            else:
                logger.info(f"Device #{device_code} '{device_name}' ({ip}:{port}) is unreachable (OFFLINE).")
                api_client.send_heartbeat(device_code, "OFFLINE")
                if device_code in self.active_threads:
                    logger.info(f"Stopping Worker Thread for offline device #{device_code}.")
                    self.active_threads[device_code].stop()
                    del self.active_threads[device_code]

    def stop_all_threads(self):
        logger.info("Stopping all active device worker threads...")
        for code, worker in list(self.active_threads.items()):
            worker.stop()
        self.active_threads.clear()


device_manager = ThreadedDeviceManager()
