// frontend/src/pages/PropietarioPanel.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MNT_STATUS = ['pendiente', 'en_progreso', 'resuelto', 'cerrado'];

const badge = (bg) => ({
  display: 'inline-block',
  padding: '4px 10px',
  backgroundColor: bg,
  color: 'white',
  borderRadius: '4px',
  fontSize: '0.8rem',
});

const RES_COLOR = { pendiente: '#f39c12', aceptada: '#2ecc71', rechazada: '#e74c3c' };
const MNT_COLOR = { pendiente: '#f39c12', en_progreso: '#3498db', resuelto: '#2ecc71', cerrado: '#7f8c8d' };

export default function PropietarioPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = async () => {
    try {
      // Cada llamada es independiente; si una falla no tumba las demás
      const [propsRes, resvRes, mntRes, techRes] = await Promise.allSettled([
        api.get('/properties/owner/me'),
        api.get('/reservations/owner'),
        api.get('/maintenance/owner'),
        api.get('/auth/technicians'),
      ]);
      if (propsRes.status === 'fulfilled') setProperties(propsRes.value.data || []);
      if (resvRes.status === 'fulfilled') setReservations(resvRes.value.data || []);
      if (mntRes.status === 'fulfilled') setMaintenance(mntRes.value.data || []);
      if (techRes.status === 'fulfilled') setTechnicians(techRes.value.data || []);

      if ([propsRes, resvRes, mntRes].every((r) => r.status === 'rejected')) {
        setError('No se pudieron cargar tus datos. Verifica tu sesión.');
      }
    } catch (err) {
      console.error('Error al cargar datos del propietario:', err);
      setError('No se pudieron cargar tus datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleReservation = async (id, status) => {
    try {
      const res = await api.put(`/reservations/${id}`, { status });
      setReservations((prev) => prev.map((r) => (r._id === id ? { ...r, status: res.data.status } : r)));
    } catch (err) {
      alert(err.response?.data?.msg || 'No se pudo actualizar la reserva.');
    }
  };

  // Asignar técnico a una solicitud de mantenimiento
  const handleAssign = async (id, technicianId) => {
    if (!technicianId) return;
    try {
      const res = await api.put(`/maintenance/${id}/assign`, { technicianId });
      setMaintenance((prev) => prev.map((m) => (m._id === id ? res.data : m)));
    } catch (err) {
      alert(err.response?.data?.msg || 'No se pudo asignar el técnico.');
    }
  };

  // Actualizar estado de una solicitud
  const handleMntStatus = async (id, status) => {
    try {
      const res = await api.put(`/maintenance/${id}`, { status });
      setMaintenance((prev) => prev.map((m) => (m._id === id ? { ...m, status: res.data.status } : m)));
    } catch (err) {
      alert(err.response?.data?.msg || 'No se pudo actualizar el estado.');
    }
  };

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('es-CO') : '—');

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
        <h1>🔑 Panel del Propietario</h1>
        {user?.name && <p>Bienvenido, <strong>{user.name}</strong></p>}
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto' }}>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {/* Mis Propiedades */}
        <section style={cardStyle}>
          <h2 style={{ borderBottom: '2px solid #2ecc71', paddingBottom: '10px' }}>Mis Propiedades</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : properties.length === 0 ? (
            <p>Aún no has registrado ninguna propiedad.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {properties.map((prop) => (
                <li key={prop._id} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <strong>{prop.title}</strong><br />
                  <span style={{ fontSize: '0.85rem', color: '#777' }}>
                    📍 {prop.location?.address || 'Sin dirección'} · ${Number(prop.price).toLocaleString('es-CO')} COP · {prop.type}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: '20px' }}>
            <a href="/add-property" style={linkBtn('#2ecc71')}>Añadir Nueva Propiedad</a>
          </div>
        </section>

        {/* Reservas recibidas */}
        <section style={cardStyle}>
          <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>Reservas recibidas</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : reservations.length === 0 ? (
            <p>No tienes reservas todavía.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {reservations.map((r) => (
                <li key={r._id} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <strong>{r.property?.title || 'Propiedad'}</strong>
                    <span style={badge(RES_COLOR[r.status] || '#999')}>{r.status}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#555', margin: '6px 0' }}>
                    Inquilino: {r.tenant?.name} {r.tenant?.lastname || ''} · {fmtDate(r.startDate)} → {fmtDate(r.endDate)}
                  </p>
                  {r.status === 'pendiente' && (
                    <div style={{ marginTop: '8px' }}>
                      <button onClick={() => handleReservation(r._id, 'aceptada')} style={actionBtn('#2ecc71')}>Aceptar</button>
                      <button onClick={() => handleReservation(r._id, 'rechazada')} style={actionBtn('#e74c3c')}>Rechazar</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Mantenimiento de mis propiedades */}
        <section style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ borderBottom: '2px solid #e67e22', paddingBottom: '10px', margin: 0 }}>Solicitudes de Mantenimiento</h2>
            <button onClick={() => navigate('/solicitar-mantenimiento')} style={actionBtn('#e67e22')}>+ Crear solicitud</button>
          </div>
          {loading ? (
            <p>Cargando...</p>
          ) : maintenance.length === 0 ? (
            <p style={{ marginTop: '12px' }}>No hay solicitudes de mantenimiento en tus propiedades.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '12px' }}>
              {maintenance.map((m) => (
                <li key={m._id} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <strong>{m.property?.title || 'Propiedad'}</strong>
                    <span style={badge(MNT_COLOR[m.status] || '#999')}>{m.status}</span>
                  </div>
                  <p style={{ margin: '6px 0' }}>{m.description}</p>
                  {m.reportedBy && (
                    <p style={{ fontSize: '0.85rem', color: '#555', margin: '4px 0' }}>
                      Reportado por: {m.reportedBy.name} {m.reportedBy.lastname || ''}
                    </p>
                  )}

                  {/* Gestión: asignar técnico + estado */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', marginRight: '6px' }}>Técnico:</label>
                      <select
                        value={m.assignedTo?._id || ''}
                        onChange={(e) => handleAssign(m._id, e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px' }}
                      >
                        <option value="">— Asignar técnico —</option>
                        {technicians.map((t) => (
                          <option key={t._id} value={t._id}>{t.name} {t.lastname || ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', marginRight: '6px' }}>Estado:</label>
                      <select
                        value={m.status}
                        onChange={(e) => handleMntStatus(m._id, e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px' }}
                      >
                        {MNT_STATUS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

const cardStyle = {
  marginBottom: '30px',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
};

const linkBtn = (bg) => ({
  display: 'inline-block',
  padding: '8px 16px',
  backgroundColor: bg,
  color: 'white',
  textDecoration: 'none',
  borderRadius: '4px',
});

const actionBtn = (bg) => ({
  padding: '6px 14px',
  marginRight: '8px',
  backgroundColor: bg,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
});
