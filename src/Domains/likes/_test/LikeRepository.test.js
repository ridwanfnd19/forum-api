const LikeRepository = require('../LikeRepository');

describe('Likes repository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.addLike('')).rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.deleteLike('')).rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.verifyLike('')).rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.countLike('', '')).rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
