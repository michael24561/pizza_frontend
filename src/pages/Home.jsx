import React from 'react';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Pizza Margarita Happy",
      description: "Clásica pizza con salsa de tomate, mozzarella fresca y albahaca",
      price: "28.90",
      image: "🍕",
      badge: "Más Popular"
    },
    {
      id: 2,
      name: "Pizza Pepperoni Supreme",
      description: "Doble pepperoni, queso mozzarella y nuestra salsa especial",
      price: "32.90",
      image: "🍕",
      badge: "Recomendado"
    },
    {
      id: 3,
      name: "Pizza Hawaiana Feliz",
      description: "Jamón, piña, queso mozzarella y salsa barbacoa",
      price: "30.90",
      image: "🍕",
      badge: "Nuevo"
    },
    {
      id: 4,
      name: "Pizza Vegetariana",
      description: "Verduras frescas, champiñones, pimientos y aceitunas",
      price: "29.90",
      image: "🍕",
      badge: "Saludable"
    }
  ];

  const stats = [
    { number: "5000+", label: "Clientes Felices" },
    { number: "15min", label: "Tiempo de Entrega" },
    { number: "4.9★", label: "Calificación" },
    { number: "50+", label: "Tipos de Pizza" }
  ];

  // Función para manejar el clic en "Agregar"
  const handleAddToCart = (product) => {
    // Aquí puedes agregar lógica para añadir el producto al carrito
    console.log('Producto agregado:', product);
    
    // Redirigir al carrito
    window.location.href = '/carrito';
  };

  // Función para manejar el clic en "Ordenar Ahora"
  const handleOrderNow = () => {
    window.location.href = '/menu';
  };

  // Función para manejar el clic en "Ver Menú Completo"
  const handleViewMenu = () => {
    window.location.href = '/menu';
  };

  // Función para manejar el clic en la oferta especial
  const handleSpecialOffer = () => {
    window.location.href = '/menu';
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                ¡La <span className="highlight">Felicidad</span> 
                <br />llega a tu puerta!
              </h1>
              <p className="hero-description">
                Descubre las pizzas más deliciosas y artesanales de la ciudad. 
                Ingredientes frescos, masa casera y mucho amor en cada preparación.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={handleOrderNow}>
                  🚀 Ordenar Ahora
                </button>
                <button className="btn btn-secondary" onClick={handleViewMenu}>
                  📱 Ver Menú Completo
                </button>
              </div>
              <div className="hero-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-image">
              <div className="pizza-animation">🍕</div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>🍕 Nuestras Pizzas Estrella</h2>
            <p>Las pizzas que más alegría generan entre nuestros clientes</p>
          </div>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-badge">{product.badge}</div>
                <div className="product-image">
                  {product.image}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">S/. {product.price}</span>
                    <button 
                      className="btn-add-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      🛒 Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Promociones */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-card">
            <div className="promo-content">
              <h2>🎉 ¡Oferta Especial!</h2>
              <h3>2 Pizzas Grandes + 2 Gaseosas</h3>
              <p className="promo-price">
                <span className="old-price">S/. 65.90</span>
                <span className="new-price">S/. 49.90</span>
              </p>
              <p className="promo-description">
                Perfecto para compartir en familia o con amigos. 
                ¡No dejes pasar esta oportunidad!
              </p>
              <button className="btn btn-warning" onClick={handleSpecialOffer}>
                ¡Quiero esta Oferta!
              </button>
            </div>
            <div className="promo-image">
              <div className="pizza-combo">🍕🍕🥤🥤</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Testimonios */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>⭐ Lo que dicen nuestros clientes felices</h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-text">
                "¡La mejor pizza que he probado! Ingredientes frescos y delivery super rápido."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩</div>
                <div className="author-info">
                  <div className="author-name">María González</div>
                  <div className="author-rating">★★★★★</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-text">
                "Mi familia es fanática de Happy Pizza. Los viernes de pizza son tradición en casa."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍👩‍👧‍👦</div>
                <div className="author-info">
                  <div className="author-name">Familia Rodríguez</div>
                  <div className="author-rating">★★★★★</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-text">
                "Excelente relación calidad-precio. Las promociones son increíbles."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💼</div>
                <div className="author-info">
                  <div className="author-name">Carlos López</div>
                  <div className="author-rating">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;