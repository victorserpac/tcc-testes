// .env lib
require('dotenv').config();

const { test } = require('ava');
const { expect } = require('chai');
const request = require('supertest');

// Dependencias
const FilmeModel = require('../../src/models/FilmeModel');
const MidiaModel = require('../../src/models/MidiaModel');

const app = require('../../src/app');

const criarFilme = async () => {
  const midia = {
    titulo: 'Titulo',
    capa: 'Capa',
  };

  const midiaId = await MidiaModel.criar(midia);

  await FilmeModel.criar({
    midia_id: midiaId,
    sinopse: 'Sinopse do Filme',
    diretor: 'Diretor do Filme',
    duracao: 'Duracao do Filme',
  });

  return midiaId;
};

test.afterEach.always(async () => {
  await FilmeModel.cleanup();
  await MidiaModel.cleanup();
});

test.serial('GET /filme - deve responder com lista vazia', async () => {
  const { body } = await request(app)
    .get('/filme');

  expect(body).to.be.an('object').that.has.property('filmes').that.is.an('array').that.is.empty;
});

test.serial('GET /filme - deve responder com lista de filmes', async () => {
  await criarFilme();
  await criarFilme();
  await criarFilme();

  const { body } = await request(app)
    .get('/filme');

  expect(body).to.be.an('object').that.has.property('filmes').that.is.an('array').that.has.lengthOf(3);
});

test.serial('GET /filme/{midiaId} - deve responder com mensagem para filme não encontrado', async () => {
  const midiaId = 123;

  const { body } = await request(app)
    .get(`/filme/${midiaId}`);

  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('GET /filme/{midiaId} - deve responder com filme', async () => {
  const midiaId = await criarFilme();

  const { body } = await request(app)
    .get(`/filme/${midiaId}`);

  expect(body).to.be.an('object').that.has.property('filme').that.is.an('object');
});

test.serial('POST /filme - deve responder com midiaId do filme criado', async () => {
  const filme = {
    titulo: 'Titulo',
    capa: 'Capa',
    sinopse: 'Sinopse do Filme',
    diretor: 'Diretor do Filme',
    duracao: 'Duracao do Filme',
  };

  const { body } = await request(app)
    .post('/filme')
    .send(filme);

  expect(body).to.be.an('object').that.has.property('midiaId').that.is.a('number');
});

test.serial('PUT /filme/{midiaId} - deve retornar mensagem para filme não encontrado', async () => {
  const midiaId = 123;
  const filme = {
    titulo: 'Titulo para editar',
  };

  const { body } = await request(app)
    .put(`/filme/${midiaId}`)
    .send(filme);

  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('PUT /filme/{midiaId} - deve retornar status 204 para filme editado', async () => {
  const midiaId = await criarFilme();
  const filme = {
    titulo: 'Titulo para editar',
  };

  await request(app)
    .put(`/filme/${midiaId}`)
    .send(filme)
    .expect(204);
});

test.serial('DELETE /filme/{midiaId} - deve retornar mensagem para filme não encontrado', async () => {
  const midiaId = 123;

  const { body } = await request(app)
    .delete(`/filme/${midiaId}`)
    .expect(200);

  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('DELETE /filme/{midiaId} - deve retornar status 204 para filme excluido', async () => {
  const midiaId = await criarFilme();

  await request(app)
    .delete(`/filme/${midiaId}`)
    .expect(204);
});
