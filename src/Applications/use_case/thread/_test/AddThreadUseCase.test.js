const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const NewThread= require('../../../../Domains/threads/entities/NewThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUserCase', () => {
  it('should throw error if use case params not contain userId', async () => {
    // Arrange
    const userId = undefined;
    const addThreadUseCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(addThreadUseCase.execute(userId, {}))
        .rejects
        .toThrowError('ADD_THREAD_USE_CASE.NOT_CONTAIN_USERID');
  });

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };

    const expectedNewThread = {
      id: 'thread-123',
      title: useCasePayload.title,
      username: userId,
    };

    /** creating dependency of use case */
    const mockAddThreadRepository= new ThreadRepository();

    /** mocking needed function */
    mockAddThreadRepository.addThread = jest.fn()
        .mockImplementation(() => Promise.resolve({
          id: 'thread-123',
          title: 'title',
          username: 'user-123',
        }));

    // create use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockAddThreadRepository,
    });

    // Action
    const response = await addThreadUseCase.execute(userId, useCasePayload);

    // Assert
    expect(mockAddThreadRepository.addThread).toBeCalledWith(
        new NewThread(userId, useCasePayload),
    );
    expect(response).toStrictEqual(expectedNewThread);
  });
});
