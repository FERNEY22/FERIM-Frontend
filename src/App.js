// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

//new features 13/12/15
import { AuthProvider } from './context/AuthContext'; // Asegúrate de tener este archivo
import { useAuth } from './context/AuthContext'; // Hook para acceder al estado de autenticación

import api from './services/api';
import Register from './pages/Register';
import InquilinoPanel from './pages/InquilinoPanel';
import MiCuenta from './pages/Micuenta';

// Importa tus componentes
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; // si ya lo tienes
import ReservationForm from './pages/ReservationForm';

import PropertyListByType from './pages/PropertyListByType';
import AddPropertyWithLogin from './pages/AddPropertyWithLogin';
import PropertiesByType from './pages/PropertiesByType';

import ReservationDashboard from './pages/ReservationDashboard';
import MaintenanceForm from './pages/MaintenanceForm';
import ReservationWithLogin from './pages/ReservationWithLogin';

// Componente para rutas protegidas
const PrivateRoute = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Login />;
};

function App() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties');
        setProperties(res.data);
      } catch (err) {
        console.error('Error al cargar propiedades:', err);
      }
    };
    fetchProperties();
  }, []);

  return (
    <AuthProvider>
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f5f5f5' }}>
        {/* Encabezado */}
        <header style={{
          textAlign: 'center',
          marginBottom: '30px',
          paddingTop: '20px',
          paddingBottom: '20px',
          backgroundColor: '#2c3e50',
          color: 'white'
        }}>
          <h1>FERIM – Alquiler de inmuebles en Bogotá</h1>
          <p>Encuentra tu próximo hogar con transparencia y confianza</p>
        </header>

        {/* Navegación rápida (opcional) */}
        <nav style={{
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <Link to="/" style={{ margin: '0 10px', color: '#2c3e50', textDecoration: 'none' }}>Inicio</Link>
          <Link to="/dashboard" style={{ margin: '0 10px', color: '#2c3e50', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/login" style={{ margin: '0 10px', color: '#2c3e50', textDecoration: 'none' }}>Login</Link>
          <Link to="/register" style={{ margin: '0 10px', color: '#2c3e50', textDecoration: 'none' }}>Registrar</Link>
          <Link to="/mi-cuenta" style={{ margin: '0 10px', color: '#2c3e50', textDecoration: 'none' }}>Mi Cuenta</Link>

          

          <Link to="/add-property" style={{ margin: '0 10px', color: '#e67e22', textDecoration: 'none' }}>Registrar Propiedad</Link>

        </nav>

        {/* Contenido según ruta */}
        <Routes>
          {/* Página Principal */}
          <Route path="/" element={
            <main style={{ maxWidth: '1200px', margin: '0 auto' }}>

              {/* Módulo de Propiedades Disponibles (Público) */}
<section style={{
  marginBottom: '40px',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
}}>
  <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>Propiedades disponibles</h2>
  {properties.length === 0 ? (
    <p>Cargando propiedades...</p>
  ) : (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px'
    }}>
      {properties.map((prop) => (
        <div key={prop._id} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{prop.title}</h3>
          <p style={{ fontSize: '14px', marginBottom: '10px' }}>{prop.description}</p>
          <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>$ {prop.price.toLocaleString('es-CO')} COP</p>
          <p style={{ fontSize: '12px', color: '#666' }}>Tipo: {prop.type}</p>
          <button style={{
            marginTop: '10px',
            padding: '6px 12px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Ver detalles
          </button>
        </div>
      ))}
    </div>
  )}
</section>

{/* NUEVA SECCIÓN: ¿Por qué elegir FERIM? */}
<section style={{
  marginBottom: '40px',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
}}>
  <h2 style={{ borderBottom: '2px solid #2ecc71', paddingBottom: '10px' }}>¿Por qué elegir FERIM?</h2>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  }}>
    <div style={{
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f0f8ff',
      borderRadius: '8px',
      borderLeft: '4px solid #2ecc71'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔒</div>
      <h3>Transparencia Total</h3>
      <p style={{ fontSize: '14px', color: '#555' }}>Precios claros, sin sorpresas ni comisiones ocultas.</p>
    </div>
    <div style={{
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f0f8ff',
      borderRadius: '8px',
      borderLeft: '4px solid #e67e22'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📍</div>
      <h3>Ubicaciones Premium</h3>
      <p style={{ fontSize: '14px', color: '#555' }}>Propiedades en los mejores barrios de Bogotá.</p>
    </div>
    <div style={{
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f0f8ff',
      borderRadius: '8px',
      borderLeft: '4px solid #9b59b6'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📞</div>
      <h3>Soporte 24/7</h3>
      <p style={{ fontSize: '14px', color: '#555' }}>Atención personalizada para inquilinos y propietarios.</p>
    </div>
  </div>
</section>

{/* NUEVA SECCIÓN: Para Propietarios */}
<section style={{
  marginBottom: '40px',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
}}>
  <h2 style={{ borderBottom: '2px solid #e74c3c', paddingBottom: '10px' }}>¿Eres propietario?</h2>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px'
  }}>
    <div style={{
      flex: '1',
      minWidth: '300px'
    }}>
      <p style={{ fontSize: '16px', lineHeight: 1.5, marginBottom: '20px' }}>
        Publica tus inmuebles en minutos y gestiona solicitudes de reserva, mantenimiento y pagos desde tu panel personal.
      </p>
      <Link to="/register" style={{
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#e74c3c',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: '600',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}>
        Publicar Propiedad
      </Link>
    </div>
    <div style={{
      flex: '1',
      minWidth: '200px',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f8d7da',
      borderRadius: '8px',
      border: '1px solid #f5c6cb'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏠</div>
      <p style={{ fontSize: '14px', color: '#721c24' }}>
        ¡Gana hasta un 20% más con nuestras estrategias de alquiler!
      </p>
    </div>
  </div>
</section>

{/* NUEVA SECCIÓN: Soporte y Mantenimiento */}
<section style={{
  marginBottom: '40px',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
}}>
  <h2 style={{ borderBottom: '2px solid #e67e22', paddingBottom: '10px' }}>¿Tienes un problema en tu propiedad?</h2>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px'
  }}>
    <div style={{
      flex: '1',
      minWidth: '300px'
    }}>
      <p style={{ fontSize: '16px', lineHeight: 1.5, marginBottom: '20px' }}>
        Reporta cualquier falla o necesidad de mantenimiento y un técnico calificado llegará a tu propiedad en menos de 24 horas.
      </p>
      <Link to="/dashboard" style={{
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#e67e22',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: '600',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = '#d35400'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#e67e22'}>
        Reportar Falla
      </Link>
    </div>
    <div style={{
      flex: '1',
      minWidth: '200px',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#fff3cd',
      borderRadius: '8px',
      border: '1px solid #ffeaa7'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛠️</div>
      <p style={{ fontSize: '14px', color: '#856404' }}>
        Servicio técnico certificado y garantizado.
      </p>
    </div>
  </div>
</section>

            </main>
          } />

          {/* Dashboard (Acceso Público por ahora) */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/add-property" element={<AddPropertyWithLogin />} />
          <Route path="/properties/:type" element={<PropertyListByType />} />
          <Route path="/properties/:type" element={<PropertiesByType />} />
          <Route path="/solicitar-mantenimiento" element={<MaintenanceForm />} />

          {/* Login (opcional) */}
          <Route path="/login" element={<Login />} />
            <Route path="/reservar/:propertyId" element={<ReservationForm />} />
            <Route path="/mi-cuenta" element={<ReservationDashboard />} />
            <Route path="/reservar/:propertyId" element={<ReservationWithLogin />} />

          <Route path="/register" element={<Register />} />
          <Route path="/inquilino" element={
            <PrivateRoute>
            <InquilinoPanel />
            </PrivateRoute>
            } />
          <Route path="/mi-cuenta" element={
            <PrivateRoute>
            <MiCuenta />
            </PrivateRoute>
            } />

        </Routes>

        {/* Pie de página */}
        <footer style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#2c3e50',
          color: 'white',
          fontSize: '12px'
        }}>
          © 2025 FERIM - Plataforma de Alquiler de Inmuebles en Bogotá
        </footer>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;

<button 
  onClick={() => window.location.href = '/dashboard'}
  style={{
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px'
  }}
>
  Ir al Dashboard
</button>
