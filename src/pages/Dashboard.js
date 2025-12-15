// frontend/src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const propertyTypes = [
    {
      id: 'apartamento',
      name: 'Apartamentos',
      description: 'Espacios modernos y cómodos en zonas urbanas.',
      icon: '🏙️',
    },
    {
      id: 'casa',
      name: 'Casas',
      description: 'Hogares familiares con patio y mayor privacidad.',
      icon: '🏡',
    },
    {
      id: 'habitacion',
      name: 'Habitaciones',
      description: 'Soluciones económicas para estudiantes o jóvenes profesionales.',
      icon: '🛏️',
    },
    {
      id: 'apartaestudio',
      name: 'Apartaestudios',
      description: 'Todo en un solo espacio: ideal para vida minimalista.',
      icon: '🏠',
    },
    {
      id: 'local',
      name: 'Locales Comerciales',
      description: 'Espacios estratégicos para tu negocio en Bogotá.',
      icon: '🏢',
    },
    {
      id: 'finca',
      name: 'Fincas y Fines de Semana',
      description: 'Escápate del bullicio a un lugar tranquilo y natural.',
      icon: '🌳',
    },
  ];

  return (
    <div style={{ 
      fontFamily: 'Segoe UI, Arial, sans-serif', 
      padding: '20px', 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Encabezado */}
      <header style={{
        textAlign: 'center',
        marginBottom: '40px',
        paddingTop: '20px'
      }}>
        <h1 style={{ 
          color: '#2c3e50', 
          fontSize: '2.5rem', 
          marginBottom: '12px' 
        }}>
          Explora tu Próximo Hogar
        </h1>
        <p style={{ 
          color: '#7f8c8d', 
          fontSize: '1.1rem',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Encuentra el tipo de vivienda que mejor se adapta a tu estilo de vida. 
          En FERIM, cada espacio cuenta una historia.
        </p>
      </header>

      {/* Cuadrícula de tipos de propiedad */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {propertyTypes.map((type) => (
            <div
              key={type.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid #eee'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                textAlign: 'center',
                padding: '30px 20px 20px',
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '16px'
                }}>
                  {type.icon}
                </div>
                <h3 style={{
                  margin: '0 0 12px',
                  fontSize: '1.4rem',
                  color: '#2c3e50'
                }}>
                  {type.name}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#555',
                  lineHeight: 1.5,
                  marginBottom: '20px'
                }}>
                  {type.description}
                </p>
                <Link
                  to={`/properties/${type.id}`}
                  style={{
                    display: 'inline-block',
                    padding: '8px 24px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '20px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                >
                  Ver opciones
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <div style={{
          textAlign: 'center',
          marginTop: '50px',
          padding: '30px',
          backgroundColor: '#2c3e50',
          borderRadius: '12px',
          color: 'white'
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '1.8rem' }}>
            ¿No encuentras lo que buscas?
          </h2>
          <p style={{ marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px' }}>
            Publica tus necesidades y te ayudamos a encontrar el inmueble ideal.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-block',
              padding: '10px 30px',
              backgroundColor: '#e74c3c',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '24px',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}
          >
            Registrarse como Inquilino
          </Link>
        </div>
      </main>
    </div>
  );
}