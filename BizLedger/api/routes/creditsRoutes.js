const express = require('express');
const router = express.Router();
const {
  getAllCredits,
  getUnpaidCredits
} = require('../controllers/creditsController');

router.get('/', getAllCredits);
router.get('/unpaid', getUnpaidCredits);

module.exports = router;
