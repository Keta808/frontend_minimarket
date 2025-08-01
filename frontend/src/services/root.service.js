import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL || 'https://backend-minimarket-b8b9.onrender.com/api/';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; 
      try {
        const res = await instance.get('/auth/refresh', { withCredentials: true });
    
        const newAccessToken = res.data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error("Refresh fallido: no hay token.");
        } 
        localStorage.setItem('token', newAccessToken);   
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    console.error("🚫 Error no manejado por el interceptor o refresh ya intentado.");
    return Promise.reject(error);
  }
);

export default instance;
