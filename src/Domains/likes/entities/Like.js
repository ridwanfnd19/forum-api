class Like {
  constructor(userId, threadId, commentId) {
    this._verifyPayload(userId, threadId, commentId);

    this.owner = userId;
    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload(userId, threadId, commentId) {
    if (!userId || !threadId || !commentId) {
      throw new Error('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Like;
