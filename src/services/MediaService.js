const _ = require('lodash');
const MediaModel = require('../models/MediaModel');

class MediaService {

  static async listar() {
    const busca = await MediaModel.listar();

    const medias = busca.map((media) => {
      if (_.some(media.livro, _.identity)) {
        return _.merge(media.media, media.livro);
      }

      if (_.some(media.filme, _.identity)) {
        return _.merge(media.media, media.filme);
      }

      return media.media;
    });

    return medias;
  }

  static async obter(id) {
    try {
      const media = await MediaModel.obter(id);

      if (_.some(media.livro, _.identity)) {
        return _.merge(media.media, media.livro);
      }

      if (_.some(media.filme, _.identity)) {
        return _.merge(media.media, media.filme);
      }

      return media.media;
    } catch (error) {
      throw error;
    }
  }

  static async criar(dados) {
    try {
      const dbIds = await MediaModel.criar(dados);

      return dbIds[0];
    } catch (error) {
      throw error;
    }
  }

  static async editar(id, dados) {
    try {
      const edicao = await MediaModel.editar(id, dados);

      if (edicao === 0) {
        return false;
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async excluir(id) {
    return MediaModel.excluir(id);
  }
}

module.exports = MediaService;
