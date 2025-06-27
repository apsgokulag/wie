// D:\DEVELOP\wie\wie_creator\services\auth-service\src\middleware\validation.js
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorMessages
    });
  }
  
  next();
};

module.exports = validate;