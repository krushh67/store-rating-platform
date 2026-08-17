const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { storeValidator, validate: storeValidate } = require('../validators/storeValidator');
const { registerValidator, validate } = require('../validators/authValidator');

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.post('/users', registerValidator, validate, adminController.createUser);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/stores', storeValidator, storeValidate, adminController.createStore);
router.get('/stores', adminController.getStores);

module.exports = router;
