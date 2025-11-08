import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login:', loginData);
    
    // Aquí iría la lógica de autenticación
    alert('¡Bienvenido de vuelta! 🍕');
    
    // Redirigir a la página principal después de 1 segundo
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Lógica de login social
    alert(`Iniciaste sesión con ${provider} 🍕`);
    navigate('/');
  };

  return (
    <div className="auth-page-split">
      <div className="auth-container-split">
        
        {/* Lado del Formulario */}
        <div className="auth-form-side">
          <div className="form-content">
            {/* Header con logo */}
            <div className="brand-header">
              <div className="brand-logo-small">🍕</div>
              <h1 className="brand-name">Happy Pizza</h1>
            </div>

            <div className="form-header-split">
              <h2 className="form-title-split">¡Bienvenido de vuelta!</h2>
              <p className="form-subtitle-split">
                ¿No tienes cuenta?{' '}
                <button 
                  onClick={() => navigate('/register')} 
                  className="signup-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                >
                  Regístrate aquí
                </button>
              </p>
            </div>

            <form onSubmit={handleLogin} className="auth-form-split">
              <div className="form-group-split">
                <label className="form-label-split">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-input-split"
                  placeholder="tu@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group-split">
                <label className="form-label-split">Contraseña</label>
                <div className="input-wrapper-split">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input-split"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-split"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-options-split">
                <label className="checkbox-label-split">
                  <input
                    type="checkbox"
                    className="checkbox-input-split"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Recordarme</span>
                </label>
                <button 
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="forgot-link-split"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button type="submit" className="submit-btn-split">
                Iniciar Sesión
              </button>
            </form>

            <div className="divider-split">
              <span className="divider-text-split">O continúa con</span>
            </div>

            <div className="social-buttons-split">
              <button 
                className="social-btn-split google"
                onClick={() => handleSocialLogin('Google')}
              >
                <span className="social-icon-split">G</span>
                Google
              </button>
              <button 
                className="social-btn-split facebook"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <span className="social-icon-split">f</span>
                Facebook
              </button>
            </div>

            <div className="footer-links">
              <button 
                onClick={() => navigate('/privacy')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', font: 'inherit' }}
              >
                Política de Privacidad
              </button>
              <span>•</span>
              <button 
                onClick={() => navigate('/terms')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', font: 'inherit' }}
              >
                Términos de Servicio
              </button>
            </div>
          </div>
        </div>

        {/* Lado de la Ilustración */}
        <div className="auth-illustration-side">
          <div className="illustration-content">
            <div className="pizza-scene">
              <div className="stars">
                <div className="star">⭐</div>
                <div className="star">🌟</div>
                <div className="star">✨</div>
              </div>
              
              <div className="delivery-illustration">
                <div className="pizza-rocket">🍕🚀</div>
              </div>

              <div className="clouds">
                <div className="cloud cloud-1">☁️</div>
                <div className="cloud cloud-2">☁️</div>
              </div>
            </div>

            <div className="illustration-text">
              <h2>La felicidad llega a tu puerta</h2>
              <p>Disfruta de las mejores pizzas con entrega rápida y ofertas exclusivas</p>
              
              <div className="features-list">
                <div className="feature-bullet">
                  <span className="bullet-icon">⚡</span>
                  <span>Entrega en 15 minutos o menos</span>
                </div>
                <div className="feature-bullet">
                  <span className="bullet-icon">🎁</span>
                  <span>Ofertas y descuentos exclusivos</span>
                </div>
                <div className="feature-bullet">
                  <span className="bullet-icon">⭐</span>
                  <span>Acumula puntos por cada compra</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;