const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const RepliesRepository = require('../../../../Domains/replies/RepliesRepository');
const DeleteRepliesUseCase = require('../DeleteRepliesUseCase');

describe('DeleteRepliesUseCase', () => {
  it('should throw error if use case params not contain userId', async () => {
    // Arrange
    const userId = undefined;
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const repliesId = 'replies-123';
    const deleteRepliesUseCase = new DeleteRepliesUseCase({});

    // Action & Assert
    await expect(deleteRepliesUseCase.execute(userId, threadId, commentId, repliesId))
        .rejects
        .toThrowError('DELETE_REPLIES_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID_OR_REPLIESID');
  });

  it('should throw error if use case params not contain threadId', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = undefined;
    const commentId = 'comment-123';
    const repliesId = 'replies-123';
    const deleteRepliesUseCase = new DeleteRepliesUseCase({});

    // Action & Assert
    await expect(deleteRepliesUseCase.execute(userId, threadId, commentId, repliesId))
        .rejects
        .toThrowError('DELETE_REPLIES_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID_OR_REPLIESID');
  });

  it('should throw error if use case params not contain commentId', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = undefined;
    const repliesId = 'replies-123';
    const deleteRepliesUseCase = new DeleteRepliesUseCase({});

    // Action & Assert
    await expect(deleteRepliesUseCase.execute(userId, threadId, commentId, repliesId))
        .rejects
        .toThrowError('DELETE_REPLIES_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID_OR_REPLIESID');
  });

  it('should throw error if use case params not contain repliesId', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const repliesId = undefined;
    const deleteRepliesUseCase = new DeleteRepliesUseCase({});

    // Action & Assert
    await expect(deleteRepliesUseCase.execute(userId, threadId, commentId, repliesId))
        .rejects
        .toThrowError('DELETE_REPLIES_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID_OR_REPLIESID');
  });

  it('should throw error if threadId not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const repliesId = 'replies-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve([]));

    // create use case instance
    const deleteRepliesUseCase = new DeleteRepliesUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(deleteRepliesUseCase.execute(userId, threadId, commentId, repliesId))
        .rejects
        .toThrowError('THREAD_NOT_FOUND');
  });

  it('should throw error if commentId not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const repliesId = 'replies-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'thread-123', title: 'title', body: 'body', date: 'date', username: 'username'}]));
    mockCommentRepository.findCommentsById = jest.fn()
        .mockImplementation(() => Promise.resolve([]));

    // create use case instance
    const deleteRepliesUseCase = new DeleteRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteRepliesUseCase.execute(userId, threadId, commentId, repliesId))
        .rejects
        .toThrowError('COMMENT_NOT_FOUND');
  });

  it('should throw error if repliesId not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const repliesId = 'replies-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'thread-123', title: 'title', body: 'body', date: 'date', username: 'username'}]));
    mockCommentRepository.findCommentsById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'comment-123', content: 'sebuah content', threadId: 'thread-123', owner: 'user-123', date: '2021-08-08T07:19:09.775Z', is_delete: true}]));
    mockRepliesRepository.findRepliesById = jest.fn()
        .mockImplementation(() => Promise.resolve([]));

    // create use case instance
    const deleteRepliesUseCase = new DeleteRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action & Assert
    await expect(deleteRepliesUseCase.execute(userId, threadId, commentId, repliesId))
        .rejects
        .toThrowError('REPLIES_NOT_FOUND');
  });

  it('should throw error if not owner', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const repliesId = 'replies-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'thread-123', title: 'title', body: 'body', date: 'date', username: 'username'}]));
    mockCommentRepository.findCommentsById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'comment-123', content: 'sebuah content', threadId: 'thread-123', owner: 'user-123', date: '2021-08-08T07:19:09.775Z', is_delete: true}]));
    mockRepliesRepository.findRepliesById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'comment-123', owner: 'user-124'}]));

    // create use case instance
    const deleteRepliesUseCase = new DeleteRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action & Assert
    await expect(deleteRepliesUseCase.execute(userId, threadId, commentId, repliesId))
        .rejects
        .toThrowError('YOU_HAVE_NO_RIGHT_TO_ACCESS_THIS_RESOURCE');
  });

  it('should orchestrating the delete replies action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const repliesId = 'replies-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'thread-123', title: 'title', body: 'body', date: 'date', username: 'username'}]));
    mockCommentRepository.findCommentsById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'comment-123', content: 'sebuah content', threadId: 'thread-123', owner: 'user-123', date: '2021-08-08T07:19:09.775Z', is_delete: true}]));
    mockRepliesRepository.findRepliesById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'replies-123', content: 'sebuah content', threadId: 'thread-123', commentId: 'comment-123', owner: 'user-123', date: '2021-08-08T07:19:09.775Z', is_delete: true}]));
    mockRepliesRepository.deleteRepliesById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'replies-123'}]));

    // create use case instance
    const deleteRepliesUseCase = new DeleteRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    await deleteRepliesUseCase.execute(userId, threadId, commentId, repliesId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.findCommentsById).toHaveBeenCalledWith(commentId, threadId);
    expect(mockRepliesRepository.findRepliesById).toHaveBeenCalledWith(repliesId);
    expect(mockRepliesRepository.deleteRepliesById).toHaveBeenCalledWith(repliesId);
  });
});
