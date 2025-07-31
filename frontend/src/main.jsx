import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import Root from './routes/Root.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login.jsx';
import ProductoList from './routes/ListaProductos.jsx';
import ProductoForm from './routes/ProductoForm.jsx';
import CategoriaForm from './routes/CategoriaForm.jsx';
import CategoriaList from './routes/CategoriaList.jsx';
import Movimientos from './routes/Movimientos.jsx';
import StockFormulario from './routes/StockFormulario.jsx';
import Dashboard from './routes/Dashboard.jsx';
import UsuariosScreen from './routes/UsuarioScreen.jsx';

import { setupAxiosInterceptors } from './services/axiosInterceptor.service.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';

setupAxiosInterceptors();

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/productos', element: <ProductoList /> },
    ],
  },
  { path: '/auth', element: <Login /> },
  {
    path: '/productos/nuevo',
    element: (
      <ProtectedRoute>
        <ProductoForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/productos/editar/:id',
    element: (
      <ProtectedRoute>
        <ProductoForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/categorias',
    element: (
      <ProtectedRoute>
        <CategoriaList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/categorias/nueva',
    element: (
      <ProtectedRoute>
        <CategoriaForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/categorias/editar/:id',
    element: (
      <ProtectedRoute>
        <CategoriaForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/movimientos',
    element: (
      <ProtectedRoute>
        <Movimientos />
      </ProtectedRoute>
    ),
  },
  {
    path: '/stock/registro',
    element: (
      <ProtectedRoute>
        <StockFormulario />
      </ProtectedRoute>
    ),
  },
  {
    path: '/usuarios',
    element: (
      <ProtectedRoute>
        <UsuariosScreen />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
