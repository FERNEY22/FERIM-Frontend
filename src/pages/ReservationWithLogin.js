// frontend/src/pages/ReservationWithLogin.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ReservationWithLogin() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [reservationData, setReservationData] = useState({ startDate: '', endDate: '' });
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cargar los datos de la propiedad
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${propertyId}`);
        setProperty(res.data);
      } catch (err) {
        alert('Propiedad no encontrada');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId, navigate]);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleReservationChange = (e) => {
    setReservationData({ ...reservationData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', loginData);

      // Validar rol
      if (response.data.user.role !== 'inquilino') {
        throw new Error('Solo inquilinos pueden hacer reservas.');
      }

      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message || 'Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (new Date(reservationData.startDate) >= new Date(reservationData.endDate)) {
      setError('La fecha de inicio debe ser anterior a la de fin.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/reservations', {
        propertyId,
        startDate: reservationData.startDate,
        endDate: reservationData.endDate
      });
      alert('✅ Reserva enviada. Espera la confirmación del propietario.');
      navigate('/mi-cuenta');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al crear la reserva.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isLoggedIn ? 'Reservar Propiedad' : 'Iniciar Sesión para Reservar'}
      </h2>

      {property && !isLoggedIn && (
        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
          <h3>{property.title}</h3>
          <p><strong>Dirección:</strong> {property.location?.address}</p>
          <p><strong>Precio:</strong> ${property.price.toLocaleString('es-CO')} COP</p>
        </div>
      )}

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
              borderRadius: '4px'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      ) : (
        // Formulario de reserva
        <form onSubmit={handleSubmitReservation}>
          <div style={{ marginBottom: '15px' }}>
            <label>Fecha de inicio:</label>
            <input
              type="date"
              name="startDate"
              value={reservationData.startDate}
              onChange={handleReservationChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Fecha de fin:</label>
            <input
              type="date"
              name="endDate"
              value={reservationData.endDate}
              onChange={handleReservationChange}
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
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {loading ? 'Reservando...' : 'Enviar Solicitud de Reserva'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}