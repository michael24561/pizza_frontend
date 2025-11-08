import React, { useState } from 'react';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('pizzas');
  const [cart, setCart] = useState([]);

  const categories = [
    { id: 'pizzas', name: '🍕 Pizzas', icon: '🍕' },
    { id: 'bebidas', name: '🥤 Bebidas', icon: '🥤' },
    { id: 'postres', name: '🍰 Postres', icon: '🍰' },
    { id: 'combos', name: '🎉 Combos', icon: '🎉' },
    { id: 'extras', name: '➕ Extras', icon: '➕' }
  ];

  const menuItems = {
    pizzas: [
      {
        id: 1,
        name: "Pizza Margarita Happy",
        description: "Salsa de tomate, mozzarella fresca, albahaca y aceite de oliva",
        price: 28.90,
        image: "🍕",
        sizes: ["Personal", "Mediana", "Familiar"],
        ingredients: ["Tomate", "Mozzarella", "Albahaca"],
        popular: true
      },
      {
        id: 2,
        name: "Pizza Pepperoni Supreme",
        description: "Doble pepperoni, queso mozzarella y salsa especial de la casa",
        price: 32.90,
        image: "🍕",
        sizes: ["Personal", "Mediana", "Familiar"],
        ingredients: ["Pepperoni", "Mozzarella", "Salsa especial"],
        popular: true
      },
      {
        id: 3,
        name: "Pizza Hawaiana Feliz",
        description: "Jamón, piña, queso mozzarella y salsa barbacoa",
        price: 30.90,
        image: "🍕",
        sizes: ["Personal", "Mediana", "Familiar"],
        ingredients: ["Jamón", "Piña", "Mozzarella", "Salsa barbacoa"]
      },
      {
        id: 4,
        name: "Pizza Vegetariana",
        description: "Verduras frescas, champiñones, pimientos, aceitunas y cebolla",
        price: 29.90,
        image: "🍕",
        sizes: ["Personal", "Mediana", "Familiar"],
        ingredients: ["Pimientos", "Champiñones", "Aceitunas", "Cebolla"]
      },
      {
        id: 5,
        name: "Pizza Cuatro Quesos",
        description: "Mezcla especial de mozzarella, parmesano, gorgonzola y fontina",
        price: 34.90,
        image: "🍕",
        sizes: ["Personal", "Mediana", "Familiar"],
        ingredients: ["Mozzarella", "Parmesano", "Gorgonzola", "Fontina"]
      },
      {
        id: 6,
        name: "Pizza Carnes Premium",
        description: "Pepperoni, jamón, salchicha italiana y bacon crujiente",
        price: 36.90,
        image: "🍕",
        sizes: ["Personal", "Mediana", "Familiar"],
        ingredients: ["Pepperoni", "Jamón", "Salchicha", "Bacon"]
      }
    ],
    bebidas: [
      {
        id: 7,
        name: "Gaseosa Personal",
        description: "Refresco de 500ml - Coca Cola, Inca Kola, Sprite o Fanta",
        price: 8.90,
        image: "🥤",
        sizes: ["500ml"]
      },
      {
        id: 8,
        name: "Gaseosa Familiar",
        description: "Refresco de 2L - Ideal para compartir",
        price: 12.90,
        image: "🥤",
        sizes: ["2L"]
      },
      {
        id: 9,
        name: "Limonada Natural",
        description: "Limonada fresca con hierbabuena - 500ml",
        price: 10.90,
        image: "🍹",
        sizes: ["500ml"]
      },
      {
        id: 10,
        name: "Jugo Natural",
        description: "Jugo de frutas naturales - Naranja, Maracuyá o Fresa",
        price: 9.90,
        image: "🧃",
        sizes: ["500ml"]
      }
    ],
    postres: [
      {
        id: 11,
        name: "Brownie con Helado",
        description: "Brownie de chocolate con bola de helado de vainilla",
        price: 15.90,
        image: "🍫"
      },
      {
        id: 12,
        name: "Cheesecake de Fresa",
        description: "Delicioso cheesecake con salsa de fresa natural",
        price: 18.90,
        image: "🍰"
      },
      {
        id: 13,
        name: "Helado Artesanal",
        description: "Bola de helado - Vainilla, Chocolate o Fresa",
        price: 12.90,
        image: "🍨"
      }
    ],
    combos: [
      {
        id: 14,
        name: "Combo Familiar",
        description: "2 Pizzas Grandes + 2 Gaseosas 2L + Postre",
        price: 79.90,
        originalPrice: 95.90,
        image: "🎉",
        includes: ["2 Pizzas Grandes", "2 Gaseosas 2L", "1 Postre"]
      },
      {
        id: 15,
        name: "Combo Pareja",
        description: "1 Pizza Mediana + 2 Gaseosas Personales",
        price: 45.90,
        originalPrice: 52.90,
        image: "💑",
        includes: ["1 Pizza Mediana", "2 Gaseosas 500ml"]
      },
      {
        id: 16,
        name: "Combo Individual",
        description: "1 Pizza Personal + 1 Gaseosa Personal",
        price: 32.90,
        originalPrice: 37.80,
        image: "👤",
        includes: ["1 Pizza Personal", "1 Gaseosa 500ml"]
      }
    ],
    extras: [
      {
        id: 17,
        name: "Porción Extra de Queso",
        description: "Queso mozzarella adicional para tu pizza",
        price: 4.90,
        image: "🧀"
      },
      {
        id: 18,
        name: "Salsa Extra",
        description: "Salsa de tomate, barbacoa o ajo",
        price: 3.90,
        image: "🍅"
      },
      {
        id: 19,
        name: "Breadsticks",
        description: "6 palitos de pan con salsa de ajo",
        price: 12.90,
        image: "🥖"
      },
      {
        id: 20,
        name: "Alitas de Pollo",
        description: "6 alitas de pollo con salsa BBQ o Buffalo",
        price: 18.90,
        image: "🍗"
      }
    ]
  };

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() }]);
    // Efecto visual de agregado al carrito
    const button = document.getElementById(`add-btn-${item.id}`);
    if (button) {
      button.textContent = '✅ Agregado';
      setTimeout(() => {
        button.textContent = '🛒 Agregar';
      }, 2000);
    }
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Función para redirigir al carrito
  const handleViewCart = () => {
    window.location.href = '/carrito';
  };

  return (
    <div className="menu-page">
      {/* Header del Menú */}
      <section className="menu-hero">
        <div className="container">
          <div className="menu-header">
            <h1>🍕 Menú Happy Pizza</h1>
            <p>Explora nuestra deliciosa selección de pizzas y acompañamientos</p>
            <div className="cart-indicator">
              <span className="cart-count">🛒 {getCartCount()} items</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Items del Menú */}
      <section className="menu-items-section">
        <div className="container">
          <div className="menu-grid">
            {menuItems[activeCategory]?.map(item => (
              <div key={item.id} className="menu-item-card">
                {item.popular && <div className="popular-badge">🌟 Más Popular</div>}
                {item.originalPrice && <div className="discount-badge">💥 Oferta</div>}
                
                <div className="item-image">
                  {item.image}
                </div>
                
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  
                  {item.ingredients && (
                    <div className="ingredients">
                      <strong>Ingredientes:</strong> {item.ingredients.join(', ')}
                    </div>
                  )}
                  
                  {item.includes && (
                    <div className="combo-includes">
                      <strong>Incluye:</strong>
                      <ul>
                        {item.includes.map((include, index) => (
                          <li key={index}>✓ {include}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.sizes && (
                    <div className="sizes">
                      <strong>Tamaños:</strong>
                      <div className="size-options">
                        {item.sizes.map(size => (
                          <span key={size} className="size-option">{size}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="item-footer">
                  <div className="price-section">
                    {item.originalPrice && (
                      <span className="original-price">S/. {item.originalPrice}</span>
                    )}
                    <span className="current-price">S/. {item.price}</span>
                  </div>
                  <button
                    id={`add-btn-${item.id}`}
                    className="btn-add-to-cart"
                    onClick={() => addToCart(item)}
                  >
                    🛒 Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carrito Flotante */}
      {cart.length > 0 && (
        <div className="floating-cart">
          <div className="cart-summary">
            <span>{getCartCount()} items en el carrito</span>
            <button 
              className="btn-view-cart"
              onClick={handleViewCart}
            >
              Ver Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;