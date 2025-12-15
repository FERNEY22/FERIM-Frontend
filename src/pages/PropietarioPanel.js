// frontend/src/pages/PropietarioPanel.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function PropietarioPanel() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]); // Para las propiedades del dueño
  const [maintenanceRequests, setMaintenanceRequests] = useState([]); // Para solicitudes de mantenimiento
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        // Obtener datos del usuario
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);

        // --- IMPORTANTE: Ajusta estas rutas de API a las de tu backend ---
        // Obtener las propiedades del propietario
        const propertiesRes = await api.get('/properties/owner'); // Endpoint hipotético
        setProperties(propertiesRes.data);

        // Obtener las solicitudes de mantenimiento para sus propiedades
        const maintenanceRes = await api.get('/maintenance/owner'); // Endpoint hipotético
        setMaintenanceRequests(maintenanceRes.data);
        // --------------------------------------------------------------

      } catch (err) {
        console.error('Error al cargar datos del propietario:', err);
        alert('No se pudieron cargar tus datos. ¿Estás logueado?');
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '20px', 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '30px',
        paddingTop: '20px'
      }}>
        <h1>🔑 Panel del Propietario</h1>
        {user && <p>Bienvenido, <strong>{user.name}</strong>!</p>}
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Módulo: Mis Propiedades */}
        <section style={{
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ borderBottom: '2px solid #2ecc71', paddingBottom: '10px' }}>
            Mis Propiedades
          </h2>
          {loading ? (
            <p>Cargando...</p>
          ) : properties.length === 0 ? (
            <p>Aún no has registrado ninguna propiedad.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {properties.map(prop => (
                <li key={prop._id} style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee'
                }}>
                  <strong>{prop.title}</strong><br />
                  <strong>Dirección:</strong> {prop.address}<br />
                  <strong>Estado:</strong> 
                  <span style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    padding: '4px 10px',
                    backgroundColor: prop.isRented ? '#e74c3c' : '#2ecc71',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                  }}>
                    {prop.isRented ? 'Alquilada' : 'Disponible'}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: '20px' }}>
            <a 
              href="/add-property" 
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: '#2ecc71',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Añadir Nueva Propiedad
            </a>
          </div>
        </section>

        {/* Módulo: Solicitudes de Mantenimiento */}
        <section style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ borderBottom: '2px solid #e67e22', paddingBottom: '10px' }}>
            Solicitudes de Mantenimiento
          </h2>
          {loading ? (
            <p>Cargando...</p>
          ) : maintenanceRequests.length === 0 ? (
            <p>No tienes solicitudes de mantenimiento pendientes.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {maintenanceRequests.map(req => (
                <li key={req._id} style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee'
                }}>
                  <strong>Propiedad:</strong> {req.property.title}<br />
                  <strong>Inquilino:</strong> {req.tenant.name}<br />
                  <strong>Descripción:</strong> {req.description}<br />
                  <span style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    padding: '4px 10px',
                    backgroundColor: '#f39c12',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                  }}>
                    {req.status || 'Pendiente'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

      </main>
    </div>
  );
}