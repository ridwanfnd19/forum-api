const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  let server;

  beforeAll(async () => {
    server = await createServer(container);
    await server.start();
  });

  afterAll(async () => {
    await pool.end();
    await server.stop();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and added comment', async () => {
      // Arrange
      const payload = {
        content: 'sebuah content',
      };

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

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(payload.content);
    });

    it('should response 401 when add comment with no authentication', async () => {
      // Arrange
      const payload = {
        content: 'sebuah content',
      };

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

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 when add comment with bad payload', async () => {
      // Arrange
      const payload = {
        content: 123,
      };

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

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(400);
    });

    it('should response 404 when add comment with not found thread', async () => {
      // Arrange
      const payload = {
        content: 'sebuah content',
      };

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
      await server.inject({
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

      // Action
      const response = await server.inject({
        url: `/threads/xxx/comments`,
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('when Delete /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment', async () => {
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
      const comment = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload: {
          content: 'sebuah content',
        },
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      const responseCommentJson = JSON.parse(comment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when delete comment with no authentication', async () => {
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
      const comment = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload: {
          content: 'sebuah content',
        },
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      const responseCommentJson = JSON.parse(comment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}`,
        method: 'DELETE',
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when delete comment with no found comment', async () => {
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
        url: `/threads/${threadId}/comments/xxx`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
    });

    it('should response 403 when delete comment with invalid owner', async () => {
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
      const comment = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload: {
          content: 'sebuah content',
        },
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      const responseCommentJson = JSON.parse(comment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(403);
    });
  });
});

