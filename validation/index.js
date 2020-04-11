const assignIn = require('lodash/assignIn');
const Joi = require('joi');

function validate(errObj, object, schema) {
  if (!object || !schema) {return;}

  Joi.validate(object, schema, (errors, value) => {
    if (!errors || errors.details.length === 0) {
      assignIn(object, value);
      return;
    }
    errors.details.forEach((error) => {
      errObj[error.context.key] = error.message.replace(new RegExp('"'+error.context.key+'" '), '');
    });
  });
}

module.exports = function(schema) {
  if (!schema) {throw new Error('Please provide a validation schema');}

  return function (req, res, next)  {
    let errors = {};

    ['body', 'query', 'params'].forEach((key) => {
      if (schema[key]) {validate(errors, req[key], schema[key]);}
    });

    if (Object.keys(errors).length === 0) {return next();}

    res.status(400);
    res.send({ message: 'Validation failed', errors });
  };
};
