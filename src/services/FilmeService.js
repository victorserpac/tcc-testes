const _ = require('lodash');
const FilmeModel = require('../models/FilmeModel');
const MediaService = require('../services/MediaService');

class FilmeService {

  static async listar() {
    try {
      const filmes = await FilmeModel.listar();

      return filmes;
    } catch (error) {
      throw error;
    }
  }

  static async obter(mediaId) {
    return FilmeModel.obter(mediaId);
  }

  static async criar(dados) {
    try {
      const dadosMedia = {
        titulo: dados.titulo,
        capa: dados.capa,
      };

      const mediaId = await MediaService.criar(dadosMedia);

      const dadosFilme = {
        media_id: mediaId,
        sinopse: dados.sinopse,
        diretor: dados.diretor,
        duracao: dados.duracao,
      };

      await FilmeModel.criar(dadosFilme);

      return mediaId;
    } catch (error) {
      throw error;
    }
  }

  static async editar(mediaId, dados) {
    try {
      const dadosFilme = {
        sinopse: dados.sinopse,
        diretor: dados.diretor,
        duracao: dados.duracao,
      };


      if (_.some(dadosFilme, _.identity)) {
        const edicao = await FilmeModel.editar(mediaId, dadosFilme);

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
    return FilmeModel.excluir(mediaId);
  }
}

module.exports = FilmeService;
