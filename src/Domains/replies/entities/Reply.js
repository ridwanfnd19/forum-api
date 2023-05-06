class Reply {
  constructor({id, username, date, is_delete: isDelete, content}) {
    this._verifyParams(id, username, date, isDelete, content);

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
  }

  _verifyParams(id, username, date, isDelete, content) {
    if (!id || !username || !date || isDelete == undefined || !content) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'object' ||
      typeof isDelete !== 'boolean' || typeof content !== 'string') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;


