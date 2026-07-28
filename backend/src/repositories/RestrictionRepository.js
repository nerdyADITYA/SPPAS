const { prisma } = require('../config/prisma');

class RestrictionRepository {
  async findAll() {
    return await prisma.securityguardrestrictionmaster.findMany({
      orderBy: { RestrictionCode: 'asc' },
    });
  }

  async findActiveRestrictions() {
    return await prisma.securityguardrestrictionmaster.findMany({
      where: { Enable: 'Y' },
    });
  }

  async create(data) {
    return await prisma.securityguardrestrictionmaster.create({ data });
  }

  async update(restrictionCode, data) {
    return await prisma.securityguardrestrictionmaster.update({
      where: { RestrictionCode: Number(restrictionCode) },
      data: { ...data, UpdateDateTime: new Date() },
    });
  }
}

module.exports = new RestrictionRepository();
