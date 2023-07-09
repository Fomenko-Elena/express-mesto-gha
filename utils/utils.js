const errMessage = (message, status, res) => res.status(status).send({ message });

const HTTP_NOT_FOUND = 404;
const HTTP_SERVER_ERROR = 500;
const HTTP_BAD_REQUEST = 400;

module.exports.serverError = (error, res) => {
  errMessage('На сервере произошла ошибка.', HTTP_SERVER_ERROR, res);
  // eslint-disable-next-line no-console
  console.log(error);
};

module.exports.errUserNotFound = (userId, res) => errMessage(`Запрашиваемый пользователь не найден. Id: ${userId}`, HTTP_NOT_FOUND, res);

module.exports.errCardNotFound = (cardId, res) => errMessage(`Запрашиваемая карточа не найдена. Id: ${cardId}`, HTTP_NOT_FOUND, res);

module.exports.errInvalidParameters = (error, res) => errMessage('Некорректные параметры запроса.', HTTP_BAD_REQUEST, res);

module.exports.isDbCastError = (error) => error.name === 'CastError';

module.exports.isValidationError = (error) => error.name === 'ValidationError';

module.exports.noVersionKeyProjection = '-__v';

module.exports.noVersionKeyOptions = { versionKey: false };
