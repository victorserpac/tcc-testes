// /* eslint-disable */
const { test } = require('ava');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const MidiaService = require('../../src/services/MidiaService');
const MidiaModel = require('../../src/models/MidiaModel');

// Helpers
const { isMidiaValida } = require('../../src/helpers/Validator');

const filme = () => ({
  midia: {
    id: 1,
    titulo: 'Titulo',
    capa: 'Capa',
    created_at: 'Data de Criação',
  },
  filme: {
    diretor: 'Diretor',
    sinopse: 'Sinopse',
    duracao: 'Duracao',
  },
  livro: {
    autor: null,
    editora: null,
  }
});

const livro = () => ({
  midia: {
    id: 1,
    titulo: 'Titulo',
    capa: 'Capa',
    created_at: 'Data de Criação',
  },
  filme: {
    diretor: null,
    sinopse: null,
    duracao: null,
  },
  livro: {
    autor: 'Autor',
    editora: 'Editora',
  }
});

const midia = () => ({
  titulo: 'Titulo',
  capa: 'Capa',
});

let sandbox;

test.beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

test.afterEach.always(() => {
  sandbox.restore();
});

test.serial('listar(): deve retornar lista de midias convertida', async () => {
  const midias = [
    filme(),
    livro(),
  ];

  const listar = sandbox.stub(MidiaModel, 'listar').returns(midias);
  const resposta = await MidiaService.listar();

  expect(listar.called).to.be.true;
  resposta.forEach((midiaReposta) => {
    expect(isMidiaValida(midiaReposta)).to.be.true;
  });
});

test.serial('listar(): deve retornar lista vazia de midias', async () => {
  const midias = [];
  const listar = sandbox.stub(MidiaModel, 'listar').returns(midias);
  const resposta = await MidiaService.listar();

  expect(listar.called).to.be.true;
  expect(resposta).to.be.an('array').that.is.empty;
});

test.serial('obter(): deve retornar uma midia convertida', async () => {
  const midiaId = 1;
  const obter = sandbox.stub(MidiaModel, 'obter').returns(filme());

  const resposta = await MidiaService.obter(midiaId);

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(isMidiaValida(resposta)).to.be.true;
});

test.serial('obter(): deve retornar "undefined" para midia não encontrada', async () => {
  const midiaId = 1;
  const obter = sandbox.stub(MidiaModel, 'obter').returns(undefined);

  const resposta = await MidiaService.obter(midiaId);

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(resposta).to.be.undefined;
});

test.serial('obter(): deve lançar erro', async () => {
  const midiaId = 1;
  const obter = sandbox.stub(MidiaModel, 'obter').throws('Error');


  expect(MidiaService.obter(midiaId)).to.be.rejectedWith(Error);
  expect(obter.calledWith(midiaId)).to.be.true;
});

test.serial('criar(): deve garantir que criar() de MidiaModel seja invocado com os dados passados', async () => {
  const midiaIdFake = 1;
  const dadosNovoMidia = midia();
  const criar = sandbox.stub(MidiaModel, 'criar').resolves([midiaIdFake]);

  const midiaId = await MidiaService.criar(dadosNovoMidia);

  expect(criar.calledWith(dadosNovoMidia)).to.be.true;
  expect(midiaId).to.equal(midiaIdFake);
});

test.serial('criar(): deve rejeitar promise', async () => {
  const dadosNovoMidia = midia();

  const criar = sandbox.stub(MidiaModel, 'criar').throws('Error');

  expect(MidiaService.criar(dadosNovoMidia)).to.be.rejectedWith(Error);
  expect(criar.calledWith(dadosNovoMidia)).to.be.true;
});

test.serial('editar(): deve retornar true para edição feita', async () => {
  const midiaId = 1;
  const dadosParaEditar = {
    titulo: 'Titulo para Editar',
    capa: 'Capa para editar',
  };

  const editar = sandbox.stub(MidiaModel, 'editar').resolves(1);
  const edicao = await MidiaService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.true;
  expect(editar.calledWith(midiaId, dadosParaEditar)).to.be.true;
});

test.serial('editar(): deve retornar "false" para edição não feita', async () => {
  const midiaId = 1;
  const dadosParaEditar = {
    titulo: 'Titulo para Editar',
    capa: 'Capa para editar',
  };

  const editar = sandbox.stub(MidiaModel, 'editar').resolves(0);
  const edicao = await MidiaService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.false;
  expect(editar.calledWith(midiaId, dadosParaEditar)).to.be.true;
});

test.serial('editar(): deve rejeitar promise', async () => {
  const midiaId = 1;
  const dadosParaEditar = {
    titulo: 'Titulo para Editar',
    capa: 'Capa para editar',
  };

  const editar = sandbox.stub(MidiaModel, 'editar').throws('Error');

  expect(MidiaService.editar(midiaId, dadosParaEditar)).to.be.rejectedWith(Error);
  expect(editar.calledWith(midiaId, dadosParaEditar)).to.be.true;
});

test.serial('excluir(): deve retornar "true" ao excluir', async () => {
  const midiaId = 1;
  const excluir = sandbox.stub(MidiaModel, 'excluir').resolves(1);
  const exclusao = await MidiaService.excluir(midiaId);

  expect(exclusao).to.be.true;
  expect(excluir.calledWith(midiaId)).to.be.true;
});

test.serial('excluir(): deve retornar "false" em erro ao exluir', async () => {
  const midiaId = 1;
  const excluir = sandbox.stub(MidiaModel, 'excluir').resolves(0);
  const exclusao = await MidiaService.excluir(midiaId);

  expect(exclusao).to.be.false;
  expect(excluir.calledWith(midiaId)).to.be.true;
});

test.serial('excluir(): retornar rejeitar promise', async () => {
  const midiaId = 1;
  const excluir = sandbox.stub(MidiaModel, 'excluir').throws('Error');

  expect(MidiaService.excluir(midiaId)).to.be.rejectedWith(Error);
  expect(excluir.calledWith(midiaId)).to.be.true;
});
