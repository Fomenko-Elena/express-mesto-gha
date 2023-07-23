const jwt = require('jsonwebtoken');
const { errUnauthorized } = require('../utils/utils');
const { SECRET_KEY } = require('../utils/constants');

const BEARER_PREFIX = 'Bearer ';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith(BEARER_PREFIX)) {
    return errUnauthorized(null, res);
  }

  const token = authorization.substring(BEARER_PREFIX.length);

  let userData;
  try {
    userData = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return errUnauthorized(err, res);
  }

  req.user = userData;

  return next();
};
