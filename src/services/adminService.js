import api from './api';

export const adminService = {
  getUsers: async (roleFilter) => {
    const response = await api.get(`/admin/users${roleFilter ? `?role=${roleFilter}` : ''}`);
    return response.data;
  },

  updateUserRole: async (userId, newRole) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  getKnowledgeDocuments: async () => {
    const response = await api.get('/admin/knowledge');
    return response.data;
  },

  addKnowledgeDocument: async (docData) => {
    const response = await api.post('/admin/knowledge', docData);
    return response.data;
  },

  deleteKnowledgeDocument: async (id) => {
    const response = await api.delete(`/admin/knowledge/${id}`);
    return response.data;
  }
};

