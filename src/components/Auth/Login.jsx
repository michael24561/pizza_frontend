import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ onClose, onSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);
    
    if (result.success) {
      onSuccess?.();
      onClose?.();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
        padding: '3rem',
        borderRadius: '24px',
        border: '3px solid transparent',
        backgroundClip: 'padding-box',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        width: '90%',
        maxWidth: '400px'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--pizza-red)'
          }}
        >
          ✕
        </button>

        <h2 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: 'var(--pizza-red)',
          fontSize: '2rem',
          fontWeight: '900'
        }}>
          🍕 Iniciar Sesión
        </h2>

        {error && (
          <div style={{
            background: 'var(--pizza-light-red)',
            color: 'var(--pizza-red)',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '2px solid var(--pizza-red)',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              Usuario
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid var(--border-color)',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'var(--transition)'
              }}
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid var(--border-color)',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'var(--transition)'
              }}
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? '⏳ Iniciando...' : '🚀 Iniciar Sesión'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: 'var(--text-secondary)'
        }}>
          ¿No tienes cuenta? <a href="#" style={{ color: 'var(--pizza-red)', fontWeight: '600' }}>Regístrate</a>
        </div>
      </div>
    </div>
  );
};

export default Login;