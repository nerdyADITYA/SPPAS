const { prisma } = require('../config/prisma');

class AuthRepository {
  async findByEmpNo(empNo) {
    return await prisma.employeemaster.findUnique({
      where: { EmpNo: empNo },
      include: {
        department: true,
        designation: true,
        location: true,
        personal: true,
      },
    });
  }
}

module.exports = new AuthRepository();
