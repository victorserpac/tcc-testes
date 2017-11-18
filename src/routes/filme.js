const express = require('express');
const FilmeController = require('../controllers/FilmeController');
const FilmeSchema = require('../routes/schemas/FilmeSchema');

const router = express.Router({ mergeParams: true });

/* GET /filme */
router.get('/', FilmeSchema.list, FilmeController.list);

/* GET /filme/:filmeId */
router.get('/:midiaId', FilmeSchema.get, FilmeController.get);

/* POST /filme */
router.post('/', FilmeSchema.post, FilmeController.post);

/* PUT /filme/:filmeId */
router.put('/:midiaId', FilmeSchema.put, FilmeController.put);

/* DELETE /filme/:filmeId */
router.delete('/:midiaId', FilmeSchema.delete, FilmeController.delete);

module.exports = router;
