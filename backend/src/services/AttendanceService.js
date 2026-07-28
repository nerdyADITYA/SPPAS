const attendanceRepository = require('../repositories/AttendanceRepository');
const allocationEngine = require('../allocation/AllocationEngine');

class AttendanceService {
  async getAttendanceList(params) {
    return await attendanceRepository.findAll(params);
  }

  async importAttendance(data) {
    const { empNo, punchDate, punchTime, deviceCode, shiftCode, punchType = 'IN' } = data;

    const punchDateTimeStr = `${punchDate}T${punchTime}`;
    const punchDateTime = new Date(punchDateTimeStr);

    // Duplicate check
    const existing = await attendanceRepository.findDuplicate(empNo, punchDateTime);
    if (existing) {
      throw new Error('Duplicate attendance punch detected');
    }

    const attendance = await attendanceRepository.create({
      EmpNo: empNo,
      DeviceCode: Number(deviceCode),
      PunchDate: new Date(punchDate),
      PunchTime: new Date(`1970-01-01T${punchTime}Z`),
      PunchDateTime: punchDateTime,
      ShiftCode: shiftCode ? Number(shiftCode) : 1,
      PunchType: punchType,
      AttendanceStatus: 'PENDING',
    });

    // Trigger Automatic Allocation Engine asynchronously
    allocationEngine
      .runAllocation(punchDate, shiftCode || 1)
      .catch((err) => console.error('Auto allocation trigger error:', err));

    return attendance;
  }
}

module.exports = new AttendanceService();
