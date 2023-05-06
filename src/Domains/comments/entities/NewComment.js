class NewComment {
  constructor(userId, threadId, payload) {
    this._verifyParams(userId, threadId, payload);

    this.userId = userId;
    this.threadId = threadId;
    this.content = payload.content;
  }

  _verifyParams(userId, threadId, payload) {
    const {content} = payload;

    if (!content || !userId || !threadId) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof userId !== 'string' || typeof threadId !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;


