const { test } = require('ava');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const AlunoService = require('../../src/services/AlunoService');
const AlunoModel = require('../../src/models/AlunoModel');

test.serial('listar(): deve garantir que listar() de AlunoModel seja invocado', async () => {
  const stub = sinon.stub(AlunoModel, 'listar');

  AlunoService.listar();

  expect(stub.called).to.be.true;

  stub.restore();
});

test.serial('obter(): deve garantir que obter() de AlunoModel seja invocado', async () => {
  const stub = sinon.stub(AlunoModel, 'obter');

  AlunoService.obter();

  expect(stub.called).to.be.true;

  stub.restore();
});

test.serial('criar(): deve garantir que criar() de AlunoModel seja invocado com os dados passados', async () => {
  const dadosNovoAluno = {
    matricula: 1,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  const stub = sinon.stub(AlunoModel, 'criar').resolves([dadosNovoAluno.matricula]);

  const matricula = await AlunoService.criar(dadosNovoAluno);

  expect(stub.called).to.be.true;
  expect(stub.calledWith(dadosNovoAluno)).to.be.true;
  expect(matricula).to.equal(dadosNovoAluno.matricula);

  stub.restore();
});

test.serial('criar(): deve rejeitar promise', async () => {
  const dadosNovoAluno = {
    matricula: 1,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };
  const error = new Error('Erro de teste');

  const stub = sinon.stub(AlunoModel, 'criar').rejects(error);
  const promise = AlunoService.criar(dadosNovoAluno);

  expect(promise).to.be.rejected;
  expect(stub.called).to.be.true;
  expect(stub.calledWith(dadosNovoAluno)).to.be.true;

  try {
    await promise;
  } catch (err) {
    expect(err).to.deep.equal(error);
  }

  stub.restore();
});

test.serial('editar(): deve garantir que editar() de AlunoModel seja invocado corretamente', async () => {
  const matricula = 1;
  const dadosParaEditar = {
    nome: 'Milene Vieira Lacerda',
    curso: 'ASD',
  };

  const stub = sinon.stub(AlunoModel, 'editar').resolves(1);

  const edicao = await AlunoService.editar(matricula, dadosParaEditar);

  expect(edicao).to.be.true;
  expect(stub.called).to.be.true;
  expect(stub.calledWith(matricula, dadosParaEditar)).to.be.true;

  stub.restore();
});

test.serial('editar(): deve garantir que editar() de AlunoModel seja invocado corretamente para edicao não realizada', async () => {
  const matricula = 1;
  const dadosParaEditar = {
    nome: 'Milene Vieira Lacerda',
    curso: 'ASD',
  };

  const stub = sinon.stub(AlunoModel, 'editar').resolves(0);

  const edicao = await AlunoService.editar(matricula, dadosParaEditar);

  expect(edicao).to.be.false;
  expect(stub.called).to.be.true;
  expect(stub.calledWith(matricula, dadosParaEditar)).to.be.true;

  stub.restore();
});

test.serial('editar(): deve garantir que editar() de AlunoModel lançe um erro', async () => {
  const matricula = 1;
  const dadosParaEditar = {
    nome: 'Milene Vieira Lacerda',
    curso: 'ASD',
  };

  const erro = new Error('erro de teste');

  const stub = sinon.stub(AlunoModel, 'editar').rejects(erro);

  const promise = AlunoService.editar(matricula, dadosParaEditar);

  expect(promise).to.be.rejected;
  expect(stub.called).to.be.true;
  expect(stub.calledWith(matricula, dadosParaEditar)).to.be.true;

  try {
    await promise;
  } catch (error) {
    expect(error).to.deep.equal(erro);
  }

  stub.restore();
});

test.serial('excluir(): deve garantir que excluir() de AlunoModel seja invocado corretamente', async () => {
  const matricula = 1;

  const stub = sinon.stub(AlunoModel, 'excluir').resolves(1);

  const exclusao = await AlunoService.excluir(matricula);

  expect(exclusao).to.be.true;
  expect(stub.called).to.be.true;
  expect(stub.calledWith(matricula)).to.be.true;

  stub.restore();
});

test.serial('excluir(): deve garantir que editar() de AlunoModel seja invocado corretamente para edicao não realizada', async () => {
  const matricula = 1;

  const stub = sinon.stub(AlunoModel, 'excluir').resolves(0);

  const exclusao = await AlunoService.excluir(matricula);

  expect(exclusao).to.be.false;
  expect(stub.called).to.be.true;
  expect(stub.calledWith(matricula)).to.be.true;

  stub.restore();
});

test.serial('excluir(): deve garantir que editar() de AlunoModel lançe um erro', async () => {
  const matricula = 1;
  const erro = new Error('erro de teste');
  const stub = sinon.stub(AlunoModel, 'excluir').rejects(erro);

  const promise = AlunoService.excluir(matricula);

  expect(promise).to.be.rejected;
  expect(stub.called).to.be.true;
  expect(stub.calledWith(matricula)).to.be.true;

  try {
    await promise;
  } catch (error) {
    expect(error).to.deep.equal(erro);
  }

  stub.restore();
});
