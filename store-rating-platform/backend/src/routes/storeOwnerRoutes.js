const router = require('express').Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate, authorize('STORE_OWNER'));
router.get('/dashboard', storeOwnerController.getDashboard);

module.exports = router;
