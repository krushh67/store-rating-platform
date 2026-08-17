const { body, validationResult } = require('express-validator');

const storeValidator = [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Store name must be between 20 and 60 characters'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('address').isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

module.exports = { storeValidator, validate };
