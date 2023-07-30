const Reply = require('../../../Domains/replies/entities/Reply');
const Comment = require('../../../Domains/comments/entities/Comment');

class GetThreadUseCase {
  constructor({threadRepository, commentRepository, repliesRepository, likeRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    this._validatePayload(threadId);
    const reponseThread = await this._threadRepository.getThreadById(threadId);
    this._validateThreadId(reponseThread);
    const reponseComments = await this._commentRepository.getCommentsByThreadId(threadId);

    const comments = await Promise.all(
        reponseComments.map(async (comment) => {
          comment.likeCount = await this._likeRepository.countLike(threadId, comment.id);
          const responseReplies = await this._repliesRepository.getRepliesByThreadIdAndCommentId(threadId, comment.id);
          comment.replies = responseReplies.map((reply) => new Reply(reply));
          return new Comment(comment);
        }),
    );

    reponseThread[0].comments = comments;
    return reponseThread[0];
  }

  _validatePayload(threadId) {
    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_THREADID');
    }
  }

  _validateThreadId(result) {
    if (!result.length) {
      throw new Error('THREAD_NOT_FOUND');
    }
  }
}

module.exports = GetThreadUseCase;
