import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data); 
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser); 
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
      
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          {...register('email', { required: 'Este campo es requerido' })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}

        <input
          type="password"
          placeholder="Contraseña"
          {...register('password', { required: 'Este campo es requerido' })}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default LoginForm;
