const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { JoiHelper } = require('../utils/utils');

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: JoiHelper.cardName().required(),
      link: JoiHelper.url().required(),
    }),
  }),
  addCard,
);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: JoiHelper.id().required(),
    }),
  }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: JoiHelper.id().required(),
    }),
  }),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: JoiHelper.id().required(),
    }),
  }),
  dislikeCard,
);

module.exports = router;
