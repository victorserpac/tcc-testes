const Conversion = require('../helpers/Conversion');
const { knex } = require('../config/db');

const CAMPOS_LIVRO = [
  'midia.id',
  'midia.titulo',
  'midia.capa',
  'livro.autor',
  'livro.editora',
  'midia.created_at',
];

class LivroModel {
  static listar() {
    return knex
      .select(CAMPOS_LIVRO)
      .from('livro')
      .leftJoin('midia', 'livro.midia_id', 'midia.id')
      .whereNull('midia.deleted_at');
  }

  static obter(midiaId) {
    return knex
      .select(CAMPOS_LIVRO)
      .from('livro')
      .leftJoin('midia', 'livro.midia_id', 'midia.id')
      .where('midia.id', midiaId)
      .whereNull('midia.deleted_at')
      .first();
  }

  static criar(dados) {
    return knex
      .insert(dados)
      .into('livro');
  }

  static editar(midiaId, dados) {
    return knex
      .update(dados)
      .from('livro')
      .where('livro.midia_id', midiaId);
  }

  static excluir(midiaId) {
    return knex
      .update({
        deleted_at: Conversion.getLocal().format('YYYY-MM-DD HH:mm:ss'),
      })
      .from('midia')
      .where('id', midiaId);
  }
}

module.exports = LivroModel;
