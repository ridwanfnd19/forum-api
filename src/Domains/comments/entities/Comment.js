class Comment {
  constructor({id, username, date, is_delete: isDelete, content, replies, likeCount}) {
    this._verifyParams(id, username, date, isDelete, content, replies, likeCount);

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
    this.likeCount = Number(likeCount.count);
    this.replies = replies;
  }

  _verifyParams(id, username, date, isDelete, content, replies, likeCount) {
    if (!id || !username || !date || isDelete == undefined || !content || !replies || !likeCount) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'object' ||
    typeof isDelete !== 'boolean' || typeof content !== 'string' || typeof replies !== 'object' || typeof likeCount !== 'object') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;


