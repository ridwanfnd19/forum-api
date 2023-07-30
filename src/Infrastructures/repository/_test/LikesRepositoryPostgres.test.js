const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const Like = require('../../../Domains/likes/entities/Like');
const pool = require('../../database/postgres/pool');
const LikesRepositoryPostgres = require('../LikesRepositoryPostgres');

describe('LikesRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should add like to database and return correctly', async () => {
      // Arrange
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
        content: 'sebuah comment',
        owner: 'user-124',
      });

      const threadId = 'thread-123';
      const userId = 'user-123';
      const commentId = 'comment-123';
      const like = new Like(userId, threadId, commentId);

      const fakeIdGenerator = () => '123'; // stub!
      const likesRepositoryPostgres = new LikesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newLike = await likesRepositoryPostgres.addLike(like);

      // Assert
      const responseLikes = await LikesTableTestHelper.findLikeById('likes-123');
      expect(responseLikes).toHaveLength(1);
      expect(newLike).toStrictEqual({
        id: 'likes-123',
      });
    });
  });

  describe('verifyLike function', () => {
    it('should verify like and return correctly', async () => {
      // Arrange
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
        content: 'sebuah comment',
        owner: 'user-124',
      });

      await LikesTableTestHelper.addLike({});

      const threadId = 'thread-123';
      const userId = 'user-123';
      const commentId = 'comment-123';
      const like = new Like(userId, threadId, commentId);

      const fakeIdGenerator = () => '123'; // stub!
      const likesRepositoryPostgres = new LikesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newLike = await likesRepositoryPostgres.verifyLike(like);

      // Assert
      expect(newLike).toHaveLength(1);
      expect(newLike).toStrictEqual([{
        id: 'likes-123',
      }]);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like in database and return correctly', async () => {
      // Arrange
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
        content: 'sebuah comment',
        owner: 'user-124',
      });

      await LikesTableTestHelper.addLike({});

      const threadId = 'thread-123';
      const userId = 'user-123';
      const commentId = 'comment-123';
      const like = new Like(userId, threadId, commentId);

      const fakeIdGenerator = () => '123'; // stub!
      const likesRepositoryPostgres = new LikesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likesRepositoryPostgres.deleteLike(like);

      // Assert
      const responseLikes = await LikesTableTestHelper.findLikeById('likes-123');
      expect(responseLikes).toHaveLength(0);
    });
  });

  describe('countLike function', () => {
    it('should count like and return correctly', async () => {
      // Arrange
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
        content: 'sebuah comment',
        owner: 'user-124',
      });

      await LikesTableTestHelper.addLike({});

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const fakeIdGenerator = () => '123'; // stub!
      const likesRepositoryPostgres = new LikesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const response = await likesRepositoryPostgres.countLike(threadId, commentId);

      // Assert
      expect(response).toStrictEqual({count: '1'});
    });
  });
});
