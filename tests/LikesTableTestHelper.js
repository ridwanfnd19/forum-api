/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'likes-123', threadId = 'thread-123', owner = 'user-123', commentId = 'comment-123', date = '2023-04-20T08:12:14.195Z',
  }) {
    const query = {
      text: 'INSERT INTO commentlikes VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, threadId, owner, commentId, date],
    };

    await pool.query(query);
  },

  async findLikeById(id) {
    const query = {
      text: 'SELECT * FROM commentlikes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM commentlikes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
