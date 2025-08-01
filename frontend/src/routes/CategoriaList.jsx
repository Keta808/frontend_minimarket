import { useEffect, useState } from "react";
import categoriaService from "../services/categoria.service";
import '../styles/categoriaslist.css';
import Header from '../components/Header.jsx';

function CategoriaList() {
  const [categorias, setCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [mostrarModalFormulario, setMostrarModalFormulario] = useState(false);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [productosDetalle, setProductosDetalle] = useState([]);
  const [categoriaDetalleNombre, setCategoriaDetalleNombre] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [ordenAscendente, setOrdenAscendente] = useState(true);



  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoriaService.getCategoriasConDetalleProductos();
        setCategorias(data);
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };
    fetchCategorias();
  }, []);

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNombreCategoria("");
    setCategoriaEditando(null);
    setMostrarModalFormulario(true);
  };

  const abrirModalEditar = (categoria) => {
    setModoEdicion(true);
    setNombreCategoria(categoria.nombre);
    setCategoriaEditando(categoria);
    setMostrarModalFormulario(true);
  };

const guardarCategoria = async () => {
  if (!nombreCategoria.trim()) return alert("Nombre requerido");

  if (modoEdicion && categoriaEditando) {
    const { data: actualizada, error } = await categoriaService.updateCategoria(
      categoriaEditando._id,
      { nombre: nombreCategoria }
    );

    if (error) {
      console.error("Error al actualizar categoría:", error);
      alert(error.message || "No se pudo actualizar la categoría");
      return;
    }

    setCategorias(categorias.map((cat) =>
      cat._id === actualizada._id ? actualizada : cat
    ));
  } else {
    const { data: nueva, error } = await categoriaService.createCategoria({
      nombre: nombreCategoria
    });

    if (error) {
      console.error("Error al crear categoría:", error);
      alert(error.message || "No se pudo crear la categoría");
      return;
    }

    setCategorias([...categorias, nueva]);
  }

  setMostrarModalFormulario(false);
  setNombreCategoria("");
  setCategoriaEditando(null);
  setModoEdicion(false);
};


  const eliminarCategoria = async () => {
    try {
      await categoriaService.deleteCategoria(categoriaAEliminar._id);
      setCategorias(categorias.filter((c) => c._id !== categoriaAEliminar._id));
      setMostrarModal(false);
      setCategoriaAEliminar(null);
    } catch (err) {
      console.error("Error al eliminar categoría", err);
      alert("No se pudo eliminar la categoría");
    }
  };

  const abrirModalDetalleProductos = (categoria) => {
    setProductosDetalle(categoria.productos || []);
    setCategoriaDetalleNombre(categoria.categoria || categoria.nombre || "");
    setMostrarModalDetalle(true);
  };

  const cerrarModalDetalle = () => {
    setMostrarModalDetalle(false);
    setProductosDetalle([]);
    setCategoriaDetalleNombre("");
  };


  const categoriasFiltradas = categorias
    .filter(cat => (cat.nombre || cat.categoria).toLowerCase().includes(filtroNombre.toLowerCase()))
    .sort((a, b) => {
      const nombreA = (a.nombre || a.categoria).toLowerCase();
      const nombreB = (b.nombre || b.categoria).toLowerCase();
      if (ordenAscendente) return nombreA.localeCompare(nombreB);
      return nombreB.localeCompare(nombreA);
    });

  return (
    <div className="categoria-list-container">
      <Header />
      <h2>Listado de Categorías</h2>

      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #555",
            backgroundColor: "#1e1e1e",
            color: "white",
            flex: 1,
            marginRight: "1rem"
          }}
        />
        <button
          onClick={() => setOrdenAscendente(!ordenAscendente)}
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
          Ordenar {ordenAscendente ? "↓" : "↑"}
        </button>
      </div>

      <table className="categoria-table" cellPadding="5">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categoriasFiltradas.map((cat, index) => (
            <tr key={index}>
              <td>{cat.categoria || cat.nombre}</td>
              <td className="cantidad-productos-cell">
                {cat.cantidadProductos}
                {cat.cantidadProductos > 0 && (
                  <button
                    className="ver-detalle-btn"
                    onClick={() => abrirModalDetalleProductos(cat)}
                  >
                    ver
                  </button>
                )}
              </td>
              <td className="categoria-actions">
                <button onClick={() => abrirModalEditar(cat)}>Editar</button>
                <button
                  className="delete-button"
                  onClick={() => {
                    setCategoriaAEliminar(cat);
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

      <button className="crear-categoria-btn" onClick={abrirModalCrear}>
        Crear Categoría
      </button>

     
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              ¿Eliminar la categoría <strong>{categoriaAEliminar?.categoria || categoriaAEliminar?.nombre}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={eliminarCategoria}>
                Sí, eliminar
              </button>
              <button className="cancel-btn" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

     
      {mostrarModalFormulario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modoEdicion ? "Editar Categoría" : "Nueva Categoría"}</h3>
            <input
              type="text"
              value={nombreCategoria || ""}
              onChange={(e) => setNombreCategoria(e.target.value)}
              placeholder="Nombre de la categoría"
            />
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={guardarCategoria}>
                Guardar
              </button>
              <button className="cancel-btn" onClick={() => setMostrarModalFormulario(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

     
      {mostrarModalDetalle && (
        <div className="modal-overlay">
          <div className="modal-content modal-detalle-productos">
            <h3>Productos en categoría: <strong>{categoriaDetalleNombre}</strong></h3>
            {productosDetalle.length === 0 ? (
              <p>No hay productos en esta categoría.</p>
            ) : (
              <ul>
                {productosDetalle.map((prod, i) => (
                  <li key={i}>{prod}</li>
                ))}
              </ul>
            )}
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={cerrarModalDetalle}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriaList;
