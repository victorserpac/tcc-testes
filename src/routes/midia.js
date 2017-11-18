const express = require('express');
const MidiaController = require('../controllers/MidiaController');
const MidiaSchema = require('../routes/schemas/MidiaSchema');

const router = express.Router({ mergeParams: true });

/* GET /midia */
router.get('/', MidiaSchema.list, MidiaController.list);

/* GET /midia/:id */
router.get('/:id', MidiaSchema.get, MidiaController.get);

/* DELETE /midia/:id */
router.delete('/:id', MidiaSchema.delete, MidiaController.delete);

module.exports = router;
