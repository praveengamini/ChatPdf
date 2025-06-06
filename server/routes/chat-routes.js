// routes/chatRoutes.js
const express = require('express');
const { getChatByPdf,addMessageToChat} = require('../controllers/chat-controller.js');

const router = express.Router();

// Get chat history
router.post('/send/:pdfId/:userId', addMessageToChat);
router.get('/getchat/:pdfId', getChatByPdf);
module.exports= router;
