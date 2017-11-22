const _ = require('lodash');
const LivroModel = require('../models/LivroModel');
const MidiaService = require('../services/MidiaService');

class LivroService {
  static listar() {
    return LivroModel.listar();
  }

  static obter(midiaId) {
    return LivroModel.obter(midiaId);
  }

  static async criar(dados) {
    try {
      const dadosMidia = {
        titulo: dados.titulo,
        capa: dados.capa,
      };

      const midiaId = await MidiaService.criar(dadosMidia);

      const dadosLivro = {
        midia_id: midiaId,
        autor: dados.autor,
        editora: dados.editora,
      };

      await LivroModel.criar(dadosLivro);

      return midiaId;
    } catch (error) {
      throw error;
    }
  }

  static async editar(midiaId, dados) {
    try {
      const dadosLivro = {
        autor: dados.autor,
        editora: dados.editora,
      };


      if (_.some(dadosLivro, _.identity)) {
        const edicao = await LivroModel.editar(midiaId, dadosLivro);

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

  static excluir(midiaId) {
    return MidiaService.excluir(midiaId);
  }
}

module.exports = LivroService;
