import instance from './root.service';

export const tryRefreshToken = async () => {
  try {
    const res = await instance.get('/auth/refresh'); // gracias a withCredentials, la cookie va incluida
    const { accessToken, user } = res.data.data;

    // Guarda el token y usuario en localStorage
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    return true;
  } catch (error) {
    console.error('No se pudo refrescar el token:', error);
    return false;
  }
};
