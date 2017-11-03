const Conversion = require('../helpers/Conversion');
const { knex } = require('../config/db');

class AlunoModel {

  static listar() {
    return knex
      .select('*')
      .from('aluno')
      .whereNull('aluno.deleted_at');
  }

  static obter(matricula) {
    return knex
      .from('aluno')
      .where('aluno.matricula', matricula);
  }

  static criar(data) {
    return knex
      .insert(data)
      .into('aluno');
  }

  static editar(matricula, dados) {
    return knex
      .update(dados)
      .from('aluno')
      .where('aluno.matricula', matricula);
  }

  static deletar(matricula) {
    return knex
      .update({
        deleted_at: Conversion.getLocal().format('YYYY-MM-DD HH:mm:ss'),
      })
      .from('aluno')
      .where('aluno.matricula', matricula);
  }

}

module.exports = AlunoModel;
