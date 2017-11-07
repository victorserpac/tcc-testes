const { test } = require('ava');
const { expect } = require('chai');
const sinon = require('sinon');

// Dependencias
const AlunoService = require('../../src/services/AlunoService');
const AlunoModel = require('../../src/models/AlunoModel');

test('listar(): deve garantir que listar() de AlunoModel seja invocado', async () => {
  const stub = sinon.stub(AlunoModel, 'listar');

  AlunoService.listar();

  expect(stub.called).to.be.true;

  stub.restore();
});

test('obter(): deve garantir que obter() de AlunoModel seja invocado', async () => {
  const stub = sinon.stub(AlunoModel, 'obter');

  AlunoService.obter();

  expect(stub.called).to.be.true;

  stub.restore();
});

// test('criar(): deve garantir que obter() de AlunoModel seja invocado', async () => {
//   const stub = sinon.stub(AlunoModel, 'obter');

//   AlunoService.obter();

//   expect(stub.called).to.be.true;

//   stub.restore();
// });