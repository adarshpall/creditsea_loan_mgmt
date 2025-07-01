const express = require('express');
const router = express.Router();
const { createLoan, getAllLoans } = require('../controllers/loanControllers');

router.post('/loanpost', createLoan);
router.get('/allLoans', getAllLoans);

module.exports = router;
