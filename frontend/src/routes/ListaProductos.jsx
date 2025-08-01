import { useEffect, useState } from 'react';
import productoService from '../services/producto.service';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/productolist.css';

function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [busquedaCategoria, setBusquedaCategoria] = useState('');
  const [ordenStockAscendente, setOrdenStockAscendente] = useState(true);



  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await productoService.getProductos();
        setProductos(data);
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setError('No se pudieron cargar los productos');
      }
    };

    fetchProductos();
  }, []);

  const eliminarProducto = async () => {
    try {
      await productoService.deleteProducto(productoAEliminar._id);
      setProductos(productos.filter((p) => p._id !== productoAEliminar._id));
      setMostrarModal(false);
      setProductoAEliminar(null);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('No se pudo eliminar el producto');
    }
  };

  const productosFiltrados = productos
    .filter((p) =>
      p.nombre_base.toLowerCase().includes(busquedaNombre.toLowerCase())
    )
    .filter((p) =>
      p.categoria?.nombre
        ?.toLowerCase()
        .includes(busquedaCategoria.toLowerCase())
    )
    .sort((a, b) =>
  ordenStockAscendente
    ? a.stock_actual - b.stock_actual
    : b.stock_actual - a.stock_actual
)

  return (
    <div className="producto-list-container">
      <Header />
      <h2>Listado de Productos</h2>
      {error && <p className="producto-error">{error}</p>}

      <div className="producto-toolbar">
        <button
          className="crear-producto-btn"
          onClick={() => navigate('/productos/nuevo')}
        >
          Crear producto
        </button>

        <input
          type="text"
          placeholder="Buscar por nombre"
          className="filtro-input"
          value={busquedaNombre}
          onChange={(e) => setBusquedaNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Buscar por categoría"
          className="filtro-input"
          value={busquedaCategoria}
          onChange={(e) => setBusquedaCategoria(e.target.value)}
        />

       <button
          onClick={() => setOrdenStockAscendente(!ordenStockAscendente)}
          style={{
            padding: "0.5rem 1rem",
            fontWeight: "600",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#27ae60",
            color: "white",
            cursor: "pointer"
          }}
        >
          Ordenar por stock {ordenStockAscendente ? "↓" : "↑"}
        </button>
      </div>

      <table className="producto-table" cellPadding="5">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Unidad x empaque</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((prod) => (
            <tr key={prod._id}>
              <td>{prod.nombre_base + "  -  "+ prod.presentacion}</td>
              <td>{prod.unidad_empaque}</td>
              <td>{prod.categoria?.nombre || 'Sin categoría'}</td>
              <td>{prod.stock_actual}</td>
              <td className="producto-actions">
                <button
                  onClick={() => navigate(`/productos/editar/${prod._id}`)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => {
                    setProductoAEliminar(prod);
                    setMostrarModal(true);
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              ¿Estás seguro de que deseas eliminar el producto{' '}
              <strong>{productoAEliminar?.nombre_base}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={eliminarProducto}>
                Sí, eliminar
              </button>
              <button
                className="cancel-btn"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductoList;
