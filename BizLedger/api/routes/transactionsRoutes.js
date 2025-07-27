const express = require('express');
const router = express.Router();
const {
  logTransaction,
  getAllTransactionsSummary // ✅ Make sure this line exists
} = require('../controllers/transactionsController');


router.post('/', logTransaction);
router.get('/summary', getAllTransactionsSummary);  // ⬅ New route

module.exports = router;
