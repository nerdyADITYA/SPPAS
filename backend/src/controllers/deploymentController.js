const deploymentService = require('../services/DeploymentService');
const allocationEngine = require('../allocation/AllocationEngine');
const { sendSuccess } = require('../utils/apiResponse');

class DeploymentController {
  async getDeployments(req, res, next) {
    try {
      const { page, pageSize, date, shiftCode, postCode, status } = req.query;
      const result = await deploymentService.getDeployments({ page, pageSize, date, shiftCode, postCode, status });
      return sendSuccess(res, 'Deployments retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getDeploymentById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await deploymentService.getDeploymentById(id);
      return sendSuccess(res, 'Deployment details retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async triggerAutoAllocation(req, res, next) {
    try {
      const { date, shiftCode } = req.body;
      const result = await allocationEngine.runAllocation(date, shiftCode || 1);
      return sendSuccess(res, result.message, result);
    } catch (error) {
      next(error);
    }
  }

  async createManualDeployment(req, res, next) {
    try {
      const currentEmpNo = req.user.EmpNo;
      const result = await deploymentService.createManualDeployment(req.body, currentEmpNo);
      return sendSuccess(res, 'Manual deployment created successfully', result, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;
      const currentEmpNo = req.user.EmpNo;
      const result = await deploymentService.updateStatus(id, status, currentEmpNo, remarks);
      return sendSuccess(res, `Deployment status updated to ${status}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DeploymentController();
