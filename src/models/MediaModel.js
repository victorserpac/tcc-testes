const Conversion = require('../helpers/Conversion');
const { knex } = require('../config/db');

class MediaModel {

  static listar() {
    return knex
      .select('*')
      .from('media')
      .whereNull('media.deleted_at');
  }

  static obter(id) {
    return knex
      .from('media')
      .where('media.id', id);
  }

  static criar(dados) {
    return knex
      .insert(dados)
      .into('media');
  }

  static editar(id, dados) {
    return knex
      .update(dados)
      .from('media')
      .where('media.id', id);
  }

  static deletar(id) {
    return knex
      .update({
        deleted_at: Conversion.getLocal().format('YYYY-MM-DD HH:mm:ss'),
      })
      .from('media')
      .where('media.id', id);
  }

}

module.exports = MediaModel;
