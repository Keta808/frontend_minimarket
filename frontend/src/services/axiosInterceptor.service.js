// src/services/axiosInterceptor.js
import instance from './root.service';

export const setupAxiosInterceptors = () => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const isOnLoginPage = window.location.pathname === '/auth';

        if (!isOnLoginPage) {
          console.warn('⚠️ Token expirado o inválido. Cerrando sesión...');
          localStorage.removeItem('token');
          window.location.href = '/auth'; // redirige solo si no estás ya en login
        }
      }
      return Promise.reject(error);
    }
  );
};
