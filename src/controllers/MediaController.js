const Logger = require('../helpers/Logger');
const MediaService = require('../services/MediaService');

class MediaController {

  static async list(req, res) {
    try {
      const medias = await MediaService.listar();

      res.send({ medias });
    } catch (error) {
      Logger.throw(res, '3272358416', error);
    }
  }

  static async get(req, res) {
    try {
      const { id } = req.params;

      const media = await MediaService.obter(id);

      if (!media) {
        res.send({ mensagem: 'Media não encontrado' });
        return;
      }

      res.send({ media });
    } catch (error) {
      Logger.throw(res, '6001059324', error);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const exclusao = await MediaService.excluir(id);

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

module.exports = MediaController;
