const express = require('express');
const MediaController = require('../controllers/MediaController');
const MediaSchema = require('../routes/schemas/MediaSchema');

const router = express.Router({ mergeParams: true });

/* GET /media */
router.get('/', MediaSchema.list, MediaController.list);

/* GET /media/:id */
router.get('/:id', MediaSchema.get, MediaController.get);

/* DELETE /media/:id */
router.delete('/:id', MediaSchema.delete, MediaController.delete);

module.exports = router;
