const { Error } = require('mongoose');

const {
  NotFoundError,
  DuplicateError,
  ForbiddenError,
  UnauthorizedError,
} = require('../utils/errors');

const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const HTTP_FOBIDDEN = 403;
const HTTP_CONFLICT = 409;
const HTTP_SERVER_ERROR = 500;
const HTTP_BAD_REQUEST = 400;

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(err);

  let status = HTTP_SERVER_ERROR;
  let message = 'На сервере произошла ошибка.';

  if (err instanceof Error.CastError || err instanceof Error.ValidationError) {
    status = HTTP_BAD_REQUEST;
    message = 'Некорректные параметры запроса.';
  } else if (err instanceof NotFoundError) {
    status = HTTP_NOT_FOUND;
    message = err.message;
  } else if (err instanceof DuplicateError) {
    status = HTTP_CONFLICT;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    status = HTTP_UNAUTHORIZED;
    message = 'Необходима авторизация.';
  } else if (err instanceof ForbiddenError) {
    status = HTTP_FOBIDDEN;
    message = err.message;
  }
  res.status(status).send({ message });
};
