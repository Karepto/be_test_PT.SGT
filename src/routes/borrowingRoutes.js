const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowingController');

router.post('/', borrowingController.create);

router.put('/:id/return', borrowingController.returnBook);

module.exports = router;
