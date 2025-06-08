const PDF = require('../models/Pdf.js');
const { parsePdfText } = require('../utils/pdfParser.js');
const { sendToPythonMicroservice } = require('../utils/pythonClient.js');
const User = require('../models/User.js');
const path = require('path');
const fs = require('fs');
const Chat = require('../models/Chats.js');

const uploadPdf = async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;
    const fileUrl = `/uploads/${file.filename}`;
    const fileName = file.originalname;

    const parsedText = await parsePdfText(file.path);

    const pdf = new PDF({ userId, fileName, fileUrl, parsedText });
    await pdf.save();

    await sendToPythonMicroservice({
      text: parsedText,
      pdfId: pdf._id.toString()
    });

    res.status(201).json({ success: true, pdfId: pdf._id });
  } catch (err) {
    if (err.message.includes('Invalid PDF')) {
      return res.status(400).json({ success: false, error: err.message });
    }
    res.status(500).json({ success: false, error: 'Failed to upload PDF' });
  }
};

const getUserPdfs = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const pdfs = await PDF.find({ userId })
      .select('-parsedText')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'PDFs retrieved successfully',
      count: pdfs.length,
      data: pdfs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const deletePdf = async (req, res) => {
  try {
    const { pdfId } = req.params;

    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    const filePath = path.join(__dirname, '..', pdf.fileUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete file:', err);
    });

    await Chat.deleteMany({ pdfId });

    await PDF.findByIdAndDelete(pdfId);

    res.status(200).json({ message: 'PDF and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadPdf, getUserPdfs, deletePdf };
