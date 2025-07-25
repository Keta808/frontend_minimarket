import axios from './root.service';


const getUsers = async () => 
{

    try {
        const res = await axios.get('/users');
        console.log(res)
        console.log(res);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

const createUser = async (data) =>
{
    try {
        const dataConRol={
            ...data,
            roles:['trabajador'],
        }
        const res = await axios.post('/users',dataConRol);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

const deleteUser  = async (id) => 
{
    try {
        const res = await axios.delete(`/users/${id}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

async function cambiarPasswordUsuario(data) {
  try {
  console.log("data llegando,",data);
    
    const {userId,actual,nueva} = data;
    const contraseñas = {actual,nueva}
    const response = await axios.put(`/users/changepassword/${userId}`, contraseñas);
    console.log("response");
    return [response.data, null];
  } catch (error) {
    const mensaje =
      error.response?.data?.message || "Error al cambiar la contraseña";
    return [null, mensaje];
  }
}

export default {
    getUsers,
    createUser,
    deleteUser,
    cambiarPasswordUsuario,
}