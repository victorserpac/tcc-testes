/* eslint-disable */
// .env lib
require('dotenv').config();

// Bibliotecas
const { test } = require('ava');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const AlunoService = require('../../src/services/AlunoService');
const AlunoModel = require('../../src/models/AlunoModel');

// Helpers
const { isAlunoValido } = require('../../src/helpers/Validator');

const criarAluno = matricula => AlunoService.criar({
  matricula,
  nome: 'Victor Serpa do Carmo',
  curso: 'TSI',
});

test.afterEach.always(async () => {
  await AlunoModel.cleanup();
});

test.serial('listar(): deve retornar uma lista vazia de alunos', async () => {
  const alunos = await AlunoService.listar();

  expect(alunos).to.be.an('array').that.is.empty;
});

test.serial('listar(): deve retornar uma lista de alunos', async () => {
  await criarAluno(20142850076);
  await criarAluno(20142850077);
  await criarAluno(20142850078);

  const alunos = await AlunoService.listar();

  expect(alunos).to.be.an('array');

  alunos.forEach((aluno) => {
    expect(isAlunoValido(aluno)).to.be.true;
  });
});

test.serial('obter(): deve retornar "undefined" para aluno não encontrado', async () => {
  const aluno = await AlunoService.obter(20142850076);

  expect(aluno).to.be.undefined;
});

test.serial('obter(): deve retornar um aluno', async () => {
  const matricula = await criarAluno(20142850076);

  const aluno = await AlunoService.obter(matricula);

  expect(isAlunoValido(aluno)).to.be.true;
});

test.serial('criar(): deve criar um aluno', async () => {
  const payloadAluno = {
    matricula: 20142850076,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  const matricula = await AlunoService.criar(payloadAluno);

  expect(matricula).to.be.a('number').that.is.equal(payloadAluno.matricula);
});

test.serial('criar(): deve retornar erro para aluno já criado', async () => {
  const matricula = await criarAluno(20142850076);
  const payloadAluno = {
    matricula,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  expect(AlunoService.criar(payloadAluno)).to.be.rejected;
});

test.serial('editar(): deve retornar "true" para aluno editado', async () => {
  const matricula = await criarAluno(20142850076);

  const dadosParaEditar = {
    nome: 'Milene Vieira Lacerda',
    curso: 'ASD',
  };

  const edicao = await AlunoService.editar(matricula, dadosParaEditar);
  const aluno = await AlunoService.obter(matricula);

  expect(edicao).to.be.true;
  expect(aluno.nome).to.equal(dadosParaEditar.nome);
  expect(aluno.curso).to.equal(dadosParaEditar.curso);
});

test.serial('editar(): deve garantir que aluno foi editado', async () => {
  const matricula = await criarAluno(20142850076);

  const dadosParaEditar = {
    nome: 'Milene Vieira Lacerda',
    curso: 'ASD',
  };

  await AlunoService.editar(matricula, dadosParaEditar);
  const aluno = await AlunoService.obter(matricula);

  expect(aluno.nome).to.equal(dadosParaEditar.nome);
  expect(aluno.curso).to.equal(dadosParaEditar.curso);
});

test.serial('editar(): deve retornar "false" por tentar editar aluno inexistente', async () => {
  const matricula = 20142850076;
  const dadosParaEditar = {
    nome: 'Milene Vieira Lacerda',
    curso: 'ASD',
  };

  const edicao = await AlunoService.editar(matricula, dadosParaEditar);

  expect(edicao).to.be.false;
});

test.serial('editar(): deve retornar erro para edicao mal feita', async () => {
  const matricula = await criarAluno(20142850076);

  const dadosParaEditar = {
    teste: 'asd',
  };

  expect(AlunoService.editar(matricula, dadosParaEditar)).to.be.rejected;
});

test.serial('excluir(): deve retornar "true" para exclusao com sucesso', async () => {
  const matricula = await criarAluno(20142850076);

  const exclusao = await AlunoService.excluir(matricula);

  expect(exclusao).to.be.true;
});

test.serial('excluir(): deve retornar "false" por excluir aluno já excluido', async () => {
  const matricula = await criarAluno(20142850076);

  await AlunoService.excluir(matricula);
  const exclusao = await AlunoService.excluir(matricula);

  expect(exclusao).to.be.false;
});

test.serial('excluir(): deve retornar "false" por excluir aluno não cadastrado', async () => {
  const exclusao = await AlunoService.excluir(20142850076);

  expect(exclusao).to.be.false;
});

test.serial('excluir(): deve lançar erro por exclusao mau feita', async () => {
  const matricula = "asd";

  expect(AlunoService.excluir(matricula)).to.be.rejected;
});