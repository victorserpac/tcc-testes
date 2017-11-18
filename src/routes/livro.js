const express = require('express');
const LivroController = require('../controllers/LivroController');
const LivroSchema = require('../routes/schemas/LivroSchema');

const router = express.Router({ mergeParams: true });

/* GET /livro */
router.get('/', LivroSchema.list, LivroController.list);

/* GET /livro/:midiaId */
router.get('/:midiaId', LivroSchema.get, LivroController.get);

/* POST /livro */
router.post('/', LivroSchema.post, LivroController.post);

/* PUT /livro/:midiaId */
router.put('/:midiaId', LivroSchema.put, LivroController.put);

/* DELETE /livro/:midiaId */
router.delete('/:midiaId', LivroSchema.delete, LivroController.delete);

module.exports = router;
