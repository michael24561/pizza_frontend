import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useSucursal } from '../contexts/SucursalContext';
import api from '../api';
import './Carrito.css';

const CartPage = () => {
  const { user, authLoading } = useContext(AuthContext);
  const { sucursalSeleccionada } = useSucursal();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Si la sesión aún está cargando, esperamos a que termine
    if (authLoading) return;

    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchCart = async () => {
    setLoading(true); // Aseguramos que se inicie el estado de carga
    try {
      const response = await api.get('/carritos/', {
        params: { cliente_id: user.id_cliente }
      });

      if (response.data.length > 0) {
        setCart(response.data[0]);
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setError("No pudimos cargar tu carrito. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    try {
      await api.patch(`/carritos-items/${itemId}/`, { cantidad: newQty });
      // Refetch para asegurar totales y subtotales correctos del backend
      fetchCart();
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm("¿Seguro que quieres quitar este producto?")) return;

    try {
      await api.delete(`/carritos-items/${itemId}/`);
      // Refetch para asegurar totales correctos del backend
      fetchCart();
    } catch (error) {
      console.error("Error al eliminar item:", error);
    }
  };

  const handleCheckout = async () => {
    if (!sucursalSeleccionada) {
      alert("Por favor, selecciona una sucursal en el menú de inicio.");
      navigate('/');
      return;
    }

    if (deliveryOption === 'delivery' && !address.trim()) {
      alert("Por favor ingresa una dirección de entrega.");
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // El backend crea el pedido y jala los items del carrito automáticamente cliente-sucursal
      const pedidoData = {
        sucursal: sucursalSeleccionada.id_sucursal,
        direccion: deliveryOption === 'pickup'
          ? `Recojo en Tienda: ${sucursalSeleccionada.direccion}`
          : address,
        cliente: user.id_cliente,
        codigo: `HP-${Math.floor(Date.now() / 1000)}`,
        estado: 'pendiente',
        tipo_entrega: deliveryOption === 'pickup' ? 'recojo' : 'delivery',
        costo_delivery: deliveryOption === 'pickup' ? '0.00' : '5.00'
      };

      const response = await api.post('/pedidos/', pedidoData);

      // Éxito: Limpiamos localmente y redirigimos al perfil para ver el pedido
      setCart(null);
      alert("¡Pedido realizado con éxito!");
      navigate('/perfil');
    } catch (error) {
      console.error("Error al procesar pedido:", error);
      const msg = error.response?.data?.error || "Hubo un error al procesar tu pedido. Verifica el stock.";
      setError(msg);
    } finally {
      setProcessing(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="cart-container text-center pt-20">
        <div className="loading-spinner mx-auto"></div>
        <p className="font-bold text-gray-500">Cargando tus sabores...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="cart-container text-center pt-20">
        <div className="bg-white p-12 rounded-3xl shadow-xl inline-block border-2 border-red-100">
          <span className="text-7xl mb-6 block">✋</span>
          <h2 className="text-3xl font-black text-gray-800">¡Casi listo!</h2>
          <p className="text-gray-500 mt-3 max-w-sm mx-auto">Inicia sesión para poder agregar productos a tu carrito y realizar pedidos.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-8 bg-red-600 text-white font-bold py-3 px-10 rounded-xl hover:bg-red-700 transition-all shadow-lg"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  // El backend ya nos da el total del carrito calculado con extras
  const cartSubtotal = cart?.total || 0;
  const deliveryFee = deliveryOption === 'delivery' ? 5.00 : 0;
  const total = parseFloat(cartSubtotal) + deliveryFee;

  return (
    <div className="cart-container">
      <h1 className="cart-title">
        <span>🛒</span> Tu Carrito de Felicidad
      </h1>

      {!cart || cart.items.length === 0 ? (
        <div className="empty-cart-container bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-200">
          <div className="empty-pizza-icon">🍕</div>
          <h2 className="text-2xl font-black text-gray-400">Tu carrito está vacío</h2>
          <p className="text-gray-400 mt-2">¡Es hora de elegir tu pizza favorita!</p>
          <button
            onClick={() => navigate('/menu')}
            className="mt-8 bg-orange-500 text-white font-black py-4 px-10 rounded-2xl hover:bg-orange-600 transition-all shadow-xl"
          >
            VER MENÚ COMPLETO
          </button>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Lista de Items */}
          <div className="cart-items-wrapper">
            {cart.items.map(item => (
              <div key={item.id_item} className="cart-item-card">
                <div className="cart-item-image">
                  {item.variante_info?.producto_imagen || item.promocion_info?.imagen ? (
                    <img
                      src={item.variante_info?.producto_imagen || item.promocion_info?.imagen}
                      alt={item.variante_info?.producto_nombre || item.promocion_info?.titulo}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '15px' }}
                    />
                  ) : (
                    <div className="emoji-icon">{item.variante_info ? '🍕' : '🎁'}</div>
                  )}
                </div>
                <div className="cart-item-info">
                  <h3 className="cart-item-name">
                    {item.variante_info?.producto_nombre || item.promocion_info?.titulo}
                  </h3>
                  <p className="cart-item-desc">
                    {item.variante_info?.producto_descripcion || item.promocion_info?.descripcion}
                  </p>
                  <span className="cart-item-variant">
                    {item.variante_info?.tamaño || 'Promoción'}
                  </span>

                  {/* MOSTRAR OPCIONES (EXTRAS, SALSAS, ETC) */}
                  {item.opciones_promocion && item.opciones_promocion.length > 0 && (
                    <div className="cart-item-options-list">
                      {item.opciones_promocion.map((opc, idx) => (
                        <div key={idx} className="cart-item-option-chip">
                          <span className="option-bullet">•</span>
                          <span className="option-name">{opc.variante_info?.producto_nombre}</span>
                          <span className="option-size">({opc.variante_info?.tamaño})</span>
                          {parseFloat(opc.variante_info?.precio) > 0 && (
                            <span className="option-price">+ S/ {opc.variante_info?.precio}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-picker">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id_item, item.cantidad, -1)}
                    >
                      -
                    </button>
                    <span className="qty-value">{item.cantidad}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id_item, item.cantidad, 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    S/ {parseFloat(item.subtotal).toFixed(2)}
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => removeItem(item.id_item)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="cart-summary-wrapper">
            <div className="summary-card">
              <h2 className="summary-title">Resumen de Pago</h2>

              {/* Sucursal Check */}
              {sucursalSeleccionada ? (
                <div className="branch-info-box">
                  <span className="branch-icon">🏪</span>
                  <div className="branch-text">
                    <h4>Preparado en:</h4>
                    <p>{sucursalSeleccionada.direccion}</p>
                  </div>
                </div>
              ) : (
                <div className="branch-info-box bg-red-50 border-red-100">
                  <span className="branch-icon">⚠️</span>
                  <div className="branch-text text-red-600">
                    <h4>Sucursal no elegida</h4>
                    <p>Selecciona una antes de pagar</p>
                  </div>
                </div>
              )}

              {/* Delivery Options */}
              <div className="delivery-toggle">
                <button
                  className={`toggle-btn ${deliveryOption === 'delivery' ? 'active' : ''}`}
                  onClick={() => setDeliveryOption('delivery')}
                >
                  🚚 Delivery
                </button>
                <button
                  className={`toggle-btn ${deliveryOption === 'pickup' ? 'active' : ''}`}
                  onClick={() => setDeliveryOption('pickup')}
                >
                  🏪 Recojo
                </button>
              </div>

              {/* Address Input */}
              {deliveryOption === 'delivery' && (
                <div className="address-section animate-fade-in">
                  <label className="address-label">Dirección de Entrega</label>
                  <input
                    type="text"
                    className="address-input"
                    placeholder="Ej: Av. Principal 123, Int 4"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}

              {/* Totals */}
              <div className="price-breakdown">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>S/ {parseFloat(cartSubtotal).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>{deliveryOption === 'delivery' ? 'Costo Delivery' : 'Ahorro Delivery'}</span>
                  <span>S/ {deliveryFee.toFixed(2)}</span>
                </div>

                {error && (
                  <div className="bg-red-50 p-3 rounded-lg text-red-600 text-xs font-bold my-4 border-l-4 border-red-500">
                    {error}
                  </div>
                )}

                <div className="summary-row total">
                  <span>Pagarás</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={processing || !sucursalSeleccionada}
              >
                {processing ? 'Procesando...' : 'FINALIZAR PEDIDO ✓'}
              </button>

              <button
                onClick={() => navigate('/menu')}
                className="w-full mt-4 text-gray-400 font-bold text-sm hover:text-red-500 transition-colors"
              >
                ← Agregar más productos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;