const AddThreadUseCase = require('../../../../Applications/use_case/thread/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/thread/GetThreadUseCase');
const AddLikeCommentUseCase = require('../../../../Applications/use_case/likes/AddLikeUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(credentialId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread: addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const {threadId} = request.params;
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {thread},
    });
    response.code(200);
    return response;
  }

  async putLikeCommentHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {threadId, commentId} = request.params;
    const addLikeCommentUseCase = this._container.getInstance(AddLikeCommentUseCase.name);
    const like = await addLikeCommentUseCase.execute(credentialId, threadId, commentId);

    const response = h.response({
      status: 'success',
      message: like,
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadHandler;
