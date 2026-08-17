const router = require('express').Router();
const storeController = require('../controllers/storeController');
const ratingController = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ratingValidator, validate } = require('../validators/ratingValidator');

router.get('/', authenticate, storeController.getStores);
router.get('/:id', authenticate, storeController.getStoreById);
router.post('/:storeId/rating', authenticate, authorize('USER'), ratingValidator, validate, ratingController.submitRating);
router.put('/:storeId/rating', authenticate, authorize('USER'), ratingValidator, validate, ratingController.submitRating);

module.exports = router;
