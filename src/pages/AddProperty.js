// frontend/src/pages/AddProperty.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AddProperty() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [propertyData, setPropertyData] = useState({
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Manejar cambio en el formulario de login
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Manejar cambio en el formulario de propiedad
  const handlePropertyChange = (e) => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
  };

  // Función para iniciar sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', loginData);
      
      // Verificar que el rol sea 'propietario'
      if (response.data.user.role !== 'propietario') {
        throw new Error('Acceso denegado. Solo propietarios pueden registrar propiedades.');
      }

      // Guardar token en localStorage (opcional)
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(err.message || 'Credenciales inválidas. Verifica tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar la propiedad
  const handleRegisterProperty = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar coordenadas
      const lng = parseFloat(propertyData.lng);
      const lat = parseFloat(propertyData.lat);
      if (isNaN(lng) || isNaN(lat)) {
        throw new Error('Coordenadas inválidas');
      }

      const propertyDataToSend = {
        title: propertyData.title,
        description: propertyData.description,
        price: parseFloat(propertyData.price),
        type: propertyData.type,
        location: {
          type: 'Point',
          coordinates: [lng, lat],
          address: propertyData.address
        }
      };

      await api.post('/properties', propertyDataToSend);
      alert('✅ Propiedad registrada exitosamente');
      navigate('/mi-cuenta');
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

      {!isLoggedIn ? (
        // Formulario de login
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      ) : (
        // Formulario de registro de propiedad
        <form onSubmit={handleRegisterProperty}>
          <div style={{ marginBottom: '15px' }}>
            <label>Título:</label>
            <input
              type="text"
              name="title"
              value={propertyData.title}
              onChange={handlePropertyChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Descripción:</label>
            <textarea
              name="description"
              value={propertyData.description}
              onChange={handlePropertyChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px', height: '80px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Precio ($):</label>
            <input
              type="number"
              name="price"
              value={propertyData.price}
              onChange={handlePropertyChange}
              required
              min="0"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Tipo:</label>
            <select
              name="type"
              value={propertyData.type}
              onChange={handlePropertyChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="habitacion">Habitación</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Dirección:</label>
            <input
              type="text"
              name="address"
              value={propertyData.address}
              onChange={handlePropertyChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Longitud (lng):</label>
            <input
              type="text"
              name="lng"
              value={propertyData.lng}
              onChange={handlePropertyChange}
              required
              placeholder="Ej: -74.0721"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Latitud (lat):</label>
            <input
              type="text"
              name="lat"
              value={propertyData.lat}
              onChange={handlePropertyChange}
              required
              placeholder="Ej: 4.6097"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
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
            {loading ? 'Registrando...' : 'Registrar Propiedad'}
          </button>
        </form>
      )}
    </div>
  );
}