import React, { useState } from 'react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [userData, setUserData] = useState({
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+51 987 654 321',
    direccion: 'Av. Pizza 123, Lima',
    fechaNacimiento: '1990-05-15'
  });

  // Removemos el setPedidos ya que no se usa
  const [pedidos] = useState([
    {
      id: 'ORD-001',
      fecha: '2024-01-15',
      total: 45.90,
      estado: 'Entregado',
      items: ['Pizza Pepperoni Familiar', 'Coca-Cola 2L']
    },
    {
      id: 'ORD-002',
      fecha: '2024-01-10',
      total: 32.50,
      estado: 'Entregado',
      items: ['Pizza Margarita Mediana', 'Alitas BBQ']
    },
    {
      id: 'ORD-003',
      fecha: '2024-01-08',
      total: 28.00,
      estado: 'Cancelado',
      items: ['Pizza Hawaiana Personal']
    }
  ]);

  const [favoritos, setFavoritos] = useState([
    {
      id: 1,
      nombre: 'Pizza Pepperoni',
      descripcion: 'Doble pepperoni y queso mozzarella',
      precio: 22.50,
      imagen: '🍕'
    },
    {
      id: 2,
      nombre: 'Pizza Margarita',
      descripcion: 'Salsa de tomate, mozzarella fresca y albahaca',
      precio: 18.90,
      imagen: '🍕'
    },
    {
      id: 3,
      nombre: 'Alitas BBQ',
      descripcion: 'Alitas de pollo con salsa barbacoa',
      precio: 16.00,
      imagen: '🍗'
    }
  ]);

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    alert('¡Perfil actualizado correctamente!');
  };

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header del perfil */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-icon">👤</div>
            <button className="edit-avatar-btn">📷</button>
          </div>
          <div className="profile-info">
            <h1>{userData.nombre}</h1>
            <p>Miembro desde Enero 2024</p>
            <div className="profile-stats">
              <div className="stat">
                <strong>{pedidos.length}</strong>
                <span>Pedidos</span>
              </div>
              <div className="stat">
                <strong>{favoritos.length}</strong>
                <span>Favoritos</span>
              </div>
              <div className="stat">
                <strong>5★</strong>
                <span>Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            📝 Información Personal
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedidos')}
          >
            📦 Mis Pedidos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'favoritos' ? 'active' : ''}`}
            onClick={() => setActiveTab('favoritos')}
          >
            ❤️ Mis Favoritos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'configuracion' ? 'active' : ''}`}
            onClick={() => setActiveTab('configuracion')}
          >
            ⚙️ Configuración
          </button>
        </div>

        {/* Contenido de las pestañas */}
        <div className="tab-content">
          
          {/* Pestaña: Información Personal */}
          {activeTab === 'personal' && (
            <div className="tab-panel">
              <div className="form-section">
                <h2>Información Personal</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input
                      type="text"
                      value={userData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={userData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={userData.fechaNacimiento}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Dirección de Entrega</h3>
                  <div className="form-group">
                    <textarea
                      value={userData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      className="form-textarea"
                      rows="3"
                      placeholder="Ingresa tu dirección completa para delivery"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSaveProfile}>
                    💾 Guardar Cambios
                  </button>
                  <button className="btn btn-secondary">
                    🔄 Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pestaña: Mis Pedidos */}
          {activeTab === 'pedidos' && (
            <div className="tab-panel">
              <h2>Historial de Pedidos</h2>
              <div className="orders-list">
                {pedidos.map(pedido => (
                  <div key={pedido.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Pedido #{pedido.id}</h3>
                        <p className="order-date">{pedido.fecha}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${pedido.estado.toLowerCase()}`}>
                          {pedido.estado}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      <ul>
                        {pedido.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total: S/ {pedido.total.toFixed(2)}</strong>
                      </div>
                      <div className="order-actions">
                        <button className="btn btn-outline">
                          🔄 Repetir Pedido
                        </button>
                        <button className="btn btn-outline">
                          📋 Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pestaña: Mis Favoritos */}
          {activeTab === 'favoritos' && (
            <div className="tab-panel">
              <h2>Mis Productos Favoritos</h2>
              <div className="favorites-grid">
                {favoritos.map(item => (
                  <div key={item.id} className="favorite-card">
                    <div className="favorite-image">
                      {item.imagen}
                    </div>
                    <div className="favorite-info">
                      <h3>{item.nombre}</h3>
                      <p>{item.descripcion}</p>
                      <div className="favorite-price">S/ {item.precio.toFixed(2)}</div>
                    </div>
                    <div className="favorite-actions">
                      <button className="btn btn-primary">
                        🛒 Ordenar
                      </button>
                      <button 
                        className="remove-favorite"
                        onClick={() => setFavoritos(favoritos.filter(fav => fav.id !== item.id))}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pestaña: Configuración */}
          {activeTab === 'configuracion' && (
            <div className="tab-panel">
              <h2>Configuración de Cuenta</h2>
              
              <div className="settings-section">
                <h3>🔔 Notificaciones</h3>
                <div className="setting-item">
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                  <span>Notificaciones de promociones</span>
                </div>
                <div className="setting-item">
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                  <span>Estado de mis pedidos</span>
                </div>
                <div className="setting-item">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                  <span>Newsletter semanal</span>
                </div>
              </div>

              <div className="settings-section">
                <h3>🔒 Seguridad</h3>
                <button className="btn btn-outline">
                  🔑 Cambiar Contraseña
                </button>
                <button className="btn btn-outline">
                  📧 Verificar Email
                </button>
              </div>

              <div className="settings-section">
                <h3>❌ Cuenta</h3>
                <button className="btn btn-danger">
                  🗑️ Eliminar Cuenta
                </button>
                <p className="warning-text">
                  Esta acción no se puede deshacer. Se perderán todos tus datos y historial.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;