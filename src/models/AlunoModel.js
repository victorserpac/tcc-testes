const Conversion = require('../helpers/Conversion');
const { knex } = require('../config/db');

const CAMPOS_ALUNO = [
  'aluno.matricula',
  'aluno.nome',
  'aluno.curso',
  'aluno.created_at',
];

class AlunoModel {

  static listar() {
    return knex
      .select(CAMPOS_ALUNO)
      .from('aluno')
      .whereNull('deleted_at');
  }

  static obter(matricula) {
    return knex
      .select(CAMPOS_ALUNO)
      .from('aluno')
      .where('matricula', matricula)
      .whereNull('deleted_at')
      .first();
  }

  static obterExcluido(matricula) {
    return knex
      .select(CAMPOS_ALUNO)
      .from('aluno')
      .where('matricula', matricula)
      .whereNotNull('deleted_at')
      .first();
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
      .where('matricula', matricula);
  }

  static excluir(matricula) {
    return knex
      .update({
        deleted_at: Conversion.getLocal().format('YYYY-MM-DD HH:mm:ss'),
      })
      .from('aluno')
      .where('matricula', matricula)
      .whereNull('deleted_at');
  }

  static cleanup() {
    return knex
      .delete()
      .from('aluno');
  }
}

module.exports = AlunoModel;
