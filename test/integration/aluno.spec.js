// .env lib
require('dotenv').config();

const { test } = require('ava');
const { expect } = require('chai');
const request = require('supertest');

// Dependencias
const AlunoModel = require('../../src/models/AlunoModel');

const app = require('../../src/app');

const criarAluno = (matricula) => {
  const aluno = {
    matricula,
    nome: 'Aluno de Teste',
    curso: 'Curso de Teste',
  };

  return AlunoModel.criar(aluno);
}

test.afterEach.always(async () => {
  await AlunoModel.cleanup();
});

test.serial('GET /aluno - deve responder com lista vazia', async () => {
  const { body } = await request(app).get('/aluno');

  expect(body).to.be.an('object').that.has.property('alunos').that.is.an('array').that.is.empty;
});

test.serial('GET /aluno - deve responder com lista de alunos', async () => {
  await criarAluno(20142850076);
  await criarAluno(20142850077);
  await criarAluno(20142850078);

  const { body } = await request(app).get('/aluno');

  expect(body).to.be.an('object').that.has.property('alunos').that.is.an('array').that.has.lengthOf(3);
});

test.serial('GET /aluno/{matricula} - deve responder com mensagem para aluno não encontrado', async () => {
  const matricula = 20142850076;

  const { body } = await request(app).get(`/aluno/${matricula}`);

  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('GET /aluno/{matricula} - deve responder com aluno', async () => {
  const matricula = 20142850076;
  await criarAluno(matricula);

  const { body } = await request(app).get(`/aluno/${matricula}`);

  expect(body).to.be.an('object').that.has.property('aluno').that.is.an('object');
});

test.serial('POST /aluno - deve responder com matricula do aluno criado', async () => {
  const aluno = {
    matricula: 20142850076,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  const { body } = await request(app).post('/aluno').send(aluno);

  expect(body).to.be.an('object').that.has.property('matricula').that.is.a('number');
});

test.serial('POST /aluno - deve responder com mensagem de aluno já registrado', async () => {
  const matricula = 20142850076;
  const aluno = {
    matricula,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  await criarAluno(matricula);

  const { body } = await request(app).post('/aluno').send(aluno);

  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial.skip('POST /aluno - deve reativar conta de aluno excluido', async () => {
  const matricula = 20142850076;
  const aluno = {
    matricula,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  await criarAluno(matricula);
  AlunoModel.excluir(matricula);

  const { body } = await request(app).post('/aluno').send(aluno);

  expect(body).to.be.an('object').that.has.property('matricula').that.is.a('number');
});

test.serial('put(): deve retornar status 204 para aluno editado', async () => {
  const matricula = 20142850076;
  const aluno = {
    nome: 'Victor do Carmo',
  };

  await criarAluno(matricula);

  await request(app)
    .put(`/aluno/${matricula}`)
    .send(aluno)
    .expect(204);
});

test.serial('put(): deve retornar mensagem para aluno não encontrado', async () => {
  const matricula = 20142850076;
  const aluno = {
    nome: 'Victor do Carmo',
  };

  const { body } = await request(app)
    .put(`/aluno/${matricula}`)
    .send(aluno);


  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('delete(): deve retornar mensagem para aluno não encontrado', async () => {
  const matricula = 20142850076;

  const { body } = await request(app)
    .delete(`/aluno/${matricula}`)
    .expect(200);

  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('delete(): deve retornar status 204 para aluno excluido', async () => {
  const matricula = 20142850076;

  await criarAluno(matricula);

  await request(app)
    .delete(`/aluno/${matricula}`)
    .expect(204);
});
