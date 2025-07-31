import axios from './root.service';
import jwtDecode from 'jwt-decode';

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post('auth/login', { email, password });
    const { status, data } = response;

    if (status === 200) {
      const { email, roles, id } = jwtDecode(data.data.accessToken);

      localStorage.setItem('token', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify({ email, roles, id }));

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
    }
  } catch (error) {
    console.error('Error login service:', error);
    throw error; // para que LoginForm lo detecte
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};
