/* eslint-disable */
const { test } = require('ava');
const sinon = require('sinon');
const { expect } = require('chai');

// Dependencias
const FilmeController = require('../../../src/controllers/FilmeController');
const FilmeService = require('../../../src/services/FilmeService');
const Logger = require('../../../src/helpers/Logger');

const filme = () => ({
  id: 1180,
  titulo: 'Titulo',
  capa: 'Capa',
  diretor: 'Diretor',
  sinopse: 'Sinopse',
  duracao: 'Duracao',
  created_at: '2017-11-20 23:50:44',
});

const filmeSchema = () => ({
  titulo: 'Titulo',
  capa: 'Capa',
  diretor: 'Diretor',
  sinopse: 'Sinopse',
  duracao: 'Duracao',
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

  const listar = sandbox.stub(FilmeService, 'listar').resolves([]);

  await FilmeController.list(req, res);

  const response = res.send.firstCall.args[0];

  expect(listar.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('filmes').that.is.an('array').that.is.empty;
});

test('list(): deve responder com lista de filmes', async () => {
  const req = {};
  const res = { send: sinon.spy() };

  const listar = sandbox.stub(FilmeService, 'listar').resolves([
    filme(),
    filme(),
  ]);

  await FilmeController.list(req, res);

  const response = res.send.firstCall.args[0];

  expect(listar.called).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('filmes').that.is.an('array').that.has.lengthOf(2);
});

test('list(): deve responder mensagem de erro', async () => {
  const req = {};
  const res = { send: sinon.spy() };

  const listar = sandbox.stub(FilmeService, 'listar').rejects();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await FilmeController.list(req, res);

  expect(listar.called).to.be.true;
  expect(loggerThrow.calledWith(res, '3272358416', sinon.match.instanceOf(Error))).to.be.true;
});

test('get(): deve responder com mensagem para filme não encontrado', async () => {
  const midiaId = 1180;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy() };

  const obter = sandbox.stub(FilmeService, 'obter').resolves(undefined);

  await FilmeController.get(req, res);

  const response = res.send.firstCall.args[0];

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test('get(): deve responder com filme', async () => {
  const midiaId = 1180;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy() };

  const obter = sandbox.stub(FilmeService, 'obter').resolves(filme());

  await FilmeController.get(req, res);

  const response = res.send.firstCall.args[0];

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('filme').that.is.an('object');
});

test('get(): deve responder mensagem de erro', async () => {
  const midiaId = 1180;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy() };

  const obter = sandbox.stub(FilmeService, 'obter').rejects();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await FilmeController.get(req, res);

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.false;
  expect(loggerThrow.calledWith(res, '6001059324', sinon.match.instanceOf(Error))).to.be.true;
});

test('post(): deve responder midiaId do filme criado', async () => {
  const midiaId = filme().id;
  const req = { body: filmeSchema() };
  const res = { send: sinon.spy() };

  const criar = sandbox.stub(FilmeService, 'criar').resolves(midiaId);

  await FilmeController.post(req, res);

  const response = res.send.firstCall.args[0];

  expect(criar.calledWith(req.body)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('midiaId').that.is.a('number');
});

test('post(): deve responder mensagem de erro', async () => {
  const midiaId = filme().id;
  const req = { body: filmeSchema() };
  const res = { send: sinon.spy() };

  const criar = sandbox.stub(FilmeService, 'criar').rejects();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await FilmeController.post(req, res);

  expect(criar.calledWith(req.body)).to.be.true;
  expect(res.send.called).to.be.false;
  expect(loggerThrow.calledWith(res, '2365958507', sinon.match.instanceOf(Error))).to.be.true;
});

test('put(): deve responder com mensagem para filme não contrado', async () => {
  const midiaId = 1180;
  const req = { params: { midiaId }, body: filmeSchema() };
  const res = { send: sinon.spy() };

  const editar = sandbox.stub(FilmeService, 'editar').resolves(false);

  await FilmeController.put(req, res);

  const response = res.send.firstCall.args[0];

  expect(editar.calledWith(midiaId, req.body)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test('put(): deve responder status 204 para filme editado', async () => {
  const midiaId = 1180;
  const req = { params: { midiaId }, body: filmeSchema() };
  const res = { sendStatus: sinon.spy() };

  const editar = sandbox.stub(FilmeService, 'editar').resolves(true);

  await FilmeController.put(req, res);

  expect(editar.calledWith(midiaId, req.body)).to.be.true;
  expect(res.sendStatus.called).to.be.true;
  expect(res.sendStatus.calledWith(204)).to.be.true;
});

test('put(): deve responder mensagem de erro', async () => {
  const midiaId = 1180;
  const req = { params: { midiaId }, body: filmeSchema() };
  const res = { send: sinon.spy(), sendStatus: sinon.spy() };

  const editar = sandbox.stub(FilmeService, 'editar').rejects();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await FilmeController.put(req, res);

  expect(editar.calledWith(midiaId, req.body)).to.be.true;
  expect(res.sendStatus.called).to.be.false;
  expect(res.send.called).to.be.false;
  expect(loggerThrow.calledWith(res, '5768905470', sinon.match.instanceOf(Error))).to.be.true;
});

test('delete(): deve responder com mensagem para filme não contrado', async () => {
  const midiaId = 1180;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy(), sendStatus: sinon.spy() };

  const excluir = sandbox.stub(FilmeService, 'excluir').resolves(false);

  await FilmeController.delete(req, res);

  const response = res.send.firstCall.args[0];

  expect(excluir.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(res.sendStatus.called).to.be.false;
  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test('delete(): deve responder status 204 para filme excluído', async () => {
  const midiaId = 1180;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy(), sendStatus: sinon.spy() };

  const excluir = sandbox.stub(FilmeService, 'excluir').resolves(true);

  await FilmeController.delete(req, res);

  expect(excluir.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.false;
  expect(res.sendStatus.calledWith(204)).to.be.true;
});

test('delete(): deve responder mensagem de erro', async () => {
  const midiaId = 1180;
  const req = { params: { midiaId } };
  const res = { send: sinon.spy(), sendStatus: sinon.spy() };

  const excluir = sandbox.stub(FilmeService, 'excluir').rejects();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await FilmeController.delete(req, res);

  expect(excluir.calledWith(midiaId)).to.be.true;
  expect(res.send.called).to.be.false;
  expect(res.sendStatus.called).to.be.false;
  expect(loggerThrow.calledWith(res, '5768905476', sinon.match.instanceOf(Error))).to.be.true;
});