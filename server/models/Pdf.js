const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // S3 or local server URL
  parsedText: { type: String, required: true }, // Only parsed once
  createdAt: { type: Date, default: Date.now }
});

const PDF = mongoose.model('PDF', pdfSchema);
module.exports = PDF;
