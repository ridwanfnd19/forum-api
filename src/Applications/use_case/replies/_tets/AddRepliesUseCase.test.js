const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const RepliesRepository = require('../../../../Domains/replies/RepliesRepository');
const NewReplies = require('../../../../Domains/replies/entities/NewReplies');
const AddRepliesUseCase = require('../AddRepliesUseCase');

describe('AddRepliesUseCase', () => {
  it('should throw error if use case params not contain userId', async () => {
    // Arrange
    const userId = undefined;
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const addRepliesUseCase = new AddRepliesUseCase({});

    // Action & Assert
    await expect(addRepliesUseCase.execute(userId, threadId, commentId, {}))
        .rejects
        .toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID');
  });

  it('should throw error if use case params not contain threadId', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = undefined;
    const commentId = 'comment-123';
    const addRepliesUseCase = new AddRepliesUseCase({});

    // Action & Assert
    await expect(addRepliesUseCase.execute(userId, threadId, commentId, {}))
        .rejects
        .toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID');
  });

  it('should throw error if use case params not contain commentId', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = undefined;
    const addRepliesUseCase = new AddRepliesUseCase({});

    // Action & Assert
    await expect(addRepliesUseCase.execute(userId, threadId, commentId, {}))
        .rejects
        .toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID');
  });

  it('should throw error if threadId not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const useCasePayload = {
      content: 'sebuah comment',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve([]));

    // create use case instance
    const addRepliesUseCase = new AddRepliesUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addRepliesUseCase.execute(userId, threadId, commentId, useCasePayload))
        .rejects
        .toThrowError('THREAD_NOT_FOUND');
  });

  it('should throw error if commentId not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const useCasePayload = {
      content: 'sebuah comment',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommnetRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'thread-123', title: 'title', body: 'body', date: 'date', username: 'username'}]));
    mockCommnetRepository.findCommentsById = jest.fn()
        .mockImplementation(() => Promise.resolve([]));

    // create use case instance
    const addRepliesUseCase = new AddRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommnetRepository,
    });

    // Action & Assert
    await expect(addRepliesUseCase.execute(userId, threadId, commentId, useCasePayload))
        .rejects
        .toThrowError('COMMENT_NOT_FOUND');
  });

  it('should orchestrating the add replies action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const useCasePayload = {
      content: 'sebuah replies',
    };

    const expectedNewReplies = {
      id: 'replies-123',
      content: useCasePayload.content,
      owner: userId,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommnetRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'thread-123', title: 'title', body: 'body', date: 'date', username: 'username'}]));
    mockCommnetRepository.findCommentsById = jest.fn()
        .mockImplementation(() => Promise.resolve([{id: 'comment-123', content: 'sebuah content', threadId: 'thread-123', owner: 'user-123', date: '2021-08-08T07:19:09.775Z', is_delete: true}]));
    mockRepliesRepository.addReplies = jest.fn()
        .mockImplementation(() => Promise.resolve({
          id: 'replies-123',
          content: 'sebuah replies',
          owner: 'user-123',
        }));

    // create use case instance
    const addRepliesUseCase = new AddRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommnetRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const response = await addRepliesUseCase.execute(userId, threadId, commentId, useCasePayload);

    // Assert
    expect(mockRepliesRepository.addReplies).toBeCalledWith(
        new NewReplies(userId, threadId, commentId, useCasePayload),
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommnetRepository.findCommentsById).toBeCalledWith(commentId, threadId);
    expect(response).toStrictEqual(expectedNewReplies);
  });
});
