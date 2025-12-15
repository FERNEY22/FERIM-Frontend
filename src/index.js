import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa createRoot desde react-dom/client
import App from './App'; // Asegúrate de que la ruta sea correcta

// Obtiene el elemento raíz del DOM (el div con id="root" en public/index.html)
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza la aplicación React dentro de ese elemento raíz
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);