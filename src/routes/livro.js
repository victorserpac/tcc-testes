const express = require('express');
const LivroController = require('../controllers/LivroController');
const LivroSchema = require('../routes/schemas/LivroSchema');

const router = express.Router({ mergeParams: true });

/* GET /livro */
router.get('/', LivroSchema.list, LivroController.list);

/* GET /livro/:mediaId */
router.get('/:mediaId', LivroSchema.get, LivroController.get);

/* POST /livro */
router.post('/', LivroSchema.post, LivroController.post);

/* PUT /livro/:mediaId */
router.put('/:mediaId', LivroSchema.put, LivroController.put);

/* DELETE /livro/:mediaId */
router.delete('/:mediaId', LivroSchema.delete, LivroController.delete);

module.exports = router;
