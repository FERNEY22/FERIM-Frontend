// frontend/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//import api from '../services/api';

import { useAuth } from '../context/AuthContext';

export default function Login() {
  
   
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth(); // Usa el login del contexto

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

   try {
      // Usa la función login del contexto en lugar de hacer la llamada API directamente
      await login(formData.email, formData.password);
      
      // Si el login es exitoso, el contexto se encargará de redirigir
      // Puedes redirigir manualmente si lo deseas
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/mi-cuenta';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);



    } catch (err) {
      setError('Credenciales inválidas. Verifica tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <div style={{
        width: '400px',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#2c3e50',
          fontSize: '2rem',
          marginBottom: '10px'
        }}>Iniciar Sesión</h1>
        <p style={{
          color: '#7f8c8d',
          marginBottom: '20px'
        }}>Accede a tu panel</p>

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '15px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                transition: 'border-color 0.2s'
              }}
              placeholder="tu@email.com"
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                transition: 'border-color 0.2s'
              }}
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#bdc3c7' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#2980b9')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#3498db')}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          fontSize: '0.9rem',
          color: '#7f8c8d'
        }}>
          ¿No tienes cuenta?{' '}
          <a href="/register" style={{
            color: '#9b59b6',
            textDecoration: 'underline'
          }}>
            Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  );
}


