// main.jsx
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

// 🟩 Agrega esta línea
import { setupAxiosInterceptors } from './services/axiosInterceptor.service.js';
setupAxiosInterceptors(); // ⬅️ Inicializa los interceptores una vez

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/productos', element: <ProductoList /> },
    ],
  },
  { path: '/auth', element: <Login /> },
  { path: '/productos/nuevo', element: <ProductoForm /> },
  { path: '/productos/editar/:id', element: <ProductoForm /> },
  { path: '/categorias', element: <CategoriaList /> },
  { path: '/categorias/nueva', element: <CategoriaForm /> },
  { path: '/categorias/editar/:id', element: <CategoriaForm /> },
  { path: '/movimientos', element: <Movimientos /> },
  { path: '/stock/registro', element: <StockFormulario /> },
  { path: '/usuarios', element: <UsuariosScreen /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
