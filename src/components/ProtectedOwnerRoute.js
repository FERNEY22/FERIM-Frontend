// frontend/src/components/ProtectedOwnerRoute.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedOwnerRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Verificando permisos...</div>;
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (user?.role !== 'propietario') {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        maxWidth: '600px',
        margin: '50px auto',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px'
      }}>
        <h2>🔒 Acceso restringido</h2>
        <p>Solo los usuarios con rol de <strong>propietario</strong> pueden registrar propiedades.</p>
        <button
          onClick={() => navigate('/mi-cuenta')}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#e67e22',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Volver a mi cuenta
        </button>
      </div>
    );
  }

  return children;
}