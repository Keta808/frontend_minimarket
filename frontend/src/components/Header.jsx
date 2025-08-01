import '../styles/header.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const { logout } = useAuth();  

  const handleLogout = async () => {
    await logout();  
    navigate('/auth', { replace: true }); 
  };

  return (
    <header className="header">
      <div className="logo">Minimarket</div>

      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <nav className={`header-nav ${menuAbierto ? 'abierto' : ''}`}>
        <button onClick={() => navigate('/')}>Inicio</button>
        <button onClick={() => navigate('/productos')}>Productos</button>
        <button onClick={() => navigate('/categorias')}>Categorías</button>
        <button onClick={() => navigate('/movimientos')}>Movimientos</button>
        <button onClick={() => navigate('/usuarios')}>Usuarios</button>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>
    </header>
  );
}
