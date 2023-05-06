const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and added replies', async () => {
      // Arrange
      const payload = {
        content: 'sebuah replies',
      };

      const server = await createServer(container);

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
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual(payload.content);
    });

    it('should response 401 when add replies with no authentication', async () => {
      // Arrange
      const payload = {
        content: 'sebuah replies',
      };

      const server = await createServer(container);

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
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        method: 'POST',
        payload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 when add replies with bad payload', async () => {
      // Arrange
      const payload = {
        content: 123,
      };

      const server = await createServer(container);

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
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(400);
    });

    it('should response 404 when add replies with not found thread', async () => {
      // Arrange
      const payload = {
        content: 'sebuah replies',
      };

      const server = await createServer(container);

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
        url: `/threads/xxx/comments/${commentId}/replies`,
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
    });

    it('should response 404 when add replies with not found comment', async () => {
      // Arrange
      const payload = {
        content: 'sebuah replies',
      };

      const server = await createServer(container);

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

      await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments/xxx/replies`,
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('when Delete /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete comment', async () => {
      // Arrange
      const server = await createServer(container);

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

      // Add Replies
      const responseReplies = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        method: 'POST',
        payload: {
          content: 'sebuah replies',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      const responseRepliesJson = JSON.parse(responseReplies.payload);
      const replyId = responseRepliesJson.data.addedReply.id;

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when delete replies with not found replies', async () => {
      // Arrange
      const server = await createServer(container);

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

      // Add Replies
      await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        method: 'POST',
        payload: {
          content: 'sebuah replies',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/replies/xxx`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
    });

    it('should response 403 when delete replies with invalid owner', async () => {
      // Arrange
      const server = await createServer(container);

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

      // Add Replies
      const responseReplies = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        method: 'POST',
        payload: {
          content: 'sebuah replies',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      const responseRepliesJson = JSON.parse(responseReplies.payload);
      const replyId = responseRepliesJson.data.addedReply.id;

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(403);
    });
  });
});
