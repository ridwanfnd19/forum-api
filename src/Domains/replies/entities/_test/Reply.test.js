/* eslint-disable camelcase */
const Reply = require('../Reply');

describe('Reply entities', () => {
  it('should throw error when id not contain needed property', () => {
    // Arrange
    const payload = {
      id: undefined,
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when username not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: undefined,
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when date not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'username',
      date: undefined,
      is_delete: true,
      content: 'content',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when is_delete not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: undefined,
      content: 'content',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: undefined,
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when id not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when username not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 123,
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when date not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'username',
      date: 123,
      is_delete: true,
      content: 'content',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when is_delete not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: 123,
      content: 'content',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when content not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 123,
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply entities correctly when is_delete = false', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: false,
      content: 'content',
    };

    // Action
    const newReply = new Reply(payload);

    // Assert
    expect(newReply.id).toEqual(payload.id);
    expect(newReply.username).toEqual(payload.username);
    expect(newReply.date).toEqual(payload.date);
    expect(newReply.content).toEqual(payload.content);
  });

  it('should create Reply entities correctly when is_delete = true', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
    };

    // Action
    const newReply = new Reply(payload);

    // Assert
    expect(newReply.id).toEqual(payload.id);
    expect(newReply.username).toEqual(payload.username);
    expect(newReply.date).toEqual(payload.date);
    expect(newReply.content).toEqual('**balasan telah dihapus**');
  });
});
