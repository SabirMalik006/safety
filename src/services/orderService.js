import api from './api';

// ============================================
// REGULAR ORDER (COD/Later Payment)
// ============================================
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// ============================================
// ORDER WITH PAYMENT PROOF (For Manual Verification)
// ============================================
export const createOrderWithPaymentProof = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// ============================================
// GET MY ORDERS (User Dashboard)
// ============================================
export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};

// ============================================
// GET ORDER BY ID
// ============================================
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// ============================================
// GET ORDER STATUS
// ============================================
export const getOrderStatus = async (id) => {
  const response = await api.get(`/orders/${id}/status`);
  return response.data;
};

// ============================================
// ADMIN: GET PENDING VERIFICATION ORDERS
// ============================================
export const getPendingVerificationOrders = async () => {
  const response = await api.get('/orders/pending-verification');
  return response.data;
};

// ============================================
// ADMIN: VERIFY PAYMENT (APPROVE)
// ============================================
export const verifyPayment = async (orderId, adminNotes) => {
  const response = await api.put(`/orders/${orderId}/verify-payment`, { adminNotes });
  return response.data;
};

// ============================================
// ADMIN: REJECT PAYMENT (DISAPPROVE)
// ============================================
export const rejectPayment = async (orderId, rejectionReason, adminNotes) => {
  const response = await api.put(`/orders/${orderId}/reject-payment`, { rejectionReason, adminNotes });
  return response.data;
};

// ============================================
// ADMIN: GET PAYMENT PROOF DETAILS
// ============================================
export const getPaymentProofDetails = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/payment-proof`);
  return response.data;
};

// ============================================
// ADMIN: UPDATE ORDER STATUS
// ============================================
export const updateOrderStatus = async (orderId, status, trackingNumber = null) => {
  const response = await api.put(`/orders/${orderId}/status`, { orderStatus: status, trackingNumber });
  return response.data;
};

// ============================================