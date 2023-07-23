const mongoose = require('mongoose');
const { URL_REGEX } = require('../utils/utils');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => URL_REGEX.test(value),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: mongoose.Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
