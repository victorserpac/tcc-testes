const Logger = require('../helpers/Logger');
const AlunoService = require('../services/AlunoService');

class AlunoController {

  static async list(req, res) {
    try {
      const alunos = await AlunoService.listar();

      res.send({ alunos });
    } catch (error) {
      Logger.throw(res, '3272358416', error);
    }
  }

  static async get(req, res) {
    try {
      const { matricula } = req.params;

      const aluno = await AlunoService.obter(matricula);

      if (!aluno) {
        res.send({ mensagem: 'Aluno não encontrado' });
        return;
      }

      res.send({ aluno });
    } catch (error) {
      Logger.throw(res, '6001059324', error);
    }
  }

  static async post(req, res) {
    try {
      const matricula = await AlunoService.criar(req.body);

      res.send({ matricula });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).send({ message: 'Aluno já matriculado' });
        return;
      }

      Logger.throw(res, '2365958507', error);
    }
  }

  static async put(req, res) {
    const { matricula } = req.params;
    const dados = req.body;

    try {
      const aluno = await AlunoService.editar(matricula, dados);

      if (!aluno) {
        res.send({ mensagem: 'Aluno não encontrado' });
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      Logger.throw(res, '5768905470', error);
    }
  }

  static async delete(req, res) {
    try {
      const { matricula } = req.params;
      const sucesso = await AlunoService.deletar(matricula);

      if (!sucesso) {
        res.send({ mensagem: 'Aluno não encontrado' });
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      Logger.throw(res, '5768905476', error);
    }
  }

}

module.exports = AlunoController;
