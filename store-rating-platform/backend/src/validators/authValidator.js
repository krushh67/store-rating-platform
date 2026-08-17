const { body, validationResult } = require('express-validator');

const passwordRules = body('password')
  .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 characters')
  .matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/)
  .withMessage('Password must contain at least one uppercase letter and one special character');

const nameRules = body('name')
  .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters');

const emailRules = body('email')
  .isEmail().withMessage('Must be a valid email address').normalizeEmail();

const addressRules = body('address')
  .isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters');

const registerValidator = [nameRules, emailRules, passwordRules, addressRules];
const loginValidator = [emailRules, body('password').notEmpty()];
const passwordUpdateValidator = [passwordRules];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

module.exports = { registerValidator, loginValidator, passwordUpdateValidator, validate };
