class DeleteCommentUseCase {
  constructor({commentRepository}) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, userId, threadId) {
    this._validatePayload(commentId, userId, threadId);
    const result = await this._commentRepository.findCommentsById(commentId, threadId);
    this._validateCommentId(result);
    this._validateOwner(result, userId);
    await this._commentRepository.deleteCommentById(commentId);
  }

  _validatePayload(commentId, userId, threadId) {
    if (!commentId || !userId || !threadId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENTID_USERID_OR_THREADID');
    }
  }

  _validateCommentId(result) {
    if (!result.length) {
      throw new Error('COMMENT_NOT_FOUND');
    }
  }

  _validateOwner(result, userId) {
    if (result[0].owner !== userId) {
      throw new Error('YOU_HAVE_NO_RIGHT_TO_ACCESS_THIS_RESOURCE');
    }
  }
}

module.exports = DeleteCommentUseCase;
