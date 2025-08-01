import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usuarioService from '../services/user.service';
import Header from  '../components/Header';
import '../styles/usuarios.css';
import CambiarPassword from '../components/CambiarPassword';
import { useAuth } from '../context/AuthContext';

function UsuariosScreen() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { user: usuarioActual } = useAuth();

  const esAdmin = usuarioActual.roles[0].name === 'admin';

  useEffect(() => {
    usuarioService.getUsers()
      .then(res => setUsuarios(res.data))
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setCargando(false));
  }, [esAdmin, navigate]);

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      try {
        await usuarioService.deleteUser(id);
        setUsuarios(prev => prev.filter(u => u._id !== id));
      } catch {
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usuarioService.createUser(nuevoUsuario);
      const res = await usuarioService.getUsers();
      setUsuarios(res.data);
      setMostrarModal(false);
      setNuevoUsuario({ username: '', email: '', password: '' });
    } catch {
      alert('Error al crear usuario');
    }
  };

if (!esAdmin) {
  return (
    <div className="usuarios-container">
      <Header />
      <CambiarPassword userId={usuarioActual.id} />
    </div>
  );
}


  return (
    <div className="usuarios-container">
      <Header></Header>
      <h2>Gestión de Usuarios</h2>
      <button className="crear-btn" onClick={() => setMostrarModal(true)}>Crear Usuario</button>

      {cargando ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario._id}>
                  <td>{usuario.username}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.roles[0]?.name || 'Sin rol'}</td>
                  <td>
                    <button className="eliminar-btn" onClick={() => eliminarUsuario(usuario._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Crear Usuario</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Nombre de usuario"
                value={nuevoUsuario.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={nuevoUsuario.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={nuevoUsuario.password}
                onChange={handleChange}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="crear-btn">Guardar</button>
                <button type="button" className="cancelar-btn" onClick={() => setMostrarModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuariosScreen;
