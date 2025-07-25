import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate,useParams } from 'react-router-dom';
import productoService from '../services/producto.service';
import categoriaService from '../services/categoria.service';
import '../styles/productoform.css';
import Header from '../components/Header';

function ProductoForm() {
  const { register, handleSubmit, reset } = useForm();
  const {id} = useParams();
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const esEdicion = Boolean(id);


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoriaService.getAllCategorias();
        setCategorias(data);
      } catch (err) {
        console.error('Error al obtener categorías:', err);
        setError('No se pudieron cargar las categorías');
      }
    };

    fetchCategorias();
  }, []);

   // Cargar datos del producto si es edición
  useEffect(() => {
    if (esEdicion) {
      const fetchProducto = async () => {
        try {
          const data = await productoService.getProductoById(id);
     
          reset({
            nombre_base: data.data.nombre_base,
            presentacion: data.data.presentacion,
            unidad_empaque: data.data.unidad_empaque,
            stock_actual: data.data.stock_actual,
          });


        } catch (err) {
          console.error('Error al cargar producto:', err);
          setError('No se pudo cargar el producto');
        }
      };

      fetchProducto();
    }
  }, [id, esEdicion, reset]);


    const onSubmit = async (formData) => {
      const { data, error } = esEdicion
        ? await productoService.updateProducto(id, formData)
        : await productoService.createProductos(formData);

      if (error) {
        console.error('❌ Error al guardar producto:', error);
        setError(error.details || 'Error al guardar producto');
        return;
      }

      navigate('/productos');
    };


  return (
     <div className="producto-form-container">
      <Header></Header>
     <h2>{esEdicion ? 'Editar Producto' : 'Crear Producto'}</h2>
            {error && <p className="producto-form-error">
          {typeof error === 'string' ? error : error.message || 'Ocurrió un error'}
        </p>}
      <form className="producto-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nombre:</label>
          <input {...register('nombre_base', { required: true })} />
        </div>

        <div>
          <label>Presentacion (Formato):</label>
          <input {...register('presentacion', { required: true })} />
        </div>
        
        <div>
          <label> Unidad empaque </label>
          <input {...register('unidad_empaque', { required: true })} />
        </div>

       <div>
          <label>Stock:</label>
          <input
            type="number"
            min="0"
            step="1"
            {...register('stock_actual', {
              required: 'El stock es obligatorio',
              min: {
                value: 0,
                message: 'El stock no puede ser negativo'
              }
            })}
          />
        </div>
        <div>
          <label>Categoría:</label>
          <select {...register('categoria')} defaultValue="">
            <option value="" disabled>Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">{esEdicion ? 'Guardar cambios' : 'Crear'}</button>
      </form>
    </div>
  );
}

export default ProductoForm;
