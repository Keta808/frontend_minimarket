// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import instance from '../services/root.service'; // Usa tu Axios con credenciales

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar, intenta refrescar el usuario
  useEffect(() => {
    const refreshUser = async () => {
      try {
        const res = await instance.get('/auth/refresh'); // importante: credenciales incluidas
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
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

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
