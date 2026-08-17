const router = require('express').Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { registerValidator, loginValidator, passwordUpdateValidator, validate } = require('../validators/authValidator');

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.put('/password', authenticate, passwordUpdateValidator, validate, authController.updatePassword);

module.exports = router;
