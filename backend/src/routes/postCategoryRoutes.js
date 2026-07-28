const express = require('express');
const router = express.Router();
const postCategoryController = require('../controllers/postCategoryController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

router.get('/', authenticate, postCategoryController.getCategories);
router.post('/', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), postCategoryController.createCategory);
router.put('/:id', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), postCategoryController.updateCategory);
router.delete('/:id', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), postCategoryController.deleteCategory);

module.exports = router;
