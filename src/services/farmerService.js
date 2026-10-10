import api from './api';

export const farmerService = {
  getProfile: async () => {
    const response = await api.get('/farmer/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/farmer/profile', profileData);
    return response.data;
  }
};

