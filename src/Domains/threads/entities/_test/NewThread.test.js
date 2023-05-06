const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {};

    // Action & Assert
    expect(() => new NewThread(userId, payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when userId not contain needed property', () => {
    // Arrange
    const userId = undefined;
    const payload = {};

    // Action & Assert
    expect(() => new NewThread(userId, payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {
      title: 123,
      body: 'body',
    };

    // Action & Assert
    expect(() => new NewThread(userId, payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when userId not meet data type specification', () => {
    // Arrange
    const userId = 123;
    const payload = {
      title: '123',
      body: 'body',
    };

    // Action & Assert
    expect(() => new NewThread(userId, payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {
      title: 'title',
      body: 'body',
    };

    // Action
    const newThread = new NewThread(userId, payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
