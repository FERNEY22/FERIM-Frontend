import axios from 'axios';

// URL base de tu backend
// Si lo despliegas en Render, cambia esta URL a la de Render
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Tiempo máximo de espera para una solicitud
});

// Interceptor para añadir el token JWT a las cabeceras de las solicitudes
api.interceptors.request.use(
  (config => {
    // Recupera el token del localStorage (o donde lo guardes)
    const token = localStorage.getItem('token');
    if (token) {
      // Añade el token al header 'x-auth-token' (como lo esperas en el backend)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }),
  (error) => {
    // Si hay un error antes de enviar la solicitud
    return Promise.reject(error);
  }
);

export default api;