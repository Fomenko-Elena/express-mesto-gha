const User = require('../models/user');
const {
  errUserNotFound,
  serverError,
  errInvalidParameters,
  isDbCastError,
  isValidationError,
  noVersionKeyProjection,
  noVersionKeyOptions,
} = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User
    .find({}, noVersionKeyProjection)
    .then((users) => res.send(users))
    .catch((error) => serverError(error, res));
};

const handleGetUser = (userId, res) => {
  User
    .findById(userId, noVersionKeyProjection)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        errUserNotFound(userId, res);
      }
    })
    .catch((error) => {
      if (isDbCastError(error)) {
        errInvalidParameters(error, res);
      } else {
        serverError(error, res);
      }
    });
};

module.exports.getUser = (req, res) => handleGetUser(req.params.id, res);

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((user) => {
      res.send(user.toJSON(noVersionKeyOptions));
    })
    .catch((error) => {
      if (isValidationError(error)) {
        errInvalidParameters(error, res);
      } else {
        serverError(error, res);
      }
    });
};

module.exports.getCurrentUserInfo = (req, res) => handleGetUser(req.user._id, res);

module.exports.updateCurrentUserInfo = (req, res) => {
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
      if (user) {
        res.send(user.toJSON(noVersionKeyOptions));
      } else {
        errUserNotFound(_id, res);
      }
    })
    .catch((error) => {
      if (isDbCastError(error) || isValidationError(error)) {
        errInvalidParameters(error, res);
      } else {
        serverError(error, res);
      }
    });
};

module.exports.updateCurrentUserAvatar = (req, res) => {
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
      if (user) {
        res.send(user.toJSON(noVersionKeyOptions));
      } else {
        errUserNotFound(_id, res);
      }
    })
    .catch((error) => {
      if (isDbCastError(error) || isValidationError(error)) {
        errInvalidParameters(error, res);
      } else {
        serverError(error, res);
      }
    });
};
