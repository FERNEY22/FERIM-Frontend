// frontend/src/pages/PropertyListByType.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TYPE_LABELS = {
  apartamento: 'Apartamentos',
  casa: 'Casas',
  habitacion: 'Habitaciones',
  apartaestudio: 'Apartaestudios',
  local: 'Locales Comerciales',
  finca: 'Fincas'
};

export default function PropertyListByType() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get(`/properties`);
        // Filtrar por tipo
        const filtered = res.data.filter(p => p.type === type);
        setProperties(filtered);
      } catch (err) {
        console.error('Error al cargar propiedades:', err);
        setError('No se pudieron cargar las propiedades.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [type]);

  const goBack = () => navigate('/dashboard');

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>{TYPE_LABELS[type] || 'Propiedades'}</h1>
        <button
          onClick={goBack}
          style={{
            marginTop: '10px',
            padding: '6px 12px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Volver al Dashboard
        </button>
      </header>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {loading ? (
        <p style={{ textAlign: 'center' }}>Cargando propiedades...</p>
      ) : properties.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No hay propiedades de este tipo disponibles.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {properties.map(prop => (
            <div key={prop._id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              border: '1px solid #eee'
            }} onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }} onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
            }}>
              <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{prop.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '12px', lineHeight: 1.4 }}>
                {prop.description.substring(0, 100)}{prop.description.length > 100 ? '...' : ''}
              </p>
              <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1rem' }}>
                ${prop.price.toLocaleString('es-CO')} COP
              </p>
              <p style={{ fontSize: '0.85rem', color: '#777', marginBottom: '12px' }}>
                <strong>Dirección:</strong> {prop.location?.address || 'Sin dirección'}
              </p>
              {prop.owner && (
                <p style={{ fontSize: '0.85rem', color: '#333', marginBottom: '0' }}>
                  <strong>Propietario:</strong><br />
                  <span style={{ fontSize: '0.8rem' }}>{prop.owner.name} — {prop.owner.email}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}