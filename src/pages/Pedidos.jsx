import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { AuthContext } from "../contexts/AuthContext";
import api from "../api";

const Pedidos = () => {
  const navigate = useNavigate();

  const { user, authLoading } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("activos");

  const [orders, setOrders] = useState({
    activos: [],
    historial: [],
  });

  const [loading, setLoading] = useState(true);

  const [cancelingId, setCancelingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  /* ─────────────────────────────────────────
     FETCH ORDERS
  ───────────────────────────────────────── */

  useEffect(() => {
    if (!authLoading) {
      if (user?.id_cliente) {
        fetchOrders();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/pedidos/?cliente_id=${user.id_cliente}&_t=${Date.now()}`
      );

      const allOrders = res.data.map((order) => {
        const items = order.items.map((item) => {
          const name = item.variante_info
            ? `${item.variante_info.producto_nombre} (${item.variante_info.tamaño})`
            : item.promocion_info.titulo;

          return {
            name,
            quantity: item.cantidad,
            price:
              parseFloat(item.subtotal || 0) /
              item.cantidad,
          };
        });

        const total = parseFloat(order.total || 0);

        const statusMap = {
          pendiente: {
            text: "Pendiente",
            icon: "⏳",
            color:
              "bg-yellow-100 text-yellow-700 border-yellow-200",
          },
          preparando: {
            text: "Preparando",
            icon: "👨‍🍳",
            color:
              "bg-orange-100 text-orange-700 border-orange-200",
          },
          en_camino: {
            text: "En camino",
            icon: "🚗",
            color:
              "bg-blue-100 text-blue-700 border-blue-200",
          },
          entregado: {
            text: "Entregado",
            icon: "✅",
            color:
              "bg-green-100 text-green-700 border-green-200",
          },
          cancelado: {
            text: "Cancelado",
            icon: "❌",
            color:
              "bg-red-100 text-red-700 border-red-200",
          },
        };

        const statusInfo =
          statusMap[order.estado] ||
          statusMap.pendiente;

        return {
          id: order.id_pedido,
          codigo: order.codigo,
          date: new Date(
            order.fecha_pedido
          ).toLocaleString("es-PE", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          items,
          total,
          status: order.estado,
          statusInfo,
          deliveryAddress:
            order.direccion || "Recojo en tienda",
          tipoEntrega:
            order.tipo_entrega || "delivery",
          costoDelivery: parseFloat(
            order.costo_delivery || 0
          ),
          estimatedTime:
            order.estado === "preparando"
              ? "20-25 min"
              : order.estado === "en_camino"
              ? "10-15 min"
              : null,
        };
      });

      setOrders({
        activos: allOrders.filter(
          (o) =>
            !["entregado", "cancelado"].includes(
              o.status
            )
        ),

        historial: allOrders.filter((o) =>
          ["entregado", "cancelado"].includes(
            o.status
          )
        ),
      });
    } catch (error) {
      console.error(error);

      toast.error(
        "No pudimos cargar tus pedidos"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────
     CANCEL ORDER
  ───────────────────────────────────────── */

  const handleCancelOrder = async (orderId) => {
    try {
      setCancelingId(orderId);

      await api.patch(`/pedidos/${orderId}/`, {
        estado: "cancelado",
      });

      toast.success("Pedido cancelado");

      fetchOrders();
    } catch (error) {
      console.error(error);

      toast.error(
        "No se pudo cancelar el pedido"
      );
    } finally {
      setCancelingId(null);
    }
  };

  /* ─────────────────────────────────────────
     DELETE HISTORY ORDER
  ───────────────────────────────────────── */

  const handleDeleteOrder = async (orderId) => {
    try {
      setDeletingId(orderId);

      await api.delete(`/pedidos/${orderId}/`);

      toast.success(
        "Pedido eliminado del historial"
      );

      fetchOrders();
    } catch (error) {
      console.error(error);

      toast.error(
        "No se pudo eliminar el pedido"
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ─────────────────────────────────────────
     NOT LOGGED
  ───────────────────────────────────────── */

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] shadow-2xl border border-gray-100 p-10 max-w-xl w-full text-center"
        >
          <div className="text-7xl mb-6">
            🍕
          </div>

          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Inicia sesión
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            Accede a tus pedidos, revisa el
            estado en tiempo real y disfruta
            una experiencia personalizada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold transition"
            >
              Iniciar sesión
            </button>

            <button
              onClick={() =>
                navigate("/register")
              }
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-bold transition"
            >
              Crear cuenta
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     LOADING
  ───────────────────────────────────────── */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-5">
            🍕
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Cargando pedidos...
          </h2>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     ORDER CARD
  ───────────────────────────────────────── */

  const OrderCard = ({ order }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-[32px] p-7 shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
        <div>
          <h3 className="text-2xl font-black text-gray-900">
            Pedido #{order.codigo}
          </h3>

          <p className="text-gray-500 mt-1">
            {order.date}
          </p>
        </div>

        <div
          className={`px-5 py-3 rounded-2xl border text-sm font-bold w-fit ${order.statusInfo.color}`}
        >
          {order.statusInfo.icon}{" "}
          {order.statusInfo.text}
        </div>
      </div>

      {/* ITEMS */}

      <div className="space-y-4 mb-8">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 rounded-2xl px-5 py-4"
          >
            <div>
              <p className="font-semibold text-gray-900">
                {item.quantity}x {item.name}
              </p>
            </div>

            <div className="font-black text-red-600">
              S/.{" "}
              {(
                item.price * item.quantity
              ).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS */}

      <div className="bg-gray-50 rounded-3xl p-6 mb-8 space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Tipo de entrega
          </p>

          <p className="font-bold text-gray-900">
            {order.tipoEntrega ===
            "delivery"
              ? "🛵 Delivery"
              : "🏪 Recojo en tienda"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">
            Dirección
          </p>

          <p className="font-semibold text-gray-900">
            {order.deliveryAddress}
          </p>
        </div>

        {order.costoDelivery > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Delivery
            </p>

            <p className="font-bold text-red-600">
              S/.{" "}
              {order.costoDelivery.toFixed(2)}
            </p>
          </div>
        )}

        {order.estimatedTime && (
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Tiempo estimado
            </p>

            <p className="font-bold text-gray-900">
              ⏰ {order.estimatedTime}
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Total
          </p>

          <h4 className="text-4xl font-black text-gray-900">
            S/. {order.total.toFixed(2)}
          </h4>
        </div>

        <div className="flex flex-wrap gap-3">
          {order.status === "pendiente" && (
            <button
              onClick={() =>
                handleCancelOrder(order.id)
              }
              disabled={
                cancelingId === order.id
              }
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold transition disabled:opacity-50"
            >
              {cancelingId === order.id
                ? "Cancelando..."
                : "Cancelar"}
            </button>
          )}

          {order.status === "entregado" && (
            <button
              onClick={() =>
                navigate("/menu")
              }
              className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold transition"
            >
              Ordenar otra vez
            </button>
          )}

          {(order.status === "entregado" ||
            order.status ===
              "cancelado") && (
            <button
              onClick={() =>
                handleDeleteOrder(order.id)
              }
              disabled={
                deletingId === order.id
              }
              className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-2xl font-bold transition disabled:opacity-50"
            >
              {deletingId === order.id
                ? "Eliminando..."
                : "Eliminar"}
            </button>
          )}

          <button className="border border-gray-200 hover:border-gray-900 px-6 py-3 rounded-2xl font-bold transition">
            Ver detalles
          </button>
        </div>
      </div>
    </motion.div>
  );

  /* ─────────────────────────────────────────
     MAIN
  ───────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* HERO */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600"
            alt=""
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-red-500" />

              <span className="text-white text-sm font-semibold tracking-wide">
                HAPPY PIZZA
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Mis pedidos
            </h1>

            <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
              Sigue el estado de tus pedidos
              en tiempo real y administra tu
              historial fácilmente.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TABS */}

      <section className="px-6 lg:px-10 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() =>
                setActiveTab("activos")
              }
              className={`px-7 py-4 rounded-2xl font-bold transition ${
                activeTab === "activos"
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-900"
              }`}
            >
              🚀 Activos (
              {orders.activos.length})
            </button>

            <button
              onClick={() =>
                setActiveTab("historial")
              }
              className={`px-7 py-4 rounded-2xl font-bold transition ${
                activeTab === "historial"
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-900"
              }`}
            >
              📚 Historial (
              {orders.historial.length})
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="px-6 lg:px-10 pb-24">
        <div className="max-w-7xl mx-auto">
          {orders[activeTab].length >
          0 ? (
            <div className="grid grid-cols-1 gap-8">
              {orders[activeTab].map(
                (order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                  />
                )
              )}
            </div>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="bg-white border border-gray-100 rounded-[40px] p-16 text-center shadow-sm"
            >
              <div className="text-8xl mb-8">
                📦
              </div>

              <h2 className="text-4xl font-black text-gray-900 mb-4">
                No hay pedidos
              </h2>

              <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
                {activeTab === "activos"
                  ? "Aún no tienes pedidos activos."
                  : "Tu historial está vacío."}
              </p>

              <button
                onClick={() =>
                  navigate("/menu")
                }
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-bold transition"
              >
                Ir al menú
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Pedidos;