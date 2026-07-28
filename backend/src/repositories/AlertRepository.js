const { prisma } = require('../config/prisma');

class AlertRepository {
  async findAll({ page = 1, pageSize = 25, resolved, severity, alertType }) {
    const skip = (page - 1) * pageSize;
    const where = {};

    if (resolved) where.Resolved = resolved;
    if (severity) where.Severity = severity;
    if (alertType) where.AlertType = alertType;

    const [data, totalRecords] = await Promise.all([
      prisma.securityalertlog.findMany({
        where,
        skip,
        take: Number(pageSize),
        include: {
          employee: true,
          post: true,
          device: true,
          resolvedUser: true,
        },
        orderBy: [{ Severity: 'desc' }, { AlertDateTime: 'desc' }],
      }),
      prisma.securityalertlog.count({ where }),
    ]);

    return {
      data,
      page: Number(page),
      pageSize: Number(pageSize),
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  }

  async create(data) {
    return await prisma.securityalertlog.create({ data });
  }

  async resolve(alertCode, resolvedBy, remarks = null) {
    return await prisma.securityalertlog.update({
      where: { AlertCode: BigInt(alertCode) },
      data: {
        Resolved: 'Y',
        ResolvedBy: resolvedBy,
        ResolvedDateTime: new Date(),
        Remarks: remarks,
      },
    });
  }
}

module.exports = new AlertRepository();
