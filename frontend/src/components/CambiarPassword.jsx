import { useState } from 'react';
import usuarioService from '../services/user.service';
import { useNavigate } from 'react-router-dom';
import '../styles/cambiarpassword.css';

export default function CambiarPassword({ userId }) {
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nuevaPassword !== confirmarPassword) {
      return setMensaje('Las contraseñas no coinciden');
    }

    try {
      await usuarioService.cambiarPasswordUsuario({
        userId,
        actual: passwordActual,
        nueva: nuevaPassword
      });
      setMensaje('Contraseña actualizada exitosamente');
      alert(`Contraseña actualizada exitosamente`);
      navigate('/');
      
    } catch (err) {
      setMensaje('Error al cambiar la contraseña');
    }
  };

  return (
    <div className="cambiar-password-container">
      <h2>Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Contraseña actual"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          required
        />
        <button type="submit">Actualizar contraseña</button>
      </form>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}
