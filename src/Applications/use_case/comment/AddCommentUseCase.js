const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({commentRepository, threadRepository}) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    this._validatePayload(userId, threadId);
    const reposeThread = await this._threadRepository.getThreadById(threadId);
    this._validateThreadId(reposeThread);
    const newComment = new NewComment(userId, threadId, useCasePayload);
    return this._commentRepository.addComment(newComment);
  }

  _validatePayload(userId, threadId) {
    if (!userId || !threadId) {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID');
    }
  }

  _validateThreadId(result) {
    if (!result.length) {
      throw new Error('THREAD_NOT_FOUND');
    }
  }
}

module.exports = AddCommentUseCase;
