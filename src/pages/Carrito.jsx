import React, { useState } from 'react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Pizza Margarita",
      description: "Salsa de tomate, mozzarella fresca y albahaca",
      price: 18.90,
      quantity: 1,
      image: "🍕",
      size: "Mediana"
    },
    {
      id: 2,
      name: "Pizza Pepperoni",
      description: "Doble pepperoni y queso mozzarella",
      price: 22.50,
      quantity: 2,
      image: "🍕",
      size: "Familiar"
    },
    {
      id: 3,
      name: "Bebida Coca-Cola",
      description: "Refresco 500ml",
      price: 8.00,
      quantity: 1,
      image: "🥤",
      size: "500ml"
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('delivery');

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = deliveryOption === 'delivery' ? 5.00 : 0;
  const discount = promoCode === 'HAPPY20' ? subtotal * 0.2 : 0;
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header del carrito */}
        <div className="cart-header">
          <h1>🛒 Tu Carrito</h1>
          <p>Revisa y confirma tu pedido</p>
        </div>

        <div className="cart-layout">
          {/* Lista de productos */}
          <div className="cart-items-section">
            <div className="section-header">
              <h2>Productos en el carrito ({cartItems.length})</h2>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>¡Agrega algunas pizzas deliciosas!</p>
                <button className="btn btn-primary">Ver Menú</button>
              </div>
            ) : (
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      {item.image}
                    </div>
                    
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      <div className="item-size">{item.size}</div>
                    </div>

                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="item-price">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <button 
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="order-summary">
            <div className="summary-card">
              <h2>Resumen del Pedido</h2>
              
              {/* Opciones de entrega */}
              <div className="delivery-options">
                <h3>Método de Entrega</h3>
                <div className="option-buttons">
                  <button
                    className={`option-btn ${deliveryOption === 'delivery' ? 'active' : ''}`}
                    onClick={() => setDeliveryOption('delivery')}
                  >
                    <span className="option-icon">🚚</span>
                    <span className="option-text">
                      <strong>Delivery</strong>
                      <small>Entrega a domicilio</small>
                    </span>
                  </button>
                  <button
                    className={`option-btn ${deliveryOption === 'pickup' ? 'active' : ''}`}
                    onClick={() => setDeliveryOption('pickup')}
                  >
                    <span className="option-icon">🏪</span>
                    <span className="option-text">
                      <strong>Recojo en tienda</strong>
                      <small>Ahorra S/ 5.00</small>
                    </span>
                  </button>
                </div>
              </div>

              {/* Código promocional */}
              <div className="promo-section">
                <h3>Código Promocional</h3>
                <div className="promo-input-group">
                  <input
                    type="text"
                    placeholder="Ingresa tu código"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="promo-input"
                  />
                  <button className="promo-btn">Aplicar</button>
                </div>
                {promoCode === 'HAPPY20' && (
                  <div className="promo-success">
                    🎉 ¡Descuento del 20% aplicado!
                  </div>
                )}
              </div>

              {/* Desglose de precios */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                
                {deliveryFee > 0 && (
                  <div className="price-row">
                    <span>Delivery:</span>
                    <span>S/ {deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="price-row discount">
                    <span>Descuento:</span>
                    <span>- S/ {discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="price-row total">
                  <span>
                    <strong>Total:</strong>
                  </span>
                  <span>
                    <strong>S/ {total.toFixed(2)}</strong>
                  </span>
                </div>
              </div>

              {/* Tiempo estimado */}
              <div className="delivery-time">
                <div className="time-icon">⏰</div>
                <div className="time-info">
                  <strong>Tiempo estimado:</strong>
                  <span>{deliveryOption === 'delivery' ? '30-45 minutos' : '15-20 minutos'}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="action-buttons">
                <button className="btn btn-secondary">
                  ← Seguir Comprando
                </button>
                <button className="btn btn-primary">
                  Proceder al Pago ✓
                </button>
              </div>
            </div>

            {/* Información adicional */}
            <div className="additional-info">
              <div className="info-card">
                <h3>📦 Política de Delivery</h3>
                <ul>
                  <li>Delivery gratis en órdenes mayores a S/ 50</li>
                  <li>Tiempo estimado: 30-45 minutos</li>
                  <li>Zona de cobertura: Distritos cercanos</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>🛡️ Garantía de Satisfacción</h3>
                <ul>
                  <li>Pizza fría = Pizza gratis</li>
                  <li>Ingredientes 100% frescos</li>
                  <li>Servicio al cliente 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;