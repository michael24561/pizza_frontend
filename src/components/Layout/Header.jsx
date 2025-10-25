import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderClick = () => {
    window.location.href = '/menu';
  };

  // Función para redirigir al carrito
  const handleCartClick = () => {
    window.location.href = '/carrito';
  };

  // Nueva función para redirigir al perfil
  const handleProfileClick = () => {
    window.location.href = '/perfil';
  };

  // Función para navegación general
  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Navegación Principal */}
      <nav className="main-nav">
        <div className="container">
          <div className="nav-content">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon">🍕</div>
              <div className="logo-text">
                <h1>Happy Pizza</h1>
                <p>¡La felicidad en cada bocado!</p>
              </div>
            </div>

            {/* Menú de Navegación */}
            <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
              <a 
                href="/" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/');
                }}
              >
                <span className="nav-icon">🏠</span>
                Inicio
              </a>
              <a 
                href="/menu" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/menu');
                }}
              >
                <span className="nav-icon">🍕</span>
                Menú
              </a>
              <a 
                href="/pedidos" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/pedidos');
                }}
              >
                <span className="nav-icon">📦</span>
                Mis Pedidos
              </a>
              <a 
                href="/contacto" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/contacto');
                }}
              >
                <span className="nav-icon">📞</span>
                Contacto
              </a>
              <button 
                className="btn-order"
                onClick={handleOrderClick}
              >
                <span className="btn-icon">🚀</span>
                Ordenar Ahora
              </button>
            </div>

            {/* Carrito y Usuario */}
            <div className="nav-actions">
              <button 
                className="cart-btn"
                onClick={handleCartClick}
                aria-label="Ver carrito"
              >
                <span className="cart-icon">🛒</span>
                <span className="cart-count">0</span>
              </button>
              <button 
                className="user-btn"
                onClick={handleProfileClick}
                aria-label="Mi cuenta"
              >
                <span className="user-icon">👤</span>
              </button>
              <button 
                className="menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className="toggle-bar"></span>
                <span className="toggle-bar"></span>
                <span className="toggle-bar"></span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;