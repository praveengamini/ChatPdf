// controllers/chatController.js
const Chat = require('../models/Chats.js');
const axios = require('axios')
const getChatByPdf = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const chat = await Chat.findOne({ pdfId }).populate('pdfId');
    if (!chat) {
      return res.status(404).json({ success: false, message: 'No chat found' });
    }
    res.json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error fetching chat' });
  }
};

const addMessageToChat = async (req, res) => {
  try {
    console.log('=== CHAT REQUEST DEBUG ===');
    console.log('URL:', req.url);
    console.log('Route params:', req.params);
    console.log('Request body:', req.body);
    console.log('pdfId:', req.params.pdfId);
    console.log('userId:', req.params.userId);
    console.log('========================');

    const { pdfId, userId } = req.params;
    const { sender, message } = req.body;

    // Validate parameters
    if (!pdfId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing pdfId or userId'
      });
    }

    // 1. Find or create a chat
    let chat = await Chat.findOne({ pdfId, userId });
    if (!chat) {
      chat = new Chat({ pdfId, userId, messages: [] });
    }

    // 2. Add user's message
    chat.messages.push({ sender, message });
    await chat.save();

    console.log('Calling Python service with:', { pdfId, message });

    // 3. Send user message and PDF ID to Python microservice
    const aiResponse = await axios.post('http://192.168.31.96:8000/api/generate', {
      pdfId,
      message
    });
    
    console.log("Python AI response:", aiResponse.data);

    const aiMessage = aiResponse.data.answer || 'Sorry, I could not generate a response.';

    // 4. Save AI's reply
    chat.messages.push({ sender: 'ai', message: aiMessage });
    await chat.save();

    // 5. Respond to frontend with updated chat
    res.status(201).json({
      success: true,
      chat
    });

  } catch (err) {
    console.error('=== CHAT ERROR ===');
    console.error('Error message:', err.message);
    console.error('Error response:', err.response?.data);
    console.error('Full error:', err);
    console.error('==================');
    
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: err.message // Add this for debugging
    });
  }
};


module.exports = {getChatByPdf,addMessageToChat}