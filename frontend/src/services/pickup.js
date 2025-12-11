import api from './api.js';

export const createPickupRequest = async (formData) => {
  const response = await api.post('/pickup/request', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getPickupStatus = async (id) => {
  const response = await api.get(`/pickup/status/${id}`);
  return response.data;
};

export const getMyPickupRequests = async () => {
  const response = await api.get('/pickup/my-requests');
  return response.data;
};




