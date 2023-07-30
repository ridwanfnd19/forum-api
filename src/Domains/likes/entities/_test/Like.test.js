const Like = require('../Like');

describe('Like entities', () => {
  it('should throw error when userId not contain needed property', () => {
    // Arrange
    const userId = undefined;
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    // Action & Assert
    expect(() => new Like(userId, threadId, commentId)).toThrowError('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when threadId not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = undefined;
    const commentId = 'comment-123';

    // Action & Assert
    expect(() => new Like(userId, threadId, commentId)).toThrowError('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when commentId not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = undefined;

    // Action & Assert
    expect(() => new Like(userId, threadId, commentId)).toThrowError('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when userId not meet data type specification', () => {
    // Arrange
    const userId = 123;
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    // Action & Assert
    expect(() => new Like(userId, threadId, commentId)).toThrowError('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when threadId not meet data type specification', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 123;
    const commentId = 'comment-123';

    // Action & Assert
    expect(() => new Like(userId, threadId, commentId)).toThrowError('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when commentId not meet data type specification', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 123;

    // Action & Assert
    expect(() => new Like(userId, threadId, commentId)).toThrowError('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
