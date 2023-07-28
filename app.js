const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { JoiHelper } = require('./utils/utils');
const {
  addUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const otherErrors = require('./middlewares/errors');
const { NotFoundError } = require('./utils/errors');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: JoiHelper.email().required(),
      password: JoiHelper.userPassword().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: JoiHelper.userName(),
      about: JoiHelper.userAbout(),
      avatar: JoiHelper.url(),
      email: JoiHelper.email().required(),
      password: JoiHelper.userPassword().required(),
    }),
  }),
  addUser,
);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => next(new NotFoundError('Страница по указанному маршруту не найдена')));

app.use(errors());
app.use(otherErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
