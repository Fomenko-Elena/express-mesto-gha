const { Joi } = require('celebrate');
const validator = require('validator');

const sendMessage = (message, status, res) => res.status(status).send({ message });

const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;
const HTTP_SERVER_ERROR = 500;
const HTTP_BAD_REQUEST = 400;

module.exports.serverError = (res) => sendMessage('На сервере произошла ошибка.', HTTP_SERVER_ERROR, res);

module.exports.okMessage = (message, res) => sendMessage(message, HTTP_OK, res);

module.exports.errNotFound = (message, res) => sendMessage(message, HTTP_NOT_FOUND, res);

module.exports.errPageNotFound = (res) => sendMessage('Страница по указанному маршруту не найдена', HTTP_NOT_FOUND, res);

module.exports.errInvalidParameters = (res) => sendMessage('Некорректные параметры запроса.', HTTP_BAD_REQUEST, res);

module.exports.errUnauthorized = (res) => sendMessage('Необходима авторизация.', HTTP_UNAUTHORIZED, res);

module.exports.errConflict = (message, res) => sendMessage(message, HTTP_CONFLICT, res);

module.exports.noVersionKeyProjection = '-__v';

module.exports.noVersionKeyOptions = { versionKey: false };

module.exports.URL_REGEX = /^(http(s):\/\/)?(\.www)?([a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+)+$/;

module.exports.JoiHelper = {
  id: () => Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  userName: () => Joi.string().min(2).max(30),
  userAbout: () => Joi.string().min(2).max(30),
  userPassword: () => Joi.string(),
  url: () => Joi.string().pattern(module.exports.URL_REGEX),
  cardName: () => Joi.string().min(2).max(30),
  email: () => Joi.string().custom((value, helper) => {
    if (!validator.isEmail(value)) {
      return helper.message('Неправильный email');
    }
    return value;
  }),
};
