/* eslint-disable max-classes-per-file */
class NotFoundError extends Error {
}

class DuplicateError extends Error {
}

class UnauthorizedError extends Error {
}

class ForbiddenError extends Error {
}

module.exports.NotFoundError = NotFoundError;

module.exports.DuplicateError = DuplicateError;

module.exports.UnauthorizedError = UnauthorizedError;

module.exports.ForbiddenError = ForbiddenError;
