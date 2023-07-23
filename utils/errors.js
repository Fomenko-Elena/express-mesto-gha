/* eslint-disable max-classes-per-file */
class UserNotFoundError extends Error {
}

class UserDuplicateError extends Error {
}

class UnauthorizedError extends Error {
}

class CardNotFoundError extends Error {
}

class UnauthorizedDeleteCardError extends Error {
}

module.exports.UserNotFoundError = UserNotFoundError;

module.exports.UserDuplicateError = UserDuplicateError;

module.exports.UnauthorizedError = UnauthorizedError;

module.exports.CardNotFoundError = CardNotFoundError;

module.exports.UnauthorizedDeleteCardError = UnauthorizedDeleteCardError;

module.exports.isDbCastError = (error) => error.name === 'CastError';

module.exports.isValidationError = (error) => error.name === 'ValidationError';

module.exports.isDuplicateError = (error) => error.name === 'MongoServerError' && error.code === 11000;
