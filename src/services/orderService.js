import api from './api';

export const createOrderWithPaymentProof = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getPendingVerificationOrders = async () => {
  const response = await api.get('/orders/pending-verification');
  return response.data;
};

export const verifyPayment = async (orderId, adminNotes) => {
  const response = await api.put(`/orders/${orderId}/verify-payment`, { adminNotes });
  return response.data;
};

export const rejectPayment = async (orderId, rejectionReason, adminNotes) => {
  const response = await api.put(`/orders/${orderId}/reject-payment`, { rejectionReason, adminNotes });
  return response.data;
};

export const getPaymentProofDetails = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/payment-proof`);
  return response.data;
};