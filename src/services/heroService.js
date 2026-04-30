import api from './api';

// Get active heroes (for homepage)
export const getHeroes = async () => {
  const response = await api.get('/hero');
  return response.data;
};

// ✅ Get all heroes including inactive (for admin)
export const getAllHeroes = async () => {
  const response = await api.get('/hero/all');
  return response.data;
};

// ✅ Create hero slide (admin)
export const createHero = async (heroData) => {
  const response = await api.post('/hero', heroData);
  return response.data;
};

// ✅ Update hero slide (admin)
export const updateHero = async (id, heroData) => {
  const response = await api.put(`/hero/${id}`, heroData);
  return response.data;
};

// ✅ Delete hero slide (admin)
export const deleteHero = async (id) => {
  const response = await api.delete(`/hero/${id}`);
  return response.data;
};