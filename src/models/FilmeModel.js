const Conversion = require('../helpers/Conversion');
const { knex } = require('../config/db');

const CAMPOS_FILME = [
  'media.id',
  'media.titulo',
  'media.capa',
  'filme.sinopse',
  'filme.diretor',
  'filme.duracao',
  'media.created_at',
];

class FilmeModel {
  static listar() {
    return knex
      .select(CAMPOS_FILME)
      .from('media')
      .leftJoin('filme', 'filme.media_id', 'media.id')
      .whereNull('media.deleted_at');
  }

  static obter(mediaId) {
    return knex
      .select(CAMPOS_FILME)
      .from('media')
      .leftJoin('filme', 'filme.media_id', 'media.id')
      .where('media.id', mediaId)
      .whereNull('media.deleted_at')
      .first();
  }

  static criar(dados) {
    return knex
      .insert(dados)
      .into('filme');
  }

  static editar(mediaId, dados) {
    return knex
      .update(dados)
      .from('filme')
      .where('filme.media_id', mediaId);
  }

  static excluir(mediaId) {
    return knex
      .update({
        deleted_at: Conversion.getLocal().format('YYYY-MM-DD HH:mm:ss'),
      })
      .from('media')
      .where('id', mediaId);
  }
}

module.exports = FilmeModel;
