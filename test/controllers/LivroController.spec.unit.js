/* eslint-disable */
const { test } = require('ava');
const sinon = require('sinon');
const { expect } = require('chai');

// Dependencias
const LivroController = require('../../src/controllers/LivroController');
const LivroService = require('../../src/services/LivroService');
const Logger = require('../../src/helpers/Logger');

const livro = () => ({
  id: 1181,
  titulo: 'Titulo',
  capa: 'Capa',
  autor: 'Autor',
  editora: 'Editora',
  created_at: '2017-11-20 23:50:44',
});

const livroSchema = () => ({
  titulo: 'Titulo',
  capa: 'Capa',
  autor: 'Autor',
  editora: 'Editora',
});

let sandbox;

test.beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

test.afterEach.always(() => {
  sandbox.restore();
});

test('list(): deve responder com lista vazia', async () => {
  const req = {};
  const res = { send: sinon.spy() };

  const listar = sandbox.stub(LivroService, 'listar').resolves([]);

  await LivroController.list(req, res);

  const response = res.send.firstCall.args[0];

  expect(listar.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('livros').that.is.an('array').that.is.empty;
});

test('list(): deve responder com lista de livros', async () => {
  const req = {};
  const res = { send: sinon.spy() };

  const listar = sandbox.stub(LivroService, 'listar').resolves([
    livro(),
    livro(),
  ]);

  await LivroController.list(req, res);

  const response = res.send.firstCall.args[0];

  expect(listar.called).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('livros').that.is.an('array').that.has.lengthOf(2);
});

test('list(): deve responder mensagem de erro', async () => {
  const req = {};
  const res = { send: sinon.spy() };

  const listar = sandbox.stub(LivroService, 'listar').rejects();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await LivroController.list(req, res);

  expect(listar.called).to.be.true;
  expect(loggerThrow.calledWith(res, '3272358416', sinon.match.instanceOf(Error))).to.be.true;
});

test('get(): deve responder com mensagem para livro não encontrado', async () => {
  const midiaId = 1181;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy() };

  const obter = sandbox.stub(LivroService, 'obter').resolves(undefined);

  await LivroController.get(req, res);

  const response = res.send.firstCall.args[0];

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test('get(): deve responder com livro', async () => {
  const midiaId = 1181;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy() };

  const obter = sandbox.stub(LivroService, 'obter').resolves(livro());

  await LivroController.get(req, res);

  const response = res.send.firstCall.args[0];

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('livro').that.is.an('object');
});

test('get(): deve responder mensagem de erro', async () => {
  const midiaId = 1181;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy() };

  const obter = sandbox.stub(LivroService, 'obter').rejects();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await LivroController.get(req, res);

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.false;
  expect(loggerThrow.calledWith(res, '6001059324', sinon.match.instanceOf(Error))).to.be.true;
});

test('post(): deve responder midiaId do livro criado', async () => {
  const midiaId = livro().id;
  const req = { body: livroSchema() };
  const res = { send: sinon.spy() };

  const criar = sandbox.stub(LivroService, 'criar').resolves(midiaId);

  await LivroController.post(req, res);

  const response = res.send.firstCall.args[0];

  expect(criar.calledWith(req.body)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('midiaId').that.is.a('number');
});

test('post(): deve responder mensagem de erro', async () => {
  const midiaId = livro().id;
  const req = { body: livroSchema() };
  const res = { send: sinon.spy() };

  const criar = sandbox.stub(LivroService, 'criar').rejects();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await LivroController.post(req, res);

  expect(criar.calledWith(req.body)).to.be.true;
  expect(res.send.called).to.be.false;
  expect(loggerThrow.calledWith(res, '2365958507', sinon.match.instanceOf(Error))).to.be.true;
});

test('put(): deve responder com mensagem para livro não contrado', async () => {
  const midiaId = 1181;
  const req = { params: { midiaId }, body: livroSchema() };
  const res = { send: sinon.spy(), sendStatus: sinon.spy() };

  const editar = sandbox.stub(LivroService, 'editar').resolves(false);

  await LivroController.put(req, res);

  const response = res.send.firstCall.args[0];

  expect(editar.calledWith(midiaId, req.body)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(res.sendStatus.called).to.be.false;
  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test('put(): deve responder status 204 para livro editado', async () => {
  const midiaId = 1181;
  const req = { params: { midiaId }, body: livroSchema() };
  const res = { send: sinon.spy(), sendStatus: sinon.spy() };

  const editar = sandbox.stub(LivroService, 'editar').resolves(true);

  await LivroController.put(req, res);

  expect(editar.calledWith(midiaId, req.body)).to.be.true;
  expect(res.send.called).to.be.false;
  expect(res.sendStatus.called).to.be.true;
  expect(res.sendStatus.calledWith(204)).to.be.true;
});

test('put(): deve responder mensagem de erro', async () => {
  const midiaId = 1181;
  const req = { params: { midiaId }, body: livroSchema() };
  const res = { send: sinon.spy(), sendStatus: sinon.spy() };

  const editar = sandbox.stub(LivroService, 'editar').rejects();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await LivroController.put(req, res);

  expect(editar.calledWith(midiaId, req.body)).to.be.true;
  expect(res.sendStatus.called).to.be.false;
  expect(res.send.called).to.be.false;
  expect(loggerThrow.calledWith(res, '5768905470', sinon.match.instanceOf(Error))).to.be.true;
});

test('delete(): deve responder com mensagem para livro não contrado', async () => {
  const midiaId = 1181;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy(), sendStatus: sinon.spy() };

  const excluir = sandbox.stub(LivroService, 'excluir').resolves(false);

  await LivroController.delete(req, res);

  const response = res.send.firstCall.args[0];

  expect(excluir.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(res.sendStatus.called).to.be.false;
  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test('delete(): deve responder status 204 para livro excluído', async () => {
  const midiaId = 1181;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy(), sendStatus: sinon.spy() };

  const excluir = sandbox.stub(LivroService, 'excluir').resolves(true);

  await LivroController.delete(req, res);

  expect(excluir.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.false;
  expect(res.sendStatus.calledWith(204)).to.be.true;
});

test('delete(): deve responder mensagem de erro', async () => {
  const midiaId = 1181;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy(), sendStatus: sinon.spy() };

  const excluir = sandbox.stub(LivroService, 'excluir').rejects();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await LivroController.delete(req, res);

  expect(excluir.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.false;
  expect(res.sendStatus.called).to.be.false;
  expect(loggerThrow.calledWith(res, '5768905476', sinon.match.instanceOf(Error))).to.be.true;
});