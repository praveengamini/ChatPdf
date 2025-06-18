const axios = require('axios');

const sendToPythonMicroservice = async ({ text, pdfId }) => {
  try {
    const response = await axios.post(`${process.env.IP_PY_MICRO}/embed`, {
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
// process.env.IP_PY_MICRO