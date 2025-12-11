import api from './api.js';

export const getAllPickups = async (filters = {}) => {
  const response = await api.get('/admin/pickups', { params: filters });
  return response.data;
};

export const assignPickupToWorker = async (pickupId, workerId) => {
  const response = await api.post(`/admin/assign/${pickupId}`, { workerId });
  return response.data;
};

export const optimizeRoute = async (pickupIds, startLocation) => {
  const response = await api.post('/admin/route/optimize', {
    pickupIds,
    startLocation,
  });
  return response.data;
};

export const getAnalytics = async (period = 'daily', startDate, endDate) => {
  const response = await api.get('/admin/analytics', {
    params: { period, startDate, endDate },
  });
  return response.data;
};

export const getAllWorkers = async () => {
  const response = await api.get('/admin/workers');
  return response.data;
};




