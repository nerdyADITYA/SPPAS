const { prisma } = require('../config/prisma');

class ReportRepository {
  async getAttendanceReport({ startDate, endDate, empNo, shiftCode }) {
    const where = {};
    if (startDate && endDate) {
      where.PunchDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    if (empNo) where.EmpNo = empNo;
    if (shiftCode) where.ShiftCode = Number(shiftCode);

    return await prisma.securityattendance.findMany({
      where,
      include: {
        employee: true,
        device: true,
        shift: true,
      },
      orderBy: { PunchDateTime: 'desc' },
    });
  }

  async getDeploymentReport({ startDate, endDate, empNo, postCode, shiftCode, status }) {
    const where = {};
    if (startDate && endDate) {
      where.DeploymentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    if (empNo) where.EmpNo = empNo;
    if (postCode) where.PostCode = Number(postCode);
    if (shiftCode) where.ShiftCode = Number(shiftCode);
    if (status) where.DeploymentStatus = status;

    return await prisma.securitydeployment.findMany({
      where,
      include: {
        employee: true,
        post: { include: { postCategory: true, location: true } },
        shift: true,
        allocatedUser: true,
      },
      orderBy: { DeploymentDate: 'desc' },
    });
  }

  async getVacancyReport({ startDate, endDate, shiftCode }) {
    const where = {};
    if (startDate && endDate) {
      where.VacancyDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    if (shiftCode) where.ShiftCode = Number(shiftCode);

    return await prisma.securitypostvacancy.findMany({
      where,
      include: {
        post: { include: { postCategory: true, location: true } },
        shift: true,
      },
      orderBy: { VacancyDate: 'desc' },
    });
  }
}

module.exports = new ReportRepository();
