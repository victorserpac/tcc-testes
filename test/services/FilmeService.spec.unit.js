/* eslint-disable */
const { test } = require('ava');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// .env lib
require('dotenv').config();

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const FilmeService = require('../../src/services/FilmeService');
const FilmeModel = require('../../src/models/FilmeModel');
const MidiaService = require('../../src/services/MidiaService');

// Helpers
const { isMidiaValida } = require('../../src/helpers/Validator');

const filme = () => ({
  id: 1178,
  titulo: 'Titulo',
  capa: 'Capa',
  sinopse: 'Sinopse',
  diretor: 'Diretor',
  duracao: 'Duracao',
  created_at: '2017-11-20 23:50:44',
});

let sandbox;

test.beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

test.afterEach.always(() => {
  sandbox.restore();
});

test('listar(): deve retornar lista vazia', async () => {
  const filmes = [];
  const listar = sandbox.stub(FilmeModel, 'listar').resolves(filmes);
  const resposta = await FilmeService.listar();

  expect(listar.called).to.be.true;
  expect(resposta).to.be.an('array').that.is.empty;
});

test('listar(): deve retornar lista de filmes', async () => {
  const filmes = [
    filme(),
    filme(),
    filme(),
  ];

  const listar = sandbox.stub(FilmeModel, 'listar').resolves(filmes);
  const resposta = await FilmeService.listar();

  expect(listar.called).to.be.true;
  expect(resposta).to.be.an('array').that.has.lengthOf(3);
});

test('listar(): deve lançar um erro', async () => {
  const listar = sandbox.stub(FilmeModel, 'listar').throws();

  expect(FilmeService.listar()).to.be.rejected;
  expect(listar.called).to.be.true;
});

test('obter(): deve retornar uma filme', async () => {
  const midiaId = 1178;
  const obter = sandbox.stub(FilmeModel, 'obter').resolves(filme());

  const resposta = await FilmeService.obter(midiaId);

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(resposta).to.be.an('object');
});

test('obter(): deve retornar "undefined" para filme não encontrada', async () => {
  const midiaId = 1178;
  const obter = sandbox.stub(FilmeModel, 'obter').resolves(undefined);

  const resposta = await FilmeService.obter(midiaId);

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(resposta).to.be.undefined;
});

test('obter(): deve lançar um erro', async () => {
  const midiaId = 1178;
  const obter = sandbox.stub(FilmeModel, 'obter').throws();

  expect(FilmeService.obter(midiaId)).to.be.rejected;
  expect(obter.calledWith(midiaId)).to.be.true;
});

test('criar(): deve criar filme e midia', async () => {
  const midiaIdFake = 1178;
  const criarFilme = sandbox.stub(FilmeModel, 'criar').resolves();
  const criarMidia = sandbox.stub(MidiaService, 'criar').resolves(midiaIdFake);

  const dadosParaCriar = {
    titulo: 'Titulo',
    capa: 'Capa',
    sinopse: 'Sinopse',
    diretor: 'Diretor',
    duracao: 'Duracao',
  };

  const assertMidia = {
    titulo: dadosParaCriar.titulo,
    capa: dadosParaCriar.capa,
  };

  const assertFilme = {
    midia_id: midiaIdFake,
    sinopse: dadosParaCriar.sinopse,
    diretor: dadosParaCriar.diretor,
    duracao: dadosParaCriar.duracao,
  };

  const midiaId = await FilmeService.criar(dadosParaCriar);

  expect(criarMidia.calledWith(assertMidia)).to.be.true;
  expect(criarFilme.calledWith(assertFilme)).to.be.true;
  expect(midiaId).to.equal(midiaIdFake);
});

test('criar(): deve lançar erro no MidiaService', async () => {
  const dadosParaCriar = {
    titulo: 'Titulo',
    capa: 'Capa',
    sinopse: 'Sinopse',
    diretor: 'Diretor',
    duracao: 'Duracao',
  };

  const criarMidia = sandbox.stub(MidiaService, 'criar').throws();
  const criarFilme = sandbox.stub(FilmeModel, 'criar').resolves();

  expect(FilmeService.criar(dadosParaCriar)).to.be.rejected;
  expect(criarMidia.called).to.be.true;
  expect(criarFilme.called).to.be.false;
});

test('criar(): deve lançar erro no FilmeModel', async () => {
  const dadosParaCriar = {
    titulo: 'Titulo',
    capa: 'Capa',
    sinopse: 'Sinopse',
    diretor: 'Diretor',
    duracao: 'Duracao',
  };

  const criarMidia = sandbox.stub(MidiaService, 'criar').resolves(1178);
  const criarFilme = sandbox.stub(FilmeModel, 'criar').throws();

  try {
    await FilmeService.criar(dadosParaCriar);
  } catch (error) {
    expect(error).to.be.an('error');
  }

  expect(criarMidia.called).to.be.true;
  expect(criarFilme.called).to.be.true;
});

test('editar(): deve retornar true para edição feita', async () => {
  const midiaId = 1178;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
    sinopse: 'Sinopse',
    diretor: 'Diretor',
    duracao: 'Duracao',
  };

  const assertFilme = {
    sinopse: dadosParaEditar.sinopse,
    diretor: dadosParaEditar.diretor,
    duracao: dadosParaEditar.duracao,
  };

  const assertMidia = {
    titulo: dadosParaEditar.titulo,
    capa: dadosParaEditar.capa,
  };

  const editarFilme = sandbox.stub(FilmeModel, 'editar').resolves(1);
  const editarMidia = sandbox.stub(MidiaService, 'editar').resolves(true);

  const edicao = await FilmeService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.true;
  expect(editarFilme.calledWith(midiaId, assertFilme)).to.be.true;
  expect(editarMidia.calledWith(midiaId, assertMidia)).to.be.true;
});

test('editar(): não deve chamar editar de FilmeModel', async () => {
  const midiaId = 1178;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
  };

  const editarFilme = sandbox.stub(FilmeModel, 'editar');
  const editarMidia = sandbox.stub(MidiaService, 'editar').resolves(true);

  const edicao = await FilmeService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.true;
  expect(editarFilme.called).to.be.false;
  expect(editarMidia.called).to.be.true;
});

test('editar(): não deve chamar editar de MidiaService', async () => {
  const midiaId = 1178;
  const dadosParaEditar = {
    sinopse: 'Sinopse',
    diretor: 'Diretor',
    duracao: 'Duracao',
  };

  const editarFilme = sandbox.stub(FilmeModel, 'editar').resolves(1);
  const editarMidia = sandbox.stub(MidiaService, 'editar');

  const edicao = await FilmeService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.true;
  expect(editarFilme.called).to.be.true;
  expect(editarMidia.called).to.be.false;
});

test('editar(): deve retornar "false" para problema na edição do FilmeModel', async () => {
  const midiaId = 1178;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
    sinopse: 'Sinopse',
    diretor: 'Diretor',
    duracao: 'Duracao',
  };

  const editarFilme = sandbox.stub(FilmeModel, 'editar').resolves(0);
  const editarMidia = sandbox.stub(MidiaService, 'editar');

  const edicao = await FilmeService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.false;
  expect(editarFilme.called).to.be.true;
  expect(editarMidia.called).to.be.false;
});

test('editar(): deve retornar "false" para problema na edição da MidiaService', async () => {
  const midiaId = 1178;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
    sinopse: 'Sinopse',
    diretor: 'Diretor',
    duracao: 'Duracao',
  };

  const editarFilme = sandbox.stub(FilmeModel, 'editar').resolves(1);
  const editarMidia = sandbox.stub(MidiaService, 'editar').resolves(false);

  const edicao = await FilmeService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.false;
  expect(editarFilme.called).to.be.true;
  expect(editarMidia.called).to.be.true;
});

test('editar(): deve rejeitar promise por problema em FilmeModel', async () => {
  const midiaId = 1178;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
    sinopse: 'Sinopse',
    diretor: 'Diretor',
    duracao: 'Duracao',
  };

  const editarFilme = sandbox.stub(FilmeModel, 'editar').throws();
  const editarMidia = sandbox.stub(MidiaService, 'editar');

  expect(FilmeService.editar(midiaId, dadosParaEditar)).to.be.rejected;
  expect(editarFilme.called).to.be.true;
  expect(editarMidia.called).to.be.false;
});

test('editar(): deve rejeitar promise por problema em MidiaService', async () => {
  const midiaId = 1178;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
    sinopse: 'Sinopse',
    diretor: 'Diretor',
    duracao: 'Duracao',
  };

  const editarFilme = sandbox.stub(FilmeModel, 'editar').resolves(1);
  const editarMidia = sandbox.stub(MidiaService, 'editar').throws();

  try {
    await FilmeService.editar(midiaId, dadosParaEditar)
  } catch (error) {
    expect(error).to.be.an('error');
  }

  expect(editarFilme.called).to.be.true;
  expect(editarMidia.called).to.be.true;
});

test('excluir(): deve retornar "true" ao excluir', async () => {
  const midiaId = 1178;
  const excluir = sandbox.stub(MidiaService, 'excluir').resolves(true);
  const exclusao = await FilmeService.excluir(midiaId);

  expect(exclusao).to.be.true;
  expect(excluir.calledWith(midiaId)).to.be.true;
});

test('excluir(): deve retornar "false" em erro ao exluir', async () => {
  const midiaId = 1178;
  const excluir = sandbox.stub(MidiaService, 'excluir').resolves(false);
  const exclusao = await FilmeService.excluir(midiaId);

  expect(exclusao).to.be.false;
  expect(excluir.calledWith(midiaId)).to.be.true;
});

test('excluir(): retornar rejeitar promise', async () => {
  const midiaId = 1178;
  const excluir = sandbox.stub(MidiaService, 'excluir').throws();

  expect(FilmeService.excluir(midiaId)).to.be.rejectedWith(Error);
  expect(excluir.calledWith(midiaId)).to.be.true;
});
