/* eslint-disable */
const { test } = require('ava');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const AlunoService = require('../../src/services/AlunoService');
const AlunoModel = require('../../src/models/AlunoModel');

const aluno = () => ({
  matricula: 20142850076,
  nome: 'Victor Serpa do Carmo',
  turma: 'TSI',
});

let sandbox;

test.beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

test.afterEach.always(() => {
  sandbox.restore();
});

test.serial('listar(): deve garantir que listar() de AlunoModel seja invocado', async () => {
  const listar = sandbox.stub(AlunoModel, 'listar');

  AlunoService.listar();

  expect(listar.called).to.be.true;
});

test.serial('obter(): deve garantir que obter() de AlunoModel seja invocado', async () => {
  const obter = sandbox.stub(AlunoModel, 'obter');

  AlunoService.obter();

  expect(obter.called).to.be.true;
});

test.serial('criar(): deve garantir que criar() de AlunoModel seja invocado com os dados passados', async () => {
  const dadosNovoAluno = aluno();

  const criar = sandbox.stub(AlunoModel, 'criar').resolves([dadosNovoAluno.matricula]);

  const matricula = await AlunoService.criar(dadosNovoAluno);

  expect(criar.calledWith(dadosNovoAluno)).to.be.true;
  expect(matricula).to.equal(dadosNovoAluno.matricula);
});

test.serial('criar(): deve rejeitar promise', async () => {
  const dadosNovoAluno = aluno();

  const criar = sandbox.stub(AlunoModel, 'criar').rejects();

  expect(AlunoService.criar(dadosNovoAluno)).to.be.rejected;
  expect(criar.calledWith(dadosNovoAluno)).to.be.true;
});

test.serial('editar(): deve garantir que editar() de AlunoModel seja invocado corretamente', async () => {
  const matricula = 20142850076;
  const dadosParaEditar = {
    nome: 'Milene Vieira Lacerda',
    curso: 'ASD',
  };

  const editar = sandbox.stub(AlunoModel, 'editar').resolves(1);

  const edicao = await AlunoService.editar(matricula, dadosParaEditar);

  expect(edicao).to.be.true;
  expect(editar.calledWith(matricula, dadosParaEditar)).to.be.true;
});

test.serial('editar(): deve garantir que editar() de AlunoModel seja invocado corretamente para edicao não realizada', async () => {
  const matricula = 20142850076;
  const dadosParaEditar = {
    nome: 'Milene Vieira Lacerda',
    curso: 'ASD',
  };

  const editar = sandbox.stub(AlunoModel, 'editar').resolves(0);

  const edicao = await AlunoService.editar(matricula, dadosParaEditar);

  expect(edicao).to.be.false;
  expect(editar.calledWith(matricula, dadosParaEditar)).to.be.true;
});

test.serial('editar(): deve garantir que editar() de AlunoModel lançe um erro', async () => {
  const matricula = 20142850076;
  const dadosParaEditar = {
    nome: 'Milene Vieira Lacerda',
    curso: 'ASD',
  };

  const editar = sandbox.stub(AlunoModel, 'editar').rejects();

  expect(AlunoService.editar(matricula, dadosParaEditar)).to.be.rejected;
  expect(editar.calledWith(matricula, dadosParaEditar)).to.be.true;
});

test.serial('excluir(): deve garantir que excluir() de AlunoModel seja invocado corretamente', async () => {
  const matricula = 20142850076;

  const excluir = sandbox.stub(AlunoModel, 'excluir').resolves(1);

  const exclusao = await AlunoService.excluir(matricula);

  expect(exclusao).to.be.true;
  expect(excluir.calledWith(matricula)).to.be.true;
});

test.serial('excluir(): deve garantir que editar() de AlunoModel seja invocado corretamente para edicao não realizada', async () => {
  const matricula = 20142850076;

  const excluir = sandbox.stub(AlunoModel, 'excluir').resolves(0);

  const exclusao = await AlunoService.excluir(matricula);

  expect(exclusao).to.be.false;
  expect(excluir.calledWith(matricula)).to.be.true;
});

test.serial('excluir(): deve garantir que editar() de AlunoModel lançe um erro', async () => {
  const matricula = 20142850076;

  const excluir = sandbox.stub(AlunoModel, 'excluir').rejects();

  expect(AlunoService.excluir(matricula)).to.be.rejected;
  expect(excluir.calledWith(matricula)).to.be.true;
});
