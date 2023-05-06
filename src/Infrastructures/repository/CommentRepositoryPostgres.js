const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const id = `comment-${this._idGenerator()}`;
    const {userId, threadId, content} = comment;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, threadId, userId, date],
    };

    const {rows} = await this._pool.query(query);

    return rows[0];
  };

  async deleteCommentById(commentId) {
    const date = new Date().toISOString();
    const query = {
      text: `UPDATE comments SET is_delete = true, date = $2 WHERE id = $1 RETURNING id`,
      values: [commentId, date],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }

  async findCommentsById(commentId, threadId) {
    const query = {
      text: `SELECT * FROM comments WHERE id = $1 AND thread_id = $2`,
      values: [commentId, threadId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  };

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
      SELECT a.id, b.username, a.date, a.is_delete, a.content
      FROM comments a, users b
      WHERE a.owner = b.id AND thread_id = $1
      ORDER BY a.date
      `,
      values: [threadId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
