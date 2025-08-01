import { useEffect, useState } from "react";
import movimientosService from "../services/movimiento.service";
import '../styles/movimientos.css';
import Header from '../components/Header.jsx';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [filtros, setFiltros] = useState({
    producto: "",
    tipo: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const fetchMovimientos = async () => {
    const data = await movimientosService.getMovimientos();
 
    setMovimientos(data);
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

 
  const movimientosFiltrados = movimientos.filter((mov) => {
    const productoNombre =
      `${mov.producto?.nombre_base || ""} ${mov.producto?.presentacion || ""}`.toLowerCase();
    const cumpleProducto = productoNombre.includes(filtros.producto.toLowerCase());

    const cumpleTipo =
      !filtros.tipo || mov.tipo.toLowerCase() === filtros.tipo.toLowerCase();

    const fecha = new Date(mov.createdAt);
    const cumpleFechaInicio = !filtros.fechaInicio || fecha >= new Date(filtros.fechaInicio);
    const cumpleFechaFin = !filtros.fechaFin || fecha <= new Date(filtros.fechaFin);

    return cumpleProducto && cumpleTipo && cumpleFechaInicio && cumpleFechaFin;
  });

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  
  return (
    <div className="movimientos-container">
      <Header></Header>
      <h1>Movimientos</h1>

      <div className="filtros-grid">
        <input
          type="text"
          name="producto"
          placeholder="Buscar producto"
          value={filtros.producto}
          onChange={handleChange}
        />

        <select name="tipo" value={filtros.tipo} onChange={handleChange}>
          <option value="">Todos los tipos</option>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>

        <input type="date" name="fechaInicio" value={filtros.fechaInicio} onChange={handleChange} />

        <input type="date" name="fechaFin" value={filtros.fechaFin} onChange={handleChange} />
      </div>

      <div className="table-wrapper">
        <table className="movimientos-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.length > 0 ? (
              movimientosFiltrados.map((mov) => (
                <tr key={mov._id}>
                  <td>{mov.producto?.nombre_base} {mov.producto?.presentacion}</td>
                  <td className={mov.tipo}>{mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)}</td>
                  <td>{mov.cantidad}</td>
                  <td>{mov.usuario?.username || 'Desconocido'}</td>
                  <td>{new Date(mov.createdAt).toLocaleString()}</td>
                  <td>{mov.observaciones}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  No se encontraron movimientos con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Movimientos;
 