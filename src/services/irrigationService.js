import api from './api';

export const irrigationService = {
  getIrrigationByFarm: async (farmId) => {
    const response = await api.get(`/irrigation/farm/${farmId}`);
    return response.data;
  },

  saveIrrigation: async (irrigationData, farmId) => {
    const response = await api.post(`/irrigation${farmId ? `?farmId=${farmId}` : ''}`, irrigationData);
    return response.data;
  },

  updateIrrigation: async (id, irrigationData) => {
    const response = await api.put(`/irrigation/${id}`, irrigationData);
    return response.data;
  }
};

