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

// Setups para o teste
const criarAluno = (matricula) => {
  const payloadAluno = {
    matricula,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  return AlunoService.criar(payloadAluno);
};

const criarAlunos = (matriculas) => {
  const promises = [];

  matriculas.forEach((matricula) => {
    promises.push(criarAluno(matricula));
  });

  return Promise.all(promises);
};

const excluirAluno = (matricula) => {
  return AlunoModel.hardDelete(matricula);
};

const excluirAlunos = (matriculas) => {
  const promises = [];

  matriculas.forEach((matricula) => {
    promises.push(excluirAluno(matricula));
  });

  return Promise.all(promises);
};


/**
 * Testes de Integração
 */

test('listar(): deve retornar uma lista vazia de alunos', async () => {
  // executar função principal
  const alunos = await AlunoService.listar();

  // certificar comportamento esperado
  expect(alunos).to.be.an('array');
  expect(alunos).to.be.empty;
});

test('listar(): deve retornar uma lista de alunos', async () => {
  // antes do teste
  const matriculasParaCriar = [1, 2, 3];
  const matriculas = await criarAlunos(matriculasParaCriar);

  // executar função principal
  const alunos = await AlunoService.listar();

  // certificar comportamento esperado
  expect(alunos).to.be.an('array');

  alunos.forEach((aluno) => {
    expect(aluno).to.have.property('matricula');
    expect(aluno).to.have.property('nome');
    expect(aluno).to.have.property('curso');
    expect(aluno).to.have.property('created_at');
    expect(aluno).to.not.have.property('updated_at');
    expect(aluno).to.not.have.property('deleted_at');
  });

  // depois do teste
  excluirAlunos(matriculas);
});

test('obter(): deve retornar "undefined" para aluno não encontrado', async () => {
  // executar função principal
  const aluno = await AlunoService.obter(4);

  expect(aluno).to.be.undefined;
});

test('obter(): deve retornar um aluno', async () => {
  // antes do teste
  const matricula = await criarAluno(5);

  // executar função principal
  const aluno = await AlunoService.obter(matricula);

  expect(aluno).to.have.property('matricula');
  expect(aluno).to.have.property('nome');
  expect(aluno).to.have.property('curso');
  expect(aluno).to.have.property('created_at');
  expect(aluno).to.not.have.property('updated_at');
  expect(aluno).to.not.have.property('deleted_at');

  await excluirAluno(matricula);
});

test('criar(): deve criar um aluno', async () => {
  const payloadAluno = {
    matricula: 6,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  // executar função principal
  const matricula = await AlunoService.criar(payloadAluno);

  expect(matricula).to.be.a('number');
  expect(matricula).to.equal(payloadAluno.matricula);

  await excluirAluno(matricula);
});

test('criar(): deve retornar erro para aluno já criado', async () => {
  const payloadAluno = {
    matricula: 7,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  // executar função principal
  const matricula = await AlunoService.criar(payloadAluno);

  expect(AlunoService.criar(payloadAluno)).to.be.rejected;

  await excluirAluno(matricula);
});

test('editar(): deve retornar "true" para aluno editado', async () => {
  // antes do teste
  const matricula = await criarAluno(8);

  const dadosParaEditar = {
    nome: 'Milene Vieira Lacerda',
    curso: 'ASD',
  };

  // executar função principal
  const edicao = await AlunoService.editar(matricula, dadosParaEditar);
  const aluno = await AlunoService.obter(matricula);

  expect(edicao).to.be.true;
  expect(aluno.nome).to.equal(dadosParaEditar.nome);
  expect(aluno.curso).to.equal(dadosParaEditar.curso);

  await excluirAluno(matricula);
});

test('editar(): deve retornar "false" por tentar editar aluno inexistente', async () => {
  // antes do teste
  const matricula = 9;
  const dadosParaEditar = {
    nome: 'Milene Vieira Lacerda',
    curso: 'ASD',
  };

  // executar função principal
  const edicao = await AlunoService.editar(matricula, dadosParaEditar);

  expect(edicao).to.be.false;
});

test('editar(): deve retornar erro para edicao mau feita', async () => {
  // antes do teste
  const matricula = await criarAluno(10);

  const dadosParaEditar = {
    teste: 'asd',
  };

  // executar função principal
  expect(AlunoService.editar(matricula, dadosParaEditar)).to.be.rejected;

  await excluirAluno(matricula);
});

test('excluir(): deve retornar "true" para exclusao com sucesso', async () => {
  // antes do teste
  const matricula = await criarAluno(11);

  // executar função principal
  const exclusao = await AlunoService.excluir(matricula);

  expect(exclusao).to.be.true;

  await excluirAluno(matricula);
});

test('excluir(): deve retornar "false" por excluir aluno já excluido', async () => {
  // antes do teste
  const matricula = await criarAluno(12);

  // executar função principal
  await AlunoService.excluir(matricula);
  const exclusao = await AlunoService.excluir(matricula);

  expect(exclusao).to.be.false;

  await excluirAluno(matricula);
});

test('excluir(): deve retornar "false" por excluir aluno não cadastrado', async () => {
  // antes do teste
  const matricula = 13;

  // executar função principal
  const exclusao = await AlunoService.excluir(matricula);

  expect(exclusao).to.be.false;
});

test('excluir(): deve lançar erro por exclusao mau feita', async () => {
  const matricula = "asd";

  // executar função principal
  expect(AlunoService.excluir(matricula)).to.be.rejected;
});
