import api from './api';

export const getRentals = () => {
  return api.get('/rentals');
};

export const getRental = (id) => {
  return api.get(`/rentals/${id}`);
};

export const createRental = (rentalData) => {
  return api.post('/rentals', rentalData);
};

export const updateRentalStatus = (id, status) => {
  return api.put(`/rentals/${id}/status`, { status });
};

export const cancelRental = (id) => {
  return api.put(`/rentals/${id}/cancel`);
};
