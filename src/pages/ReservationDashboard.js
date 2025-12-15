// frontend/src/pages/ReservationDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReservationDashboard() {
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties');
        setProperties(res.data);
      } catch (err) {
        console.error('Error al cargar propiedades:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleReserve = (propertyId) => {
    if (!isAuthenticated) {
      // Guardar la ruta de destino para redirigir después del login
      localStorage.setItem('redirectAfterLogin', `/reservar/${propertyId}`);
      navigate('/login');
    } else {
      navigate(`/reservar/${propertyId}`);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
        <h1>🏠 Propiedades Disponibles</h1>
        {!isAuthenticated && (
          <p style={{ color: '#e67e22', fontSize: '0.95rem' }}>
            Inicia sesión para poder hacer reservas.
          </p>
        )}
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <section style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>Explora y Reserva</h2>
          {loading ? (
            <p>Cargando propiedades...</p>
          ) : properties.length === 0 ? (
            <p>No hay propiedades disponibles.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {properties.map(prop => (
                <div key={prop._id} style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  border: '1px solid #eee'
                }}>
                  <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{prop.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '12px', lineHeight: 1.4 }}>
                    {prop.description.substring(0, 100)}{prop.description.length > 100 ? '...' : ''}
                  </p>
                  <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    ${prop.price.toLocaleString('es-CO')} COP
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#777', marginBottom: '12px' }}>
                    <strong>Dirección:</strong> {prop.location?.address || 'Sin dirección'}
                  </p>
                  {prop.owner && (
                    <p style={{ fontSize: '0.85rem', color: '#333', marginBottom: '12px' }}>
                      <strong>Propietario:</strong><br />
                      <span style={{ fontSize: '0.8rem' }}>{prop.owner.name}</span>
                    </p>
                  )}
                  <button
                    onClick={() => handleReserve(prop._id)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#2ecc71',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Reservar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>


<a
  href="/solicitar-mantenimiento"
  style={{
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#e67e22',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    marginTop: '20px'
  }}
>
  Solicitar Mantenimiento
</a>



      </main>
    </div>
  );
}