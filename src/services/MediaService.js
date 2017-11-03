const MediaModel = require('../models/MediaModel');

class MediaService {

  static async listar() {
    try {
      const medias = await MediaModel.listar();

      return medias;
    } catch (error) {
      throw error;
    }
  }

  static async obter(matricula) {
    try {
      const media = await MediaModel.obter(matricula);

      if (media.length === 0) {
        return null;
      }

      return media;
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

  static async deletar(matricula) {
    try {
      const delecao = await MediaModel.deletar(matricula);

      if (delecao) {
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MediaService;
