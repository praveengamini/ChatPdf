const Chat = require('../models/Chats.js');
const axios = require('axios');

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
    const { pdfId, userId } = req.params;
    const { sender, message } = req.body;

    if (!pdfId || !userId || !sender || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: pdfId, userId, sender, or message'
      });
    }

    const sessionId = userId;

    let chat = await Chat.findOne({ pdfId, userId });
    if (!chat) {
      chat = new Chat({ pdfId, userId, messages: [] });
    }

    chat.messages.push({ sender, message });
    await chat.save();

    const aiResponse = await axios.post(`${process.env.IP_PY_MICRO}/api/generate`, {
      pdfId,
      message,
      sessionId
    });

    const aiMessage = aiResponse.data.answer || 'Sorry, I could not generate a response.';

    chat.messages.push({ sender: 'ai', message: aiMessage });
    await chat.save();

    res.status(201).json({
      success: true,
      chat
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: err.message
    });
  }
};

module.exports = { getChatByPdf, addMessageToChat };
