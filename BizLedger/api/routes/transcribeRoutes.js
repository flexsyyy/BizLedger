const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

const { handleTranscription } = require('../controllers/transcribeController');

router.post('/', upload.single('file'), handleTranscription);

module.exports = router;
