import api from './api';

export const assistantService = {
  askQuestion: async (question, conversationId) => {
    const response = await api.post('/assistant/chat', { question, conversationId });
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/assistant/conversations');
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await api.get(`/assistant/conversations/${conversationId}/messages`);
    return response.data;
  }
};

