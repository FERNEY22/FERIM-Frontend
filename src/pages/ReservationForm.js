// frontend/src/pages/ReservationForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ReservationForm() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
  email: '',
  startDate: '',
  endDate: ''
});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos de la propiedad
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${propertyId}`);
        setProperty(res.data);
      } catch (err) {
        alert('Propiedad no encontrada');
        navigate('/mi-cuenta');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setError('');

  // Validar fechas
  if (new Date(formData.startDate) >= new Date(formData.endDate)) {
    setError('La fecha de inicio debe ser anterior a la de fin.');
    setSubmitting(false);
    return;
  }

  try {
    // Validar que el email esté registrado y sea inquilino
    const validationRes = await api.post('/reservations/validate-tenant', {
      email: formData.email
    });

    if (!validationRes.data.valid) {
      setError(validationRes.data.message || 'Solo inquilinos registrados pueden hacer reservas.');
      setSubmitting(false);
      return;
    }

    // Crear la reserva
    await api.post('/reservations', {
      propertyId,
      tenantEmail: formData.email, // En lugar de depender del token
      startDate: formData.startDate,
      endDate: formData.endDate
    });

    alert('✅ Reserva enviada. Espera la confirmación del propietario.');
    navigate('/'); // Vuelve al inicio
  } catch (err) {
    const msg = err.response?.data?.msg || 'Error al crear la reserva.';
    setError(msg);
  } finally {
    setSubmitting(false);
  }
};

  if (loading) return <p style={{ textAlign: 'center', padding: '40px' }}>Cargando propiedad...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reservar Propiedad</h2>
      {property && (
        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
          <h3>{property.title}</h3>
          <p><strong>Dirección:</strong> {property.location?.address}</p>
          <p><strong>Precio:</strong> ${property.price.toLocaleString('es-CO')} COP</p>
        </div>
      )}

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
          <label>Fecha de inicio:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Fecha de fin:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {submitting ? 'Enviando...' : 'Enviar Solicitud de Reserva'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/mi-cuenta')}
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
    </div>
  );
}