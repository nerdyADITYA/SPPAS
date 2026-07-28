const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { createPostValidator } = require('../validators/postValidator');
const { validate } = require('../middleware/validationMiddleware');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

router.get('/', authenticate, postController.getPosts);
router.get('/:id', authenticate, postController.getPostById);
router.post('/', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), createPostValidator, validate, postController.createPost);
router.put('/:id', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), postController.updatePost);
router.delete('/:id', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), postController.deletePost);

module.exports = router;
