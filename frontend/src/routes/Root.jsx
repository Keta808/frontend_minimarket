import { Outlet, useNavigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  return (
    <div className="p-6">
      <Outlet />
    </div>
  );
}

export default Root;
