// .env lib
require('dotenv').config();

const { test } = require('ava');
const { expect } = require('chai');
const request = require('supertest');

// Dependencias
const MidiaModel = require('../../src/models/MidiaModel');
const LivroModel = require('../../src/models/LivroModel');
const FilmeModel = require('../../src/models/FilmeModel');

const app = require('../../src/app');

const criarMidia = async (tipo) => {
  const midia = {
    titulo: 'Titulo',
    capa: 'Capa',
  };

  const midiaId = await MidiaModel.criar(midia);

  if (tipo === 'livro') {
    await LivroModel.criar({
      midia_id: midiaId,
      autor: 'Autor do livro',
      editora: 'Editora do Livro',
    });
  }
  if (tipo === 'filme') {
    await FilmeModel.criar({
      midia_id: midiaId,
      sinopse: 'Sinopse do Filme',
      diretor: 'Diretor do Livro',
      duracao: 'Duracao do Livro',
    });
  }

  return midiaId;
};

test.afterEach.always(async () => {
  await FilmeModel.cleanup();
  await LivroModel.cleanup();
  await MidiaModel.cleanup();
});

test.serial('GET /midia - deve responder com lista vazia', async () => {
  const { body } = await request(app).get('/midia');

  expect(body).to.be.an('object').that.has.property('midias').that.is.an('array').that.is.empty;
});

test.serial('GET /midia - deve responder com lista de midias', async () => {
  await criarMidia('livro');
  await criarMidia('filme');
  await criarMidia();

  const { body } = await request(app)
    .get('/midia');

  expect(body).to.be.an('object').that.has.property('midias').that.is.an('array').that.has.lengthOf(3);
});

test.serial('GET /midia/{midiaId} - deve responder com mensagem para midia não encontrado', async () => {
  const midiaId = 123;

  const { body } = await request(app)
    .get(`/midia/${midiaId}`);

  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('GET /midia/{midiaId} - deve responder com midia', async () => {
  const midiaId = await criarMidia('livro');

  const { body } = await request(app)
    .get(`/midia/${midiaId}`);


  expect(body).to.be.an('object').that.has.property('midia').that.is.an('object');
});

test.serial('DELETE /midia/{midiaId} - deve retornar mensagem para midia não encontrado', async () => {
  const midiaId = 123;

  const { body } = await request(app)
    .delete(`/midia/${midiaId}`)
    .expect(200);

  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('DELETE /midia/{midiaId} - deve retornar status 204 para midia excluido', async () => {
  const midiaId = await criarMidia('livro');

  await request(app)
    .delete(`/midia/${midiaId}`)
    .expect(204);
});
