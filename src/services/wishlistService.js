import api from './api';

export const getWishlist = async () => {
  const response = await api.get('/users/profile/wishlist');
  return response.data.data || [];
};

export const toggleWishlist = async (productId) => {
  const response = await api.post('/users/profile/wishlist/toggle', { productId });
  return response.data.data || [];
};
