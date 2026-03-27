import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';

const Pedidos = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('activos');
  const [orders, setOrders] = useState({ activos: [], historial: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id_cliente) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/pedidos/?cliente_id=${user.id_cliente}&_t=${Date.now()}`);
      console.log('[Pedidos] API raw data:', res.data.map(o => ({ codigo: o.codigo, total: o.total, costo_delivery: o.costo_delivery })));


      const allOrders = res.data.map(order => {
        // Formatear items para que sean compatibles con el diseño
        const items = order.items.map(item => {
          const name = item.variante_info ?
            `${item.variante_info.producto_nombre} (${item.variante_info.tamaño})` :
            item.promocion_info.titulo;

          return {
            name: name,
            quantity: item.cantidad,
            price: parseFloat(item.subtotal) / item.cantidad // Subtotal ya incluye extras
          };
        });

        // Usar el total que calcula el backend correctamente (incluye extras, salsas, etc.)
        const total = parseFloat(order.total || 0);

        // Mapear estados a textos legibles y emojis
        const statusMap = {
          'pendiente': { text: '⏳ Pendiente', icon: '⏳' },
          'preparando': { text: '👨‍🍳 En preparación', icon: '👨‍🍳' },
          'en_camino': { text: '🚗 En camino', icon: '🚗' },
          'entregado': { text: '✅ Entregado', icon: '✅' },
          'cancelado': { text: '❌ Cancelado', icon: '❌' }
        };

        const statusInfo = statusMap[order.estado] || { text: order.estado, icon: '📋' };

        return {
          id: order.codigo,
          date: new Date(order.fecha_pedido).toLocaleString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          items: items,
          total: total,
          status: order.estado,
          statusText: statusInfo.text,
          deliveryAddress: order.direccion || 'Recojo en tienda',
          tipoEntrega: order.tipo_entrega || 'delivery',
          costoDelivery: parseFloat(order.costo_delivery || 0),
          estimatedTime: order.estado === 'preparando' ? '20-25 min' : (order.estado === 'en_camino' ? '10-15 min' : null)
        };
      });

      setOrders({
        activos: allOrders.filter(o => !['entregado', 'cancelado'].includes(o.status)),
        historial: allOrders.filter(o => ['entregado', 'cancelado'].includes(o.status))
      });
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pendiente: 'var(--pizza-yellow)',
      preparando: '#ff9800',
      en_camino: 'var(--pizza-orange)',
      entregado: 'var(--pizza-red)',
      cancelado: '#666'
    };
    return colors[status] || 'var(--text-secondary)';
  };

  const OrderCard = ({ order }) => (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info">
          <h3>Pedido #{order.id}</h3>
          <span className="order-date">{order.date}</span>
        </div>
        <div className="order-status" style={{ color: getStatusColor(order.status) }}>
          {order.statusText}
        </div>
      </div>

      <div className="order-items">
        <h4>Items del pedido:</h4>
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <span className="item-name">{item.quantity}x {item.name}</span>
            <span className="item-price">S/. {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="order-details">
        <div className="detail-item">
          <strong>{order.tipoEntrega === 'delivery' ? '🛵 Dirección de entrega:' : '📍 Retiro en tienda:'}</strong>
          <span>{order.deliveryAddress}</span>
        </div>
        {order.costoDelivery > 0 && (
          <div className="detail-item">
            <strong>🛵 Costo de delivery:</strong>
            <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>S/. {order.costoDelivery.toFixed(2)}</span>
          </div>
        )}
        {order.estimatedTime && (
          <div className="detail-item">
            <strong>⏰ Tiempo estimado:</strong>
            <span>{order.estimatedTime}</span>
          </div>
        )}
      </div>

      <div className="order-footer">
        <div className="order-total">
          <strong>Total: S/. {order.total.toFixed(2)}</strong>
        </div>
        <div className="order-actions">
          {order.status === 'entregado' && (
            <button className="btn btn-secondary">🔄 Ordenar de nuevo</button>
          )}
          <button className="btn btn-outline">📋 Ver detalles</button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="pedidos-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner">🍕 Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="pedidos-page">
      {/* Header */}
      <section className="pedidos-hero">
        <div className="container">
          <div className="pedidos-header">
            <h1>📦 Mis Pedidos</h1>
            <p>Gestiona y revisa el estado de tus pedidos en tiempo real</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="tabs-section">
        <div className="container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'activos' ? 'active' : ''}`}
              onClick={() => setActiveTab('activos')}
            >
              🚀 Pedidos Activos ({orders.activos.length})
            </button>
            <button
              className={`tab ${activeTab === 'historial' ? 'active' : ''}`}
              onClick={() => setActiveTab('historial')}
            >
              📚 Historial ({orders.historial.length})
            </button>
          </div>
        </div>
      </section>

      {/* Contenido de Pedidos */}
      <section className="orders-section">
        <div className="container">
          {orders[activeTab].length > 0 ? (
            <div className="orders-grid">
              {orders[activeTab].map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No hay pedidos {activeTab === 'activos' ? 'activos' : 'en tu historial'}</h3>
              <p>
                {activeTab === 'activos'
                  ? '¡Realiza tu primer pedido y lo verás aquí!'
                  : 'Aún no tienes pedidos completados'
                }
              </p>
              {activeTab === 'activos' && (
                <button className="btn btn-primary" onClick={() => window.location.href = '/menu'}>🍕 Ordenar Ahora</button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Estadísticas Rápidas */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-number">{orders.activos.length}</div>
                <div className="stat-label">Pedidos Activos</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{orders.historial.length}</div>
                <div className="stat-label">Pedidos Completados</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-number">
                  S/. {orders.historial
                    .filter(o => o.status === 'entregado')
                    .reduce((total, order) => total + order.total, 0)
                    .toFixed(2)}
                </div>
                <div className="stat-label">Total Gastado</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pedidos;