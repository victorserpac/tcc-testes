const Joi = require('joi');
const RouteValidator = require('../../middlewares/RouteValidator');

class AlunoSchema extends RouteValidator {

  static get list() {
    const schema = {};

    return this.validate(schema);
  }

  static get get() {
    const schema = {
      params: Joi.object().keys({
        matricula: Joi.number().integer().required(),
      }),
    };

    return this.validate(schema);
  }

  static get post() {
    const schema = {
      body: Joi.object().keys({
        matricula: Joi.number().integer().required(),
        nome: Joi.string().required(),
        curso: Joi.string().required(),
      }),
    };

    return this.validate(schema);
  }

  static get put() {
    const schema = {
      params: Joi.object().keys({
        matricula: Joi.number().integer().required(),
      }),
      body: Joi.object().keys({
        nome: Joi.string(),
        curso: Joi.string(),
      }),
    };

    return this.validate(schema);
  }

  static get delete() {
    const schema = {
      params: Joi.object().keys({
        matricula: Joi.number().integer().required(),
      }),
    };

    return this.validate(schema);
  }

}

module.exports = AlunoSchema;
