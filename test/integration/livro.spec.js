// .env lib
require('dotenv').config();

const { test } = require('ava');
const { expect } = require('chai');
const request = require('supertest');

// Dependencias
const LivroModel = require('../../src/models/LivroModel');
const MidiaModel = require('../../src/models/MidiaModel');

const app = require('../../src/app');

const criarLivro = async () => {
  const midia = {
    titulo: 'Titulo',
    capa: 'Capa',
  };

  const midiaId = await MidiaModel.criar(midia);

  await LivroModel.criar({
    midia_id: midiaId,
    autor: 'Autor do Livro',
    editora: 'Editora do Livro',
  });

  return midiaId;
};

test.afterEach.always(async () => {
  await LivroModel.cleanup();
  await MidiaModel.cleanup();
});

test.serial('GET /livro - deve responder com lista vazia', async () => {
  const { body } = await request(app)
    .get('/livro');

  expect(body).to.be.an('object').that.has.property('livros').that.is.an('array').that.is.empty;
});

test.serial('GET /livro - deve responder com lista de livros', async () => {
  await criarLivro();
  await criarLivro();
  await criarLivro();

  const { body } = await request(app)
    .get('/livro');

  expect(body).to.be.an('object').that.has.property('livros').that.is.an('array').that.has.lengthOf(3);
});

test.serial('GET /livro/{midiaId} - deve responder com mensagem para livro não encontrado', async () => {
  const midiaId = 123;

  const { body } = await request(app)
    .get(`/livro/${midiaId}`);

  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('GET /livro/{midiaId} - deve responder com livro', async () => {
  const midiaId = await criarLivro();

  const { body } = await request(app)
    .get(`/livro/${midiaId}`);

  expect(body).to.be.an('object').that.has.property('livro').that.is.an('object');
});

test.serial('POST /livro - deve responder com midiaId do livro criado', async () => {
  const livro = {
    titulo: 'Titulo',
    capa: 'Capa',
    autor: 'Autor do Livro',
    editora: 'Editora do Livro',
  };

  const { body } = await request(app)
    .post('/livro')
    .send(livro);

  expect(body).to.be.an('object').that.has.property('midiaId').that.is.a('number');
});

test.serial('PUT /livro/{midiaId} - deve retornar mensagem para livro não encontrado', async () => {
  const midiaId = 123;
  const livro = {
    titulo: 'Titulo para editar',
  };

  const { body } = await request(app)
    .put(`/livro/${midiaId}`)
    .send(livro);

  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('PUT /livro/{midiaId} - deve retornar status 204 para livro editado', async () => {
  const midiaId = await criarLivro();
  const livro = {
    titulo: 'Titulo para editar',
  };

  await request(app)
    .put(`/livro/${midiaId}`)
    .send(livro)
    .expect(204);
});


test.serial('PUT /livro/{midiaId} - deve retornar status 204 para livro editado', async () => {
  const midiaId = await criarLivro();
  const livro = {
    titulo: 'Titulo para editar',
    autor: 'Autor para editar',
  };

  await request(app)
    .put(`/livro/${midiaId}`)
    .send(livro)
    .expect(204);
});

test.serial('DELETE /livro/{midiaId} - deve retornar mensagem para livro não encontrado', async () => {
  const midiaId = 123;

  const { body } = await request(app)
    .delete(`/livro/${midiaId}`)
    .expect(200);

  expect(body).to.be.an('object').that.has.property('mensagem').that.is.a('string');
});

test.serial('DELETE /livro/{midiaId} - deve retornar status 204 para livro excluido', async () => {
  const midiaId = await criarLivro();

  await request(app)
    .delete(`/livro/${midiaId}`)
    .expect(204);
});
