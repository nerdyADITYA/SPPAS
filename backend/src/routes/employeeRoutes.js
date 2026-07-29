const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize, checkModuleAccess } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

router.get('/', authenticate, checkModuleAccess('employees', 'READ'), employeeController.getEmployees);
router.get('/:empNo', authenticate, checkModuleAccess('employees', 'READ'), employeeController.getEmployeeByEmpNo);
router.patch('/:empNo/role', authenticate, authorize([ROLES.SUPERADMIN]), checkModuleAccess('employees', 'MUTATE'), employeeController.updateRole);
router.patch('/:empNo/category', authenticate, checkModuleAccess('employees', 'MUTATE'), employeeController.updateCategory);

module.exports = router;
