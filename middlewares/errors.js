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

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(err);

  if (isDbCastError(err)
    || isValidationError(err)
    || err instanceof UnauthorizedDeleteCardError) {
    errInvalidParameters(res);
  } if (err instanceof UserNotFoundError || err instanceof CardNotFoundError) {
    errNotFound(err.message, res);
  } if (err instanceof UserDuplicateError) {
    errConflict(err.message, res);
  } else {
    serverError(res);
  }
};
