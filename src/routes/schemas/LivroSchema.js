const Joi = require('joi');
const RouteValidator = require('../../middlewares/RouteValidator');

class FilmeSchema extends RouteValidator {

  static get list() {
    const schema = {};

    return this.validate(schema);
  }

  static get get() {
    const schema = {
      params: Joi.object().keys({
        midiaId: Joi.number().integer().required(),
      }),
    };

    return this.validate(schema);
  }

  static get post() {
    const schema = {
      body: Joi.object().keys({
        titulo: Joi.string().required(),
        capa: Joi.string(),
        autor: Joi.string(),
        editora: Joi.string(),
      }),
    };

    return this.validate(schema);
  }

  static get put() {
    const schema = {
      params: Joi.object().keys({
        midiaId: Joi.number().integer().required(),
      }),
      body: Joi.object().keys({
        titulo: Joi.string(),
        capa: Joi.string(),
        autor: Joi.string(),
        editora: Joi.string(),
      }),
    };

    return this.validate(schema);
  }

  static get delete() {
    const schema = {
      params: Joi.object().keys({
        midiaId: Joi.number().integer().required(),
      }),
    };

    return this.validate(schema);
  }

}

module.exports = FilmeSchema;
