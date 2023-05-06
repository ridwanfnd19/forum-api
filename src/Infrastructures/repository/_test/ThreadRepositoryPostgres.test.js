const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread to database and return correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      const userId = 'user-123';
      const thread = new NewThread(userId, {
        title: 'title',
        body: 'body',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newThread = await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
      expect(newThread).toStrictEqual({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
      });
    });
  });

  describe('getThread function', () => {
    it('should get thread and return correctly', async () => {
      // Arrange
      const currentDate = new Date();

      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      await ThreadsTableTestHelper.addThread({
        date: currentDate,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const respose = await threadRepositoryPostgres.getThreadById('thread-123');


      // Assert
      expect(respose).toHaveLength(1);
      expect(respose[0]).toHaveProperty('id', 'title', 'body', 'date', 'username');
      expect(respose).toStrictEqual([
        {
          id: 'thread-123',
          title: 'title',
          body: 'body',
          date: currentDate,
          username: 'dicoding',
        },
      ]);
    });
  });
});
