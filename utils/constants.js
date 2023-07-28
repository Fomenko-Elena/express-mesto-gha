module.exports.PASSWORD_SALT_LENGTH = 10;

module.exports.DEFAULT_USER_NAME = 'Жак-Ив Кусто';
module.exports.DEFAULT_USER_ABOUT = 'Исследователь';
module.exports.DEFAULT_USER_AVATAR = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

module.exports.SECRET_KEY = 'dShHhXIAQkAt7Oe7vZb8lV7buPeIJz1W';
module.exports.JWT_OPTIONS = {
  expiresIn: '7d',
};
module.exports.COOKIE_NAME = 'token';
module.exports.COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};
