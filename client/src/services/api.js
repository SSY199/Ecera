import axios from 'axios';

/**
 * Axios instance for the LMS API. Set VITE_API_URL in .env to your API root
 * (e.g. http://localhost:5000/api) so paths like /users/login resolve correctly.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
