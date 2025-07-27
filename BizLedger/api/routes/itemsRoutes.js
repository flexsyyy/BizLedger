const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemStock
} = require('../controllers/itemsController');

router.get('/', getAllItems);
router.get('/:item_id/stock', getItemStock);

module.exports = router;
