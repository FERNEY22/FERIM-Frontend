// frontend/src/pages/MaintenanceForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function MaintenanceForm() {
  const [formData, setFormData] = useState({
    email: '',
    propertyId: '',
    description: '',
    type: 'plomeria'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar que el email esté registrado y sea inquilino o propietario
      const validationRes = await api.post('/maintenance/validate-user', {
        email: formData.email
      });

      if (!validationRes.data.valid) {
        throw new Error(validationRes.data.message || 'Solo usuarios registrados pueden solicitar mantenimiento.');
      }

      // Enviar la solicitud de mantenimiento
      await api.post('/maintenance', {
        propertyId: formData.propertyId,
        description: formData.description,
        type: formData.type,
        reportedBy: formData.email // Enviamos el email para que el backend lo asocie al usuario
      });

      alert('✅ Solicitud de mantenimiento enviada. Espera la respuesta del técnico.');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Error al enviar la solicitud.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
        <h1>🔧 Solicitar Mantenimiento</h1>
        <p>Reporta cualquier problema en tu propiedad.</p>
      </header>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email registrado:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="tu@email.com"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>ID de la propiedad:</label>
          <input
            type="text"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            required
            placeholder="ID de la propiedad (ej: 675d8b2e1f2a3c4d5e6f7g8h)"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
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
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          {loading ? 'Enviando solicitud...' : 'Enviar Solicitud'}
        </button>
      </form>
    </div>
  );
}