// frontend/src/pages/TecnicoPanel.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS = ['pendiente', 'en_progreso', 'resuelto', 'cerrado'];

const STATUS_COLOR = {
  pendiente: '#f39c12',
  en_progreso: '#3498db',
  resuelto: '#2ecc71',
  cerrado: '#7f8c8d',
};

export default function TecnicoPanel() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/maintenance/technician');
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
      setError(err.response?.data?.msg || 'No se pudieron cargar tus solicitudes asignadas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await api.put(`/maintenance/${id}`, { status });
      // Actualiza la solicitud en la lista con la respuesta del backend
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: res.data.status } : r)));
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert(err.response?.data?.msg || 'No se pudo actualizar el estado.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
        <h1>🛠️ Panel del Técnico</h1>
        {user?.name && <p>Bienvenido, <strong>{user.name}</strong></p>}
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto' }}>
        <section style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ borderBottom: '2px solid #e67e22', paddingBottom: '10px' }}>
            Solicitudes asignadas
          </h2>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {loading ? (
            <p>Cargando solicitudes...</p>
          ) : requests.length === 0 ? (
            <p>No tienes solicitudes de mantenimiento asignadas.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {requests.map((req) => (
                <li
                  key={req._id}
                  style={{
                    padding: '16px',
                    marginBottom: '12px',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <strong>{req.property?.title || 'Propiedad'}</strong>
                    <span
                      style={{
                        padding: '4px 10px',
                        backgroundColor: STATUS_COLOR[req.status] || '#999',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                      }}
                    >
                      {req.status}
                    </span>
                  </div>
                  {req.property?.location?.address && (
                    <p style={{ fontSize: '0.85rem', color: '#777', margin: '6px 0' }}>
                      📍 {req.property.location.address}
                    </p>
                  )}
                  <p style={{ margin: '6px 0' }}>{req.description}</p>
                  {req.reportedBy && (
                    <p style={{ fontSize: '0.85rem', color: '#555', margin: '6px 0' }}>
                      Reportado por: {req.reportedBy.name} {req.reportedBy.lastname || ''}
                    </p>
                  )}

                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '0.85rem', marginRight: '8px' }}>Cambiar estado:</label>
                    <select
                      value={req.status}
                      disabled={updatingId === req._id}
                      onChange={(e) => handleStatusChange(req._id, e.target.value)}
                      style={{ padding: '6px', borderRadius: '4px' }}
                    >
                      {STATUS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {updatingId === req._id && <span style={{ marginLeft: '8px', fontSize: '0.8rem' }}>Guardando...</span>}
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
