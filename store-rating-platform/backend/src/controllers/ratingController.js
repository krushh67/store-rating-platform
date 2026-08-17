const ratingService = require('../services/ratingService');

const submitRating = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const result = await ratingService.submitOrUpdateRating(req.user.id, storeId, rating);
    const status = result.created ? 201 : 200;
    const message = result.created ? 'Rating submitted successfully' : 'Rating updated successfully';
    res.status(status).json({ success: true, message, data: result.rating });
  } catch (err) { next(err); }
};

module.exports = { submitRating };
