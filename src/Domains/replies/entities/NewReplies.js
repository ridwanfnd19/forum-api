class NewReplies {
  constructor(userId, threadId, commentId, payload) {
    this._verifyPayload(userId, threadId, commentId, payload);

    this.owner = userId;
    this.threadId = threadId;
    this.commentId = commentId;
    this.content = payload.content;
  }

  _verifyPayload(userId, threadId, commentId, payload) {
    const {content} = payload;

    if (!content || !userId || !threadId || !commentId) {
      throw new Error('NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof userId !== 'string' ||
    typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('NEW_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReplies;


