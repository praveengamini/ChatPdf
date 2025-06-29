// routes/pdfRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadPdf,getUserPdfs,deletePdf } = require('../controllers/pdf-controller.js');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadPdf);
router.get('/user/:userId', getUserPdfs);
router.delete('/deletePdf/:pdfId', deletePdf);

module.exports = router