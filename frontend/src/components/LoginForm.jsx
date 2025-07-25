import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth.service';
import '../styles/login.css'; // asegúrate de importar los estilos

function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data).then(() => {
      navigate('/');
    });
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
