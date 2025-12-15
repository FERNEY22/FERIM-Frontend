// frontend/src/pages/MiCuenta.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InquilinoPanel from './InquilinoPanel';
import PropietarioPanel from './PropietarioPanel';
import api from '../services/api';

export default function MiCuenta() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); // 'inquilino', 'propietario', o null
  const [isAuthenticated, setIsAuthenticated] = useState(false); // true o false
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Para mostrar errores de la API

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      
      // 1. Si no hay token, el usuario no está autenticado.
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return; // Detenemos la ejecución aquí
      }

      // 2. Si hay token, verificamos su validez con el backend
      try {
        const response = await api.get('/auth/me');
        setUserRole(response.data.role);
        setIsAuthenticated(true);
      } catch (err) {
        // Si el token es inválido o el backend responde con error
        console.error('Token inválido o error de autenticación:', err);
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token'); // Limpiamos el token inválido
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []); // Se ejecuta solo una vez al montar el componente

  // 3. Mientras se verifica, mostramos un mensaje de carga
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Verificando tu cuenta...</p>
      </div>
    );
  }

  // 4. Si NO está autenticado, mostramos un mensaje para que inicie sesión.
  //    Esta es la parte clave que soluciona tu problema.
 
// 4. Mostrar el panel del inquilino SIEMPRE, sin importar si está logueado o no
return <InquilinoPanel />;
}