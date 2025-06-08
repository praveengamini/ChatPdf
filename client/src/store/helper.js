export const saveCurrentPdfToStorage = (pdfId) => {
  try {
    localStorage.setItem('currentPdfId', pdfId);
    localStorage.setItem('lastAccessed', new Date().toISOString());
  } catch (error) {
    console.error('Failed to save PDF ID to localStorage:', error);
  }
};

export const getCurrentPdfFromStorage = () => {
  try {
    return localStorage.getItem('currentPdfId');
  } catch (error) {
    console.error('Failed to get PDF ID from localStorage:', error);
    return null;
  }
};

export const clearCurrentPdfFromStorage = () => {
  try {
    localStorage.removeItem('currentPdfId');
    localStorage.removeItem('lastAccessed');
  } catch (error) {
    console.error('Failed to clear PDF ID from localStorage:', error);
  }
};