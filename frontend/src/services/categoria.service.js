import axios from './root.service';
import {handleError} from '../utils/handleError';

const getAllCategorias = async () => {
  const res = await axios.get('/categoria');
  console.log(res);
  return res.data.data;
};

const getCategoriasConDetalleProductos = async () => {
  const res = await axios.get('/categoria/getCategoriasConDetalleProductos');
  console.log(res);
  return res.data.data;
};


async function createCategoria(data) {
  try {
    const res = await axios.post("/categoria", data);
    return res.data;
  } catch (error) {
    return handleError(error);
  } 
}

async function updateCategoria(id, data) {
  try {
    const res = await axios.put(`/categoria/${id}`, data);
    return { data: res.data, error: null };
  } catch (error) {
    return { data: null, error: handleError(error) };
  }
}

async function deleteCategoria(id) {
  const res = await axios.delete(`/categoria/${id}`);
  return res.data;
}


export default {
  getAllCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoriasConDetalleProductos
};
