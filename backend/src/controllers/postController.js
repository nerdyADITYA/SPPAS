const postService = require('../services/PostService');
const { sendSuccess } = require('../utils/apiResponse');

class PostController {
  async getPosts(req, res, next) {
    try {
      const { enableOnly } = req.query;
      const posts = await postService.getPosts(enableOnly === 'true');
      return sendSuccess(res, 'Duty posts retrieved successfully', posts);
    } catch (error) {
      next(error);
    }
  }

  async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await postService.getPostById(id);
      return sendSuccess(res, 'Duty post retrieved successfully', post);
    } catch (error) {
      next(error);
    }
  }

  async createPost(req, res, next) {
    try {
      const post = await postService.createPost(req.body);
      return sendSuccess(res, 'Duty post created successfully', post, 201);
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await postService.updatePost(id, req.body);
      return sendSuccess(res, 'Duty post updated successfully', post);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      await postService.deletePost(id);
      return sendSuccess(res, 'Duty post deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
