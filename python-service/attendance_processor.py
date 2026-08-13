import datetime
from api_client import api_client
from validators import validate_punch_record
from logger import logger

class AttendanceProcessor:
    def __init__(self):
        self.synced_cache = set()
        self.skipped_log_set = set()
        self.preload_existing_punches()

    def preload_existing_punches(self):
        try:
            records = api_client.fetch_today_attendance()
            for r in records:
                emp_no = str(r.get("EmpNo", "")).strip()
                dt_str = str(r.get("PunchDateTime") or "")
                device_code = r.get("DeviceCode")
                if emp_no and device_code and dt_str:
                    try:
                        dt = datetime.datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
                        dt_local = dt.astimezone()
                        date_part = dt_local.strftime("%Y-%m-%d")
                        time_part = dt_local.strftime("%H:%M:%S")
                        key = f"{emp_no}_{date_part}_{time_part}_{device_code}"
                        self.synced_cache.add(key)
                    except Exception:
                        pass
        except Exception:
            pass

    def is_synced(self, record):
        emp_no = str(record['empNo']).strip()
        cache_key = f"{emp_no}_{record['punchDate']}_{record['punchTime']}_{record['deviceCode']}"
        return cache_key in self.synced_cache

    def process_and_upload(self, records):
        uploaded_count = 0
        duplicate_count = 0

        for record in records:
            emp_no = str(record['empNo']).strip()
            cache_key = f"{emp_no}_{record['punchDate']}_{record['punchTime']}_{record['deviceCode']}"

            # Skip non-security guard IDs 1 and 2 with ONE-TIME log output
            if emp_no in ["1", "2"]:
                if emp_no not in self.skipped_log_set:
                    self.skipped_log_set.add(emp_no)
                    logger.info(f"[SKIPPED] Employee #{emp_no} skipped (Non-Security Guard test ID on physical terminal).")
                self.synced_cache.add(cache_key)
                continue

            cache_key = f"{emp_no}_{record['punchDate']}_{record['punchTime']}_{record['deviceCode']}"
            if cache_key in self.synced_cache:
                duplicate_count += 1
                continue

            valid, reason = validate_punch_record(record)
            if not valid:
                logger.warning(f"[VALIDATION FAILED] Punch record invalid: {record}. Reason: {reason}")
                continue

            punch_type_badge = f"PUNCH {record.get('punchType', 'IN').upper()}"
            logger.info(f"[{punch_type_badge}] Processing Hardware Biometric Event:")
            logger.info(f"  [+] Employee ID (EmpNo) : #{record['empNo']}")
            logger.info(f"  [+] Timestamp          : {record['punchDate']} {record['punchTime']}")
            logger.info(f"  [+] Biometric Device   : Device #{record['deviceCode']}")
            logger.info(f"  [+] Punch Direction    : {record.get('punchType', 'IN')}")

            logger.info(f"[API POST] Dispatching punch record for Employee #{record['empNo']} to backend API...")
            success, msg = api_client.upload_attendance(record)

            if success:
                self.synced_cache.add(cache_key)
                uploaded_count += 1
                logger.info(f"[DATABASE SUCCESS] Ingested into 'securityattendance' table successfully! Employee: #{record['empNo']}. Backend Response: {msg}")
            else:
                logger.warn(f"[DATABASE REJECTED] Punch upload failed for Employee #{record['empNo']}. Reason: {msg}")

        if uploaded_count > 0:
            logger.info(f"[SUMMARY] Attendance Processing Batch Finished. Successfully Inserted: {uploaded_count}, Duplicates Skipped: {duplicate_count}")
        return uploaded_count

attendance_processor = AttendanceProcessor()
