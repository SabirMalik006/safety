import api from './api';

// Get all products with filters
export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.featured) params.append('featured', filters.featured);
  if (filters.search) params.append('search', filters.search);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  
  const response = await api.get(`/products?${params.toString()}`);
  return response.data;
};

// Get single product by ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Get single product by slug
export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/slug/${slug}`);
  return response.data;
};

// Get featured products
export const getFeaturedProducts = async () => {
  return await getProducts({ featured: 'true' });
};

// Get products by category
export const getProductsByCategory = async (categoryId) => {
  return await getProducts({ category: categoryId });
};

// ✅ Get all categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// ✅ Create category (admin)
export const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

// ✅ Update category (admin)
export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

// ✅ Delete category (admin)
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// Create product (admin)
export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

// Update product (admin)
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// Delete product (admin)
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Upload product images (admin)
export const uploadProductImages = async (formData) => {
  const response = await api.post('/products/upload-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Delete product image (admin)
export const deleteProductImage = async (publicId) => {
  const response = await api.delete('/products/delete-image', {
    data: { publicId }
  });
  return response.data;
};