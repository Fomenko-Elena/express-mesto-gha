const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  getCurrentUserInfo,
  updateCurrentUserInfo,
  updateCurrentUserAvatar,
} = require('../controllers/users');
const { JoiHelper } = require('../utils/utils');

router.get('/', getUsers);
router.get('/me', getCurrentUserInfo);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: JoiHelper.userName().required(),
      about: JoiHelper.userAbout().required(),
    }),
  }),
  updateCurrentUserInfo,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: JoiHelper.url().required(),
    }),
  }),
  updateCurrentUserAvatar,
);

router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: JoiHelper.id().required(),
    }),
  }),
  getUser,
);

module.exports = router;
