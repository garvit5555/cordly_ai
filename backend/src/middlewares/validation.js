const Joi = require('joi');

// Validation for query requests
const validateQuery = (req, res, next) => {
  const schema = Joi.object({
    query: Joi.string().required().min(3).max(1000),
    databaseId: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: error.details[0].message
    });
  }
  
  next();
};

// Validation for database connection requests
const validateDatabaseConnection = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('postgres', 'mysql', 'sqlite', 'mssql').required(),
    host: Joi.string().when('type', {
      is: Joi.string().valid('postgres', 'mysql', 'mssql'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    port: Joi.number().when('type', {
      is: Joi.string().valid('postgres', 'mysql', 'mssql'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    database: Joi.string().required(),
    user: Joi.string().when('type', {
      is: Joi.string().valid('postgres', 'mysql', 'mssql'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    password: Joi.string().when('type', {
      is: Joi.string().valid('postgres', 'mysql', 'mssql'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    filename: Joi.string().when('type', {
      is: 'sqlite',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: error.details[0].message
    });
  }
  
  next();
};

module.exports = {
  validateQuery,
  validateDatabaseConnection
}; 