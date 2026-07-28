const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

router.get('/', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.SUPERVISOR]), employeeController.getEmployees);
router.get('/:empNo', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.SUPERVISOR]), employeeController.getEmployeeByEmpNo);
router.patch('/:empNo/role', authenticate, authorize([ROLES.SUPERADMIN]), employeeController.updateRole);

module.exports = router;
