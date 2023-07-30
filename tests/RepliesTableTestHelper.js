const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReplies({
    id = 'replies-123', content = 'sebuah replies', threadId = 'thread-123',
    commentId = 'comment-123', owner = 'user-124', date = '2023-04-20T08:12:14.195Z',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, threadId, commentId, owner, date],
    };

    await pool.query(query);
  },

  async deleteReplies(repliesId = 'replies-123') {
    const date = new Date().toISOString();
    const query = {
      text: `UPDATE replies SET is_delete = true, date = $2 WHERE id = $1 RETURNING id`,
      values: [repliesId, date],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
