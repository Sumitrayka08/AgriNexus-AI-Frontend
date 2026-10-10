import api from './api';

export const recommendationService = {
  recommendCrop: async (parameters) => {
    const response = await api.post('/recommendations', parameters);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/recommendations');
    return response.data;
  }
};

