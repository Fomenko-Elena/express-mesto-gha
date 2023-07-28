const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoServerError } = require('mongodb');
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
  COOKIE_NAME,
} = require('../utils/constants');
const {
  NotFoundError,
  DuplicateError,
} = require('../utils/errors');

module.exports.getUsers = (req, res, next) => {
  User
    .find({}, noVersionKeyProjection)
    .then((users) => res.send(users))
    .catch(next);
};

function chekUserNotNull(user, userId) {
  if (!user) {
    throw new NotFoundError(`Запрашиваемый пользователь не найден. Id: ${userId}`);
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
      res.send(user.toJSON({
        useProjection: true,
        ...noVersionKeyOptions,
      }));
    })
    .catch((error) => {
      if (error instanceof MongoServerError && error.code === 11000) {
        next(new DuplicateError('Пользователь с таким email уже существует'));
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
      const token = jwt.sign(
        {
          _id: user._id,
        },
        SECRET_KEY,
        JWT_OPTIONS,
      );
      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS).send({ message: 'Авторизация успешна' });
    })
    .catch(next);
};
