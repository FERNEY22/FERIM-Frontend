import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

// Estado inicial del contexto de autenticación
const initialState = {
  token: localStorage.getItem('token'), // Recupera el token del localStorage al iniciar
  isAuthenticated: null,
  user: null, // Aquí se almacenará la info del usuario después de loguearse

  loading: true // Añadimos loading para manejar la carga inicial 2025-dec

};

// Crear el contexto
const AuthContext = createContext();

// Reducer para manejar los diferentes estados de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      // Al iniciar sesión exitosamente, guarda el token en localStorage
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        user: action.payload.user, // Suponiendo que el backend devuelve info del usuario
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      // Al fallar el login o al hacer logout, limpia el localStorage y el estado
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false
      };
    case 'USER_LOADED':
      // Cuando se carga la info del usuario (por ejemplo, al refrescar la página)
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload, // La info del usuario viene en action.payload
        
        loading: false  //añadido dec 2025

      };
      default:
      return state;
  }
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

    // Cargar usuario al iniciar la app
  useEffect(() => {
    loadUser();
  }, []);

  // Rehidrata la sesión decodificando el payload del JWT almacenado.
  // El token lleva { user: { id, role } } y su expiración (exp), así que no
  // necesitamos un endpoint extra del backend para restaurar la sesión.
  const loadUser = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Si el token expiró, cerrar sesión
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        dispatch({ type: 'AUTH_ERROR' });
        return;
      }
      dispatch({ type: 'USER_LOADED', payload: payload.user });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      // Usa la instancia 'api' (baseURL del backend + header x-auth-token).
      // El backend ya devuelve { token, user }, así que LOGIN_SUCCESS deja la
      // sesión lista sin llamadas extra.
      const res = await api.post('/auth/login', { email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL' });
      throw err.response?.data?.msg || 'Error al iniciar sesión';
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loadUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

