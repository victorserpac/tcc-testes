/* eslint-disable */
const { test } = require('ava');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const AlunoModel = require('../../../src/models/AlunoModel');
const { knex } = require('../../../src/config/db');

let select;
let from;
let whereNull;
let where;
let first;
let whereNotNull;
let insert;
let into;
let update;
let deleteStub;

test.beforeEach(() => {
  select = sinon.stub(knex, 'select').returns(knex);
  from = sinon.stub(knex, 'from').returns(knex);
  whereNull = sinon.stub(knex, 'whereNull').returns(knex);
  where = sinon.stub(knex, 'where').returns(knex);
  first = sinon.stub(knex, 'first').returns(knex);
  whereNotNull = sinon.stub(knex, 'whereNotNull').returns(knex);
  insert = sinon.stub(knex, 'insert').returns(knex);
  into = sinon.stub(knex, 'into').returns(knex);
  update = sinon.stub(knex, 'update').returns(knex);
  deleteStub = sinon.stub(knex, 'delete').returns(knex);
});

test.afterEach(() => {
  select.restore();
  from.restore();
  whereNull.restore();
  where.restore();
  first.restore();
  whereNotNull.restore();
  insert.restore();
  into.restore();
  update.restore();
  deleteStub.restore();
});

test.serial('listar(): deve validar query builder', async () => {
  AlunoModel.listar();

  expect(select.called).to.be.true;
  expect(from.calledWith('aluno')).to.be.true;
  expect(whereNull.calledWith('deleted_at')).to.be.true;
});

test.serial('obter(): deve validar query builder', async () => {
  const matricula = 20142850076;

  AlunoModel.obter(matricula);

  expect(select.called).to.be.true;
  expect(from.calledWith('aluno')).to.be.true;
  expect(where.calledWith('matricula', matricula)).to.be.true;
  expect(whereNull.calledWith('deleted_at')).to.be.true;
  expect(first.called).to.be.true;
});

test.serial('obterExcluido(): deve validar query builder', async () => {
  const matricula = 20142850076;

  AlunoModel.obterExcluido(matricula);

  expect(select.called).to.be.true;
  expect(from.calledWith('aluno')).to.be.true;
  expect(where.calledWith('matricula', matricula)).to.be.true;
  expect(whereNotNull.calledWith('deleted_at')).to.be.true;
  expect(first.called).to.be.true;
});

test.serial('criar(): deve validar query builder', async () => {
  const aluno = {
    matricula: 20142850076,
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  AlunoModel.criar(aluno);

  expect(insert.calledWith(aluno)).to.be.true;
  expect(into.calledWith('aluno')).to.be.true;
});

test.serial('editar(): deve validar query builder', async () => {
  const matricula = 20142850076;
  const dados = {
    nome: 'Victor Serpa do Carmo',
    curso: 'TSI',
  };

  AlunoModel.editar(matricula, dados);

  expect(update.calledWith(dados)).to.be.true;
  expect(from.calledWith('aluno')).to.be.true;
  expect(where.calledWith('matricula', matricula)).to.be.true;
});

test.serial('excluir(): deve validar query builder', async () => {
  const matricula = 20142850076;

  AlunoModel.excluir(matricula);

  expect(update.calledWith({deleted_at: sinon.match.string})).to.be.true;
  expect(from.calledWith('aluno')).to.be.true;
  expect(where.calledWith('matricula', matricula)).to.be.true;
  expect(whereNull.calledWith('deleted_at')).to.be.true;
});

test.serial('cleanup(): deve validar query builder', async () => {
  AlunoModel.cleanup();

  expect(deleteStub.called).to.be.true;
  expect(from.calledWith('aluno')).to.be.true;
});
