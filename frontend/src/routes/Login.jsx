import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  // Cambiar esta línea para verificar token, no solo user
  const token = localStorage.getItem('token');

  if (token) {
    return (
      <>
        <h2>Ya estás logeado!</h2>
        <button onClick={() => navigate('/')}>Ir a home</button>
      </>
    );
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default Login;
