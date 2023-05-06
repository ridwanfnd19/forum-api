const AddRepliesUseCase = require('../../../../Applications/use_case/replies/AddRepliesUseCase');
const DeleteRepliesUseCase = require('../../../../Applications/use_case/replies/DeleteRepliesUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postRepliesHandler = this.postRepliesHandler.bind(this);
    this.deleteRepliesHandler = this.deleteRepliesHandler.bind(this);
  }

  async postRepliesHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {threadId, commentId} = request.params;
    const addRepliesUseCase = this._container.getInstance(AddRepliesUseCase.name);
    const addedReplies= await addRepliesUseCase.execute(credentialId, threadId, commentId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply: addedReplies,
      },
    });
    response.code(201);
    return response;
  }

  async deleteRepliesHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {threadId, commentId, replyId} = request.params;
    const deleteRepliesUseCase = this._container.getInstance(DeleteRepliesUseCase.name);
    await deleteRepliesUseCase.execute(credentialId, threadId, commentId, replyId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
