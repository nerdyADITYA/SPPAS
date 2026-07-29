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
}

module.exports = new ShiftRepository();
