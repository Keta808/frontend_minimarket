import axios from './root.service';


 const registrarEntrada = async (data) => {
  try {
    const res = await axios.post("/stock/entrada", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

 const registrarSalida = async (data) => {
  try {
    const res = await axios.post("/stock/salida", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

 const revertirMovimiento = async (id, usuarioId) => {
  try {
    const res = await axios.post(`/stock/revertir/${id}`, { usuario: usuarioId });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {

    registrarSalida,
    registrarEntrada,
    revertirMovimiento,
}

