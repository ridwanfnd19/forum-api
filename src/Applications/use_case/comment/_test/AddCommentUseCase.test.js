const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const NewComment = require('../../../../Domains/comments/entities/NewComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error if use case params not contain userId', async () => {
    // Arrange
    const userId = undefined;
    const threadId = 'thread-123';
    const addCommentUseCase = new AddCommentUseCase({});

    // Action & Assert
    await expect(addCommentUseCase.execute(userId, threadId, {}))
        .rejects
        .toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID');
  });

  it('should throw error if use case params not contain threadId', async () => {
    // Arrange
    const userId = 'userId';
    const threadId = undefined;
    const addCommentUseCase = new AddCommentUseCase({});

    // Action & Assert
    await expect(addCommentUseCase.execute(userId, threadId, {}))
        .rejects
        .toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID');
  });

  it('should throw error if threadId not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = {
      content: 'sebuah comment',
    };

    const expectedNewComment = {
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userId,
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
        .mockImplementation(() => Promise.resolve(expectedNewComment));
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve([]));

    // create use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute(userId, threadId, useCasePayload))
        .rejects
        .toThrowError('THREAD_NOT_FOUND');
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = {
      content: 'sebuah comment',
    };

    const expectedNewComment = {
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userId,
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    }));
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve([{
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2023-04-17T16:58:21.027Z',
      username: 'username',
    }]));

    // create use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const response = await addCommentUseCase.execute(userId, threadId, useCasePayload);

    // Assert
    expect(mockCommentRepository.addComment).toBeCalledWith(
        new NewComment(userId, threadId, useCasePayload),
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(response).toStrictEqual(expectedNewComment);
  });
});
