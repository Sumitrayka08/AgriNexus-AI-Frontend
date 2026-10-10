import api from './api';

export const soilService = {
  getSoilByFarm: async (farmId) => {
    const response = await api.get(`/soil/farm/${farmId}`);
    return response.data;
  },

  saveSoilInfo: async (soilData, farmId) => {
    const response = await api.post(`/soil${farmId ? `?farmId=${farmId}` : ''}`, soilData);
    return response.data;
  },

  updateSoilInfo: async (id, soilData) => {
    const response = await api.put(`/soil/${id}`, soilData);
    return response.data;
  }
};

