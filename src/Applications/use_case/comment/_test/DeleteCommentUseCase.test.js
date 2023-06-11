/* eslint-disable prefer-promise-reject-errors */
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case params not contain userId', async () => {
    // Arrange
    const userId = undefined;
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(commentId, userId, threadId))
        .rejects
        .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENTID_USERID_OR_THREADID');
  });

  it('should throw error if use case params not contain commentId', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = undefined;
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(commentId, userId, threadId))
        .rejects
        .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENTID_USERID_OR_THREADID');
  });

  it('should throw error if use case params not contain threadId', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = undefined;
    const commentId = 'comment-123';
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(commentId, userId, threadId))
        .rejects
        .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENTID_USERID_OR_THREADID');
  });

  it('should throw error if commentId not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    /** creating dependency of use case */
    const mockCommentRepository= new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.findCommentsById = jest.fn(() => Promise.resolve([]));
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

    // create use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(commentId, userId, threadId))
        .rejects
        .toThrowError('COMMENT_NOT_FOUND');
  });

  it('should throw error if not owner', async () => {
    // Arrange
    const userId = 'user';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const expectedVerifyOwner = [
      {
        id: 'comment-123',
        content: 'sebuah content',
        threadId: 'thread-123',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
        is_delete: true,
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository= new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.findCommentsById = jest.fn(() => Promise.resolve(expectedVerifyOwner));
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve([{id: 'comment-123'}]));

    // create use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(commentId, userId, threadId))
        .rejects
        .toThrowError('YOU_HAVE_NO_RIGHT_TO_ACCESS_THIS_RESOURCE');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const expectedVerifyOwner = [
      {
        id: 'comment-123',
        content: 'sebuah content',
        threadId: 'thread-123',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
        is_delete: true,
      },
    ];


    /** creating dependency of use case */
    const mockCommentRepository= new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.findCommentsById = jest.fn(() => Promise.resolve(expectedVerifyOwner));
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve([{id: 'comment-123'}]));

    // create use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(commentId, userId, threadId);

    // Assert
    expect(mockCommentRepository.findCommentsById).toHaveBeenCalledWith(
        commentId, threadId,
    );
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith(
        commentId,
    );
  });
});
