const PDF = require('../models/Pdf.js');
const { parsePdfText } = require('../utils/pdfParser.js');
const { sendToPythonMicroservice } = require('../utils/pythonClient.js');
const User = require('../models/User.js')
const path = require('path')
const fs = require('fs')
const Chat = require('../models/Chats.js')
const uploadPdf = async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;
    const fileUrl = `/uploads/${file.filename}`;
    const fileName = file.originalname;

    console.log('Uploaded file size:', file.size);

    // Step 1: Parse the PDF into text
    const parsedText = await parsePdfText(file.path);

    // Step 2: Save metadata and text in MongoDB
    const pdf = new PDF({ userId, fileName, fileUrl, parsedText });
    await pdf.save();

    console.log('=== PDF UPLOAD DEBUG ===');
    console.log('Generated MongoDB pdfId:', pdf._id.toString());
    console.log('File filename:', file.filename);
    console.log('========================');

    // Step 3: Send to Python service
    await sendToPythonMicroservice({
      text: parsedText,
      pdfId: pdf._id.toString()
    });

    res.status(201).json({ success: true, pdfId: pdf._id });
  } catch (err) {
    console.error('PDF Upload Error:', err.message);

    if (err.message.includes('Invalid PDF')) {
      return res.status(400).json({ success: false, error: err.message });
    }

    res.status(500).json({ success: false, error: 'Failed to upload PDF' });
  }
};
const getUserPdfs = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all PDFs for the user
    const pdfs = await PDF.find({ userId })
      .select('-parsedText') // Exclude parsed text for performance
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      message: 'PDFs retrieved successfully',
      count: pdfs.length,
      data: pdfs
    });

  } catch (error) {
    console.error('Error in getUserPdfs:', error);
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

    // Find the PDF by ID
    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    // Delete associated file (local server)
    const filePath = path.join(__dirname, '..', pdf.fileUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete file:', err);
    });

    // Delete associated chat messages
    await Chat.deleteMany({ pdfId });

    // Delete PDF from DB
    await PDF.findByIdAndDelete(pdfId);

    res.status(200).json({ message: 'PDF and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadPdf,getUserPdfs,deletePdf};
