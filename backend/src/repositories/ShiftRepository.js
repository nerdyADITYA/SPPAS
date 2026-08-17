const { prisma } = require('../config/prisma');

class ShiftRepository {
  async findAll() {
    return await prisma.shiftmaster.findMany({
      orderBy: { ShiftCode: 'asc' },
    });
  }

  async findById(shiftCode) {
    return await prisma.shiftmaster.findUnique({
      where: { ShiftCode: Number(shiftCode) },
    });
  }

  parseTimeToDate(timeStr) {
    if (!timeStr) return null;
    if (timeStr instanceof Date) return timeStr;
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hh = parts[0].padStart(2, '0');
      const mm = parts[1].padStart(2, '0');
      const ss = (parts[2] || '00').padStart(2, '0');
      return new Date(`1970-01-01T${hh}:${mm}:${ss}Z`);
    }
    return null;
  }

  async create(data) {
    const formattedData = { ...data };
    const timeFields = [
      'ShiftStartTime',
      'ShiftEndTime',
      'FullDayHrs',
      'HalfDayHrs',
      'LunchHrs',
      'GraceAfterShiftStart',
      'GraceBeforeShiftEnd',
      'GraceForWorkedStatus',
      'GraceForMeal',
      'OTBeforeShiftStart',
      'OTAfterShiftEnd',
      'OtMinHours',
      'ShiftAlocation_StartTime',
      'ShiftAlocation_EndTime',
      'ShiftAlocation_PunchBreak',
    ];
    for (const field of timeFields) {
      if (data[field] !== undefined) {
        formattedData[field] = this.parseTimeToDate(data[field]);
      }
    }
    if (data.OTRound !== undefined) {
      formattedData.OTRound = Number(data.OTRound);
    }
    return await prisma.shiftmaster.create({
      data: formattedData,
    });
  }

  async update(shiftCode, data) {
    const formattedData = { ...data };
    const timeFields = [
      'ShiftStartTime',
      'ShiftEndTime',
      'FullDayHrs',
      'HalfDayHrs',
      'LunchHrs',
      'GraceAfterShiftStart',
      'GraceBeforeShiftEnd',
      'GraceForWorkedStatus',
      'GraceForMeal',
      'OTBeforeShiftStart',
      'OTAfterShiftEnd',
      'OtMinHours',
      'ShiftAlocation_StartTime',
      'ShiftAlocation_EndTime',
      'ShiftAlocation_PunchBreak',
    ];
    for (const field of timeFields) {
      if (data[field] !== undefined) {
        formattedData[field] = this.parseTimeToDate(data[field]);
      }
    }
    if (data.OTRound !== undefined) {
      formattedData.OTRound = Number(data.OTRound);
    }
    delete formattedData.ShiftCode;
    formattedData.UpdateDateTime = new Date();

    return await prisma.shiftmaster.update({
      where: { ShiftCode: Number(shiftCode) },
      data: formattedData,
    });
  }
}

module.exports = new ShiftRepository();
