// frontend/src/pages/PropertiesMapPage.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PropertyMap from '../components/PropertyMap';

export default function PropertiesMapPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties');
        setProperties(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error al cargar propiedades:', err);
        setError('No se pudieron cargar las propiedades.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <section
        style={{
          marginBottom: '40px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
          Mapa de propiedades
        </h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          Explora la ubicación de las propiedades disponibles en Bogotá.
        </p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {loading ? (
          <p>Cargando mapa...</p>
        ) : (
          <PropertyMap properties={properties} height="600px" />
        )}
      </section>
    </main>
  );
}
