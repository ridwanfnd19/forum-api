const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const Like = require('../../../../Domains/likes/entities/Like');
const AddLikeUseCase = require('../AddLikeUseCase');

describe('AddLikeUseCase', () => {
  it('should throw error if use case params not contain userId', async () => {
    // Arrange
    const userId = undefined;
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const addLikeUseCase = new AddLikeUseCase({});

    // Action & Assert
    await expect(addLikeUseCase.execute(userId, threadId, commentId))
        .rejects
        .toThrowError('ADD_LIKE_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID');
  });

  it('should throw error if use case params not contain threadId', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = undefined;
    const commentId = 'comment-123';
    const addLikeUseCase = new AddLikeUseCase({});

    // Action & Assert
    await expect(addLikeUseCase.execute(userId, threadId, commentId))
        .rejects
        .toThrowError('ADD_LIKE_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID');
  });

  it('should throw error if use case params not contain commentId', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = undefined;
    const addLikeUseCase = new AddLikeUseCase({});

    // Action & Assert
    await expect(addLikeUseCase.execute(userId, threadId, commentId))
        .rejects
        .toThrowError('ADD_LIKE_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID');
  });

  it('should throw error if threadId not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve([]));

    // create use case instance
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addLikeUseCase.execute(userId, threadId, commentId))
        .rejects
        .toThrowError('THREAD_NOT_FOUND');
  });

  it('should throw error if commentId not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve([{
      id: 'thread-123', title: 'title', body: 'body', date: 'date', username: 'username',
    }]));
    mockCommentRepository.findCommentsById = jest.fn(() => Promise.resolve([]));

    // create use case instance
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(addLikeUseCase.execute(userId, threadId, commentId))
        .rejects
        .toThrowError('COMMENT_NOT_FOUND');
  });

  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    // mocking needed function
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve([{
      id: 'thread-123', title: 'title', body: 'body', date: 'date', username: 'username',
    }]));
    mockCommentRepository.findCommentsById = jest.fn(() => Promise.resolve([{
      id: 'comment-123', content: 'sebuah content', threadId: 'thread-123',
      owner: 'user-123', date: '2021-08-08T07:19:09.775Z', is_delete: true,
    }]));
    mockLikeRepository.verifyLike = jest.fn(() => Promise.resolve([]));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve([{id: 'likes-123'}]));

    // create use case instance
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const like = await addLikeUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.findCommentsById).toHaveBeenCalledWith(commentId, threadId);
    expect(mockLikeRepository.addLike).toBeCalledWith(
        new Like(userId, threadId, commentId),
    );
    expect(like).toEqual('Berhasil menyukai comment');
  });

  it('should orchestrating the delete like action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    // mocking needed function
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve([{
      id: 'thread-123', title: 'title', body: 'body', date: 'date', username: 'username',
    }]));
    mockCommentRepository.findCommentsById = jest.fn(() => Promise.resolve([{
      id: 'comment-123', content: 'sebuah content', threadId: 'thread-123',
      owner: 'user-123', date: '2021-08-08T07:19:09.775Z', is_delete: true,
    }]));
    mockLikeRepository.verifyLike = jest.fn(() => Promise.resolve([{id: 'likes-123'}]));
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve([{id: 'likes-123'}]));

    // create use case instance
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const like = await addLikeUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.findCommentsById).toHaveBeenCalledWith(commentId, threadId);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(
        new Like(userId, threadId, commentId),
    );
    expect(like).toEqual('Berhasil batal menyukai comment');
  });
});
