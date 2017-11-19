// .env lib
require('dotenv').config();

const { test } = require('ava');
const sinon = require('sinon');
const { expect } = require('chai');

// Dependencias
const MidiaController = require('../../src/controllers/MidiaController');
const MidiaModel = require('../../src/models/MidiaModel');
const LivroModel = require('../../src/models/LivroModel');
const FilmeModel = require('../../src/models/FilmeModel');

// Helpers
const { isMidiaValida } = require('../../src/helpers/Validator');

const criarMidia = async (tipo) => {
  const midia = {
    titulo: 'Titulo',
    capa: 'Capa',
  };

  const midiaId = await MidiaModel.criar(midia);

  if (tipo === 'livro') {
    await LivroModel.criar({
      midia_id: midiaId,
      autor: 'Autor do livro',
      editora: 'Editora do Livro',
    });
  }
  if (tipo === 'filme') {
    await FilmeModel.criar({
      midia_id: midiaId,
      sinopse: 'Sinopse do Filme',
      diretor: 'Diretor do Livro',
      duracao: 'Duracao do Livro',
    });
  }

  return midiaId;
};

test.afterEach.always(async () => {
  await FilmeModel.cleanup();
  await LivroModel.cleanup();
  await MidiaModel.cleanup();
});

test.serial('list(): deve responder com lista vazia', async () => {
  const req = {};
  const res = { send: sinon.spy() };

  await MidiaController.list(req, res);

  const response = res.send.firstCall.args[0];

  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('midias').that.is.an('array').that.is.empty;
});

test.serial('list(): deve responder com lista de midias', async () => {
  const req = {};
  const res = { send: sinon.spy() };

  await criarMidia('livro');
  await criarMidia('filme');
  await criarMidia();

  await MidiaController.list(req, res);

  const response = res.send.firstCall.args[0];

  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('midias').that.is.an('array').that.has.lengthOf(3);
  response.midias.forEach((midia) => {
    expect(isMidiaValida(midia)).to.be.true;
  });
});

test.serial('get(): deve responder com mensagem para midia não encontrado', async () => {
  const req = { params: { id: '1' } };
  const res = { send: sinon.spy() };

  await MidiaController.get(req, res);

  const response = res.send.firstCall.args[0];

  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('get(): deve responder com midia', async () => {
  const midiaId = await criarMidia('livro');
  const req = { params: { id: String(midiaId) } };
  const res = { send: sinon.spy() };

  await MidiaController.get(req, res);

  const response = res.send.firstCall.args[0];

  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('midia').that.is.an('object');
  expect(isMidiaValida(response.midia)).to.be.true;
});

test.serial('delete(): deve retornar mensagem para midia não encontrado', async () => {
  const req = { params: { id: '1' } };
  const res = { send: sinon.spy() };

  await MidiaController.delete(req, res);

  const response = res.send.firstCall.args[0];

  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('delete(): deve retornar status 204 para midia excluido', async () => {
  const midiaId = await criarMidia('livro');
  const req = { params: { id: String(midiaId) } };
  const res = { sendStatus: sinon.spy() };

  await MidiaController.delete(req, res);

  expect(res.sendStatus.calledWith(204)).to.be.true;
});
