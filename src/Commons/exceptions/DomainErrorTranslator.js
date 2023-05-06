const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');
const AuthorizationError = require('./AuthorizationError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada'),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread karena tipe data tidak sesuai'),
  'ADD_THREAD_USE_CASE.NOT_CONTAIN_USERID': new InvariantError('harus menerima parameter userId'),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat newComment karena properti yang dibutuhkan tidak ada'),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat newComment karena tipe data tidak sesuai'),
  'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment karena properti yang dibutuhkan tidak ada'),
  'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment karena tipe data tidak sesuai'),
  'ADD_COMMENT_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID': new InvariantError('harus menerima parameter userId dan threadId'),
  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENTID_USERID_OR_THREADID': new InvariantError('harus menerima parameter userId, threadId, commentId'),
  'COMMENT_NOT_FOUND': new NotFoundError('comment tidak ditemukan'),
  'YOU_HAVE_NO_RIGHT_TO_ACCESS_THIS_RESOURCE': new AuthorizationError('anda tidak berhak mengakses resource ini'),
  'GET_THREAD_USE_CASE.NOT_CONTAIN_THREADID': new InvariantError('harus menerima parameter threadId'),
  'THREAD_NOT_FOUND': new NotFoundError('thread tidak ditemukan'),
  'REPLIES_NOT_FOUND': new NotFoundError('replies tidak ditemukan'),
  'DELETE_REPLIES_USE_CASE.NOT_CONTAIN_USERID_OR_THREADID_OR_COMMENTID_OR_REPLIESID': new InvariantError('harus menerima parameter userId, threadId, commentId, repliesId'),
  'NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat newReplies karena properti yang dibutuhkan tidak ada'),
  'NEW_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat newRreplies karena tipe data tidak sesuai'),
  'REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat replies karena properti yang dibutuhkan tidak ada'),
  'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat replies karena tipe data tidak sesuai'),
};

module.exports = DomainErrorTranslator;
