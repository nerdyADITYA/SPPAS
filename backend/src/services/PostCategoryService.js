const postCategoryRepository = require('../repositories/PostCategoryRepository');

class PostCategoryService {
  async getCategories() {
    return await postCategoryRepository.findAll();
  }

  async getCategoryById(id) {
    const cat = await postCategoryRepository.findById(id);
    if (!cat) throw new Error('Category not found');
    return cat;
  }

  async createCategory(data) {
    return await postCategoryRepository.create(data);
  }

  async updateCategory(id, data) {
    return await postCategoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    return await postCategoryRepository.delete(id);
  }
}

module.exports = new PostCategoryService();
