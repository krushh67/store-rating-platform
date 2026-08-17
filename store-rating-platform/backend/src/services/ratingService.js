const { Rating, Store } = require('../models');

const submitOrUpdateRating = async (userId, storeId, rating) => {
  const store = await Store.findByPk(storeId);
  if (!store) throw { status: 404, message: 'Store not found' };

  const [ratingRecord, created] = await Rating.findOrCreate({
    where: { userId, storeId },
    defaults: { rating },
  });

  if (!created) {
    await ratingRecord.update({ rating });
    return { created: false, rating: ratingRecord };
  }

  return { created: true, rating: ratingRecord };
};

module.exports = { submitOrUpdateRating };
