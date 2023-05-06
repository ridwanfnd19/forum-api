const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NewReplies = require('../../../Domains/replies/entities/NewReplies');
const pool = require('../../database/postgres/pool');
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');

describe('RepliesRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReplies function', () => {
    it('should add replies to database and return correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'Indonesia',
        password: 'secret_password',
      });

      await ThreadsTableTestHelper.addThread({});

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-124',
      });

      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replies = new NewReplies(userId, threadId, commentId, {
        content: 'sebuah replies',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newReplies = await repliesRepositoryPostgres.addReplies(replies);

      // Assert
      const responseReplies = await RepliesTableTestHelper.findRepliesById('replies-123');
      expect(responseReplies).toHaveLength(1);
      expect(newReplies).toStrictEqual({
        id: 'replies-123',
        content: 'sebuah replies',
        owner: 'user-123',
      });
    });
  });

  describe('findRepliesById function', () => {
    it('should find replies and return correctly', async () => {
      // Arrange
      const currentDate = new Date();
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'Indonesia',
        password: 'secret_password',
      });

      await ThreadsTableTestHelper.addThread({owner: 'user-123'});
      await CommentsTableTestHelper.addComment({owner: 'user-124'});
      await RepliesTableTestHelper.addReplies({owner: 'user-123', date: currentDate});

      const fakeIdGenerator = () => '123'; // stub!
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const replies = await repliesRepositoryPostgres.findRepliesById('replies-123');

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies).toStrictEqual([
        {
          id: 'replies-123',
          content: 'sebuah replies',
          thread_id: 'thread-123',
          comment_id: 'comment-123',
          owner: 'user-123',
          date: currentDate,
          is_delete: false,
        },
      ]);
    });
  });

  describe('deleteReplies function', () => {
    it('should delete replies and return correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'Indonesia',
        password: 'secret_password',
      });

      await ThreadsTableTestHelper.addThread({owner: 'user-123'});
      await CommentsTableTestHelper.addComment({owner: 'user-124'});
      await RepliesTableTestHelper.addReplies({owner: 'user-123'});

      const fakeIdGenerator = () => '123'; // stub!
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const deleteReplies = await repliesRepositoryPostgres.deleteRepliesById('replies-123');

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('replies-123');
      expect(deleteReplies).toHaveLength(1);
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('getRepliesByThreadIdAndCommentId function', () => {
    it('should get replies by threadId, commentId and return correctly', async () => {
      // Arrange
      const currentDate = new Date();
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'indonesia',
        password: 'secret_password',
      });

      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah content',
        owner: 'user-124',
      });

      await RepliesTableTestHelper.addReplies({
        date: currentDate,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const respose = await repliesRepositoryPostgres.getRepliesByThreadIdAndCommentId('thread-123', 'comment-123');

      // Assert
      expect(respose).toHaveLength(1);
      expect(respose).toStrictEqual([
        {
          id: 'replies-123',
          username: 'indonesia',
          date: currentDate,
          is_delete: false,
          content: 'sebuah replies',
        },
      ]);
    });
  });
});
