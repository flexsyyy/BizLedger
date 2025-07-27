const express = require('express');
const router = express.Router();
const { executeDynamicQuery } = require('../controllers/queryController');

router.post('/query', executeDynamicQuery);  // POST /mcp/query

module.exports = router;
