const Conversion = require('../helpers/Conversion');
const { knex } = require('../config/db');

const CAMPOS = [
  'midia.id',
  'midia.titulo',
  'midia.capa',
  'filme.sinopse',
  'filme.diretor',
  'filme.duracao',
  'livro.autor',
  'livro.editora',
  'midia.created_at',
];

class MidiaModel {

  static listar() {
    return knex
      .select(CAMPOS)
      .from('midia')
      .leftJoin('livro', 'midia.id', 'livro.midia_id')
      .leftJoin('filme', 'midia.id', 'filme.midia_id')
      .whereNull('midia.deleted_at')
      .options({ nestTables: true });
  }

  static obter(id) {
    return knex
      .select(CAMPOS)
      .from('midia')
      .leftJoin('livro', 'midia.id', 'livro.midia_id')
      .leftJoin('filme', 'midia.id', 'filme.midia_id')
      .whereNull('midia.deleted_at')
      .where('midia.id', id)
      .options({ nestTables: true })
      .first();
  }

  static criar(dados) {
    return knex
      .insert(dados)
      .into('midia');
  }

  static editar(id, dados) {
    return knex
      .update(dados)
      .from('midia')
      .where('id', id);
  }

  static excluir(id) {
    return knex
      .update({
        deleted_at: Conversion.getLocal().format('YYYY-MM-DD HH:mm:ss'),
      })
      .from('midia')
      .where('id', id)
      .whereNull('deleted_at');
  }

  static cleanup() {
    return knex
      .delete()
      .from('midia');
  }
}

module.exports = MidiaModel;
