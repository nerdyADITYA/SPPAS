const deploymentRepository = require('../repositories/DeploymentRepository');

class DeploymentService {
  async getDeployments(params) {
    return await deploymentRepository.findAll(params);
  }

  async getDeploymentById(id) {
    const dep = await deploymentRepository.findById(id);
    if (!dep) throw new Error('Deployment not found');
    return dep;
  }

  async createManualDeployment(data, currentEmpNo) {
    const { deploymentDate, empNo, postCode, shiftCode, remarks } = data;

    const existing = await deploymentRepository.findExistingDeployment(deploymentDate, empNo, shiftCode);
    if (existing) {
      throw new Error('Guard is already deployed for this shift');
    }

    const payload = {
      DeploymentDate: new Date(deploymentDate),
      EmpNo: empNo,
      PostCode: Number(postCode),
      ShiftCode: Number(shiftCode),
      ReportingTime: new Date(),
      AllocationMethod: 'MANUAL',
      DeploymentStatus: 'ALLOCATED',
      AllocatedBy: currentEmpNo,
      Remarks: remarks || 'Manual guard deployment',
    };

    const historyPayload = {
      ActionType: 'CREATED',
      ChangedBy: currentEmpNo,
      Remarks: remarks || 'Manual deployment created by supervisor',
    };

    return await deploymentRepository.createDeployment(payload, historyPayload);
  }

  async updateStatus(deploymentCode, status, currentEmpNo, remarks = null) {
    const updateData = {
      DeploymentStatus: status,
      ApprovedBy: currentEmpNo,
      Remarks: remarks,
    };

    if (status === 'REPORTED') {
      updateData.ReportingTime = new Date();
    } else if (status === 'COMPLETED') {
      updateData.RelievingTime = new Date();
    }

    const historyPayload = {
      ActionType: 'STATUS_CHANGED',
      ChangedBy: currentEmpNo,
      Remarks: remarks || `Deployment status changed to ${status}`,
    };

    return await deploymentRepository.updateDeployment(deploymentCode, updateData, historyPayload);
  }
}

module.exports = new DeploymentService();
