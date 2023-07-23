const {
  errInvalidParameters,
  errNotFound,
  errConflict,
  serverError,
  errUnauthorized,
  errForbidden,
} = require('../utils/utils');
const {
  UserNotFoundError,
  UserDuplicateError,
  CardNotFoundError,
  UnauthorizedDeleteCardError,
  isDbCastError,
  isValidationError,
  UnauthorizedError,
} = require('../utils/errors');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(err);

  if (isDbCastError(err)
    || isValidationError(err)) {
    errInvalidParameters(res);
  } else if (err instanceof UserNotFoundError || err instanceof CardNotFoundError) {
    errNotFound(err.message, res);
  } else if (err instanceof UserDuplicateError) {
    errConflict(err.message, res);
  } else if (err instanceof UnauthorizedError) {
    errUnauthorized(res);
  } else if (err instanceof UnauthorizedDeleteCardError) {
    errForbidden(err.message, res);
  } else {
    serverError(res);
  }
};
