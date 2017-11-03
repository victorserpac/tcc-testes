const Logger = require('../helpers/Logger');
const LivroService = require('../services/LivroService');

class LivroController {

  static async list(req, res) {
    try {
      const livros = await LivroService.listar();

      res.send({ livros });
    } catch (error) {
      Logger.throw(res, '3272358416', error);
    }
  }

  static async get(req, res) {
    try {
      const { mediaId } = req.params;

      const livro = await LivroService.obter(mediaId);

      if (!livro) {
        res.send({ mensagem: 'Livro não encontrado' });
        return;
      }

      res.send({ livro });
    } catch (error) {
      Logger.throw(res, '6001059324', error);
    }
  }

  static async post(req, res) {
    try {
      const dados = req.body;
      const mediaId = await LivroService.criar(dados);

      res.send({ mediaId });
    } catch (error) {
      Logger.throw(res, '2365958507', error);
    }
  }

  static async put(req, res) {
    const { mediaId } = req.params;
    const dados = req.body;

    try {
      const edicao = await LivroService.editar(mediaId, dados);

      if (!edicao) {
        res.send({ mensagem: 'Livro não encontrado' });
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      Logger.throw(res, '5768905470', error);
    }
  }

  static async delete(req, res) {
    try {
      const { mediaId } = req.params;
      const exclusao = await LivroService.excluir(mediaId);

      if (exclusao === 0) {
        res.send({ mensagem: 'Livro não encontrado' });
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      Logger.throw(res, '5768905476', error);
    }
  }

}

module.exports = LivroController;
