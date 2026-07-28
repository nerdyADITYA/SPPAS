const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');
const { manualDeploymentValidator } = require('../validators/deploymentValidator');
const { validate } = require('../middleware/validationMiddleware');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

router.get('/', authenticate, deploymentController.getDeployments);
router.get('/:id', authenticate, deploymentController.getDeploymentById);
router.post('/allocate', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.SUPERVISOR]), deploymentController.triggerAutoAllocation);
router.post('/', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.SUPERVISOR]), manualDeploymentValidator, validate, deploymentController.createManualDeployment);
router.patch('/:id/status', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.SUPERVISOR]), deploymentController.updateStatus);

module.exports = router;
