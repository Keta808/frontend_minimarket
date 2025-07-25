import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categoriaService from "../services/categoria.service";

function CategoriaForm() {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      categoriaService.getAllCategorias().then((data) => {
        const cat = data.find((c) => c._id === id);
        if (cat) setNombre(cat.nombre);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await categoriaService.updateCategoria(id, { nombre });
      } else {
        await categoriaService.createCategoria({ nombre });
      }
      navigate("/categorias");
    } catch (err) {
      console.error("Error al guardar", err);
      alert("Error al guardar categoría");
    }
  };

  return (
    <div>
      <h2>{id ? "Editar" : "Crear"} Categoría</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <br />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default CategoriaForm;
