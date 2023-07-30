class LikeRepository {
  async addLike(like) {
    throw new Error('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLike(like) {
    throw new Error('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyLike(like) {
    throw new Error('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async countLike(threadId, commentId) {
    throw new Error('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeRepository;
