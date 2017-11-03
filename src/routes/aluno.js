const express = require('express');
const AlunoController = require('../controllers/AlunoController');
const AlunoSchema = require('../routes/schemas/AlunoSchema');

const router = express.Router({ mergeParams: true });

/* GET /aluno */
router.get('/', AlunoSchema.list, AlunoController.list);

/* GET /aluno/:alunoId */
router.get('/:matricula', AlunoSchema.get, AlunoController.get);

/* POST /aluno */
router.post('/', AlunoSchema.post, AlunoController.post);

/* PUT /aluno/:alunoId */
router.put('/:matricula', AlunoSchema.put, AlunoController.put);

/* DELETE /aluno/:alunoId */
router.delete('/:matricula', AlunoSchema.delete, AlunoController.delete);

module.exports = router;
