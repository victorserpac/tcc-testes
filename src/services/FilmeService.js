const _ = require('lodash');
const FilmeModel = require('../models/FilmeModel');
const MidiaService = require('../services/MidiaService');

class FilmeService {

  static listar() {
    return FilmeModel.listar();
  }

  static async obter(midiaId) {
    return FilmeModel.obter(midiaId);
  }

  static async criar(dados) {
    try {
      const dadosMidia = {
        titulo: dados.titulo,
        capa: dados.capa,
      };

      const midiaId = await MidiaService.criar(dadosMidia);

      const dadosFilme = {
        midia_id: midiaId,
        sinopse: dados.sinopse,
        diretor: dados.diretor,
        duracao: dados.duracao,
      };

      await FilmeModel.criar(dadosFilme);

      return midiaId;
    } catch (error) {
      throw error;
    }
  }

  static async editar(midiaId, dados) {
    try {
      const dadosFilme = {
        sinopse: dados.sinopse,
        diretor: dados.diretor,
        duracao: dados.duracao,
      };


      if (_.some(dadosFilme, _.identity)) {
        const edicao = await FilmeModel.editar(midiaId, dadosFilme);

        if (edicao === 0) {
          return false;
        }
      }

      const dadosMidia = {
        titulo: dados.titulo,
        capa: dados.capa,
      };

      if (_.some(dadosMidia, _.identity)) {
        const edicao = await MidiaService.editar(midiaId, dadosMidia);

        if (edicao === false) {
          return false;
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async excluir(midiaId) {
    return MidiaService.excluir(midiaId);
  }
}

module.exports = FilmeService;
