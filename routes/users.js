const router = require('express').Router();
const {
  getUsers,
  getUser,
  addUser,
  getCurrentUserInfo,
  updateCurrentUserInfo,
  updateCurrentUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', addUser);

router.get('/me', getCurrentUserInfo);
router.patch('/me', updateCurrentUserInfo);
router.patch('/me/avatar', updateCurrentUserAvatar);

router.get('/:id', getUser);

module.exports = router;
