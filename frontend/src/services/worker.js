import api from './api.js';

export const getWorkerTasks = async (status = null) => {
  const params = status ? { status } : {};
  const response = await api.get('/worker/tasks', { params });
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.patch(`/worker/tasks/${taskId}/status`, { status });
  return response.data;
};




