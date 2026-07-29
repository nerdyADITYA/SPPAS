const express = require('express');
const router = express.Router();
const accessRightsController = require('../controllers/accessRightsController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

// Get permissions for current logged in user (All authenticated users can fetch their own permissions)
router.get('/my-permissions', authenticate, accessRightsController.getMyPermissions);

// SuperAdmin only: Get full access rights matrix
router.get('/', authenticate, authorize([ROLES.SUPERADMIN]), accessRightsController.getAccessRights);

// SuperAdmin only: Update access rights matrix
router.put('/', authenticate, authorize([ROLES.SUPERADMIN]), accessRightsController.updateAccessRights);

module.exports = router;
