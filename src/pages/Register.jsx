import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptNewsletter: false
  });

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    if (!registerData.acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }
    
    console.log('Register:', registerData);
    // Aquí iría la lógica de registro
    alert('¡Cuenta creada exitosamente! 🎉');
    
    // Redirigir a la página principal después de 1.5 segundos
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider}`);
    // Lógica de registro social
    alert(`Te registraste con ${provider} 🎉`);
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
              <h2 className="form-title-split">¡Crea tu cuenta!</h2>
              <p className="form-subtitle-split">
                ¿Ya tienes cuenta?{' '}
                <button 
                  onClick={() => navigate('/login')} 
                  className="signup-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>

            <form onSubmit={handleRegister} className="auth-form-split">
              <div className="form-row-split">
                <div className="form-group-split">
                  <label className="form-label-split">Nombre</label>
                  <input
                    type="text"
                    className="form-input-split"
                    placeholder="Juan"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group-split">
                  <label className="form-label-split">Apellido</label>
                  <input
                    type="text"
                    className="form-input-split"
                    placeholder="Pérez"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group-split">
                <label className="form-label-split">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-input-split"
                  placeholder="tu@email.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group-split">
                <label className="form-label-split">Teléfono</label>
                <input
                  type="tel"
                  className="form-input-split"
                  placeholder="+51 999 999 999"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="form-group-split">
                <label className="form-label-split">Contraseña</label>
                <div className="input-wrapper-split">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input-split"
                    placeholder="Mínimo 8 caracteres"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    required
                    minLength={8}
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

              <div className="form-group-split">
                <label className="form-label-split">Confirmar Contraseña</label>
                <div className="input-wrapper-split">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input-split"
                    placeholder="Repite tu contraseña"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label-split full-width">
                  <input
                    type="checkbox"
                    className="checkbox-input-split"
                    checked={registerData.acceptTerms}
                    onChange={(e) => setRegisterData({...registerData, acceptTerms: e.target.checked})}
                    required
                  />
                  <span>
                    Acepto los{' '}
                    <button 
                      onClick={() => navigate('/terms')}
                      className="link-text-split"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                    >
                      términos y condiciones
                    </button>{' '}
                    y la{' '}
                    <button 
                      onClick={() => navigate('/privacy')}
                      className="link-text-split"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                    >
                      política de privacidad
                    </button>
                  </span>
                </label>

                <label className="checkbox-label-split full-width">
                  <input
                    type="checkbox"
                    className="checkbox-input-split"
                    checked={registerData.acceptNewsletter}
                    onChange={(e) => setRegisterData({...registerData, acceptNewsletter: e.target.checked})}
                  />
                  <span>
                    Quiero recibir ofertas y noticias por email
                  </span>
                </label>
              </div>

              <button type="submit" className="submit-btn-split">
                Crear Cuenta
              </button>
            </form>

            <div className="divider-split">
              <span className="divider-text-split">O regístrate con</span>
            </div>

            <div className="social-buttons-split">
              <button 
                className="social-btn-split google"
                onClick={() => handleSocialRegister('Google')}
              >
                <span className="social-icon-split">G</span>
                Google
              </button>
              <button 
                className="social-btn-split facebook"
                onClick={() => handleSocialRegister('Facebook')}
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
                <div className="pizza-box">🍕📦</div>
                <div className="celebration">
                  <div className="confetti">🎉</div>
                  <div className="confetti">🎊</div>
                  <div className="confetti">✨</div>
                </div>
              </div>

              <div className="clouds">
                <div className="cloud cloud-1">☁️</div>
                <div className="cloud cloud-2">☁️</div>
                <div className="cloud cloud-3">☁️</div>
              </div>
            </div>

            <div className="illustration-text">
              <h2>¡Únete a nuestra familia feliz!</h2>
              <p>Regístrate hoy y obtén beneficios exclusivos</p>
              
              <div className="features-list">
                <div className="feature-bullet">
                  <span className="bullet-icon">🎁</span>
                  <span>Pizza gratis en tu cumpleaños</span>
                </div>
                <div className="feature-bullet">
                  <span className="bullet-icon">⭐</span>
                  <span>Puntos por cada compra</span>
                </div>
                <div className="feature-bullet">
                  <span className="bullet-icon">💎</span>
                  <span>20% OFF en tu primer pedido</span>
                </div>
                <div className="feature-bullet">
                  <span className="bullet-icon">🚀</span>
                  <span>Pedidos más rápidos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;