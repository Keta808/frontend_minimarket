import instance from './root.service';

export const tryRefreshToken = async () => {
  try {
    const res = await instance.get('/auth/refresh'); 
    const { accessToken, user } = res.data.data;

   
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    return true;
  } catch (error) {
    console.error('No se pudo refrescar el token:', error);
    return false;
  }
};
