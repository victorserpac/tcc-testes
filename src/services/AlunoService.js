const AlunoModel = require('../models/AlunoModel');
const Convert = require('../helpers/Conversion');

class AlunoService {

  static async listar() {
    try {
      const alunos = await AlunoModel.listar();

      return alunos;
    } catch (error) {
      throw error;
    }
  }

  static async obter(matricula) {
    try {
      const aluno = await AlunoModel.obter(matricula);

      if (aluno.length === 0) {
        return null;
      }

      return aluno;
    } catch (error) {
      throw error;
    }
  }

  static async criar(data) {
    try {
      const dbIds = await AlunoModel.criar(data);

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

  static async deletar(matricula) {
    try {
      const delecao = await AlunoModel.deletar(matricula);

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
