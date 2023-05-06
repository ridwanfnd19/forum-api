const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const id = `thread-${this._idGenerator()}`;
    const {title, body, owner} = thread;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const {rows} = await this._pool.query(query);

    return rows[0];
  };

  async getThreadById(threadId) {
    const query = {
      text: `
      SELECT a.id, a.title, a.body, a.date, b.username
      FROM threads a, users b
      WHERE a.id = $1 AND a.owner = b.id
      `,
      values: [threadId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }
}

module.exports = ThreadRepositoryPostgres;
