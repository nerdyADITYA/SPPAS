const accessRightsRepository = require('../repositories/AccessRightsRepository');

class AccessRightsService {
  getAllPermissions() {
    return accessRightsRepository.getPermissions();
  }

  getPermissionsForRole(role) {
    return accessRightsRepository.getPermissionsForRole(role);
  }

  updatePermissions(newPermissions) {
    return accessRightsRepository.updatePermissions(newPermissions);
  }
}

module.exports = new AccessRightsService();
