/* eslint-disable */
const { test } = require('ava');
const sinon = require('sinon');
const { expect } = require('chai');

// Dependencias
const LivroModel = require('../../../src/models/LivroModel');
const { knex } = require('../../../src/config/db');
const Conversion = require('../../../src/helpers/Conversion');

let select;
let from;
let leftJoin;
let whereNull;
let where;
let first;
let whereNotNull;
let insert;
let into;
let update;
let deleteStub;
let options;

test.beforeEach(() => {
  knex.options = () => {};
  select = sinon.stub(knex, 'select').returns(knex);
  from = sinon.stub(knex, 'from').returns(knex);
  leftJoin = sinon.stub(knex, 'leftJoin').returns(knex);
  whereNull = sinon.stub(knex, 'whereNull').returns(knex);
  where = sinon.stub(knex, 'where').returns(knex);
  first = sinon.stub(knex, 'first').returns(knex);
  whereNotNull = sinon.stub(knex, 'whereNotNull').returns(knex);
  insert = sinon.stub(knex, 'insert').returns(knex);
  into = sinon.stub(knex, 'into').returns(knex);
  update = sinon.stub(knex, 'update').returns(knex);
  deleteStub = sinon.stub(knex, 'delete').returns(knex);
  options = sinon.stub(knex, 'options').returns(knex);
});

test.afterEach(() => {
  select.restore();
  from.restore();
  leftJoin.restore();
  whereNull.restore();
  where.restore();
  first.restore();
  whereNotNull.restore();
  insert.restore();
  into.restore();
  update.restore();
  deleteStub.restore();
  options.restore();
});

test.serial('listar(): deve validar query builder', async () => {
  LivroModel.listar();

  expect(select.called).to.be.true;
  expect(from.calledWith('livro')).to.be.true;
  expect(leftJoin.calledWith('midia', 'livro.midia_id', 'midia.id')).to.be.true;
  expect(whereNull.calledWith('midia.deleted_at')).to.be.true;
});

test.serial('obter(): deve validar query builder', async () => {
  const id = 1;

  LivroModel.obter(id);

  expect(select.called).to.be.true;
  expect(from.calledWith('livro')).to.be.true;
  expect(leftJoin.calledWith('midia', 'livro.midia_id', 'midia.id')).to.be.true;
  expect(where.calledWith('midia.id', id)).to.be.true;
  expect(whereNull.calledWith('midia.deleted_at')).to.be.true;
  expect(first.called).to.be.true;
});

test.serial('criar(): deve validar query builder', async () => {
  const livro = {
    autor: 'Autor',
    editora: 'Editora',
  };

  LivroModel.criar(livro);

  expect(insert.calledWith(livro)).to.be.true;
  expect(into.calledWith('livro')).to.be.true;
});

test.serial('editar(): deve validar query builder', async () => {
  const id = 1;
  const dados = {
    autor: 'Autor',
    editora: 'Editora',
  };

  LivroModel.editar(id, dados);

  expect(update.calledWith(dados)).to.be.true;
  expect(from.calledWith('livro')).to.be.true;
  expect(where.calledWith('midia_id', id)).to.be.true;
});

test.serial('excluir(): deve validar query builder', async () => {
  const id = 1;

  LivroModel.excluir(id);

  expect(update.calledWith({ deleted_at: Conversion.getLocal().format('YYYY-MM-DD HH:mm:ss') })).to.be.true;
  expect(from.calledWith('midia')).to.be.true;
  expect(where.calledWith('id', id)).to.be.true;
});

test.serial('cleanup(): deve validar query builder', async () => {
  LivroModel.cleanup();

  expect(deleteStub.called).to.be.true;
  expect(from.calledWith('livro')).to.be.true;
});
