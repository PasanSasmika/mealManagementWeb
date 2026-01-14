import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

// Add interceptor to include token in all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (username: string, mobileNumber: string) => {
  const response = await API.post('/api/auth/login', { username, mobileNumber });
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await API.post('/api/auth/register', userData);
  return response.data;
};

export const uploadExcel = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await API.post('/api/auth/upload-excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await API.get('/api/auth/users'); // Added /auth/ to the path
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await API.delete(`/api/auth/users/${id}`); // Added /auth/
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await API.put(`/api/auth/users/${id}`, userData);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await API.get('/api/dashboard/analytics');
  return response.data;
};