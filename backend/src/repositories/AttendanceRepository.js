const { prisma } = require('../config/prisma');

class AttendanceRepository {
  async findAll({ page = 1, pageSize = 25, empNo, date, status }) {
    const skip = (page - 1) * pageSize;
    const where = {};

    if (empNo) where.EmpNo = empNo;
    if (status) where.AttendanceStatus = status;
    if (date) {
      const targetDate = new Date(date);
      where.PunchDate = targetDate;
    }

    const [data, totalRecords] = await Promise.all([
      prisma.securityattendance.findMany({
        where,
        skip,
        take: Number(pageSize),
        include: {
          employee: true,
          device: true,
          shift: true,
        },
        orderBy: { PunchDateTime: 'desc' },
      }),
      prisma.securityattendance.count({ where }),
    ]);

    return {
      data,
      page: Number(page),
      pageSize: Number(pageSize),
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  }

  async findDuplicate(empNo, punchDateTime) {
    return await prisma.securityattendance.findFirst({
      where: {
        EmpNo: empNo,
        PunchDateTime: new Date(punchDateTime),
      },
    });
  }

  async create(data) {
    return await prisma.securityattendance.create({ data });
  }

  async updateStatus(attendanceCode, status, remarks = null) {
    return await prisma.securityattendance.update({
      where: { AttendanceCode: BigInt(attendanceCode) },
      data: {
        AttendanceStatus: status,
        Remarks: remarks,
        UpdateDateTime: new Date(),
      },
    });
  }

  async getPendingAttendanceForToday(date) {
    const targetDate = new Date(date);
    return await prisma.securityattendance.findMany({
      where: {
        PunchDate: targetDate,
        AttendanceStatus: 'PENDING',
      },
      include: {
        employee: true,
        device: true,
        shift: true,
      },
      orderBy: { PunchTime: 'asc' },
    });
  }
}

module.exports = new AttendanceRepository();
