const sendMessage = (message, status, res) => res.status(status).send({ message });

const HTTP_OK = 200;
const HTTP_NOT_FOUND = 404;
const HTTP_SERVER_ERROR = 500;
const HTTP_BAD_REQUEST = 400;

module.exports.serverError = (error, res) => {
  sendMessage('На сервере произошла ошибка.', HTTP_SERVER_ERROR, res);
  // eslint-disable-next-line no-console
  console.log(error);
};

module.exports.okMessage = (message, res) => sendMessage(message, HTTP_OK, res);

module.exports.errUserNotFound = (userId, res) => sendMessage(`Запрашиваемый пользователь не найден. Id: ${userId}`, HTTP_NOT_FOUND, res);

module.exports.errCardNotFound = (cardId, res) => sendMessage(`Запрашиваемая карточа не найдена. Id: ${cardId}`, HTTP_NOT_FOUND, res);

module.exports.errPageNotFound = (res) => sendMessage('Страница по указанному маршруту не найдена', HTTP_NOT_FOUND, res);

module.exports.errInvalidParameters = (error, res) => sendMessage('Некорректные параметры запроса.', HTTP_BAD_REQUEST, res);

module.exports.isDbCastError = (error) => error.name === 'CastError';

module.exports.isValidationError = (error) => error.name === 'ValidationError';

module.exports.noVersionKeyProjection = '-__v';

module.exports.noVersionKeyOptions = { versionKey: false };
