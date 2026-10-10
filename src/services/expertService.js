import api from './api';

export const expertService = {
  createQuery: async (questionText) => {
    const response = await api.post('/expert/queries', { question: questionText });
    return response.data;
  },

  getMyQueries: async () => {
    const response = await api.get('/expert/queries/my');
    return response.data;
  },

  getAvailableQueries: async () => {
    const response = await api.get('/expert/queries/available');
    return response.data;
  },

  getAllQueries: async () => {
    const response = await api.get('/expert/queries');
    return response.data;
  },

  getQueryById: async (id) => {
    const response = await api.get(`/expert/queries/${id}`);
    return response.data;
  },

  respondToQuery: async (id, responseText) => {
    const response = await api.put(`/expert/queries/${id}/respond`, { response: responseText });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/expert/queries/${id}/status`, { status });
    return response.data;
  }
};

