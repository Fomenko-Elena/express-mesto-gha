const { isCelebrateError } = require('celebrate');
const {
  errInvalidParameters,
  errNotFound,
  errConflict,
  serverError,
} = require('../utils/utils');
const {
  UserNotFoundError,
  UserDuplicateError,
  CardNotFoundError,
  UnauthorizedDeleteCardError,
  isDbCastError,
  isValidationError,
} = require('../utils/errors');

module.exports = (err, req, res) => {
  // eslint-disable-next-line no-console
  console.log(err);

  if (isCelebrateError(err)
    || isDbCastError(err)
    || isValidationError(err)
    || err instanceof UnauthorizedDeleteCardError) {
    errInvalidParameters(err, res);
  } if (err instanceof UserNotFoundError || err instanceof CardNotFoundError) {
    errNotFound(err.message, res);
  } if (err instanceof UserDuplicateError) {
    errConflict(err.message, res);
  } else {
    serverError(res);
  }
};
