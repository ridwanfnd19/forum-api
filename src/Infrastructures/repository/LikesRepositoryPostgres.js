const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(like) {
    const id = `likes-${this._idGenerator()}`;
    const {threadId, owner, commentId} = like;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO commentlikes VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, threadId, owner, commentId, date],
    };

    const {rows} = await this._pool.query(query);

    return rows[0];
  }

  async deleteLike(like) {
    const {owner, threadId, commentId} = like;

    const query = {
      text: 'DELETE FROM commentlikes WHERE thread_id = $1 AND owner = $2 AND comment_id = $3 RETURNING id',
      values: [threadId, owner, commentId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }

  async verifyLike(like) {
    const {owner, threadId, commentId} = like;

    const query = {
      text: 'SELECT id FROM commentlikes WHERE thread_id = $1 AND owner = $2 AND comment_id = $3',
      values: [threadId, owner, commentId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }

  async countLike(threadId, commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM commentlikes WHERE thread_id = $1 AND comment_id = $2',
      values: [threadId, commentId],
    };

    const {rows} = await this._pool.query(query);

    return rows[0];
  }
}

module.exports = LikeRepositoryPostgres;
