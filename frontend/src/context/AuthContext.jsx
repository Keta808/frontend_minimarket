import { createContext, useContext, useState, useEffect } from 'react';
import instance from '../services/root.service';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const res = await instance.get('/auth/refresh');
        setUser(res.data.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
      } catch (error) {
        console.log('Error al refrescar sesión', error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    refreshUser();
  }, []);

const logout = async () => {
  try {
    await instance.post('/auth/logout'); 

    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete instance.defaults.headers.common['Authorization'];

  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};


  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}