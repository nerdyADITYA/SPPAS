const postRepository = require('../repositories/PostRepository');

class PostService {
  async getPosts(enableOnly = false) {
    return await postRepository.findAll({ enableOnly });
  }

  async getPostById(id) {
    const post = await postRepository.findById(id);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async createPost(data) {
    return await postRepository.create(data);
  }

  async updatePost(id, data) {
    return await postRepository.update(id, data);
  }

  async deletePost(id) {
    return await postRepository.delete(id);
  }
}

module.exports = new PostService();
