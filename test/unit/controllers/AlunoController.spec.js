/* eslint-disable */
const { test } = require('ava');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const AlunoController = require('../../../src/controllers/AlunoController');
const AlunoService = require('../../../src/services/AlunoService');
const AlunoModel = require('../../../src/models/AlunoModel');
const Logger = require('../../../src/helpers/Logger');

const aluno = () => {
  return {
    matricula: 20142850076,
    nome: 'Victor Serpa do Carmo',
    turma: 'TSI',
  }
};

let sandbox;

test.beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

test.afterEach.always(() => {
  sandbox.restore();
});

test.serial('list(): deve ter alunos na resposta', async () => {
  const req = {};
  const res = { send: sinon.spy() };
  const stub = sandbox.stub(AlunoService, 'listar').resolves([]);

  await AlunoController.list(req, res);

  expect(stub.called).to.be.true;
  expect(res.send.calledWith({ alunos: sinon.match.array })).to.be.true;
});

test.serial('list(): deve responder mensagem de erro', async () => {
  const req = {};
  const res = { send: sinon.spy() };
  const stub = sandbox.stub(AlunoService, 'listar').throws();
  const throwStub = sandbox.stub(Logger, 'throw');

  await AlunoController.list(req, res);

  expect(stub.called).to.be.true;
  expect(throwStub.calledWith(res, '3272358416', sinon.match.instanceOf(Error))).to.be.true;
});

test.serial('get(): deve responder aluno não encontrado', async () => {
  const req = { params: { matricula: 20142850076 } };
  const res = { send: sinon.spy() };
  const stub = sandbox.stub(AlunoService, 'obter').resolves(undefined);

  await AlunoController.get(req, res);

  expect(stub.calledWith(req.params.matricula)).to.be.true;
  expect(res.send.calledWith({ mensagem: sinon.match.string })).to.be.true;
});

test.serial('get(): deve responder com aluno', async () => {
  const req = { params: { matricula: 20142850076 } };
  const res = { send: sinon.spy() };
  const stub = sandbox.stub(AlunoService, 'obter').resolves(aluno());

  await AlunoController.get(req, res);

  expect(stub.calledWith(req.params.matricula)).to.be.true;
  expect(res.send.calledWith({ aluno: aluno() })).to.be.true;
});

test.serial('get(): deve responder mensagem de erro', async () => {
  const req = { params: { matricula: 20142850076 } };
  const res = { send: sinon.spy() };
  const stub = sandbox.stub(AlunoService, 'obter').throws();
  const throwStub = sandbox.stub(Logger, 'throw');

  await AlunoController.get(req, res);

  expect(stub.calledWith(req.params.matricula)).to.be.true;
  expect(throwStub.calledWith(res, '6001059324', sinon.match.instanceOf(Error))).to.be.true;
});

test.serial('post(): deve responder matricula para aluno criado', async () => {
  const alunoParaCriar = aluno();
  const req = { body: alunoParaCriar };
  const res = { send: sinon.spy() };
  const criar = sandbox.stub(AlunoService, 'criar').resolves(alunoParaCriar.matricula);

  await AlunoController.post(req, res);

  expect(criar.calledWith(req.body)).to.be.true;
  expect(res.send.calledWith({ matricula: alunoParaCriar.matricula })).to.be.true;
});

test.serial('post(): deve responder mensagem para aluno já criado', async () => {
  const req = { body: aluno() };
  const res = { send: sinon.spy() };
  res.status = sandbox.stub().returns(res);

  const erro = new Error();
  erro.code = 'ER_DUP_ENTRY';
  const criar = sandbox.stub(AlunoService, 'criar').throws(erro);
  const obter = sandbox.stub(AlunoService, 'obter').resolves(aluno());

  await AlunoController.post(req, res);

  expect(criar.calledWith(req.body)).to.be.true;
  expect(obter.calledWith(req.body.matricula)).to.be.true;
  expect(res.status.calledWith(400)).to.be.true;
  expect(res.send.calledWith({ mensagem: sinon.match.string })).to.be.true;
});

test.serial('post(): deve reativar conta aluno', async () => {
  const req = { body: aluno() };
  const res = { send: sinon.spy() };

  const erro = new Error();
  erro.code = 'ER_DUP_ENTRY';
  const criar = sandbox.stub(AlunoService, 'criar').throws(erro);
  const obter = sandbox.stub(AlunoService, 'obter').resolves(undefined);
  const editar = sandbox.stub(AlunoService, 'editar').resolves(1);

  await AlunoController.post(req, res);

  expect(criar.calledWith(req.body)).to.be.true;
  expect(obter.calledWith(req.body.matricula)).to.be.true;
  expect(editar.calledWith(req.body.matricula, { deleted_at: null })).to.be.true;
  expect(res.send.calledWith({ matricula: req.body.matricula })).to.be.true;
});

test.serial('post(): deve responder mensagem caso não consiga reativar aluno', async () => {
  const req = { body: aluno() };
  const res = { send: sinon.spy() };
  res.status = sandbox.stub().returns(res);

  const erro = new Error();
  erro.code = 'ER_DUP_ENTRY';
  const criar = sandbox.stub(AlunoService, 'criar').throws(erro);
  const obter = sandbox.stub(AlunoService, 'obter').resolves(undefined);
  const editar = sandbox.stub(AlunoService, 'editar').resolves(0);

  await AlunoController.post(req, res);

  expect(criar.calledWith(req.body)).to.be.true;
  expect(obter.calledWith(req.body.matricula)).to.be.true;
  expect(editar.calledWith(req.body.matricula, { deleted_at: null })).to.be.true;
  expect(res.status.calledWith(400)).to.be.true;
  expect(res.send.calledWith({ mensagem: sinon.match.string })).to.be.true;
});

test.serial('post(): deve responder mensagem de erro', async () => {
  const req = { body: aluno() };
  const res = { send: sinon.spy() };
  
  const criar = sandbox.stub(AlunoService, 'criar').throws();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await AlunoController.post(req, res);

  expect(criar.calledWith(req.body)).to.be.true;
  expect(loggerThrow.calledWith(res, '2365958507', sinon.match.instanceOf(Error))).to.be.true;
});

test.serial('put(): deve responder com mensagem para aluno não contrado', async () => {
  const req = { params: { matricula: 20142850076 }, body: 'teste fake de body' };
  const res = { send: sinon.spy() };

  const editar = sandbox.stub(AlunoService, 'editar').resolves(0);

  await AlunoController.put(req, res);

  expect(editar.calledWith(req.params.matricula, req.body)).to.be.true;
  expect(res.send.calledWith({ mensagem: sinon.match.string })).to.be.true;
});

test.serial('put(): deve responder status 204 para aluno editado', async () => {
  const req = { params: { matricula: 20142850076 }, body: 'teste fake de body' };
  const res = { sendStatus: sinon.spy() };

  const editar = sandbox.stub(AlunoService, 'editar').resolves(1);

  await AlunoController.put(req, res);

  expect(editar.calledWith(req.params.matricula, req.body)).to.be.true;
  expect(res.sendStatus.calledWith(204)).to.be.true;
});

test.serial('put(): deve responder mensagem de erro', async () => {
  const req = { params: { matricula: 20142850076 }, body: 'teste fake de body' };
  const res = { send: sinon.spy() };
  
  const editar = sandbox.stub(AlunoService, 'editar').throws();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await AlunoController.put(req, res);

  expect(editar.calledWith(req.params.matricula, req.body)).to.be.true;
  expect(loggerThrow.calledWith(res, '5768905470', sinon.match.instanceOf(Error))).to.be.true;
});

test.serial('delete(): deve responder com mensagem para aluno não contrado', async () => {
  const req = { params: { matricula: 20142850076 } };
  const res = { send: sinon.spy() };

  const excluir = sandbox.stub(AlunoService, 'excluir').resolves(0);

  await AlunoController.delete(req, res);

  expect(excluir.calledWith(req.params.matricula)).to.be.true;
  expect(res.send.calledWith({ mensagem: sinon.match.string })).to.be.true;
});

test.serial('delete(): deve responder status 204 para aluno excluído', async () => {
  const req = { params: { matricula: 20142850076 } };
  const res = { sendStatus: sinon.spy() };

  const excluir = sandbox.stub(AlunoService, 'excluir').resolves(1);

  await AlunoController.delete(req, res);

  expect(excluir.calledWith(req.params.matricula)).to.be.true;
  expect(res.sendStatus.calledWith(204)).to.be.true;
});

test.serial('delete(): deve responder mensagem de erro', async () => {
  const req = { params: { matricula: 20142850076 } };
  const res = { send: sinon.spy() };
  
  const excluir = sandbox.stub(AlunoService, 'excluir').throws();
  const loggerThrow = sandbox.stub(Logger, 'throw');

  await AlunoController.delete(req, res);

  expect(excluir.calledWith(req.params.matricula)).to.be.true;
  expect(loggerThrow.calledWith(res, '5768905476', sinon.match.instanceOf(Error))).to.be.true;
});