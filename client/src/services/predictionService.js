import api from './api';

export const getPrediction = (data) => {
  return api.post('/predictions/predict', data);
};

export const getPredictionHistory = () => {
  return api.get('/predictions/history');
};

export const getPredictionStats = () => {
  return api.get('/predictions/stats');
};

export const getPredictionHistoryItem = (id) => {
  return api.get(`/predictions/history/${id}`);
};
