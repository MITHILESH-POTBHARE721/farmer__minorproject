import api from './api';

export const getOrders = () => {
  return api.get('/orders');
};

export const getOrder = (id) => {
  return api.get(`/orders/${id}`);
};

export const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};

export const updateOrderStatus = (id, status) => {
  return api.put(`/orders/${id}/status`, { status });
};

export const getMySales = () => {
  return api.get('/orders/my-sales');
};

export const confirmPaymentReceived = (id) => {
  return api.put(`/orders/${id}/payment-received`);
};
