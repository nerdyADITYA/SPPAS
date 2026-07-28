const { prisma } = require('../config/prisma');

class AllocationRuleRepository {
  async findAll() {
    return await prisma.securityallocationrulemaster.findMany({
      orderBy: { RulePriority: 'asc' },
    });
  }

  async findActiveRule() {
    return await prisma.securityallocationrulemaster.findFirst({
      where: { Enable: 'Y' },
      orderBy: { RulePriority: 'asc' },
    });
  }

  async create(data) {
    return await prisma.securityallocationrulemaster.create({ data });
  }

  async update(ruleCode, data) {
    return await prisma.securityallocationrulemaster.update({
      where: { RuleCode: Number(ruleCode) },
      data: { ...data, UpdateDateTime: new Date() },
    });
  }
}

module.exports = new AllocationRuleRepository();
