// .env lib
require('dotenv').config();

// Bibliotecas
const { test } = require('ava');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const AlunoModel = require('../../src/models/AlunoModel');
const AlunoService = require('../../src/services/AlunoService');

// Helpers
const { isAlunoValido } = require('../../src/helpers/Validator');

// Setup
function criarAluno(matricula) {
  const payloadAluno = {
    matricula,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  return AlunoService.criar(payloadAluno);
}


/**
 * Testes de Integração
 */

test.serial('listar(): Deve retornar lista vazia de alunos', async () => {
  // executar função principal
  const alunos = await AlunoModel.listar();

  // certificar comportamento esperado
  expect(alunos).to.be.an('array').that.is.empty;
});

test.serial('listar(): Deve listar alunos do banco', async () => {
  // antes do teste
  await criarAluno(20142850076);
  await criarAluno(20142850077);
  await criarAluno(20142850078);

  // executar função principal
  const alunos = await AlunoModel.listar();

  // certificar comportamento esperado
  expect(alunos).to.be.an('array');
  alunos.forEach((aluno) => {
    expect(isAlunoValido(aluno)).to.be.true;
  });
});

test.serial('obter(): Deve retornar um aluno', async () => {
  // antes do teste
  const matricula = await criarAluno(20142850076);

  // executar função principal
  const aluno = await AlunoModel.obter(matricula);

  // certificar comportamento esperado
  expect(isAlunoValido(aluno)).to.be.true;
});

test.serial('obter(): Deve retornar "undefined" para aluno não encontado', async () => {
  // executar função principal
  const aluno = await AlunoModel.obter(105);

  // certificar comportamento esperado
  expect(aluno).to.be.undefined;
});

test.serial('obterExcluido(): Deve retornar aluno que foi excluído', async () => {
  // antes do teste
  const matricula = await criarAluno(20142850076);
  await AlunoService.excluir(matricula);

  // executar função principal
  const aluno = await AlunoModel.obterExcluido(matricula);

  // certificar comportamento esperado
  expect(Number(aluno.matricula)).to.equal(matricula);
  expect(isAlunoValido(aluno)).to.be.true;
});

test.serial('obterExcluido(): Deve retornar "undefined" para aluno não encontado', async () => {
  // executar função principal
  const aluno = await AlunoModel.obterExcluido(20142850076);

  // certificar comportamento esperado
  expect(aluno).to.be.undefined;
});

test.serial('criar(): Deve persistir um aluno no banco', async () => {
  const aluno = {
    matricula: 108,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  // executar função principal
  const resultado = await AlunoModel.criar(aluno);

  // certificar comportamento esperado
  expect(resultado).to.be.an('array').that.have.lengthOf(1);
  expect(resultado[0]).to.equal(aluno.matricula);
});

test.serial('editar(): Deve retornar 1 para edição feita', async () => {
  // antes do teste
  const matricula = await criarAluno(20142850076);

  const dadosParaAlterar = {
    nome: 'Nome trocado',
    curso: 'Curso Trocado',
  };

  // executar função principal
  const resultado = await AlunoModel.editar(matricula, dadosParaAlterar);

  // certificar comportamento esperado
  expect(resultado).to.be.a('number').that.is.equal(1);
});

test.serial('editar(): deve retornar 0 para uma edição mal sucedida', async () => {
  const dadosParaAlterar = {
    nome: 'Nome trocado',
    curso: 'Curso Trocado',
  };

  // executar função principal
  const resultado = await AlunoModel.editar(110, dadosParaAlterar);

  // certificar comportamento esperado
  expect(resultado).to.be.a('number').that.is.equal(0);
});

test.serial('editar(): Deve editar o aluno', async () => {
  // antes do teste
  const matricula = await criarAluno(20142850076);

  const dadosParaAlterar = {
    nome: 'Nome trocado',
    curso: 'Curso Trocado',
  };

  // executar função principal
  await AlunoModel.editar(matricula, dadosParaAlterar);

  const alunoModificado = await AlunoService.obter(matricula);

  // certificar comportamento esperado
  expect(alunoModificado.nome).to.equal(dadosParaAlterar.nome);
  expect(alunoModificado.curso).to.equal(dadosParaAlterar.curso);
});

test.serial('excluir(): Deve retornar 1 para aluno excluido', async () => {
  // antes do teste
  const matricula = await criarAluno(20142850076);

  // executar função principal
  const resultado = await AlunoModel.excluir(matricula);

  // certificar comportamento esperado
  expect(resultado).to.be.a('number').that.is.equal(1);

});

test.serial('excluir(): Deve retornar 0 ao tentar excluir aluno inexistente', async () => {
  // executar função principal
  const resultado = await AlunoModel.excluir(113);

  // certificar comportamento esperado
  expect(resultado).to.be.a('number').that.is.equal(0);
});

test.serial('excluir(): Deve garantir que aluno seja listado entre excluidos', async () => {
  // antes do teste
  const matricula = await criarAluno(20142850076);

  // executar função principal
  await AlunoModel.excluir(matricula);

  const alunoExcluido = await AlunoModel.obterExcluido(matricula);

  // certificar comportamento esperado
  expect(alunoExcluido).to.be.an('object');
  expect(alunoExcluido.matricula).to.be.a('string').that.is.equal(String(matricula));
});

test.serial('cleanup(): Deve limpar a base de alunos', async () => {
  // antes do teste
  await criarAluno(20142850076);
  await criarAluno(20142850077);
  await criarAluno(20142850078);

  const alunos = await AlunoModel.listar();

  expect(alunos).to.have.lengthOf(3);

  // executar função principal
  await AlunoModel.cleanup();

  const alunosDepoisCleanup = await AlunoModel.listar();

  // certificar comportamento esperado
  expect(alunosDepoisCleanup).to.be.empty;
});

test.afterEach.always('guaranteed cleanup', async () => {
  await AlunoModel.cleanup();
});
