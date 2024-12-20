import axios from 'axios';

export default defineNuxtPlugin(() => {
  const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Cambia esto por la URL de tu backend
    timeout: 10000, // Tiempo de espera en milisegundos
  });

  // Retorna la instancia para usarla globalmente
  return {
    provide: {
      axios: axiosInstance,
    },
  };
});
