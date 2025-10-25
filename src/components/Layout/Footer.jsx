import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`¡Gracias por suscribirte! Te enviaremos promociones a: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Sección principal compacta */}
        <div className="footer-main">
          {/* Logo y redes sociales */}
          <div className="footer-section">
            <div className="footer-brand">
              <div className="brand-logo">🍕</div>
              <div className="brand-info">
                <h3>Happy Pizza</h3>
                <p className="brand-tagline">
                  La felicidad en cada bocado
                </p>
              </div>
            </div>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
              <a href="#" className="social-link" aria-label="WhatsApp">💬</a>
            </div>
          </div>

          {/* Enlaces rápidos compactos */}
          <div className="footer-section">
            <h4 className="footer-title">Enlaces</h4>
            <nav className="footer-nav">
              <a href="/menu" className="footer-link">🍕 Menú</a>
              <a href="/pedidos" className="footer-link">📦 Pedidos</a>
              <a href="/contacto" className="footer-link">📞 Contacto</a>
              <a href="/promociones" className="footer-link">🎉 Promociones</a>
            </nav>
          </div>

          {/* Contacto compacto */}
          <div className="footer-section">
            <h4 className="footer-title">Contacto</h4>
            <div className="contact-info">
  <div className="contact-item">
    <span className="contact-icon"><i className="fas fa-map-marker-alt"></i></span>
    <span>Av. Pizza 123</span>
  </div>
  <div className="contact-item">
    <span className="contact-icon"><i className="fas fa-phone"></i></span>
    <span>+51 987 654 321</span>
  </div>
  <div className="contact-item">
    <span className="contact-icon"><i className="fas fa-clock"></i></span>
    <span>10:00 AM - 11:00 PM</span>
  </div>
</div>
          </div>

          {/* Newsletter compacto */}
          <div className="footer-section">
            <h4 className="footer-title">Newsletter</h4>
            <p className="newsletter-description">
              Recibe ofertas exclusivas
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                ✉️
              </button>
            </form>
          </div>
        </div>

        {/* Footer inferior más compacto */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; 2024 Happy Pizza</p>
          </div>
          <div className="footer-bottom-links">
            <a href="/privacidad" className="bottom-link">Privacidad</a>
            <a href="/terminos" className="bottom-link">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;