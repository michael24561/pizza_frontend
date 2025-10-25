import React, { useState } from 'react';

const Pedidos = () => {
  const [activeTab, setActiveTab] = useState('activos');

  const orders = {
    activos: [
      {
        id: 'ORD-001',
        date: '2024-01-15 18:30',
        items: [
          { name: 'Pizza Pepperoni Supreme', quantity: 1, price: 32.90 },
          { name: 'Gaseosa Personal', quantity: 2, price: 8.90 }
        ],
        total: 50.70,
        status: 'preparando',
        statusText: '👨‍🍳 En preparación',
        estimatedTime: '20-25 min',
        deliveryAddress: 'Av. Pizza 123, Ciudad Feliz'
      },
      {
        id: 'ORD-002',
        date: '2024-01-15 19:15',
        items: [
          { name: 'Pizza Hawaiana Feliz', quantity: 1, price: 30.90 },
          { name: 'Breadsticks', quantity: 1, price: 12.90 }
        ],
        total: 43.80,
        status: 'en_camino',
        statusText: '🚗 En camino',
        estimatedTime: '15-20 min',
        deliveryAddress: 'Av. Pizza 123, Ciudad Feliz'
      }
    ],
    historial: [
      {
        id: 'ORD-003',
        date: '2024-01-14 20:00',
        items: [
          { name: 'Combo Familiar', quantity: 1, price: 79.90 }
        ],
        total: 79.90,
        status: 'entregado',
        statusText: '✅ Entregado',
        deliveryAddress: 'Av. Pizza 123, Ciudad Feliz',
        rating: 5
      },
      {
        id: 'ORD-004',
        date: '2024-01-13 19:30',
        items: [
          { name: 'Pizza Margarita Happy', quantity: 1, price: 28.90 },
          { name: 'Gaseosa Familiar', quantity: 1, price: 12.90 }
        ],
        total: 41.80,
        status: 'entregado',
        statusText: '✅ Entregado',
        deliveryAddress: 'Av. Pizza 123, Ciudad Feliz',
        rating: 4
      }
    ]
  };

  const getStatusColor = (status) => {
    const colors = {
      preparando: 'var(--pizza-yellow)',
      en_camino: 'var(--pizza-orange)',
      entregado: 'var(--pizza-red)',
      cancelado: 'var(--text-secondary)'
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
            <span className="item-price">S/. {item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="order-details">
        <div className="detail-item">
          <strong>📍 Dirección de entrega:</strong>
          <span>{order.deliveryAddress}</span>
        </div>
        {order.estimatedTime && (
          <div className="detail-item">
            <strong>⏰ Tiempo estimado:</strong>
            <span>{order.estimatedTime}</span>
          </div>
        )}
        {order.rating && (
          <div className="detail-item">
            <strong>⭐ Tu calificación:</strong>
            <span>{'★'.repeat(order.rating)}{'☆'.repeat(5 - order.rating)}</span>
          </div>
        )}
      </div>

      <div className="order-footer">
        <div className="order-total">
          <strong>Total: S/. {order.total}</strong>
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

  return (
    <div className="pedidos-page">
      {/* Header */}
      <section className="pedidos-hero">
        <div className="container">
          <div className="pedidos-header">
            <h1>📦 Mis Pedidos</h1>
            <p>Gestiona y revisa el estado de tus pedidos</p>
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
              🚀 Pedidos Activos
            </button>
            <button
              className={`tab ${activeTab === 'historial' ? 'active' : ''}`}
              onClick={() => setActiveTab('historial')}
            >
              📚 Historial
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
                <button className="btn btn-primary">🍕 Ordenar Ahora</button>
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
                  S/. {orders.historial.reduce((total, order) => total + order.total, 0)}
                </div>
                <div className="stat-label">Total Gastado</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-number">4.8</div>
                <div className="stat-label">Calificación Promedio</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pedidos;