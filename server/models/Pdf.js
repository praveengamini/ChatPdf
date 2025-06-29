const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true }, 
  parsedText: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

const PDF = mongoose.model('PDF', pdfSchema);
module.exports = PDF;
