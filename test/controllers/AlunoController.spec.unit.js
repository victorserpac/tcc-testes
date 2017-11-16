const { test } = require('ava');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

// Dependencias
const AlunoController = require('../../src/controllers/AlunoController');
const AlunoService = require('../../src/services/AlunoService');
const AlunoModel = require('../../src/models/AlunoModel');
const Logger = require('../../src/helpers/Logger');


test.serial('list(): deve responder mensagem de erro', async () => {
  const req = {};
  const res = { send: sinon.spy() };
  sinon.stub(AlunoService, 'listar').throws();

  const throwStub = sinon.stub(Logger, 'throw');

  await AlunoController.list(req, res);

  var spyCall = throwStub.getCall(0);

  expect(throwStub.calledWith(res, '3272358416', sinon.match.instanceOf(Error))).to.be.true;
});