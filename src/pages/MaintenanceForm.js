// frontend/src/pages/MaintenanceForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MaintenanceForm() {
  const { propertyId: propertyIdParam } = useParams();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    propertyId: propertyIdParam || '',
    description: '',
    type: 'plomeria',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar propiedades para el selector:
  // - propietario: solo sus propiedades
  // - inquilino: todas las disponibles
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchProperties = async () => {
      try {
        const endpoint = user?.role === 'propietario' ? '/properties/owner/me' : '/properties';
        const res = await api.get(endpoint);
        setProperties(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error al cargar propiedades:', err);
      }
    };
    fetchProperties();
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // El backend asocia la solicitud al usuario autenticado (token). No se envía email.
      await api.post('/maintenance', {
        propertyId: formData.propertyId,
        description: formData.description,
        type: formData.type,
      });
      alert('✅ Solicitud de mantenimiento enviada. El propietario la gestionará.');
      navigate('/mi-cuenta');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando...</div>;
  }

  // Requiere sesión: el endpoint POST /maintenance está protegido
  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', maxWidth: '500px', margin: '40px auto' }}>
        <h2>🔧 Solicitar Mantenimiento</h2>
        <p style={{ color: '#666' }}>Debes iniciar sesión para reportar un problema.</p>
        <button
          onClick={() => {
            localStorage.setItem('redirectAfterLogin', '/solicitar-mantenimiento');
            navigate('/login');
          }}
          style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
        <h1>🔧 Solicitar Mantenimiento</h1>
        <p>Reporta un problema; el propietario lo gestionará y asignará un técnico.</p>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto' }}>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <label>Propiedad:</label>
            <select
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">— Selecciona una propiedad —</option>
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title} {p.location?.address ? `· ${p.location.address}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Descripción del problema:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe el problema en detalle."
              style={{ width: '100%', padding: '8px', marginTop: '5px', height: '80px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Tipo de falla:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="plomeria">Plomería</option>
              <option value="electricidad">Electricidad</option>
              <option value="estructural">Estructural</option>
              <option value="pintura">Pintura</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.propertyId}
            style={{ width: '100%', padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}
          >
            {loading ? 'Enviando solicitud...' : 'Enviar Solicitud'}
          </button>
        </form>
      </main>
    </div>
  );
}
