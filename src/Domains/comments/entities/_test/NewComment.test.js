const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const payload = {};

    // Action & Assert
    expect(() => new NewComment(userId, threadId, payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new NewComment(userId, threadId, payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when userId not contain needed property', () => {
    // Arrange
    const userId = undefined;
    const threadId = 'thread-123';
    const payload = {
      content: 'comment',
    };

    // Action & Assert
    expect(() => new NewComment(userId, threadId, payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when userId not meet data type specification', () => {
    // Arrange
    const userId = 123;
    const threadId = 'thread-123';
    const payload = {
      content: 'comment',
    };

    // Action & Assert
    expect(() => new NewComment(userId, threadId, payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when threadId not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = undefined;
    const payload = {
      content: 'comment',
    };

    // Action & Assert
    expect(() => new NewComment(userId, threadId, payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when threadId not meet data type specification', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 123;
    const payload = {
      content: 'comment',
    };

    // Action & Assert
    expect(() => new NewComment(userId, threadId, payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: 'comment',
    };

    // Action
    const comment = new NewComment(userId, threadId, payload);

    // Assert
    expect(comment).toBeInstanceOf(NewComment);
    expect(comment.content).toEqual(payload.content);
  });
});
