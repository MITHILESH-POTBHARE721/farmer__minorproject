import api from './api';

export const getEquipment = (params = {}) => {
  return api.get('/equipment', { params });
};

export const getEquipmentById = (id) => {
  return api.get(`/equipment/${id}`);
};

export const createEquipment = (formData) => {
  return api.post('/equipment', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateEquipment = (id, formData) => {
  return api.put(`/equipment/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteEquipment = (id) => {
  return api.delete(`/equipment/${id}`);
};

export const getMyEquipment = () => {
  return api.get('/equipment/my-equipment');
};
