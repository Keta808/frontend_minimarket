import axios from "./root.service";

const getMovimientos = async () => {
  try {
    const res = await axios.get("/movimientos");
    console.log("data sdfdsfsdd: ",res.data)
    return res.data.data;
  } catch (error) {
    console.error("Error al obtener movimientos", error);
    return [];
  }
};

const getUltimosMovimientos = async () =>{
try {
  const res = await axios.get("/movimientos/ultimosMovimientos");
  return res.data.data;
} catch (error) {
  console.error("Error al obtener movimientos", error);
    return [];
}

}
 
export default {
     getMovimientos,
     getUltimosMovimientos
}