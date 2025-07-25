function handleError (error) {
  if (error.response) {
    console.error("⚠️ Error del backend:", error.response.data);
    return { data: null, error: error.response.data };
  } else if (error.request) {
    console.error("⚠️ No hubo respuesta del servidor:", error.request);
    return {
      data: null,
      error: { message: "No hay respuesta del servidor. Verifica tu conexión." }
    };
  } else {
    console.error("⚠️ Error inesperado:", error.message);
    return {
      data: null,
      error: { message: error.message || "Error desconocido." }
    };
  }
};


export {handleError};