const express = require('express');
const FilmeController = require('../controllers/FilmeController');
const FilmeSchema = require('../routes/schemas/FilmeSchema');

const router = express.Router({ mergeParams: true });

/* GET /filme */
router.get('/', FilmeSchema.list, FilmeController.list);

/* GET /filme/:filmeId */
router.get('/:mediaId', FilmeSchema.get, FilmeController.get);

/* POST /filme */
router.post('/', FilmeSchema.post, FilmeController.post);

/* PUT /filme/:filmeId */
router.put('/:mediaId', FilmeSchema.put, FilmeController.put);

/* DELETE /filme/:filmeId */
router.delete('/:mediaId', FilmeSchema.delete, FilmeController.delete);

module.exports = router;
