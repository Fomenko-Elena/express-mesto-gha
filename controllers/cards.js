const Card = require('../models/card');
const {
  serverError,
  errInvalidParameters,
  errCardNotFound,
  isValidationError,
  isDbCastError,
  noVersionKeyProjection,
  noVersionKeyOptions,
} = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card
    .find({}, noVersionKeyProjection)
    .populate(['owner', 'likes'])
    .sort('-createdAt')
    .then((cards) => res.send(cards))
    .catch((error) => serverError(error, res));
};

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card
    .create({ name, link, owner: _id })
    .then((card) => card
      .populate(['owner', 'likes'])
      .then((populatedCard) => res.send(populatedCard.toJSON(noVersionKeyOptions))))
    .catch((error) => {
      if (isValidationError(error)) {
        errInvalidParameters(error, res);
      } else {
        serverError(error, res);
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card
    .findById(cardId)
    .populate('owner')
    .then((card) => {
      if (card) {
        if (card.owner.id === _id) {
          return card.deleteOne().then(() => res.send());
        }
        errInvalidParameters(`Карточка принадлежит другому пользователю. CardId:${cardId}, UserId:${_id}`, res);
      } else {
        errCardNotFound(cardId, res);
      }
      return card;
    })
    .catch((error) => {
      if (isValidationError(error)) {
        errInvalidParameters(error, res);
      } else {
        serverError(error, res);
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    )
    .then((card) => {
      if (card) {
        card
          .populate(['owner', 'likes'])
          .then((populatedCard) => res.send(populatedCard.toJSON(noVersionKeyOptions)));
      } else {
        errCardNotFound(cardId, res);
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

module.exports.dislikeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: _id } },
      { new: true },
    )
    .then((card) => {
      if (card) {
        card
          .populate(['owner', 'likes'])
          .then((populatedCard) => res.send(populatedCard.toJSON(noVersionKeyOptions)));
      } else {
        errCardNotFound(cardId, res);
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
