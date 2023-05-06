class DeleteRepliesUseCase {
  constructor({repliesRepository, commentRepository, threadRepository}) {
    this._repliesRepository = repliesRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId, repliesId) {
    let response;
    this._validatePayload(userId, threadId, commentId, repliesId);
    response = await this._threadRepository.getThreadById(threadId);
    this._validateThreadId(response);
    response = await this._commentRepository.findCommentsById(commentId, threadId);
    this._validateCommentId(response);
    response = await this._repliesRepository.findRepliesById(repliesId);
    this._validateRepliesId(response);
    this._validateOwner(response, userId);
    await this._repliesRepository.deleteRepliesById(repliesId);
  }

  _validatePayload(userId, threadId, commentId, repliesId) {
    if (!userId || !threadId || !commentId || !repliesId) {
      throw new Error('DELETE_REPLIES_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID_OR_REPLIESID');
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

  _validateRepliesId(result) {
    if (!result.length) {
      throw new Error('REPLIES_NOT_FOUND');
    }
  }

  _validateOwner(result, userId) {
    if (result[0].owner !== userId) {
      throw new Error('YOU_HAVE_NO_RIGHT_TO_ACCESS_THIS_RESOURCE');
    }
  }
}

module.exports = DeleteRepliesUseCase;
