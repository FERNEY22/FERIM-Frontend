// frontend/src/pages/PropertyDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(0); // índice de imagen activa

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error('Error al cargar la propiedad:', err);
        setError('No se pudo cargar la propiedad.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const goReserve = () => {
    if (!isAuthenticated) localStorage.setItem('redirectAfterLogin', `/reservar/${id}`);
    navigate(`/reservar/${id}`);
  };

  const goMaintenance = () => {
    if (!isAuthenticated) localStorage.setItem('redirectAfterLogin', `/solicitar-mantenimiento/${id}`);
    navigate(`/solicitar-mantenimiento/${id}`);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando propiedad...</div>;
  if (error || !property) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'red' }}>{error || 'Propiedad no encontrada.'}</p>
        <button onClick={() => navigate('/')} style={btn('#3498db')}>Volver al inicio</button>
      </div>
    );
  }

  const images = Array.isArray(property.images) ? property.images : [];
  const mainImg = images[selected]?.url;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{ ...btn('#95a5a6'), marginBottom: '16px' }}>← Volver</button>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {/* Galería */}
        {images.length > 0 ? (
          <div>
            <img
              src={mainImg}
              alt={property.title}
              style={{ width: '100%', height: '380px', objectFit: 'cover' }}
            />
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', padding: '10px', flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <img
                    key={img._id || i}
                    src={img.url}
                    alt={`${property.title} ${i + 1}`}
                    onClick={() => setSelected(i)}
                    style={{
                      width: '80px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: i === selected ? '3px solid #3498db' : '1px solid #ddd',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#999' }}>
            Sin imágenes
          </div>
        )}

        {/* Información */}
        <div style={{ padding: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0' }}>{property.title}</h1>
          <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 12px 0' }}>
            ${Number(property.price).toLocaleString('es-CO')} COP
          </p>
          <p style={{ color: '#666', marginBottom: '8px' }}>
            <strong>Tipo:</strong> {property.type}
          </p>
          <p style={{ color: '#666', marginBottom: '8px' }}>
            <strong>Dirección:</strong> {property.location?.address || 'Sin dirección'}
          </p>
          {property.owner?.name && (
            <p style={{ color: '#666', marginBottom: '16px' }}>
              <strong>Publicado por:</strong> {property.owner.name} {property.owner.lastname || ''}
            </p>
          )}
          <p style={{ lineHeight: 1.6, marginBottom: '24px' }}>{property.description}</p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={goReserve} style={btn('#2ecc71')}>Reservar</button>
            <button onClick={goMaintenance} style={btn('#e67e22')}>Reportar mantenimiento</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const btn = (bg) => ({
  padding: '10px 20px',
  backgroundColor: bg,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
});
