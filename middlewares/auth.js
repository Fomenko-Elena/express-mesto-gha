const jwt = require('jsonwebtoken');
const { SECRET_KEY, COOKIE_NAME } = require('../utils/constants');
const { UnauthorizedError } = require('../utils/errors');

const BEARER_PREFIX = 'Bearer ';

module.exports = (req, res, next) => {
  let token = req.cookies[COOKIE_NAME];
  if (!token) {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith(BEARER_PREFIX)) {
      return next(new UnauthorizedError());
    }

    token = authorization.substring(BEARER_PREFIX.length);
  }

  let userData;
  try {
    userData = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new UnauthorizedError());
  }

  req.user = userData;

  return next();
};
