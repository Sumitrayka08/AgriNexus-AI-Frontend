import api from './api';

export const imageAnalysisService = {
  analyzeImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/crop-image/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/crop-image/history');
    return response.data;
  }
};

