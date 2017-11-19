// .env lib
require('dotenv').config();

// Bibliotecas
const { test } = require('ava');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const _ = require('lodash');

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const MidiaModel = require('../../src/models/MidiaModel');
const FilmeModel = require('../../src/models/FilmeModel');
const LivroModel = require('../../src/models/LivroModel');

// Helpers
const { isMidiaModelValida } = require('../../src/helpers/Validator');

// Setup
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
  } else {
    await FilmeModel.criar({
      midia_id: midiaId,
      sinopse: 'Sinopse do Filme',
      diretor: 'Diretor do Livro',
      duracao: 'Duracao do Livro',
    });
  }

  return midiaId;
};


/**
 * Testes de Integração
 */

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

test.serial('listar(): Deve retornar lista vazia de midias', async () => {
  const midias = await MidiaModel.listar();

  expect(midias).to.be.an('array').that.is.empty;
});

test.serial('listar(): deve retornar lista com midias', async () => {
  await criarMidia('filme');
  await criarMidia('livro');

  const midias = await MidiaModel.listar();

  expect(midias).to.be.an('array').that.has.lengthOf(2);
  midias.forEach((midia) => {
    expect(isMidiaModelValida(midia)).to.be.true;
  });
});

test.serial('obter(): deve retornar "undefined" para midia não encontrada', async () => {
  const midia = await MidiaModel.obter(1);

  expect(midia).to.be.undefined;
});

test.serial('obter(): deve retornar midia', async () => {
  const midaId = await criarMidia('filme');
  const midia = await MidiaModel.obter(midaId);

  expect(midia).to.be.an('object');
  expect(isMidiaModelValida(midia)).to.be.true; 
});

test.serial('obter(): deve retornar null em todos os campos do livro para midia do tipo filme', async () => {
  const midaId = await criarMidia('filme');
  const midia = await MidiaModel.obter(midaId);

  expect(_.every(midia.livro, _.isNull)).to.be.true;
});

test.serial('obter(): deve retornar null em todos os campos do filme para midia do tipo livro', async () => {
  const midaId = await criarMidia('livro');
  const midia = await MidiaModel.obter(midaId);

  expect(_.every(midia.filme, _.isNull)).to.be.true;
});

test.serial('criar(): deve criar uma midia retornando-o seu id', async () => {
  const resultado = await MidiaModel.criar({
    titulo: 'Titulo',
    capa: 'Capa',
  });

  expect(resultado).to.be.an('array').that.has.lengthOf(1);
});

test.serial('criar(): deve criar uma midia retornando-o seu id', async () => {
  const objetoInvalido = {
    objeto: 'invalido',
  };

  expect(MidiaModel.criar(objetoInvalido)).to.be.rejectedWith(Error);
});

test.serial('editar(): Deve retornar 1 para edição feita', async () => {
  const midiaId = await criarMidia('livro');

  const dadosParaAlterar = {
    titulo: 'Titulo trocado',
    capa: 'Capa Trocada',
  };

  const resultado = await MidiaModel.editar(midiaId, dadosParaAlterar);

  expect(resultado).to.be.a('number').that.is.equal(1);
});

test.serial('editar(): deve retornar 0 para uma edição mal sucedida', async () => {
  const dadosParaAlterar = {
    titulo: 'Titulo trocado',
    capa: 'Capa Trocada',
  };

  const resultado = await MidiaModel.editar(1, dadosParaAlterar);

  expect(resultado).to.be.a('number').that.is.equal(0);
});

test.serial('editar(): Deve editar a midia', async () => {
  const midiaId = await criarMidia('livro');

  const dadosParaAlterar = {
    titulo: 'Titulo trocado',
    capa: 'Capa Trocada',
  };

  await MidiaModel.editar(midiaId, dadosParaAlterar);

  const midia = await MidiaModel.obter(midiaId);

  const midiaModificada = midia.midia;

  expect(midiaModificada.titulo).to.equal(dadosParaAlterar.titulo);
  expect(midiaModificada.capa).to.equal(dadosParaAlterar.capa);
});

test.serial('excluir(): Deve retornar 1 para midia excluida', async () => {
  const midiaId = await criarMidia('livro');

  const resultado = await MidiaModel.excluir(midiaId);

  expect(resultado).to.be.a('number').that.is.equal(1);
});

test.serial('excluir(): Deve retornar 0 ao excluir midia inexistente', async () => {
  const resultado = await MidiaModel.excluir(113);

  expect(resultado).to.be.a('number').that.is.equal(0);
});

test.serial('cleanup(): Deve lançar erro se limpar tabela antes das tabelas de livro e filme', async () => {
  await criarMidia('livro');
  await criarMidia('filme');
  await criarMidia('livro');

  expect(MidiaModel.cleanup()).to.be.rejectedWith(Error);
});

test.serial('cleanup(): Deve limpar a base de alunos', async () => {
  await criarMidia('livro');
  await criarMidia('filme');
  await criarMidia('livro');

  const midias = await MidiaModel.listar();

  expect(midias).to.have.lengthOf(3);

  await LivroModel.cleanup();
  await FilmeModel.cleanup();
  await MidiaModel.cleanup();

  const midiasDepoisCleanup = await MidiaModel.listar();

  expect(midiasDepoisCleanup).to.be.empty;
});