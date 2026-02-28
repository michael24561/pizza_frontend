import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService, promocionService } from '../api/productoService';
import { carritoService } from '../api/carritoService';

const Menu = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('todo');
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState({
    todo: [],
    pizzas: [],
    bebidas: [],
    postres: [],
    extras: [],
    combos: []
  });
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'todo', name: '🔥 Todo', icon: '🔥' },
    { id: 'pizzas', name: '🍕 Pizzas', icon: '🍕' },
    { id: 'bebidas', name: '🥤 Bebidas', icon: '🥤' },
    { id: 'postres', name: '🍰 Postres', icon: '🍰' },
    { id: 'combos', name: '🎉 Combos', icon: '🎉' },
    { id: 'extras', name: '🥣 Salsas', icon: '🥣' }
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      // Fetch products and combos simultaneously
      const [productsRes, combosRes] = await Promise.all([
        productoService.getAll(),
        promocionService.getAll()
      ]);

      const products = productsRes.data;
      const combos = combosRes.data;

      // Map backend data into categorical arrays
      const categorisedMenu = {
        pizzas: [],
        bebidas: [],
        postres: [],
        extras: [],
        combos: combos.map(c => ({
          ...c,
          id: c.id_promocion,
          name: c.titulo,
          price: parseFloat(c.precio),
          image: c.imagen || '🎉'
        }))
      };

      products.forEach(p => {
        const catName = p.categoria_nombre ? p.categoria_nombre.toLowerCase() : '';
        const item = {
          ...p,
          id: p.id_producto,
          name: p.nombre,
          image: p.imagen || '🍕',
          price: p.variantes && p.variantes.length > 0 ? parseFloat(p.variantes[0].precio) : 0,
          sizes: p.variantes ? p.variantes.map(v => v.tamaño) : []
        };

        if (catName.includes('pizza')) {
          categorisedMenu.pizzas.push({ ...item, image: item.imagen || '🍕' });
        }
        else if (catName.includes('bebida') || catName.includes('gaseosa')) {
          categorisedMenu.bebidas.push({ ...item, image: item.imagen || '🥤' });
        }
        else if (catName.includes('postre')) {
          categorisedMenu.postres.push({ ...item, image: item.imagen || '🍰' });
        }
        else if (catName.includes('salsa') || catName.includes('crema')) {
          // El cliente indicó visualizar SOLO las salsas aquí
          const fallbackImg = '🥣';
          categorisedMenu.extras.push({ ...item, image: item.imagen || fallbackImg });
        }
      });

      // Armamos la categoría "Todo" juntando Combos, Pizzas y Bebidas
      categorisedMenu.todo = [...categorisedMenu.combos, ...categorisedMenu.pizzas, ...categorisedMenu.bebidas];

      setMenuItems(categorisedMenu);
    } catch (error) {
      console.error('Error fetching menu data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToDetail = (item) => {
    // Si la categoría activa es 'combos', o si estamos en 'todo' y el item es promo,
    // debemos indicarle el tipo correcto al router.
    const isPromo = activeCategory === 'combos' || ('id_promocion' in item);
    const type = isPromo ? 'promo' : 'producto';
    navigate(`/detalle/${type}/${item.id}`);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const handleViewCart = () => {
    window.location.href = '/carrito';
  };

  // Funciones de Menu carrito ya no necesitan `handleConfirmPromo` si se delega a Detalle

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
          {loading ? (
            <div className="loading-state">Cargando menú delicioso...</div>
          ) : (
            <>
              {(activeCategory === 'todo' ? ['combos', 'pizzas', 'bebidas', 'postres'] : [activeCategory]).map((catKey) => {
                const items = menuItems[catKey];

                if (!items || items.length === 0) {
                  if (activeCategory !== 'todo') {
                    return (
                      <div key={catKey} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        No hay productos disponibles en esta categoría actualmente.
                      </div>
                    );
                  }
                  return null;
                }

                // Get the display name of this category
                const catObj = categories.find(c => c.id === catKey);

                return (
                  <div key={catKey} className="category-section">
                    {activeCategory === 'todo' && catObj && (
                      <h2 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #A3D146', display: 'inline-block', paddingBottom: '5px' }}>
                        {catObj.name}
                      </h2>
                    )}
                    <div className="menu-grid" style={activeCategory === 'todo' ? { marginBottom: '40px' } : undefined}>
                      {items.map(item => (
                        <div key={item.id} className="menu-item-card">
                          {item.popular && <div className="popular-badge">🌟 Más Popular</div>}
                          {item.originalPrice && <div className="discount-badge">💥 Oferta</div>}

                          <div className="item-image" onClick={() => handleNavigateToDetail(item)} style={{ cursor: 'pointer' }}>
                            {item.image && (item.image.startsWith('http') || item.image.startsWith('/')) ? (
                              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '15px' }} />
                            ) : (
                              <div style={{ fontSize: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>{item.image}</div>
                            )}
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
                              className="btn-add-to-cart"
                              onClick={() => handleNavigateToDetail(item)}
                            >
                              Ver Opciones
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>

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