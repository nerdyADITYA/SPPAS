from api_client import api_client
from validators import validate_punch_record
from logger import logger

class AttendanceProcessor:
    def __init__(self):
        self.synced_cache = set()

    def process_and_upload(self, records):
        uploaded_count = 0
        duplicate_count = 0

        for record in records:
            # Construct duplicate key
            cache_key = f"{record['empNo']}_{record['punchDate']}_{record['punchTime']}_{record['deviceCode']}"
            if cache_key in self.synced_cache:
                duplicate_count += 1
                continue

            valid, reason = validate_punch_record(record)
            if not valid:
                logger.warning(f"Invalid record skipped: {record}. Reason: {reason}")
                continue

            success, msg = api_client.upload_attendance(record)
            if success:
                self.synced_cache.add(cache_key)
                uploaded_count += 1
            else:
                logger.warn(f"Punch upload rejected by backend: {record}. Reason: {msg}")

        logger.info(f"Attendance Processing Batch Finished. Uploaded: {uploaded_count}, Duplicates Skipped: {duplicate_count}")
        return uploaded_count

attendance_processor = AttendanceProcessor()
