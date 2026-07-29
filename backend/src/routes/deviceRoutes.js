const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { createDeviceValidator } = require('../validators/deviceValidator');
const { validate } = require('../middleware/validationMiddleware');
const { authenticate, authorize, checkModuleAccess } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

router.get('/', authenticate, checkModuleAccess('devices', 'READ'), deviceController.getDevices);
router.get('/:id', authenticate, checkModuleAccess('devices', 'READ'), deviceController.getDeviceById);
router.post('/', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), checkModuleAccess('devices', 'MUTATE'), createDeviceValidator, validate, deviceController.createDevice);
router.put('/:id', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), checkModuleAccess('devices', 'MUTATE'), deviceController.updateDevice);
router.post('/heartbeat', deviceController.heartbeat); // Heartbeat endpoint used by Python service
router.delete('/:id', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), checkModuleAccess('devices', 'MUTATE'), deviceController.deleteDevice);

module.exports = router;
