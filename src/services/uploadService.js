import axios from 'axios';
import api from './api';

// Upload payment screenshot to Cloudinary
export const uploadPaymentScreenshot = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'safety_payments');
  formData.append('folder', 'payment-proofs');
  
  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );
  
  return { url: response.data.secure_url, publicId: response.data.public_id };
};

// Upload product image (for admin)
export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.post('/products/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data;
};