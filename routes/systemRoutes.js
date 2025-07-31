const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const systemController = require('../controllers/systemController');

router.post('/upload', upload.single('file'), systemController.uploadData);
router.post('/schedule', systemController.scheduleMessage);

module.exports = router;