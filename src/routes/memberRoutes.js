const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.get('/:id/borrowings', memberController.getMemberBorrowings);

router.post('/', memberController.create);

module.exports = router;
