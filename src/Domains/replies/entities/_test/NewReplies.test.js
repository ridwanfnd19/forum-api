const NewReplies = require('../NewReplies');

describe('NewReplies entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId ='comment-123';
    const payload = {};

    // Action & Assert
    expect(() => new NewReplies(userId, threadId, commentId, payload)).toThrowError('NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when userId not contain needed property', () => {
    // Arrange
    const userId = undefined;
    const threadId = 'thread-123';
    const commentId ='comment-123';
    const payload = {
      content: '123',
    };

    // Action & Assert
    expect(() => new NewReplies(userId, threadId, commentId, payload)).toThrowError('NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when threadId not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = undefined;
    const commentId ='comment-123';
    const payload = {
      content: '123',
    };

    // Action & Assert
    expect(() => new NewReplies(userId, threadId, commentId, payload)).toThrowError('NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when commentId not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = undefined;
    const payload = {
      content: '123',
    };

    // Action & Assert
    expect(() => new NewReplies(userId, threadId, commentId, payload)).toThrowError('NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId ='comment-123';
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new NewReplies(userId, threadId, commentId, payload)).toThrowError('NEW_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when userId not meet data type specification', () => {
    // Arrange
    const userId = 123;
    const threadId = 'thread-123';
    const commentId ='comment-123';
    const payload = {
      content: '123',
    };

    // Action & Assert
    expect(() => new NewReplies(userId, threadId, commentId, payload)).toThrowError('NEW_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when threadId not meet data type specification', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 123;
    const commentId ='comment-123';
    const payload = {
      content: '123',
    };

    // Action & Assert
    expect(() => new NewReplies(userId, threadId, commentId, payload)).toThrowError('NEW_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when commentId not meet data type specification', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 123;
    const payload = {
      content: '123',
    };

    // Action & Assert
    expect(() => new NewReplies(userId, threadId, commentId, payload)).toThrowError('NEW_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReplies entities correctly', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'content',
    };

    // Action
    const newReplies = new NewReplies(userId, threadId, commentId, payload);

    // Assert
    expect(newReplies).toBeInstanceOf(NewReplies);
    expect(newReplies.content).toEqual(payload.content);
  });
});
