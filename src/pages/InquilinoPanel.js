// frontend/src/pages/InquilinoPanel.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function InquilinoPanel() {
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
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

  // Cargar mis reservas y mis solicitudes de mantenimiento si está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      setReservations([]);
      setMaintenance([]);
      return;
    }
    const fetchMine = async () => {
      try {
        const [resv, mnt] = await Promise.allSettled([
          api.get('/reservations/tenant'),
          api.get('/maintenance/user'),
        ]);
        if (resv.status === 'fulfilled') setReservations(resv.value.data || []);
        if (mnt.status === 'fulfilled') setMaintenance(mnt.value.data || []);
      } catch (err) {
        console.error('Error al cargar mis datos:', err);
      }
    };
    fetchMine();
  }, [isAuthenticated]);

  const RES_COLOR = { pendiente: '#f39c12', aceptada: '#2ecc71', rechazada: '#e74c3c' };
  const MNT_COLOR = { pendiente: '#f39c12', en_progreso: '#3498db', resuelto: '#2ecc71', cerrado: '#7f8c8d' };
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('es-CO') : '—');

  const handleReserve = (propertyId) => {
    if (!isAuthenticated) {
      // Si no está logueado, redirige a login y luego vuelve
      localStorage.setItem('redirectAfterLogin', `/reservar/${propertyId}`);
      navigate('/login');
    } else {
      navigate(`/reservar/${propertyId}`);
    }
  };

  const handleReportMaintenance = (propertyId) => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', `/solicitar-mantenimiento/${propertyId}`);
      navigate('/login');
    } else {
      navigate(`/solicitar-mantenimiento/${propertyId}`);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
        <h1>🏠 Propiedades Disponibles</h1>
        {!isAuthenticated && (
          <p style={{ color: '#e67e22' }}>Inicia sesión para poder reservar.</p>
        )}
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Mis reservas (solo autenticado) */}
        {isAuthenticated && (
          <section style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ borderBottom: '2px solid #9b59b6', paddingBottom: '10px' }}>Mis reservas</h2>
            {reservations.length === 0 ? (
              <p>Aún no tienes reservas.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {reservations.map((r) => (
                  <li key={r._id} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <strong>{r.property?.title || 'Propiedad'}</strong>
                      <span style={{
                        padding: '4px 10px',
                        backgroundColor: RES_COLOR[r.status] || '#999',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                      }}>{r.status}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#555', margin: '6px 0 0 0' }}>
                      {fmtDate(r.startDate)} → {fmtDate(r.endDate)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Mis solicitudes de mantenimiento (solo autenticado) */}
        {isAuthenticated && (
          <section style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ borderBottom: '2px solid #e67e22', paddingBottom: '10px' }}>Mis solicitudes de mantenimiento</h2>
            {maintenance.length === 0 ? (
              <p>No has reportado mantenimientos.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {maintenance.map((m) => (
                  <li key={m._id} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <strong>{m.property?.title || 'Propiedad'}</strong>
                      <span style={{
                        padding: '4px 10px',
                        backgroundColor: MNT_COLOR[m.status] || '#999',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                      }}>{m.status}</span>
                    </div>
                    <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem' }}>{m.description}</p>
                    {m.assignedTo && (
                      <p style={{ fontSize: '0.8rem', color: '#777', margin: '4px 0 0 0' }}>
                        Técnico: {m.assignedTo.name} {m.assignedTo.lastname || ''}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

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
                  {prop.images?.[0]?.url && (
                    <img
                      src={prop.images[0].url}
                      alt={prop.title}
                      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                    />
                  )}
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
                    onClick={() => navigate(`/propiedad/${prop._id}`)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Ver detalles
                  </button>
                  <button
                    onClick={() => handleReserve(prop._id)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginTop: '8px',
                      backgroundColor: '#2ecc71',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Reservar
                  </button>
                  <button
                    onClick={() => handleReportMaintenance(prop._id)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginTop: '8px',
                      backgroundColor: '#e67e22',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Reportar mantenimiento
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}