import api from './api';

export const getSchemes = (params = {}) => {
  return api.get('/schemes', { params });
};

export const getScheme = (id) => {
  return api.get(`/schemes/${id}`);
};

export const createScheme = (schemeData) => {
  return api.post('/schemes', schemeData);
};

export const updateScheme = (id, schemeData) => {
  return api.put(`/schemes/${id}`, schemeData);
};

export const deleteScheme = (id) => {
  return api.delete(`/schemes/${id}`);
};

export const getSchemeCategories = () => {
  return api.get('/schemes/categories');
};
