const employeeRepository = require('../repositories/EmployeeRepository');

class EmployeeService {
  async getEmployees(params) {
    return await employeeRepository.findAll(params);
  }

  async getEmployeeByEmpNo(empNo) {
    const emp = await employeeRepository.findByEmpNo(empNo);
    if (!emp) throw new Error('Employee not found');
    delete emp.Password;
    return emp;
  }

  async updateEmployeeRole(empNo, securityRole) {
    return await employeeRepository.updateRole(empNo, securityRole);
  }
}

module.exports = new EmployeeService();
