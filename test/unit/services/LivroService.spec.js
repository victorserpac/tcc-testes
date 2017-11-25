/* eslint-disable */
const { test } = require('ava');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const LivroService = require('../../../src/services/LivroService');
const LivroModel = require('../../../src/models/LivroModel');
const MidiaService = require('../../../src/services/MidiaService');

const livro = () => ({
  id: 1179,
  titulo: 'Titulo',
  capa: 'Capa',
  autor: 'Autor',
  editora: 'Editora',
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
  const livros = [];
  const listar = sandbox.stub(LivroModel, 'listar').resolves(livros);
  const resposta = await LivroService.listar();

  expect(listar.called).to.be.true;
  expect(resposta).to.be.an('array').that.is.empty;
});

test('listar(): deve retornar lista de livros', async () => {
  const livros = [
    livro(),
    livro(),
    livro(),
  ];

  const listar = sandbox.stub(LivroModel, 'listar').resolves(livros);
  const resposta = await LivroService.listar();

  expect(listar.called).to.be.true;
  expect(resposta).to.be.an('array').that.has.lengthOf(3);
});

test('listar(): deve lançar um erro', async () => {
  const listar = sandbox.stub(LivroModel, 'listar').rejects();

  expect(LivroService.listar()).to.be.rejected;
  expect(listar.called).to.be.true;
});

test('obter(): deve retornar uma livro', async () => {
  const midiaId = 1179;
  const obter = sandbox.stub(LivroModel, 'obter').resolves(livro());

  const resposta = await LivroService.obter(midiaId);

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(resposta).to.be.an('object');
});

test('obter(): deve retornar "undefined" para livro não encontrada', async () => {
  const midiaId = 1179;
  const obter = sandbox.stub(LivroModel, 'obter').resolves(undefined);

  const resposta = await LivroService.obter(midiaId);

  expect(obter.calledWith(midiaId)).to.be.true;
  expect(resposta).to.be.undefined;
});

test('obter(): deve lançar um erro', async () => {
  const midiaId = 1179;
  const obter = sandbox.stub(LivroModel, 'obter').rejects();

  expect(LivroService.obter(midiaId)).to.be.rejected;
  expect(obter.calledWith(midiaId)).to.be.true;
});

test('criar(): deve criar livro e midia', async () => {
  const midiaIdFake = 1179;
  const criarLivro = sandbox.stub(LivroModel, 'criar').resolves();
  const criarMidia = sandbox.stub(MidiaService, 'criar').resolves(midiaIdFake);

  const dadosParaCriar = {
    titulo: 'Titulo',
    capa: 'Capa',
    autor: 'Autor',
    editora: 'Editora',
  };

  const assertMidia = {
    titulo: dadosParaCriar.titulo,
    capa: dadosParaCriar.capa,
  };

  const assertLivro = {
    midia_id: midiaIdFake,
    autor: dadosParaCriar.autor,
    editora: dadosParaCriar.editora,
  };

  const midiaId = await LivroService.criar(dadosParaCriar);

  expect(criarMidia.calledWith(assertMidia)).to.be.true;
  expect(criarLivro.calledWith(assertLivro)).to.be.true;
  expect(midiaId).to.equal(midiaIdFake);
});

test('criar(): deve lançar erro no MidiaService', async () => {
  const dadosParaCriar = {
    titulo: 'Titulo',
    capa: 'Capa',
    autor: 'Autor',
    editora: 'Editora',
  };

  const criarMidia = sandbox.stub(MidiaService, 'criar').rejects();
  const criarLivro = sandbox.stub(LivroModel, 'criar').resolves();

  expect(LivroService.criar(dadosParaCriar)).to.be.rejected;
  expect(criarMidia.called).to.be.true;
  expect(criarLivro.called).to.be.false;
});

test('criar(): deve lançar erro no LivroModel', async () => {
  const dadosParaCriar = {
    titulo: 'Titulo',
    capa: 'Capa',
    autor: 'Autor',
    editora: 'Editora',
  };

  const criarMidia = sandbox.stub(MidiaService, 'criar').resolves(1179);
  const criarLivro = sandbox.stub(LivroModel, 'criar').rejects();

  try {
    await LivroService.criar(dadosParaCriar);
  } catch (error) {
    expect(error).to.be.an('error');
  }

  expect(criarMidia.called).to.be.true;
  expect(criarLivro.called).to.be.true;
});

test('editar(): deve retornar true para edição feita', async () => {
  const midiaId = 1179;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
    autor: 'Autor',
    editora: 'Editora',
  };

  const assertLivro = {
    autor: dadosParaEditar.autor,
    editora: dadosParaEditar.editora,
  };

  const assertMidia = {
    titulo: dadosParaEditar.titulo,
    capa: dadosParaEditar.capa,
  };

  const editarLivro = sandbox.stub(LivroModel, 'editar').resolves(1);
  const editarMidia = sandbox.stub(MidiaService, 'editar').resolves(true);

  const edicao = await LivroService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.true;
  expect(editarLivro.calledWith(midiaId, assertLivro)).to.be.true;
  expect(editarMidia.calledWith(midiaId, assertMidia)).to.be.true;
});

test('editar(): não deve chamar editar de LivroModel', async () => {
  const midiaId = 1179;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
  };

  const editarLivro = sandbox.stub(LivroModel, 'editar');
  const editarMidia = sandbox.stub(MidiaService, 'editar').resolves(true);

  const edicao = await LivroService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.true;
  expect(editarLivro.called).to.be.false;
  expect(editarMidia.called).to.be.true;
});

test('editar(): não deve chamar editar de MidiaService', async () => {
  const midiaId = 1179;
  const dadosParaEditar = {
    autor: 'Autor',
    editora: 'Editora',
  };

  const editarLivro = sandbox.stub(LivroModel, 'editar').resolves(1);
  const editarMidia = sandbox.stub(MidiaService, 'editar');

  const edicao = await LivroService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.true;
  expect(editarLivro.called).to.be.true;
  expect(editarMidia.called).to.be.false;
});

test('editar(): deve retornar "false" para problema na edição do LivroModel', async () => {
  const midiaId = 1179;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
    autor: 'Autor',
    editora: 'Editora',
  };

  const editarLivro = sandbox.stub(LivroModel, 'editar').resolves(0);
  const editarMidia = sandbox.stub(MidiaService, 'editar');

  const edicao = await LivroService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.false;
  expect(editarLivro.called).to.be.true;
  expect(editarMidia.called).to.be.false;
});

test('editar(): deve retornar "false" para problema na edição da MidiaService', async () => {
  const midiaId = 1179;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
    autor: 'Autor',
    editora: 'Editora',
  };

  const editarLivro = sandbox.stub(LivroModel, 'editar').resolves(1);
  const editarMidia = sandbox.stub(MidiaService, 'editar').resolves(false);

  const edicao = await LivroService.editar(midiaId, dadosParaEditar);

  expect(edicao).to.be.false;
  expect(editarLivro.called).to.be.true;
  expect(editarMidia.called).to.be.true;
});

test('editar(): deve rejeitar promise por problema em LivroModel', async () => {
  const midiaId = 1179;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
    autor: 'Autor',
    editora: 'Editora',
  };

  const editarLivro = sandbox.stub(LivroModel, 'editar').rejects();
  const editarMidia = sandbox.stub(MidiaService, 'editar');

  expect(LivroService.editar(midiaId, dadosParaEditar)).to.be.rejected;
  expect(editarLivro.called).to.be.true;
  expect(editarMidia.called).to.be.false;
});

test('editar(): deve rejeitar promise por problema em MidiaService', async () => {
  const midiaId = 1179;
  const dadosParaEditar = {
    titulo: 'Titulo',
    capa: 'Capa',
    autor: 'Autor',
    editora: 'Editora',
  };

  const editarLivro = sandbox.stub(LivroModel, 'editar').resolves(1);
  const editarMidia = sandbox.stub(MidiaService, 'editar').rejects();

  try {
    await LivroService.editar(midiaId, dadosParaEditar)
  } catch (error) {
    expect(error).to.be.an('error');
  }

  expect(editarLivro.called).to.be.true;
  expect(editarMidia.called).to.be.true;
});

test('excluir(): deve retornar "true" ao excluir', async () => {
  const midiaId = 1179;
  const excluir = sandbox.stub(MidiaService, 'excluir').resolves(true);
  const exclusao = await LivroService.excluir(midiaId);

  expect(exclusao).to.be.true;
  expect(excluir.calledWith(midiaId)).to.be.true;
});

test('excluir(): deve retornar "false" em erro ao exluir', async () => {
  const midiaId = 1179;
  const excluir = sandbox.stub(MidiaService, 'excluir').resolves(false);
  const exclusao = await LivroService.excluir(midiaId);

  expect(exclusao).to.be.false;
  expect(excluir.calledWith(midiaId)).to.be.true;
});

test('excluir(): retornar rejeitar promise', async () => {
  const midiaId = 1179;
  const excluir = sandbox.stub(MidiaService, 'excluir').rejects();

  expect(LivroService.excluir(midiaId)).to.be.rejectedWith(Error);
  expect(excluir.calledWith(midiaId)).to.be.true;
});
