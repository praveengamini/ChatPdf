const fs = require('fs');
const pdf = require('pdf-parse');

const parsePdfText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);

  const header = dataBuffer.toString('utf8', 0, 5);
  if (header !== '%PDF-') {
    throw new Error('Invalid PDF file: Missing PDF header');
  }

  const data = await pdf(dataBuffer);
  return data.text;
};

module.exports = { parsePdfText };
