const Like = require('../../../Domains/likes/entities/Like');

class AddLikeUseCase {
  constructor({commentRepository, threadRepository, likeRepository}) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._likeRepository = likeRepository;
  }

  async execute(userId, threadId, commentId) {
    let response;
    this._validatePayload(userId, threadId, commentId);
    response = await this._threadRepository.getThreadById(threadId);
    this._validateThreadId(response);
    response = await this._commentRepository.findCommentsById(commentId, threadId);
    this._validateCommentId(response);
    const newLike = new Like(userId, threadId, commentId);
    response = await this._likeRepository.verifyLike(newLike);
    if (!response.length) {
      await this._likeRepository.addLike(newLike);
      return 'Berhasil menyukai comment';
    } else {
      await this._likeRepository.deleteLike(newLike);
      return 'Berhasil batal menyukai comment';
    }
  }

  _validatePayload(userId, threadId, commentId) {
    if (!userId || !threadId || !commentId) {
      throw new Error('ADD_LIKE_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID');
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
};

module.exports = AddLikeUseCase;
