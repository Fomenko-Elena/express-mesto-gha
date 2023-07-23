const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  noVersionKeyProjection,
  noVersionKeyOptions,
} = require('../utils/utils');
const {
  PASSWORD_SALT_LENGTH,
  SECRET_KEY,
  JWT_OPTIONS,
  COOKIE_OPTIONS,
} = require('../utils/constants');
const {
  UserNotFoundError,
  UserDuplicateError,
  UnauthorizedError,
  isDuplicateError,
} = require('../utils/errors');

module.exports.getUsers = (req, res, next) => {
  User
    .find({}, noVersionKeyProjection)
    .then((users) => res.send(users))
    .catch(next);
};

function chekUserNotNull(user, userId) {
  if (!user) {
    throw new UserNotFoundError(`Запрашиваемый пользователь не найден. Id: ${userId}`);
  }
}

const handleGetUser = (userId, res, next) => {
  User
    .findById(userId, noVersionKeyProjection)
    .then((user) => {
      chekUserNotNull(user, userId);
      res.send(user);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => handleGetUser(req.params.id, res, next);
module.exports.getCurrentUserInfo = (req, res, next) => handleGetUser(req.user._id, res, next);

module.exports.addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, PASSWORD_SALT_LENGTH)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send(user.toJSON(noVersionKeyOptions));
    })
    .catch((error) => {
      if (isDuplicateError(error)) {
        next(new UserDuplicateError('Пользователь с таким email уже существует'));
      } else {
        next(error);
      }
    });
};

module.exports.updateCurrentUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User
    .findByIdAndUpdate(
      _id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      chekUserNotNull(user, _id);
      res.send(user.toJSON(noVersionKeyOptions));
    })
    .catch(next);
};

module.exports.updateCurrentUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User
    .findByIdAndUpdate(
      _id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      chekUserNotNull(user, _id);
      res.send(user.toJSON(noVersionKeyOptions));
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Запрашиваемый пользователь не найден.');
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        SECRET_KEY,
        JWT_OPTIONS,
      );
      res.cookie('token', token, COOKIE_OPTIONS).send();
    })
    .catch(next);
};
