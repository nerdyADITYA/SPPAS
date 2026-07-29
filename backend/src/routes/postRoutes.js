const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { createPostValidator } = require('../validators/postValidator');
const { validate } = require('../middleware/validationMiddleware');
const { authenticate, authorize, checkModuleAccess } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

router.get('/', authenticate, checkModuleAccess('posts', 'READ'), postController.getPosts);
router.get('/:id', authenticate, checkModuleAccess('posts', 'READ'), postController.getPostById);
router.post('/', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), checkModuleAccess('posts', 'MUTATE'), createPostValidator, validate, postController.createPost);
router.put('/:id', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), checkModuleAccess('posts', 'MUTATE'), postController.updatePost);
router.delete('/:id', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), checkModuleAccess('posts', 'MUTATE'), postController.deletePost);

module.exports = router;
