import api from './api.js';

export const getNearbyDustbins = async (lat, lng, radius = 5000) => {
  const response = await api.get('/dustbins/nearby', {
    params: { lat, lng, radius },
  });
  return response.data;
};




