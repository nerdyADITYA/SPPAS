const { prisma } = require('../config/prisma');

class EmployeeRepository {
  async findAll({ page = 1, pageSize = 25, search = '', securityRole, enable }) {
    const skip = (page - 1) * pageSize;
    const where = {};

    if (search) {
      where.OR = [
        { EmpNo: { contains: search } },
        { FirstName: { contains: search } },
        { LastName: { contains: search } },
      ];
    }

    if (securityRole) {
      where.SecurityRole = securityRole;
    }

    if (enable) {
      where.Enable = enable;
    }

    const [data, totalRecords] = await Promise.all([
      prisma.employeemaster.findMany({
        where,
        skip,
        take: Number(pageSize),
        include: {
          department: true,
          designation: true,
          location: true,
          personal: true,
          dates: true,
        },
        orderBy: { EmpNo: 'asc' },
      }),
      prisma.employeemaster.count({ where }),
    ]);

    return {
      data,
      page: Number(page),
      pageSize: Number(pageSize),
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  }

  async findByEmpNo(empNo) {
    return await prisma.employeemaster.findUnique({
      where: { EmpNo: empNo },
      include: {
        department: true,
        designation: true,
        location: true,
        personal: true,
        dates: true,
      },
    });
  }

  async updateRole(empNo, securityRole) {
    return await prisma.employeemaster.update({
      where: { EmpNo: empNo },
      data: { SecurityRole: securityRole, UpdateDateTime: new Date() },
    });
  }
}

module.exports = new EmployeeRepository();
