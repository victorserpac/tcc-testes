const AlunoModel = require('../models/AlunoModel');

class AlunoService {
  static listar() {
    return AlunoModel.listar();
  }

  static obter(matricula) {
    return AlunoModel.obter(matricula);
  }

  static async criar(dados) {
    try {
      const dbIds = await AlunoModel.criar(dados);

      return dbIds[0];
    } catch (error) {
      throw error;
    }
  }

  static async editar(matricula, dados) {
    try {
      const edicao = await AlunoModel.editar(matricula, dados);

      if (edicao) {
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    }
  }

  static async excluir(matricula) {
    try {
      const delecao = await AlunoModel.excluir(matricula);

      if (delecao) {
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AlunoService;
