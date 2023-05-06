const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    this._validatePayload(userId);
    const newThread = new NewThread(userId, useCasePayload);
    return this._threadRepository.addThread(newThread);
  }

  _validatePayload(userId) {
    if (!userId) {
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_USERID');
    }
  }
}

module.exports = AddThreadUseCase;
