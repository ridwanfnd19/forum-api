const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add comment to database and return correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'Indonesia',
        password: 'secret_password',
      });

      await ThreadsTableTestHelper.addThread({});

      const userId = 'user-124';
      const threadId = 'thread-123';
      const comment = new NewComment(userId, threadId, {
        content: 'sebuah content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newComment = await commentRepositoryPostgres.addComment(comment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(newComment).toStrictEqual({
        id: 'comment-123',
        content: 'sebuah content',
        owner: 'user-124',
      });
    });
  });

  describe('findCommentsById function', () => {
    it('should find comment and return correctly', async () => {
      // Arrange
      const currentDate = new Date();
      await UsersTableTestHelper.addUser({
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
        date: currentDate,
      });

      const commentId = 'comment-123';
      const threadId = 'thread-123';

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comment = await commentRepositoryPostgres.findCommentsById(commentId, threadId);

      // Assert
      expect(comment).toHaveLength(1);
      expect(comment).toStrictEqual([{
        id: 'comment-123',
        content: 'sebuah content',
        thread_id: 'thread-123',
        owner: 'user-124',
        date: currentDate,
        is_delete: false,
      }]);
    });
  });

  describe('deleteCommentById', () => {
    it('should delete comment and return correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'Indonesia',
        password: 'secret_password',
      });

      await ThreadsTableTestHelper.addThread({});

      await CommentsTableTestHelper.addComment({});

      const commentId = 'comment-123';

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const deleteComment = await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(deleteComment).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should get comments by threadId and return correctly', async () => {
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
        date: currentDate,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-124',
        content: 'content',
        owner: 'user-124',
        date: currentDate,
      });

      const currentDateDelete = new Date();

      await CommentsTableTestHelper.deleteComment('comment-124', currentDateDelete);

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const respose = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(respose).toHaveLength(2);
      expect(respose).toStrictEqual([
        {
          id: 'comment-123',
          username: 'indonesia',
          date: currentDate,
          is_delete: false,
          content: 'sebuah content',
        },
        {
          id: 'comment-124',
          username: 'indonesia',
          date: currentDateDelete,
          is_delete: true,
          content: 'content',
        },
      ]);
    });
  });
});
