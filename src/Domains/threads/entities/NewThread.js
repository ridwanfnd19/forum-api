class NewThread {
  constructor(userId, payload) {
    this._verifyPayload(userId, payload);

    this.owner = userId,
    this.title = payload.title;
    this.body = payload.body;
  }

  _verifyPayload(userId, payload) {
    const {title, body} = payload;

    if (!title || !body || !userId) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof userId !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;

