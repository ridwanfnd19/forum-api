const NewReplies = require('../../../Domains/replies/entities/NewReplies');

class AddRepliesUseCase {
  constructor({repliesRepository, commentRepository, threadRepository}) {
    this._repliesRepository = repliesRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId, useCasePayload) {
    let response;
    this._validatePayload(userId, threadId, commentId);
    response = await this._threadRepository.getThreadById(threadId);
    this._validateThreadId(response);
    response = await this._commentRepository.findCommentsById(commentId, threadId);
    this._validateCommentId(response);
    const newReplies = new NewReplies(userId, threadId, commentId, useCasePayload);
    return this._repliesRepository.addReplies(newReplies);
  }

  _validatePayload(userId, threadId, commentId) {
    if (!userId || !threadId || !commentId) {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID');
    }
  }

  _validateThreadId(result) {
    if (!result.length) {
      throw new Error('THREAD_NOT_FOUND');
    }
  }

  _validateCommentId(result) {
    if (!result.length) {
      throw new Error('COMMENT_NOT_FOUND');
    }
  }
}

module.exports = AddRepliesUseCase;
