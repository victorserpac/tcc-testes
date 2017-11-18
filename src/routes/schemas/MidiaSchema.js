const Joi = require('joi');
const RouteValidator = require('../../middlewares/RouteValidator');

class MidiaSchema extends RouteValidator {

  static get list() {
    const schema = {};

    return this.validate(schema);
  }

  static get get() {
    const schema = {
      params: Joi.object().keys({
        id: Joi.number().integer().required(),
      }),
    };

    return this.validate(schema);
  }

  static get delete() {
    const schema = {
      params: Joi.object().keys({
        id: Joi.number().integer().required(),
      }),
    };

    return this.validate(schema);
  }

}

module.exports = MidiaSchema;
