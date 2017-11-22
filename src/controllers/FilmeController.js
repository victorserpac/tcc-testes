const Logger = require('../helpers/Logger');
const FilmeService = require('../services/FilmeService');

class FilmeController {

  static async list(req, res) {
    try {
      const filmes = await FilmeService.listar();

      res.send({ filmes });
    } catch (error) {
      Logger.throw(res, '3272358416', error);
    }
  }

  static async get(req, res) {
    try {
      const { midiaId } = req.params;

      const filme = await FilmeService.obter(midiaId);

      if (!filme) {
        res.send({ mensagem: 'Filme não encontrado' });
        return;
      }

      res.send({ filme });
    } catch (error) {
      Logger.throw(res, '6001059324', error);
    }
  }

  static async post(req, res) {
    try {
      const dados = req.body;
      const midiaId = await FilmeService.criar(dados);

      res.send({ midiaId });
    } catch (error) {
      Logger.throw(res, '2365958507', error);
    }
  }

  static async put(req, res) {
    const { midiaId } = req.params;
    const dados = req.body;

    try {
      const edicao = await FilmeService.editar(midiaId, dados);

      if (!edicao) {
        res.send({ mensagem: 'Filme não encontrado' });
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      Logger.throw(res, '5768905470', error);
    }
  }

  static async delete(req, res) {
    try {
      const { midiaId } = req.params;
      const exclusao = await FilmeService.excluir(midiaId);

      if (exclusao === false) {
        res.send({ mensagem: 'Filme não encontrado' });
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      Logger.throw(res, '5768905476', error);
    }
  }

}

module.exports = FilmeController;
