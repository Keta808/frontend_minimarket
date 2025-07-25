import axios from './root.service';
import {handleError} from '../utils/handleError';

 const getProductos = async () =>
{
    try {      
        const res = await axios.get('/productos');   
        const {status,data} = res;
        if (status === 200) return data.data;

    } catch (error) {
        console.log("a");
        return handleError(error);
    }
};

const createProductos = async (data) => {
  try {
    const dataConActivo = {
      ...data,
      activo: true,
    };

    const res = await axios.post('/productos', dataConActivo);
    console.log("respuesta exitosa:", res.data);
    return res.data;

  } catch (error) {
    if (error.response) {
      console.log("Error del backend:", error);
      console.log("Detalles:", error.response.data);
      return handleError(error);
    
    } else {
      console.log("Error desconocido:", error.message);
      return handleError(error);
    }
  }
};


const getProductoById = async (id) => {
  const res = await axios.get(`/productos/${id}`);
  return res.data;
};

const updateProducto = async (id, data) => {
try {
    const dataConActivo = {
        ...data,
        activo: true,
      };
    const res = await axios.put(`/productos/${id}`, dataConActivo);
    return res.data;
} catch (error) {
  return handleError(error);
}
};

const deleteProducto = async (id) => {
  const res = axios.delete(`/productos/${id}`);
  return res.data;
}

export default {
    getProductos,
    createProductos,
    getProductoById,
    updateProducto,
    deleteProducto,
}