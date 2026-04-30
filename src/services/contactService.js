import api from './api';

export const submitContact = async (formData) => {
  const response = await api.post('/contact', formData);
  return response.data;
};