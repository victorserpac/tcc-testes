const Logger = require('../helpers/Logger');
const MidiaService = require('../services/MidiaService');

class MidiaController {

  static async list(req, res) {
    try {
      const midias = await MidiaService.listar();

      res.send({ midias });
    } catch (error) {
      Logger.throw(res, '3272358416', error);
    }
  }

  static async get(req, res) {
    try {
      const { id } = req.params;

      const midia = await MidiaService.obter(id);

      if (!midia) {
        res.send({ mensagem: 'Midia não encontrado' });
        return;
      }

      res.send({ midia });
    } catch (error) {
      Logger.throw(res, '6001059324', error);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const exclusao = await MidiaService.excluir(id);

      if (!exclusao) {
        res.send({ mensagem: 'Livro não encontrado' });
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      Logger.throw(res, '5768905476', error);
    }
  }

}

module.exports = MidiaController;
