const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../../Domains/replies/RepliesRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUserCase', () => {
  it('should throw error if use case params not contain threadId', async () => {
    // Arrange
    const threadId = undefined;
    const gerThreadUseCase = new GetThreadUseCase({});

    // Action & Assert
    await expect(gerThreadUseCase.execute(threadId))
        .rejects
        .toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_THREADID');
  });

  it('should throw error if threadId not found', async () => {
    // Arrange
    const threadId = 'threadId';
    /** creating dependency of use case */
    const mockAddThreadRepository= new ThreadRepository();

    /** mocking needed function */
    mockAddThreadRepository.getThreadById = jest.fn(() => Promise.resolve([]));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockAddThreadRepository,
    });

    // Action & Assert
    await expect(getThreadUseCase.execute(threadId))
        .rejects
        .toThrowError('THREAD_NOT_FOUND');
  });

  it('should orchestrating the get thread action correctly when comment deleted', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const expectedThread = [
      {
        id: 'thread-123',
        title: 'title',
        date: Object('2023-04-17T16:58:21.027Z'),
        username: 'username',
        comments: [
          {
            id: 'comment-123',
            username: 'username2',
            date: Object('2023-04-17T16:58:21.027Z'),
            content: '**komentar telah dihapus**',
            replies: [
              {
                id: 'replies-123',
                username: 'username',
                date: Object('2023-04-17T16:58:21.027Z'),
                content: '**balasan telah dihapus**',
              },
              {
                id: 'replies-124',
                username: 'indonesia',
                date: Object('2023-04-17T16:58:21.027Z'),
                content: 'sebuah replies',
              },
            ],
          },
        ],
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository= new ThreadRepository();
    const mockCommentRepository= new CommentRepository();
    const mockRepliesRepository= new RepliesRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve([{
      id: 'thread-123',
      title: 'title',
      date: Object('2023-04-17T16:58:21.027Z'),
      username: 'username',
    }]));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([{
      id: 'comment-123',
      username: 'username2',
      date: Object('2023-04-17T16:58:21.027Z'),
      is_delete: true,
      content: 'sebuah comment',
    }]));
    mockRepliesRepository.getRepliesByThreadIdAndCommentId = jest.fn(() => Promise.resolve([
      {
        id: 'replies-123',
        username: 'username',
        date: Object('2023-04-17T16:58:21.027Z'),
        is_delete: true,
        content: 'sebuah replies',
      },
      {
        id: 'replies-124',
        username: 'indonesia',
        date: Object('2023-04-17T16:58:21.027Z'),
        is_delete: false,
        content: 'sebuah replies',
      },
    ]));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const response = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockRepliesRepository.getRepliesByThreadIdAndCommentId).toBeCalledWith(threadId, commentId);
    expect(JSON.stringify(response)).toStrictEqual(JSON.stringify(expectedThread[0]));
  });

  it('should orchestrating the get thread action correctly when comment not deleted', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const expectedThread = [
      {
        id: 'thread-123',
        title: 'title',
        date: Object('2023-04-17T16:58:21.027Z'),
        username: 'username',
        comments: [
          {
            id: 'comment-123',
            username: 'username2',
            date: Object('2023-04-17T16:58:21.027Z'),
            content: 'sebuah comment',
            replies: [
              {
                id: 'replies-123',
                username: 'username',
                date: Object('2023-04-17T16:58:21.027Z'),
                content: '**balasan telah dihapus**',
              },
              {
                id: 'replies-124',
                username: 'indonesia',
                date: Object('2023-04-17T16:58:21.027Z'),
                content: 'sebuah replies',
              },
            ],
          },
        ],
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository= new ThreadRepository();
    const mockCommentRepository= new CommentRepository();
    const mockRepliesRepository= new RepliesRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve([
      {
        id: 'thread-123',
        title: 'title',
        date: Object('2023-04-17T16:58:21.027Z'),
        username: 'username',
      },
    ]));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([
      {
        id: 'comment-123',
        username: 'username2',
        date: Object('2023-04-17T16:58:21.027Z'),
        is_delete: false,
        content: 'sebuah comment',
      },
    ]));
    mockRepliesRepository.getRepliesByThreadIdAndCommentId = jest.fn(() => Promise.resolve([
      {
        id: 'replies-123',
        username: 'username',
        date: Object('2023-04-17T16:58:21.027Z'),
        is_delete: true,
        content: 'sebuah replies',
      },
      {
        id: 'replies-124',
        username: 'indonesia',
        date: Object('2023-04-17T16:58:21.027Z'),
        is_delete: false,
        content: 'sebuah replies',
      },
    ]));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const response = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockRepliesRepository.getRepliesByThreadIdAndCommentId).toBeCalledWith(threadId, commentId);
    expect(JSON.stringify(response)).toStrictEqual(JSON.stringify(expectedThread[0]));
  });
});
