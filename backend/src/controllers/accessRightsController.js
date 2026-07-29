const accessRightsService = require('../services/AccessRightsService');
const { sendSuccess } = require('../utils/apiResponse');

const { getIO } = require('../websocket/socketServer');

class AccessRightsController {
  getAccessRights(req, res, next) {
    try {
      const permissions = accessRightsService.getAllPermissions();
      return sendSuccess(res, 'Access rights matrix retrieved successfully', permissions);
    } catch (error) {
      next(error);
    }
  }

  getMyPermissions(req, res, next) {
    try {
      const role = req.user.SecurityRole || 'USER';
      const permissions = accessRightsService.getPermissionsForRole(role);
      return sendSuccess(res, 'My permissions retrieved successfully', { role, permissions });
    } catch (error) {
      next(error);
    }
  }

  updateAccessRights(req, res, next) {
    try {
      const newPermissions = req.body;
      const updated = accessRightsService.updatePermissions(newPermissions);
      
      try {
        const io = getIO();
        io.emit('AccessRightsUpdated', { updatedBy: req.user?.EmpNo });
      } catch (err) {
        // Socket broadcast optional
      }

      return sendSuccess(res, 'Access rights matrix updated successfully', updated);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AccessRightsController();
