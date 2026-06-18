// frontend/src/pages/MiCuenta.js
// Enruta al panel correcto según el rol del usuario autenticado.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InquilinoPanel from './InquilinoPanel';
import PropietarioPanel from './PropietarioPanel';
import TecnicoPanel from './TecnicoPanel';

const Centered = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div style={{ textAlign: 'center' }}>{children}</div>
  </div>
);

export default function MiCuenta() {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  // 1) Mientras se rehidrata la sesión
  if (loading) {
    return <Centered><p>Verificando tu cuenta...</p></Centered>;
  }

  // 2) No autenticado -> invitar a iniciar sesión
  if (!isAuthenticated) {
    return (
      <Centered>
        <h2>Necesitas iniciar sesión</h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          Accede para ver tu panel personal.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Iniciar sesión
        </button>
      </Centered>
    );
  }

  // 3) Autenticado -> panel según rol
  switch (user?.role) {
    case 'propietario':
      return <PropietarioPanel />;
    case 'tecnico':
      return <TecnicoPanel />;
    case 'inquilino':
    default:
      return <InquilinoPanel />;
  }
}
