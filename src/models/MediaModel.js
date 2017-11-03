const Conversion = require('../helpers/Conversion');
const { knex } = require('../config/db');

const CAMPOS = [
  'media.id',
  'media.titulo',
  'media.capa',
  'filme.sinopse',
  'filme.diretor',
  'filme.duracao',
  'livro.autor',
  'livro.editora',
  'media.created_at',
];

class MediaModel {

  static listar() {
    return knex
      .select(CAMPOS)
      .from('media')
      .leftJoin('livro', 'media.id', 'livro.media_id')
      .leftJoin('filme', 'media.id', 'filme.media_id')
      .whereNull('media.deleted_at')
      .options({ nestTables: true });
  }

  static obter(id) {
    return knex
      .select(CAMPOS)
      .from('media')
      .leftJoin('livro', 'media.id', 'livro.media_id')
      .leftJoin('filme', 'media.id', 'filme.media_id')
      .whereNull('media.deleted_at')
      .where('media.id', id)
      .options({ nestTables: true })
      .first();
  }

  static excluir(id) {
    return knex
      .update({
        deleted_at: Conversion.getLocal().format('YYYY-MM-DD HH:mm:ss'),
      })
      .from('media')
      .where('media.id', id);
  }

}

module.exports = MediaModel;
