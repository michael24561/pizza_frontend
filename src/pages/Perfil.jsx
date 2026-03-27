import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { pedidoService } from '../api/pedidoService';
import api from '../api';
import './Perfil.css';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('personal');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Estado para los campos editables
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    telefono: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        usuario: user.usuario || '',
        correo: user.correo || '',
        telefono: user.telefono || '',
      });
      fetchPedidos();
    }
  }, [user]);

  const fetchPedidos = async () => {
    try {
      // Filtrar pedidos por el ID del cliente logueado
      const response = await api.get('/pedidos/', {
        params: { cliente_id: user.id_cliente }
      });
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ text: '', type: '' });

    try {
      // Usamos el endpoint de actualización de cliente
      // El backend espera id_cliente en el body según ClienteListCreateUpdate.put
      const response = await api.put('/clientes/', {
        id_cliente: user.id_cliente,
        ...formData
      });

      // Actualizar el contexto global
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage({ text: '¡Perfil actualizado con éxito!', type: 'success' });
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setMessage({ text: 'Error al actualizar el perfil. Intenta de nuevo.', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container text-center pt-20">
        <div className="bg-white p-10 rounded-3xl shadow-xl inline-block">
          <span className="text-6xl mb-4 block">🔒</span>
          <h2 className="text-2xl font-bold text-gray-800">Inicia sesión para ver tu perfil</h2>
          <p className="text-gray-500 mt-2">Necesitas estar autenticado para acceder a esta sección.</p>
          <a href="/login" className="mt-6 inline-block bg-red-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-700 transition-all">
            Ir al Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Banner de marca */}
        <div className="profile-header-banner">
          <div className="absolute top-4 right-4 text-4xl opacity-20">🍕</div>
          <div className="absolute bottom-4 left-4 text-3xl opacity-20">🍕</div>
        </div>

        {/* Info básica y Avatar */}
        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-inner">
              {user.usuario ? user.usuario.charAt(0).toUpperCase() : '👤'}
            </div>
            <div className="profile-edit-avatar" title="Cambiar foto">
              📷
            </div>
          </div>
          <h1 className="profile-name">{user.usuario}</h1>
          <p className="profile-email">{user.correo}</p>
          <div className="mt-4 flex gap-4">
            <div className="bg-red-50 px-4 py-1 rounded-full text-red-600 font-bold text-sm">
              Cliente VIP
            </div>
            <div className="bg-orange-50 px-4 py-1 rounded-full text-orange-600 font-bold text-sm">
              S/ {pedidos
                .filter(p => p.estado === 'entregado')
                .reduce((acc, p) => acc + parseFloat(p.total || 0), 0)
                .toFixed(2)} Gastados
            </div>
          </div>
        </div>

        {/* Navegación interna */}
        <div className="profile-tabs-nav">
          <button
            className={`profile-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            📝 Datos Personales
          </button>
          <button
            className={`profile-tab-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedidos')}
          >
            📦 Historial de Pedidos ({pedidos.length})
          </button>
        </div>

        {/* Contenido Dinámico */}
        <div className="profile-tab-content">
          {activeTab === 'personal' && (
            <form onSubmit={handleSaveProfile} className="animate-fade-in">
              <h2 className="text-xl font-black text-gray-800 mb-6">Mi Información</h2>

              {message.text && (
                <div className={`mb-6 p-4 rounded-xl font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 'bg-red-100 text-red-700 border-l-4 border-red-500'
                  }`}>
                  <span>{message.type === 'success' ? '✅' : '❌'}</span>
                  {message.text}
                </div>
              )}

              <div className="profile-details-grid">
                <div className="profile-form-group">
                  <label className="profile-label">Nombre de Usuario</label>
                  <div className="profile-input-wrapper">
                    <input
                      type="text"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleInputChange}
                      className="profile-input"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label className="profile-label">Correo Electrónico</label>
                  <div className="profile-input-wrapper">
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      className="profile-input"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label className="profile-label">Teléfono de Contacto</label>
                  <div className="profile-input-wrapper">
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="profile-input"
                      placeholder="999 999 999"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t pt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="profile-save-btn"
                >
                  {updating ? 'Guardando...' : '💾 Guardar Cambios'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'pedidos' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-black text-gray-800 mb-6">Mis Pedidos</h2>

              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin text-4xl mb-4">🌀</div>
                  <p className="text-gray-500 font-bold">Cargando tu historial...</p>
                </div>
              ) : pedidos.length > 0 ? (
                <div className="orders-list">
                  {pedidos.map(pedido => (
                    <div key={pedido.id_pedido} className="order-card group">
                      <div className="order-card-header">
                        <div>
                          <span className="order-id"># {pedido.codigo}</span>
                          <p className="order-date">
                            {new Date(pedido.fecha_pedido).toLocaleDateString()} • {new Date(pedido.fecha_pedido).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`order-status status-${pedido.estado.toLowerCase().replace(' ', '')}`}>
                          {pedido.estado}
                        </span>
                      </div>

                      <div className="order-items-summary">
                        <p className="font-bold text-gray-700 mb-1">Items:</p>
                        <p className="line-clamp-2">
                          {pedido.items?.map(item => (
                            item.variante_info
                              ? `${item.variante_info.producto_nombre || 'Producto'} (${item.variante_info.tamaño}) x${item.cantidad}`
                              : `${item.promocion_info?.titulo || 'Promo'} x${item.cantidad}`
                          )).join(', ') || 'Sin detalles'}
                        </p>
                      </div>

                      <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-4 mt-2">
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Sucursal</p>
                          <p className="text-sm font-black text-gray-600">{pedido.sucursal_direccion || 'No especificada'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-bold uppercase">Total Pagado</p>
                          <span className="order-total-price">S/ {parseFloat(pedido.total || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🍕</div>
                  <p className="text-lg font-bold">Aún no tienes pedidos</p>
                  <p className="text-sm text-gray-400 mt-1">¡Tus pizzas favoritas te están esperando!</p>
                  <button
                    onClick={() => window.location.href = '/menu'}
                    className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-all"
                  >
                    Ir al Menú
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;