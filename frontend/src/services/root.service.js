import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL || 'https://backend-minimarket-b8b9.onrender.com/api/';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar el token a cada request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
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
        // Llama refresh token (GET, con credenciales para enviar cookie)
        const res = await instance.get('/auth/refresh', { withCredentials: true });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem('token', newAccessToken);

        // Actualiza Authorization header y reintenta la request original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.warn('Token expirado o inválido. Cerrando sesión...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default instance;