import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet';
import {
  ShoppingCart, Trash2, Plus, Minus, MapPin,
  Store, Truck, ArrowLeft, CreditCard,
  Navigation, CheckCircle2, Pizza,
} from 'lucide-react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AuthContext } from '../contexts/AuthContext';
import { useSucursal } from '../contexts/SucursalContext';
import api from '../api';

// FIX LEAFLET ICONS
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// LOCATION PICKER COMPONENT
function LocationPicker({ onLocationSelect }) {
  const [tempMarker, setTempMarker] = useState(null);
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setTempMarker([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });
  return tempMarker ? <Marker position={tempMarker} /> : null;
}

const CartPage = () => {
  const navigate = useNavigate();
  const { user, authLoading } = useContext(AuthContext);
  const { sucursalSeleccionada } = useSucursal();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // MAP
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -8.1091, lng: -79.0215 });
  const [tempAddress, setTempAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  // FETCH CART
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  // MAP CENTER — geolocation when modal opens
  useEffect(() => {
    if (!showMapModal) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {
          if (sucursalSeleccionada?.latitud && sucursalSeleccionada?.longitud) {
            setMapCenter({
              lat: parseFloat(sucursalSeleccionada.latitud),
              lng: parseFloat(sucursalSeleccionada.longitud),
            });
          }
        }
      );
    }
  }, [showMapModal, sucursalSeleccionada]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/carritos/', {
        params: { cliente_id: user.id_cliente },
      });
      setCart(response.data.length ? response.data[0] : null);
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar el carrito.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    try {
      await api.patch(`/carritos-items/${itemId}/`, { cantidad: newQty });
      fetchCart();
    } catch {
      setError('No se pudo actualizar la cantidad.');
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('¿Eliminar producto del carrito?')) return;
    try {
      await api.delete(`/carritos-items/${itemId}/`);
      fetchCart();
      setSuccessMessage('Producto eliminado correctamente.');
      setTimeout(() => setSuccessMessage(''), 2500);
    } catch {
      setError('No se pudo eliminar el producto.');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('¿Vaciar carrito completo?')) return;
    try {
      await Promise.all(cart.items.map((item) => api.delete(`/carritos-items/${item.id_item}/`)));
      setCart(null);
      setSuccessMessage('Carrito vaciado correctamente.');
      setTimeout(() => setSuccessMessage(''), 2500);
    } catch {
      setError('No se pudo vaciar el carrito.');
    }
  };

  const reverseGeocode = async (lat, lng) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`
      );
      const data = await res.json();
      const dir = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setTempAddress(dir);
      return dir;
    } catch {
      const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setTempAddress(fallback);
      return fallback;
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleLocationSelect = async (lat, lng) => {
    await reverseGeocode(lat, lng);
  };

  const confirmMapLocation = () => {
    if (!tempAddress) { alert('Selecciona una ubicación.'); return; }
    setAddress(tempAddress);
    setShowMapModal(false);
  };

  // ✅ CHECKOUT CORRECTO: POST /pedidos/ → POST /mercadopago/preference/
  const handleCheckout = async () => {
    if (!sucursalSeleccionada) {
      alert('Por favor, selecciona una sucursal en el menú de inicio.');
      navigate('/');
      return;
    }
    if (deliveryOption === 'delivery' && !address.trim()) {
      alert('Por favor ingresa una dirección de entrega.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      let rawDireccion = deliveryOption === 'pickup'
        ? `Recojo en Tienda: ${sucursalSeleccionada.direccion}`
        : address;
      const direccion = rawDireccion.length > 85
        ? rawDireccion.substring(0, 82) + '...'
        : rawDireccion;

      const checkoutData = {
        sucursal: sucursalSeleccionada.id_sucursal,
        direccion,
        cliente: user.id_cliente,
        tipo_entrega: deliveryOption === 'pickup' ? 'recojo' : 'delivery',
        costo_delivery: deliveryOption === 'pickup' ? '0.00' : '5.00',
      };

      console.log('DEBUG: Iniciando checkout...', checkoutData);

      // Llamamos directamente a la creación de preferencia (NO creamos pedido antes)
      const prefResponse = await api.post('/mercadopago/preference/', checkoutData);

      const initPoint = prefResponse.data.init_point;
      const preferenceId = prefResponse.data.preference_id;

      // Guardar info en localStorage para recuperarla al volver de MP
      localStorage.setItem('pending_checkout', JSON.stringify({
        preference_id: preferenceId,
        timestamp: Date.now()
      }));
      console.log('DEBUG: Checkout session guardada. Preference:', preferenceId);

      // Redirigir a Mercado Pago (NO vaciamos carrito aquí)
      window.location.href = initPoint;

    } catch (error) {
      console.error('RESPUESTA COMPLETA:', JSON.stringify(error.response?.data, null, 2));
      console.error('STATUS:', error.response?.status);

      let msg = 'Hubo un error al procesar tu pedido.';
      if (error.response?.data) {
        if (typeof error.response.data.error === 'string') {
          msg = error.response.data.error;
        } else if (Array.isArray(error.response.data.error)) {
          msg = error.response.data.error[0];
        } else if (error.response.data.detail) {
          msg = typeof error.response.data.detail === 'string'
            ? error.response.data.detail
            : JSON.stringify(error.response.data.detail);
        }
      } else {
        msg += ` (Status: ${error.response?.status || 'Unknown'})`;
      }
      setError(msg);
    } finally {
      setProcessing(false);
    }
  };

  // LOADING
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  // NO USER
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm p-10 max-w-md w-full">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <ShoppingCart size={42} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-center text-gray-900 mt-8">Inicia sesión</h1>
          <p className="text-gray-500 text-center mt-3">Accede para continuar con tu pedido.</p>
          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full h-14 rounded-2xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold transition-all"
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cartSubtotal = parseFloat(cart?.total || 0);
  const deliveryFee = deliveryOption === 'delivery' ? 5 : 0;
  const total = cartSubtotal + deliveryFee;

  const miniMapCenter = sucursalSeleccionada?.latitud && sucursalSeleccionada?.longitud
    ? [parseFloat(sucursalSeleccionada.latitud), parseFloat(sucursalSeleccionada.longitud)]
    : [-8.1091, -79.0215];

  return (
    <div className="min-h-screen bg-[#f6f7fb] pt-32 pb-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center shadow-lg shrink-0">
                  <ShoppingCart className="text-white" size={38} />
                </div>
                <div>
                  <p className="uppercase tracking-[0.2em] text-red-500 text-sm font-bold">Pedido</p>
                  <h1 className="text-5xl font-black text-gray-900 mt-2 leading-none">Tu carrito</h1>
                  <p className="text-gray-500 mt-4 text-lg">Revisa tus productos antes de confirmar tu pedido.</p>
                  <div className="w-28 h-1.5 bg-red-500 rounded-full mt-5"></div>
                </div>
              </div>
              {cart?.items?.length > 0 && (
                <button
                  onClick={clearCart}
                  className="h-14 px-6 rounded-2xl border border-gray-200 hover:bg-red-50 hover:border-red-200 flex items-center gap-3 font-semibold text-gray-700 transition-all"
                >
                  <Trash2 size={18} />
                  Vaciar carrito
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ALERTS */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3">
            <CheckCircle2 size={20} />
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!cart || cart.items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[32px] p-16 text-center shadow-sm">
            <div className="w-28 h-28 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <Pizza size={52} className="text-red-500" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mt-8">Tu carrito está vacío</h2>
            <p className="text-gray-500 mt-4 text-lg">Agrega productos para continuar.</p>
            <button
              onClick={() => navigate('/menu')}
              className="mt-8 h-14 px-10 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all"
            >
              Ir al menú
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_0.9fr] gap-8">

            {/* ITEMS */}
            <div className="space-y-6">
              {cart.items.map((item, index) => (
                <motion.div
                  key={item.id_item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* IMAGE */}
                    <div className="w-full lg:w-44 h-44 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      {item.variante_info?.producto_imagen || item.promocion_info?.imagen ? (
                        <img
                          src={item.variante_info?.producto_imagen || item.promocion_info?.imagen}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Pizza size={50} className="text-red-500" />
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between gap-4 flex-wrap">
                          <div>
                            <h2 className="text-2xl font-black text-gray-900">
                              {item.variante_info?.producto_nombre || item.promocion_info?.titulo}
                            </h2>
                            <p className="text-gray-500 mt-2 text-sm">
                              {item.variante_info?.producto_descripcion || item.promocion_info?.descripcion}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id_item)}
                            className="text-gray-400 hover:text-red-600 transition-all shrink-0"
                          >
                            <Trash2 size={22} />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <div className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold text-sm">
                            {item.variante_info?.tamaño || 'Promoción'}
                          </div>
                          {item.opciones_promocion?.map((opc, idx) => (
                            <div key={idx} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm flex items-center gap-1">
                              <span>{opc.variante_info?.producto_nombre}</span>
                              {parseFloat(opc.variante_info?.precio) > 0 && (
                                <span className="text-red-500 font-semibold ml-1">
                                  +S/ {opc.variante_info?.precio}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex items-end justify-between flex-wrap gap-5">
                        {/* QTY */}
                        <div className="flex items-center bg-gray-100 rounded-2xl p-2 gap-3">
                          <button
                            onClick={() => updateQuantity(item.id_item, item.cantidad, -1)}
                            className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition-all"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="text-xl font-black w-8 text-center">{item.cantidad}</span>
                          <button
                            onClick={() => updateQuantity(item.id_item, item.cantidad, 1)}
                            className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition-all"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        {/* PRICE */}
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Subtotal</p>
                          <h3 className="text-4xl font-black text-gray-900 mt-1">
                            S/ {parseFloat(item.subtotal).toFixed(2)}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* SUMMARY */}
            <div>
              <div className="sticky top-28 bg-white rounded-[32px] border border-gray-200 shadow-sm p-7">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                    <CreditCard className="text-red-500" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">Resumen</h2>
                </div>

                {/* SUCURSAL */}
                {sucursalSeleccionada ? (
                  <div className="border border-gray-200 rounded-3xl p-5">
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Sucursal</p>
                    <h3 className="mt-3 font-black text-lg text-gray-900">{sucursalSeleccionada.nombre}</h3>
                    <div className="flex items-start gap-2 mt-2 text-gray-500">
                      <MapPin size={16} className="shrink-0 mt-0.5" />
                      <span className="text-sm">{sucursalSeleccionada.direccion}</span>
                    </div>
                  </div>
                ) : (
                  <div className="border border-red-200 bg-red-50 rounded-3xl p-5">
                    <p className="text-red-600 font-bold text-sm">⚠️ Selecciona una sucursal antes de continuar</p>
                  </div>
                )}

                {/* DELIVERY TOGGLE */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={() => setDeliveryOption('delivery')}
                    className={`h-16 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${
                      deliveryOption === 'delivery'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Truck size={18} />
                    Delivery
                  </button>
                  <button
                    onClick={() => setDeliveryOption('pickup')}
                    className={`h-16 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${
                      deliveryOption === 'pickup'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Store size={18} />
                    Recojo
                  </button>
                </div>

                {/* ADDRESS */}
                {deliveryOption === 'delivery' && (
                  <div className="mt-7">
                    <label className="font-bold text-gray-700 text-sm">Dirección de entrega</label>
                    <div className="flex gap-3 mt-3">
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ej: Av. Los Pinos 123"
                        rows="3"
                        className="flex-1 border border-gray-200 rounded-2xl p-4 bg-gray-50 outline-none focus:ring-4 focus:ring-red-100 resize-none text-sm"
                      />
                      <button
                        onClick={() => setShowMapModal(true)}
                        className="w-20 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center gap-2 font-bold transition-all text-xs"
                      >
                        <Navigation size={20} />
                        Mapa
                      </button>
                    </div>

                    {/* MINI MAP */}
                    <div
                      onClick={() => setShowMapModal(true)}
                      className="mt-4 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <MapContainer
                        center={miniMapCenter}
                        zoom={15}
                        scrollWheelZoom={false}
                        dragging={false}
                        zoomControl={false}
                        attributionControl={false}
                        style={{ height: '150px', width: '100%' }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={miniMapCenter} />
                      </MapContainer>
                    </div>
                  </div>
                )}

                {/* TOTALS */}
                <div className="mt-8 border border-gray-200 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span>S/ {cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>{deliveryOption === 'delivery' ? 'Costo delivery' : 'Recojo en tienda'}</span>
                    <span>S/ {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-xl font-black text-gray-900">Total</span>
                    <span className="text-4xl font-black text-red-600">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* CHECKOUT BTN */}
                <button
                  onClick={handleCheckout}
                  disabled={processing || !sucursalSeleccionada}
                  className="w-full h-16 mt-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:scale-[1.01] active:scale-[0.99] transition-all text-white font-black text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </span>
                  ) : (
                    'Confirmar pedido →'
                  )}
                </button>

                <button
                  onClick={() => navigate('/menu')}
                  className="w-full mt-5 flex items-center justify-center gap-2 text-gray-500 hover:text-red-500 transition-all font-semibold text-sm"
                >
                  <ArrowLeft size={16} />
                  Seguir comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAP MODAL */}
      {showMapModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-gray-900">Selecciona tu ubicación</h2>
                <p className="text-gray-500 mt-1 text-sm">Haz clic sobre el mapa para elegir el punto exacto.</p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-xl font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <div className="h-[500px]">
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={15}
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onLocationSelect={handleLocationSelect} />
              </MapContainer>
            </div>

            <div className="p-6 border-t border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <p className="font-bold text-gray-700 mb-2 text-sm">Dirección seleccionada</p>
                <div className="bg-gray-100 rounded-2xl p-4 text-gray-700 text-sm">
                  {isGeocoding
                    ? 'Obteniendo dirección...'
                    : tempAddress || 'Ninguna ubicación seleccionada'}
                </div>
              </div>
              <button
                onClick={confirmMapLocation}
                className="h-14 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shrink-0"
              >
                Confirmar ubicación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;