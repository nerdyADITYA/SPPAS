def validate_punch_record(record):
    """
    Validates a raw biometric punch record.
    Expected fields: empNo, punchDate, punchTime, deviceCode
    """
    if not record.get("empNo"):
        return False, "Missing employee number"
    if not record.get("punchDate"):
        return False, "Missing punch date"
    if not record.get("punchTime"):
        return False, "Missing punch time"
    if not record.get("deviceCode"):
        return False, "Missing device code"
    return True, "Valid"
