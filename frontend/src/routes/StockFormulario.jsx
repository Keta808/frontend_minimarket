import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import stockService from '../services/stock.service';
import productoService from '../services/producto.service';
import Select from 'react-select';
import '../styles/stockformulario.css';
import Header from '../components/Header';

function StockFormulario() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tipo = searchParams.get('tipo') || 'entrada';
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  useEffect(() => {
    if (tipo !== 'entrada' && tipo !== 'salida') {
      navigate('/movimientos');
    }
  }, [tipo, navigate]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await productoService.getProductos();
        const opciones = data.map(p => ({
          value: p._id,
          label: `${p.nombre_base} ${p.presentacion}`
        }));
        setProductos(opciones);
      } catch {
        setError('Error al cargar productos');
      }
    };
    fetchProductos();
  }, []);

  const onSubmit = async (formData) => {
    try {
      const usuario = JSON.parse(localStorage.getItem('user'));
      if (!usuario) {
        setError('Usuario no autenticado');
        return;
      }

      const payload = {
        producto: formData.producto.value, 
        cantidad: Number(formData.cantidad),
        motivo: formData.motivo,
        usuario: usuario.id,
        observaciones: formData.observaciones || '',
      };

      if (tipo === 'entrada') {
        await stockService.registrarEntrada(payload);
      } else {
        await stockService.registrarSalida(payload);
      }

      alert(`Movimiento de ${tipo} registrado correctamente`);
      navigate('/movimientos');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al registrar movimiento');
    }
  };

  return (
    
    
    <div className="stock-form-container">
      <Header />
      <h2>Registrar {tipo === 'entrada' ? 'Entrada' : 'Salida'}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Producto:</label>
          <Controller
            name="producto"
            control={control}
            rules={{ required: 'Seleccione un producto' }}
            render={({ field }) => (
              <Select
                {...field}
                options={productos}
                placeholder="Buscar producto..."
                isSearchable
                classNamePrefix="react-select" 
              />
            )}
          />
          {errors.producto && <span>{errors.producto.message}</span>}
        </div>

        <div>
          <label>Cantidad:</label>
          <input
            type="number"
            min="1"
            step="1"
            {...register('cantidad', {
              required: 'La cantidad es obligatoria',
              min: {
                value: 1,
                message: 'La cantidad debe ser mayor a 0'
              }
            })}
          />
          {errors.cantidad && <span>{errors.cantidad.message}</span>}

          {errors.cantidad && <span>Ingrese una cantidad válida</span>}
        </div>

        <div>
          <label>Motivo:</label>
          <select {...register('motivo', { required: true })}>
            <option value="">Seleccione un motivo</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
          {errors.motivo && <span>Seleccione un motivo</span>}
        </div>

        <div>
          <label>Observaciones (opcional):</label>
          <textarea {...register('observaciones')} />
        </div>

        <button className="crear-producto-btn">Registrar {tipo === 'entrada' ? 'Entrada' : 'Salida'}</button>
      </form>
    </div>
    
  );
}

export default StockFormulario;
