const Card = require('../models/card');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const {
  noVersionKeyProjection,
  noVersionKeyOptions,
} = require('../utils/utils');

module.exports.getCards = (req, res, next) => {
  Card
    .find({}, noVersionKeyProjection)
    .populate(['owner', 'likes'])
    .sort('-createdAt')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card
    .create({ name, link, owner: _id })
    .then((card) => card
      .populate(['owner', 'likes'])
      .then((populatedCard) => res.send(populatedCard.toJSON(noVersionKeyOptions))))
    .catch(next);
};

function checkCardNotNull(card, cardId) {
  if (!card) {
    throw new NotFoundError(`Запрашиваемая карта не найдена. CardId: ${cardId}`);
  }
}

function checkCardOwner(card, userId) {
  if (card.owner.id !== userId) {
    throw new ForbiddenError(`Карточка принадлежит другому пользователю. CardId:${card._id}.`);
  }
}

module.exports.deleteCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card
    .findById(cardId)
    .populate('owner')
    .then((card) => {
      checkCardNotNull(card, cardId);
      checkCardOwner(card, _id);
      return card.deleteOne().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    )
    .then((card) => {
      checkCardNotNull(card, cardId);
      return card
        .populate(['owner', 'likes'])
        .then((populatedCard) => res.send(populatedCard.toJSON(noVersionKeyOptions)));
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: _id } },
      { new: true },
    )
    .then((card) => {
      checkCardNotNull(card, cardId);
      return card
        .populate(['owner', 'likes'])
        .then((populatedCard) => res.send(populatedCard.toJSON(noVersionKeyOptions)));
    })
    .catch(next);
};
