const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  let server;

  beforeAll(async () => {
    jest.useRealTimers();
    server = await createServer(container);
    await server.start();
  });

  afterAll(async () => {
    await pool.end();
    await server.stop();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and added thread', async () => {
      // Arrange
      const payload = {
        title: 'title',
        body: 'dummy body',
      };

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // add auth
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);
      const accessToken = responseAuthJson.data.accessToken;

      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(payload.title);
    });

    it('should response 401 when add thread with no authentication', async () => {
      // Arrange
      const payload = {
        title: 'title',
        body: 'dummy body',
      };

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 when add thread with bad payload', async () => {
      // Arrange
      const payload = {
        title: 123,
        body: 'dummy body',
      };

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // add auth
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);
      const accessToken = responseAuthJson.data.accessToken;

      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 201 and added thread', async () => {
      // Arrange
      // add user 1
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // add user 2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'indonesia',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // auth 1
      const responseAuth1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson1 = JSON.parse(responseAuth1.payload);
      const accessToken1 = responseAuthJson1.data.accessToken;

      // add thread
      const responseThread = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: {
          title: 'title',
          body: 'dummy body',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // auth 2
      const responseAuth2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'indonesia',
          password: 'secret',
        },
      });

      const responseAuthJson2 = JSON.parse(responseAuth2.payload);
      const accessToken2 = responseAuthJson2.data.accessToken;


      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Add Comment
      await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload: {
          content: 'sebuah content',
        },
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}`,
        method: 'GET',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty('id', 'title', 'body', 'date', 'username', 'comments');
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0]).toHaveProperty('id', 'username', 'date', 'content', 'replies');
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and added like', async () => {
      // Arrange
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'indonesia',
          password: 'secret',
          fullname: 'Indonesia Dicoding',
        },
      });

      // add auth
      const responseAuth1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson1 = JSON.parse(responseAuth1.payload);
      const accessToken1 = responseAuthJson1.data.accessToken;

      const responseAuth2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'indonesia',
          password: 'secret',
        },
      });

      const responseAuthJson2 = JSON.parse(responseAuth2.payload);
      const accessToken2 = responseAuthJson2.data.accessToken;

      // Add thread
      const responseThread = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: {
          title: 'title',
          body: 'dummy body',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Add comment
      const responseComment = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toBeDefined();
      expect(responseJson.message).toEqual('Berhasil menyukai comment');
    });

    it('should response 200 and delete like', async () => {
      // Arrange
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'indonesia',
          password: 'secret',
          fullname: 'Indonesia Dicoding',
        },
      });

      // add auth
      const responseAuth1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson1 = JSON.parse(responseAuth1.payload);
      const accessToken1 = responseAuthJson1.data.accessToken;

      const responseAuth2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'indonesia',
          password: 'secret',
        },
      });

      const responseAuthJson2 = JSON.parse(responseAuth2.payload);
      const accessToken2 = responseAuthJson2.data.accessToken;

      // Add thread
      const responseThread = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: {
          title: 'title',
          body: 'dummy body',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Add comment
      const responseComment = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Add like
      await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toBeDefined();
      expect(responseJson.message).toEqual('Berhasil batal menyukai comment');
    });

    it('should response 401 when add like with no authentication', async () => {
      // Arrange
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'indonesia',
          password: 'secret',
          fullname: 'Indonesia Dicoding',
        },
      });

      // add auth
      const responseAuth1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson1 = JSON.parse(responseAuth1.payload);
      const accessToken1 = responseAuthJson1.data.accessToken;

      const responseAuth2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'indonesia',
          password: 'secret',
        },
      });

      const responseAuthJson2 = JSON.parse(responseAuth2.payload);
      const accessToken2 = responseAuthJson2.data.accessToken;

      // Add thread
      const responseThread = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: {
          title: 'title',
          body: 'dummy body',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Add comment
      const responseComment = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        method: 'PUT',
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });
  });
});

