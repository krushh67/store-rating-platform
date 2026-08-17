const { body, validationResult } = require('express-validator');

const ratingValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

module.exports = { ratingValidator, validate };
