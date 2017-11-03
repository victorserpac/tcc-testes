const Conversion = require('../helpers/Conversion');
const { knex } = require('../config/db');

const CAMPOS_LIVRO = [
  'media.id',
  'media.titulo',
  'media.capa',
  'livro.autor',
  'livro.editora',
  'media.created_at',
];

class LivroModel {
  static listar() {
    return knex
      .select(CAMPOS_LIVRO)
      .from('livro')
      .leftJoin('media', 'livro.media_id', 'media.id')
      .whereNull('media.deleted_at');
  }

  static obter(mediaId) {
    return knex
      .select(CAMPOS_LIVRO)
      .from('livro')
      .leftJoin('media', 'livro.media_id', 'media.id')
      .where('media.id', mediaId)
      .whereNull('media.deleted_at')
      .first();
  }

  static criar(dados) {
    return knex
      .insert(dados)
      .into('livro');
  }

  static editar(mediaId, dados) {
    return knex
      .update(dados)
      .from('livro')
      .where('livro.media_id', mediaId);
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

module.exports = LivroModel;
