const employeeService = require('../services/EmployeeService');
const { sendSuccess } = require('../utils/apiResponse');

class EmployeeController {
  async getEmployees(req, res, next) {
    try {
      const { page, pageSize, search, securityRole, enable } = req.query;
      const result = await employeeService.getEmployees({ page, pageSize, search, securityRole, enable });
      return sendSuccess(res, 'Employees retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeByEmpNo(req, res, next) {
    try {
      const { empNo } = req.params;
      const result = await employeeService.getEmployeeByEmpNo(empNo);
      return sendSuccess(res, 'Employee retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const { empNo } = req.params;
      const { securityRole } = req.body;
      const result = await employeeService.updateEmployeeRole(empNo, securityRole);
      return sendSuccess(res, 'Employee role updated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { empNo } = req.params;
      const { categoryCode } = req.body;
      const result = await employeeService.updateEmployeeCategory(empNo, categoryCode);
      return sendSuccess(res, 'Employee category updated successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();
