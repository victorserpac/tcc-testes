const _ = require('lodash');
const MidiaModel = require('../models/MidiaModel');

class MidiaService {

  static async listar() {
    const busca = await MidiaModel.listar();

    const midias = busca.map((midia) => {
      if (!_.every(midia.livro, _.isNull)) {
        return _.merge(midia.midia, midia.livro);
      }

      if (!_.every(midia.filme, _.isNull)) {
        return _.merge(midia.midia, midia.filme);
      }

      return midia.midia;
    });

    return midias;
  }

  static async obter(id) {
    try {
      const midia = await MidiaModel.obter(id);

      if (!midia) {
        return undefined;
      }

      if (!_.every(midia.livro, _.isNull)) {
        return _.merge(midia.midia, midia.livro);
      }

      if (!_.every(midia.filme, _.isNull)) {
        return _.merge(midia.midia, midia.filme);
      }

      return midia.midia;
    } catch (error) {
      throw error;
    }
  }

  static async criar(dados) {
    try {
      const dbIds = await MidiaModel.criar(dados);

      return dbIds[0];
    } catch (error) {
      throw error;
    }
  }

  static async editar(id, dados) {
    try {
      const edicao = await MidiaModel.editar(id, dados);

      if (edicao === 0) {
        return false;
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async excluir(id) {
    try {
      if (await MidiaModel.excluir(id)) {
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MidiaService;
