const fs = require('fs');
const pdf = require('pdf-parse');

const parsePdfText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);

  // Check if file starts with %PDF (valid header for all PDFs)
  const header = dataBuffer.toString('utf8', 0, 5);
  if (header !== '%PDF-') {
    throw new Error('Invalid PDF file: Missing PDF header');
  }

  // Try parsing with pdf-parse
  const data = await pdf(dataBuffer);
  return data.text;
};

module.exports = { parsePdfText };
