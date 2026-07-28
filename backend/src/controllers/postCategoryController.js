const postCategoryService = require('../services/PostCategoryService');
const { sendSuccess } = require('../utils/apiResponse');

class PostCategoryController {
  async getCategories(req, res, next) {
    try {
      const categories = await postCategoryService.getCategories();
      return sendSuccess(res, 'Post categories retrieved successfully', categories);
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const category = await postCategoryService.createCategory(req.body);
      return sendSuccess(res, 'Post category created successfully', category, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await postCategoryService.updateCategory(id, req.body);
      return sendSuccess(res, 'Post category updated successfully', category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await postCategoryService.deleteCategory(id);
      return sendSuccess(res, 'Post category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostCategoryController();
