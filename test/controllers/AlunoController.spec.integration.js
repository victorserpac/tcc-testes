// .env lib
require('dotenv').config();

const { test } = require('ava');
const sinon = require('sinon');
const { expect } = require('chai');

// Dependencias
const AlunoController = require('../../src/controllers/AlunoController');
const AlunoService = require('../../src/services/AlunoService');
const AlunoModel = require('../../src/models/AlunoModel');

function criarAluno(matricula) {
  const payloadAluno = {
    matricula,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  return AlunoService.criar(payloadAluno);
}

test.afterEach.always(async () => {
  await AlunoModel.cleanup();
});

test.serial('list(): deve responder com lista vazia', async () => {
  const req = {};
  const res = { send: sinon.spy() };

  await AlunoController.list(req, res);

  const response = res.send.firstCall.args[0];

  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('alunos');
  expect(response.alunos).to.be.an('array').that.is.empty;
});

test.serial('list(): deve responder com lista de alunos', async () => {
  const req = {};
  const res = { send: sinon.spy() };

  await criarAluno(20142850076);
  await criarAluno(20142850077);
  await criarAluno(20142850078);

  await AlunoController.list(req, res);

  const response = res.send.firstCall.args[0];

  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('alunos').that.is.an('array').that.has.lengthOf(3);
});

test.serial('get(): deve responder com mensagem para aluno não encontrado', async () => {
  const req = { params: { matricula: '20142850076' } };
  const res = { send: sinon.spy() };

  await AlunoController.get(req, res);

  const response = res.send.firstCall.args[0];

  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('get(): deve responder com aluno', async () => {
  const req = { params: { matricula: '20142850076' } };
  const res = { send: sinon.spy() };

  await criarAluno(20142850076);

  await AlunoController.get(req, res);

  const response = res.send.firstCall.args[0];

  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('aluno').that.is.an('object');
});

test.serial('post(): deve responder com matricula do aluno criado', async () => {
  const aluno = {
    matricula: 20142850076,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };
  const req = { body: aluno };
  const res = { send: sinon.spy() };

  await AlunoController.post(req, res);

  const response = res.send.firstCall.args[0];

  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('matricula').that.is.a('number');
});

test.serial('post(): deve responder com mensagem de aluno já registrado', async () => {
  const matricula = 20142850076;
  const aluno = {
    matricula,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };
  const req = { body: aluno };
  const res = { send: sinon.spy() };
  res.status = sinon.stub().returns(res);

  await criarAluno(matricula);

  await AlunoController.post(req, res);

  const response = res.send.firstCall.args[0];

  expect(res.status.called).to.be.true;
  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('post(): deve reativar conta de aluno excluido', async () => {
  const matricula = 20142850076;
  const aluno = {
    matricula,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };
  const req = { body: aluno };
  const res = { send: sinon.spy() };
  res.status = sinon.stub().returns(res);

  await criarAluno(matricula);
  AlunoService.excluir(matricula);

  await AlunoController.post(req, res);

  const response = res.send.firstCall.args[0];

  expect(res.send.called).to.be.true;
  expect(response).to.be.an('object').that.has.property('matricula').that.is.a('number');
});

test.serial('put(): deve retornar status 204 para aluno editado', async () => {
  const matricula = 20142850076;
  const aluno = {
    nome: 'Victor do Carmo',
  };
  const req = { params: { matricula: String(matricula) }, body: aluno };
  const res = { sendStatus: sinon.spy() };

  await criarAluno(matricula);

  await AlunoController.put(req, res);

  expect(res.sendStatus.calledWith(204)).to.be.true;
});

test.serial('put(): deve retornar mensagem para aluno não encontrado', async () => {
  const matricula = 20142850076;
  const aluno = {
    nome: 'Victor do Carmo',
  };
  const req = { params: { matricula: String(matricula) }, body: aluno };
  const res = { send: sinon.spy() };

  await AlunoController.put(req, res);

  const response = res.send.firstCall.args[0];

  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('delete(): deve retornar status 204 para aluno excluido', async () => {
  const matricula = 20142850076;
  const req = { params: { matricula: String(matricula) } };
  const res = { sendStatus: sinon.spy() };

  await criarAluno(matricula);

  await AlunoController.delete(req, res);

  expect(res.sendStatus.calledWith(204)).to.be.true;
});

test.serial('delete(): deve retornar mensagem para aluno não encontrado', async () => {
  const req = { params: { matricula: '20142850076' } };
  const res = { send: sinon.spy() };

  await AlunoController.delete(req, res);

  const response = res.send.firstCall.args[0];

  expect(response).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});
