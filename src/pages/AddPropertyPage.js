// frontend/src/pages/AddPropertyPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AddPropertyPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'apartamento',
    address: '',
    lng: '',
    lat: ''
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
      // Validar coordenadas
      const lng = parseFloat(formData.lng);
      const lat = parseFloat(formData.lat);
      if (isNaN(lng) || isNaN(lat)) {
        throw new Error('Coordenadas inválidas');
      }

      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        location: {
          type: 'Point',
          coordinates: [lng, lat],
          address: formData.address
        }
        // images: [] → opcional: puedes añadir upload de imágenes después
      };

      await api.post('/properties', propertyData);
      alert('✅ Propiedad registrada exitosamente');
      navigate('/mi-cuenta'); // Redirigir a mi cuenta para ver la propiedad
    } catch (err) {
      console.error('Error al registrar propiedad:', err);
      const msg = err.response?.data?.msg || 'Hubo un error. Verifica los datos e inténtalo de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registrar Nueva Propiedad</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Título:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Descripción:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required
            style={{ width: '100%', padding: '8px', marginTop: '5px', height: '80px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Precio ($):</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Tipo:</label>
          <select name="type" value={formData.type} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="habitacion">Habitación</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Dirección:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Longitud (lng):</label>
          <input type="text" name="lng" value={formData.lng} onChange={handleChange} required
            placeholder="Ej: -74.0721"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Latitud (lat):</label>
          <input type="text" name="lat" value={formData.lat} onChange={handleChange} required
            placeholder="Ej: 4.6097"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}>
          {loading ? 'Registrando...' : 'Registrar Propiedad'}
        </button>
      </form>
    </div>
  );
}