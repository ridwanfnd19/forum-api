/* eslint-disable camelcase */
const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when id not contain needed property', () => {
    // Arrange
    const payload = {
      id: undefined,
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
      replies: [],
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when username not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: undefined,
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
      replies: [],
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when date not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: undefined,
      is_delete: true,
      content: 'content',
      replies: [],
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when is_delete not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: undefined,
      content: 'content',
      replies: [],
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: undefined,
      replies: [],
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when replies not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
      replies: undefined,
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when likeCount not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
      replies: [],
      likeCount: undefined,
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when id not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
      replies: [],
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when username not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 123,
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
      replies: [],
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when date not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: 123,
      is_delete: true,
      content: 'content',
      replies: [],
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when is_delete not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: 123,
      content: 'content',
      replies: [],
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when content not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: false,
      content: 123,
      replies: [],
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when replies not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
      replies: 123,
      likeCount: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when likeCount not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
      replies: [],
      likeCount: 123,
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment entities correctly when is_delete = false', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: Object(Object('2021-08-08T07:19:09.775Z')),
      is_delete: false,
      content: 'content',
      replies: [],
      likeCount: {},
    };

    // Action
    const newComment = new Comment(payload);

    // Assert
    expect(newComment.id).toEqual(payload.id);
    expect(newComment.username).toEqual(payload.username);
    expect(newComment.date).toEqual(payload.date);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.replies).toEqual(payload.replies);
  });

  it('should create Comment entities correctly when is_delete = true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: Object('2021-08-08T07:19:09.775Z'),
      is_delete: true,
      content: 'content',
      replies: [],
      likeCount: {},
    };

    // Action
    const newComment = new Comment(payload);

    // Assert
    expect(newComment.id).toEqual(payload.id);
    expect(newComment.username).toEqual(payload.username);
    expect(newComment.date).toEqual(payload.date);
    expect(newComment.content).toEqual('**komentar telah dihapus**');
    expect(newComment.replies).toEqual(payload.replies);
  });
});
