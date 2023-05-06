const RepliesRepository = require('../../Domains/replies/RepliesRepository');

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplies(replies) {
    const id = `replies-${this._idGenerator()}`;
    const {owner, threadId, commentId, content} = replies;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, threadId, commentId, owner, date],
    };

    const {rows} = await this._pool.query(query);

    return rows[0];
  };

  async findRepliesById(repliesId) {
    const query = {
      text: `SELECT * FROM replies WHERE id = $1`,
      values: [repliesId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }

  async deleteRepliesById(repliesId) {
    const query = {
      text: `UPDATE replies SET is_delete = true WHERE id = $1 RETURNING id`,
      values: [repliesId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }

  async getRepliesByThreadIdAndCommentId(threadId, commentId) {
    const query = {
      text: `
      SELECT a.id, b.username, a.date, a.is_delete, a.content
      FROM replies a, users b
      WHERE a.owner = b.id AND thread_id = $1 AND comment_id = $2
      ORDER BY a.date
      `,
      values: [threadId, commentId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }
}

module.exports = RepliesRepositoryPostgres;
