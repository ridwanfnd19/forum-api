const AddCommentUseCase = require('../../../../Applications/use_case/comment/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comment/DeleteCommentUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentToThreadHandler = this.postCommentToThreadHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentToThreadHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {threadId} = request.params;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(credentialId, threadId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment: addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {threadId, commentId} = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(commentId, credentialId, threadId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentHandler;
