// src/services/axiosInterceptor.js
import instance from './root.service';

let isAlreadyRedirecting = false;

export const setupAxiosInterceptors = () => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
            const isOnLoginPage = window.location.pathname === '/auth';

            if (!isOnLoginPage && !isAlreadyRedirecting) {
                isAlreadyRedirecting = true;
                console.warn('⚠️ Token expirado o inválido. Cerrando sesión...');
                localStorage.removeItem('token');
                localStorage.removeItem('user');  // <-- limpia también user
                window.location.href = '/auth';
            }
            }

      return Promise.reject(error);
    }
  );
};
