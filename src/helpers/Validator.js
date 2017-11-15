const Joi = require('joi');

class Validator {
  static isAlunoValido(aluno) {
    const schema = Joi.object().keys({
      matricula: Joi.number().integer().required(),
      nome: Joi.string().required(),
      curso: Joi.string().required(),
      created_at: Joi.string().required(),
    });

    const result = Joi.validate(aluno, schema);

    if (result.error === null) {
      return true;
    }

    return false;
  }
}

module.exports = Validator;
