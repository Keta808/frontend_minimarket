import '../styles/dashboard.css';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import movimientoService from '../services/movimiento.service'

export default function Dashboard() {
  const [ultimosMovimientos, setUltimosMovimientos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const res = await movimientoService.getUltimosMovimientos();
        setUltimosMovimientos(res);
      } catch (error) {
        console.error('Error al obtener movimientos:', error);
      }
    };
    fetchMovimientos();
  }, []);

  return (
    <div className="dashboard-container">
      <Header />
    <h1> </h1>

      <div className="button-group">
        <button className="button-entry" onClick={() => navigate('/stock/registro?tipo=entrada')}>
          Registrar Entrada
        </button>
        <button className="button-exit" onClick={() => navigate('/stock/registro?tipo=salida')}>
          Registrar Salida
        </button>
      </div>

      <div className="movimientos">
        <h2 style={{ marginBottom: '1rem' }}>Últimos Movimientos</h2>
        
      
        <div className="movimientos-header">
          <div className="col tipo-col">Tipo</div>
          <div className="col producto-col">Producto</div>
          <div className="col cantidad-col">Cantidad</div>
          <div className="col fecha-col">Fecha</div>
        </div>

       
        {ultimosMovimientos.map((mov) => (
          <div
            key={mov._id}
            className={`movimiento-item ${mov.tipo === 'entrada' ? 'entrada' : 'salida'}`}
          >
          <div className="col tipo-col" data-label="Tipo">{mov.tipo.toUpperCase()}</div>
          <div className="col producto-col" data-label="Producto">{mov.producto?.nombre_base + " " + mov.producto?.presentacion || 'Producto eliminado'}</div>
          <div className="col cantidad-col" data-label="Cantidad">{mov.cantidad}</div>
          <div className="col fecha-col" data-label="Fecha">{new Date(mov.createdAt).toLocaleString()}</div>

          </div>
        ))}
      </div>
    </div>
  );
}
