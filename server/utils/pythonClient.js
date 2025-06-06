// utils/pythonClient.js
const axios = require('axios');

const sendToPythonMicroservice = async ({ text, pdfId }) => {
  try {
    const response = await axios.post('http://192.168.31.96:8000/embed', {
      text,
      pdfId
    });
    console.log('Embedding stored:', response.data);
  } catch (error) {
    console.error('Error sending to Python microservice:', error.message);
    throw new Error('Failed to send data to embedding service');
  }
};

module.exports = {sendToPythonMicroservice}