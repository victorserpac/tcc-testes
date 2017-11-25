// /* eslint-disable */
const { test } = require('ava');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const MidiaController = require('../../../src/controllers/MidiaController');
const MidiaService = require('../../../src/services/MidiaService');
const MidiaModel = require('../../../src/models/MidiaModel');
const Logger = require('../../../src/helpers/Logger');

// Helpers
const { isMidiaValida } = require('../../../src/helpers/Validator');

const filme = () => ({
  id: 1,
  titulo: 'Titulo',
  capa: 'Capa',
  created_at: 'Data de Criação',
  diretor: 'Diretor',
  sinopse: 'Sinopse',
  duracao: 'Duracao',
});

const livro = () => ({
  id: 1,
  titulo: 'Titulo',
  capa: 'Capa',
  created_at: 'Data de Criação',
  autor: 'Autor',
  editora: 'Editora',
});

const midia = () => ({
  id: 1,
  titulo: 'Titulo',
  capa: 'Capa',
  created_at: 'Data de Criação',
});

let sandbox;

test.beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

test.afterEach.always(() => {
  sandbox.restore();
});

test.serial('list(): deve responder com lista vazia', async () => {
  const req = {};
  const res = { send: sinon.spy() };
  const listar = sandbox.stub(MidiaService, 'listar').resolves([]);

  await MidiaController.list(req, res);

  const response = res.send.firstCall.args[0];

  expect(listar.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('midias').that.is.an('array').that.is.empty;
});

test.serial('list(): deve responder com lista de midias', async () => {
  const req = {};
  const res = { send: sinon.spy() };

  const listar = sandbox.stub(MidiaService, 'listar').resolves([
    filme(),
    filme(),
    livro(),
    livro(),
  ]);

  await MidiaController.list(req, res);

  const response = res.send.firstCall.args[0];

  expect(listar.called).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('midias').that.is.an('array').that.has.lengthOf(4);
  response.midias.forEach((midia) => {
    expect(isMidiaValida(midia)).to.be.true;
  });
});

test.serial('list(): deve responder mensagem de erro', async () => {
  const req = {};
  const res = { send: sinon.spy() };
  const listar = sandbox.stub(MidiaService, 'listar').throws();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await MidiaController.list(req, res);

  expect(listar.called).to.be.true;
  expect(loggerThrow.calledWith(res, '3272358416', sinon.match.instanceOf(Error))).to.be.true;
});

test.serial('get(): deve responder com mensagem para midia não encontrado', async () => {
  const req = { params: { id: '1' } };
  const res = { send: sinon.spy() };
  const obter = sandbox.stub(MidiaService, 'obter').resolves(undefined);

  await MidiaController.get(req, res);

  const response = res.send.firstCall.args[0];

  expect(obter.calledWith(req.params.id)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('get(): deve responder com midia', async () => {
  const req = { params: { id: '1' } };
  const res = { send: sinon.spy() };
  const obter = sandbox.stub(MidiaService, 'obter').resolves(livro());

  await MidiaController.get(req, res);

  const response = res.send.firstCall.args[0];

  expect(obter.calledWith(req.params.id)).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('midia').that.is.an('object');
  expect(isMidiaValida(response.midia)).to.be.true;
});

test.serial('get(): deve responder mensagem de erro', async () => {
  const req = { params: { id: '1' } };
  const res = { send: sinon.spy() };
  const obter = sandbox.stub(MidiaService, 'obter').throws();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await MidiaController.get(req, res);

  expect(obter.calledWith(req.params.id)).to.be.true;
  expect(loggerThrow.calledWith(res, '6001059324', sinon.match.instanceOf(Error))).to.be.true;
});

test.serial('delete(): deve responder com mensagem para midia não contrado', async () => {
  const req = { params: { id: '1' } };
  const res = { send: sinon.spy() };
  const excluir = sandbox.stub(MidiaService, 'excluir').resolves(0);

  await MidiaController.delete(req, res);

  const response = res.send.firstCall.args[0];

  expect(excluir.calledWith(req.params.id)).to.be.true;
  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('delete(): deve responder status 204 para midia excluído', async () => {
  const req = { params: { id: '1' } };
  const res = { sendStatus: sinon.spy() };
  const excluir = sandbox.stub(MidiaService, 'excluir').resolves(1);

  await MidiaController.delete(req, res);

  expect(excluir.calledWith(req.params.id)).to.be.true;
  expect(res.sendStatus.calledWith(204)).to.be.true;
});

test.serial('delete(): deve responder mensagem de erro', async () => {
  const req = { params: { id: '1' } };
  const res = { send: sinon.spy() };
  const excluir = sandbox.stub(MidiaService, 'excluir').throws();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await MidiaController.delete(req, res);

  expect(excluir.calledWith(req.params.id)).to.be.true;
  expect(loggerThrow.calledWith(res, '5768905476', sinon.match.instanceOf(Error))).to.be.true;
});