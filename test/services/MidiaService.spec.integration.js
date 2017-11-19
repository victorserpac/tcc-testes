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
const MidiaService = require('../../src/services/MidiaService');
const MidiaModel = require('../../src/models/MidiaModel');
const FilmeModel = require('../../src/models/FilmeModel');
const LivroModel = require('../../src/models/LivroModel');

// Helpers
const { isMidiaValida } = require('../../src/helpers/Validator');

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

test.beforeEach(async () => {
  await FilmeModel.cleanup();
  await LivroModel.cleanup();
  await MidiaModel.cleanup();
});

test.afterEach.always(async () => {
  await FilmeModel.cleanup();
  await LivroModel.cleanup();
  await MidiaModel.cleanup();
});

test.serial('listar(): deve retornar uma lista vazia de midias', async () => {
  const midias = await MidiaService.listar();

  expect(midias).to.be.an('array').that.is.empty;
});

test.serial('listar(): deve retornar uma lista de midias', async () => {
  await criarMidia('filme');
  await criarMidia('livro');
  await criarMidia('filme');

  const midias = await MidiaService.listar();

  expect(midias).to.be.an('array').that.has.lengthOf(3);

  midias.forEach((midia) => {
    expect(isMidiaValida(midia)).to.be.true;
  });
});

test.serial('obter(): deve retornar "undefined" para midia não encontrado', async () => {
  const midia = await MidiaService.obter(1);

  expect(midia).to.be.undefined;
});

test.serial('obter(): deve retornar um filme', async () => {
  const mediaId = await criarMidia('filme');

  const midia = await MidiaService.obter(mediaId);

  expect(isMidiaValida(midia)).to.be.true;
});

test.serial('obter(): deve retornar um livro', async () => {
  const mediaId = await criarMidia('livro');

  const midia = await MidiaService.obter(mediaId);

  expect(isMidiaValida(midia)).to.be.true;
});

test.serial('criar(): deve retornar id', async () => {
  const dados = {
    titulo: 'Titulo',
    capa: 'Capa',
  };

  const midiaId = await MidiaService.criar(dados);

  expect(midiaId).to.be.a('number');
});

test.serial('editar(): deve retornar "true" para midia editado', async () => {
  const midiaId = await criarMidia();

  const dadosParaEditar = {
    titulo: 'Titulo Editado',
    capa: 'Capa Editada',
  };

  const edicao = await MidiaService.editar(midiaId, dadosParaEditar);
  const midia = await MidiaService.obter(midiaId);

  expect(edicao).to.be.true;
});

test.serial('editar(): deve garantir que midia foi editado', async () => {
  const midiaId = await criarMidia();

  const dadosParaEditar = {
    titulo: 'Titulo Editado',
    capa: 'Capa Editada',
  };

  await MidiaService.editar(midiaId, dadosParaEditar);
  const midia = await MidiaService.obter(midiaId);

  expect(midia.titulo).to.equal(dadosParaEditar.titulo);
  expect(midia.capa).to.equal(dadosParaEditar.capa);
});

test.serial('editar(): deve retornar "false" por tentar editar midia inexistente', async () => {
  const dadosParaEditar = {
    titulo: 'Titulo Editado',
    capa: 'Capa Editada',
  };

  const edicao = await MidiaService.editar(1, dadosParaEditar);

  expect(edicao).to.be.false;
});

test.serial('editar(): deve retornar erro para edicao mal feita', async () => {
  const midiaId = await criarMidia();

  const dadosParaEditar = {
    teste: 'asd',
  };

  expect(MidiaService.editar(midiaId, dadosParaEditar)).to.be.rejectedWith(Error);
});

test.serial('excluir(): deve retornar "true" para exclusao com sucesso', async () => {
  const midiaId = await criarMidia();

  const exclusao = await MidiaService.excluir(midiaId);

  expect(exclusao).to.be.true;
});

test.serial('excluir(): deve retornar "false" por excluir midia já excluido', async () => {
  const midiaId = await criarMidia();

  await MidiaService.excluir(midiaId);
  const exclusao = await MidiaService.excluir(midiaId);

  expect(exclusao).to.be.false;
});

test.serial('excluir(): deve retornar "false" por excluir midia não cadastrado', async () => {
  const exclusao = await MidiaService.excluir(1);

  expect(exclusao).to.be.false;
});