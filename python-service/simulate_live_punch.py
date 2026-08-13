import sys
import datetime
from api_client import api_client
from logger import logger

def simulate_live_device_punch(emp_no, device_code=8):
    now = datetime.datetime.now()
    punch_date = now.strftime("%Y-%m-%d")
    punch_time = now.strftime("%H:%M:%S")

    payload = {
        "empNo": str(emp_no),
        "punchDate": punch_date,
        "punchTime": punch_time,
        "deviceCode": int(device_code),
        "shiftCode": 1,
        "punchType": "IN"
    }

    logger.info(f"Simulating Live Hardware Biometric IN Punch for Guard #{emp_no} on Device #{device_code} at {punch_date} {punch_time}...")
    success, msg = api_client.upload_attendance(payload)
    if success:
        logger.info(f"SUCCESS: Biometric punch ingested! Auto-Allocation Engine triggered. Response: {msg}")
    else:
        logger.error(f"FAILED: Punch rejected. Reason: {msg}")

if __name__ == "__main__":
    guard_id = sys.argv[1] if len(sys.argv) > 1 else "1005"
    device_id = sys.argv[2] if len(sys.argv) > 2 else "8"
    simulate_live_device_punch(guard_id, device_id)
