const { knex } = require('../config/db');

const CAMPOS_FILME = [
  'midia.id',
  'midia.titulo',
  'midia.capa',
  'filme.sinopse',
  'filme.diretor',
  'filme.duracao',
  'midia.created_at',
];

class FilmeModel {
  static listar() {
    return knex
      .select(CAMPOS_FILME)
      .from('midia')
      .leftJoin('filme', 'filme.midia_id', 'midia.id')
      .whereNull('midia.deleted_at');
  }

  static obter(midiaId) {
    return knex
      .select(CAMPOS_FILME)
      .from('midia')
      .leftJoin('filme', 'filme.midia_id', 'midia.id')
      .where('midia.id', midiaId)
      .whereNull('midia.deleted_at')
      .first();
  }

  static criar(dados) {
    return knex
      .insert(dados)
      .into('filme');
  }

  static editar(midiaId, dados) {
    return knex
      .update(dados)
      .from('filme')
      .where('midia_id', midiaId);
  }

  static cleanup() {
    return knex
      .delete()
      .from('filme');
  }
}

module.exports = FilmeModel;
