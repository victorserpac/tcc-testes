const _ = require('lodash');
const LivroModel = require('../models/LivroModel');
const MediaService = require('../services/MediaService');

class LivroService {
  static listar() {
    return LivroModel.listar();
  }

  static obter(mediaId) {
    return LivroModel.obter(mediaId);
  }

  static async criar(dados) {
    try {
      const dadosMedia = {
        titulo: dados.titulo,
        capa: dados.capa,
      };

      const mediaId = await MediaService.criar(dadosMedia);

      const dadosLivro = {
        media_id: mediaId,
        autor: dados.autor,
        editora: dados.editora,
      };

      await LivroModel.criar(dadosLivro);

      return mediaId;
    } catch (error) {
      throw error;
    }
  }

  static async editar(mediaId, dados) {
    try {
      const dadosLivro = {
        autor: dados.autor,
        editora: dados.editora,
      };


      if (_.some(dadosLivro, _.identity)) {
        const edicao = await LivroModel.editar(mediaId, dadosLivro);

        if (edicao === 0) {
          return false;
        }
      }

      const dadosMedia = {
        titulo: dados.titulo,
        capa: dados.capa,
      };

      if (_.some(dadosMedia, _.identity)) {
        const edicao = await MediaService.editar(mediaId, dadosMedia);

        if (edicao === false) {
          return false;
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async excluir(mediaId) {
    return LivroModel.excluir(mediaId);
  }
}

module.exports = LivroService;
