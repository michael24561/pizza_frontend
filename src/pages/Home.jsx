import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  productoService,
  promocionService,
} from "../api/productoService";
import { categoriaService } from "../api/categoriaService";
import sucursalService from "../api/sucursalService";
import { useSucursal } from "../contexts/SucursalContext";
import GeolocatorModal from "../components/Layout/GeolocatorModal";

import {
  Pizza,
  Coffee,
  IceCream2,
  UtensilsCrossed,
  Sandwich,
  Flame,
  MapPin,
  Phone,
  ChevronRight,
  Store,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ─────────────────────────────────────────
   ICONOS CATEGORIAS
───────────────────────────────────────── */

const getCategoryIcon = (name = "") => {
  const n = name.toLowerCase();

  if (n.includes("pizza")) return Pizza;
  if (n.includes("bebida")) return Coffee;
  if (n.includes("postre")) return IceCream2;
  if (n.includes("entrada")) return UtensilsCrossed;
  if (n.includes("extra")) return Sandwich;
  if (n.includes("salsa")) return Flame;

  return ShoppingBag;
};

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */

const shimmerStyle = {
  background:
    "linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)",
  backgroundSize: "1000px 100%",
  animation: "shimmer 1.6s infinite linear",
  borderRadius: 16,
};

if (
  typeof document !== "undefined" &&
  !document.getElementById("shimmer-kf")
) {
  const style = document.createElement("style");

  style.id = "shimmer-kf";

  style.innerHTML = `
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  `;

  document.head.appendChild(style);
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div style={{ ...shimmerStyle, height: 220 }} />

      <div className="p-5">
        <div
          style={{
            ...shimmerStyle,
            height: 22,
            width: "70%",
            marginBottom: 12,
          }}
        />

        <div
          style={{
            ...shimmerStyle,
            height: 14,
            width: "100%",
            marginBottom: 8,
          }}
        />

        <div
          style={{
            ...shimmerStyle,
            height: 14,
            width: "80%",
            marginBottom: 20,
          }}
        />

        <div
          style={{
            ...shimmerStyle,
            height: 46,
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ERROR STATE
───────────────────────────────────────── */

function ErrorState({ title, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-3xl p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
        <div className="w-3 h-3 rounded-full bg-red-500" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-500 mb-6">
        Ocurrió un problema cargando la información.
      </p>

      <button
        onClick={onRetry}
        className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition"
      >
        Intentar nuevamente
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   CACHE
───────────────────────────────────────── */

const CACHE_KEY = "hp_home_v2";

const CACHE_TTL = 5 * 60 * 1000;

function getCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);

    if (!raw) return null;

    const { data, ts } = JSON.parse(raw);

    if (Date.now() - ts > CACHE_TTL) return null;

    return data;
  } catch {
    return null;
  }
}

function setCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        ts: Date.now(),
      })
    );
  } catch {}
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */

export default function Home() {
  const navigate = useNavigate();

  const {
    sucursalSeleccionada,
    setSucursalSeleccionada,
  } = useSucursal();

  const [pizzas, setPizzas] = useState([]);

  const [categorias, setCategorias] = useState([]);

  const [ofertas, setOfertas] = useState([]);

  const [sucursales, setSucursales] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const [showChangeModal, setShowChangeModal] =
    useState(false);

  const [nearestStoreId, setNearestStoreId] =
    useState(null);

  const [userCoords, setUserCoords] =
    useState(null);

  /* ─────────────────────────────────────────
     FETCH DATA
  ───────────────────────────────────────── */

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const cached = getCache();

      if (cached) {
        setPizzas(cached.pizzas || []);
        setCategorias(cached.categorias || []);
        setOfertas(cached.ofertas || []);
        setSucursales(cached.sucursales || []);
      }

      const [
        productosRes,
        categoriasRes,
        promocionesRes,
        sucursalesRes,
      ] = await Promise.all([
        productoService.getAll(),
        categoriaService.getAll(),
        promocionService.getAll(),
        sucursalService.getAll(),
      ]);

      const pizzasFiltradas =
        productosRes.data.filter((p) =>
          p.categoria_nombre
            ?.toLowerCase()
            .includes("pizza")
        );

      setPizzas(pizzasFiltradas);

      setCategorias(categoriasRes.data || []);

      setOfertas(promocionesRes.data || []);

      setSucursales(
        sucursalesRes.data || sucursalesRes || []
      );

      setCache({
        pizzas: pizzasFiltradas,
        categorias: categoriasRes.data || [],
        ofertas: promocionesRes.data || [],
        sucursales:
          sucursalesRes.data || sucursalesRes || [],
      });

      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ─────────────────────────────────────────
     GEOLOCALIZACIÓN
  ───────────────────────────────────────── */

  useEffect(() => {
    if (
      !userCoords &&
      navigator.geolocation &&
      sucursales.length > 0
    ) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          console.warn(
            "Geolocalización no disponible"
          );
        }
      );
    }
  }, [sucursales, userCoords]);

  /* ─────────────────────────────────────────
     SUCURSAL MÁS CERCANA
  ───────────────────────────────────────── */

  useEffect(() => {
    if (userCoords && sucursales.length > 0) {
      let closest = null;

      let minDist = Infinity;

      sucursales.forEach((s) => {
        if (s.latitud && s.longitud) {
          const d = getDistanceKm(
            userCoords.lat,
            userCoords.lng,
            parseFloat(s.latitud),
            parseFloat(s.longitud)
          );

          if (d < minDist) {
            minDist = d;
            closest = s;
          }
        }
      });

      if (closest) {
        setNearestStoreId(
          closest.id_sucursal
        );
      }
    }
  }, [userCoords, sucursales]);

  /* ─────────────────────────────────────────
     HANDLE SELECT
  ───────────────────────────────────────── */

  const handleGeoSelect = (sucursal) => {
    setSucursalSeleccionada(sucursal);

    localStorage.setItem(
      "sucursalSeleccionada",
      JSON.stringify(sucursal)
    );

    setShowChangeModal(false);
  };

  /* ─────────────────────────────────────────
     ORDENAR SUCURSALES
  ───────────────────────────────────────── */

  const getSortedSucursales = () => {
    if (!userCoords) return sucursales;

    return [...sucursales].sort((a, b) => {
      if (!a.latitud || !a.longitud) return 1;

      if (!b.latitud || !b.longitud) return -1;

      const distA = getDistanceKm(
        userCoords.lat,
        userCoords.lng,
        parseFloat(a.latitud),
        parseFloat(a.longitud)
      );

      const distB = getDistanceKm(
        userCoords.lat,
        userCoords.lng,
        parseFloat(b.latitud),
        parseFloat(b.longitud)
      );

      return distA - distB;
    });
  };

  /* ─────────────────────────────────────────
     CATEGORY COLORS
  ───────────────────────────────────────── */

  const categoryStyles = [
    "bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white",
    "bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white",
    "bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 text-white",
    "bg-gradient-to-br from-gray-100 via-white to-gray-50 text-gray-900 border border-gray-200",
  ];

  /* ─────────────────────────────────────────
     MODAL OBLIGATORIO
  ───────────────────────────────────────── */

  if (!sucursalSeleccionada) {
    return (
      <GeolocatorModal
        sucursales={getSortedSucursales()}
        onSelectSucursal={
          handleGeoSelect
        }
        required={true}
      />
    );
  }

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 overflow-hidden">
      {/* MODAL CAMBIO */}

      {showChangeModal && (
        <GeolocatorModal
          sucursales={getSortedSucursales()}
          onSelectSucursal={
            handleGeoSelect
          }
          onDismiss={() =>
            setShowChangeModal(false)
          }
          required={false}
        />
      )}

      {/* HERO */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600"
            alt="Happy Pizza"
            className="w-full h-full object-cover scale-105"
          />

          <div className="absolute inset-0 bg-black/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 min-h-[760px] flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8 shadow-lg">
              <Sparkles className="w-4 h-4 text-red-500" />

              <span className="text-sm text-white font-semibold tracking-wide">
                HAPPY PIZZA PREMIUM
              </span>
            </div>

            <h1 className="text-white text-5xl md:text-7xl font-black leading-tight mb-6">
              Pizza artesanal
              <span className="block text-red-500">
                diseñada para disfrutar
              </span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-xl mb-10">
              Ingredientes frescos,
              sabores únicos y una
              experiencia moderna para
              tus clientes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  navigate("/menu")
                }
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-semibold transition shadow-2xl hover:scale-[1.02]"
              >
                Ver menú
              </button>

              <button
                onClick={() =>
                  setShowChangeModal(true)
                }
                className="bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold transition"
              >
                Cambiar sucursal
              </button>
            </div>

            {sucursalSeleccionada && (
              <div className="mt-8 bg-white/10 border border-white/10 backdrop-blur-md rounded-3xl p-5 max-w-md shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-300 mb-1">
                      Comprando desde
                    </p>

                    <p className="text-white font-bold text-lg leading-snug">
                      {
                        sucursalSeleccionada.direccion
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SUCURSALES */}

      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <div>
              <p className="text-red-600 font-semibold mb-3 uppercase tracking-wider text-sm">
                Sucursales
              </p>

              <h2 className="text-4xl font-black text-gray-900">
                Elige dónde deseas pedir
              </h2>
            </div>

            <p className="text-gray-500 max-w-md">
              Selecciona la sucursal más
              cercana para ver tiempos de
              entrega.
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {error && !loading && (
            <ErrorState
              title="No pudimos cargar las sucursales"
              onRetry={fetchData}
            />
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {getSortedSucursales().map(
                (s) => {
                  const isNearest =
                    nearestStoreId ===
                    s.id_sucursal;

                  const isSelected =
                    sucursalSeleccionada?.id_sucursal ===
                    s.id_sucursal;

                  return (
                    <div
                      key={s.id_sucursal}
                      onClick={() =>
                        setSucursalSeleccionada(
                          s
                        )
                      }
                      className={`
                      relative
                      overflow-hidden
                      group
                      bg-white
                      rounded-[32px]
                      p-7
                      border
                      transition-all
                      duration-500
                      cursor-pointer
                      hover:-translate-y-2
                      hover:shadow-2xl
                      ${
                        isNearest
                          ? "border-red-500 shadow-xl"
                          : "border-gray-100"
                      }
                      ${
                        isSelected
                          ? "ring-2 ring-red-500 ring-offset-2"
                          : ""
                      }
                    `}
                    >
                      <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full blur-3xl" />

                      <div className="flex items-start justify-between mb-10 relative z-10">
                        <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center">
                          <Store className="w-7 h-7 text-gray-700" />
                        </div>

                        <div className="flex gap-2">
                          {isNearest && (
                            <div className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-full shadow-lg">
                              Cercana
                            </div>
                          )}

                          {isSelected && (
                            <div className="text-xs font-bold bg-green-600 text-white px-3 py-1 rounded-full shadow-lg">
                              Actual
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative z-10">
                        <h3 className="text-2xl font-black text-gray-900 mb-3">
                          {s.nombre ||
                            "Sucursal"}
                        </h3>

                        <div className="flex gap-3 mb-3">
                          <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />

                          <p className="text-gray-500 leading-relaxed">
                            {s.direccion}
                          </p>
                        </div>

                        <div className="flex gap-3 mb-8">
                          <Phone className="w-5 h-5 text-gray-400 shrink-0" />

                          <p className="text-gray-400 text-sm">
                            {s.telefono}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setSucursalSeleccionada(
                              s
                            );
                          }}
                          disabled={isSelected}
                          className={`
                          w-full
                          py-4
                          rounded-2xl
                          font-bold
                          transition-all
                          flex
                          items-center
                          justify-center
                          gap-2
                          ${
                            isSelected
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : isNearest
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white"
                          }
                        `}
                        >
                          {isSelected
                            ? "Sucursal actual"
                            : "Seleccionar sucursal"}

                          {!isSelected && (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIAS */}

      <section className="px-6 lg:px-10 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-red-600 font-semibold mb-3 uppercase tracking-wider text-sm">
              Categorías
            </p>

            <h2 className="text-5xl font-black text-gray-900 leading-tight">
              Explora el menú
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[230px]">
            {categorias.map((cat, index) => {
              const Icon =
                getCategoryIcon(cat.nombre);

              return (
                <a
                  key={cat.id_categoria}
                  href={`/menu?categoria=${cat.id_categoria}`}
                  className={`
                    relative
                    overflow-hidden
                    rounded-[32px]
                    p-7
                    flex
                    flex-col
                    justify-between
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:shadow-2xl
                    group
                    ${
                      categoryStyles[
                        index %
                          categoryStyles.length
                      ]
                    }
                  `}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition duration-700" />

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg">
                      <Icon className="w-8 h-8" />
                    </div>

                    <ChevronRight className="w-6 h-6 opacity-60 group-hover:translate-x-1 transition" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-3">
                      {cat.nombre}
                    </h3>

                    <p className="text-sm opacity-90 leading-relaxed">
                      {cat.descripcion ||
                        "Descubre nuestras especialidades"}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* PIZZAS */}

      <section className="bg-white py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <div>
              <p className="text-red-600 font-semibold mb-3 uppercase tracking-wider text-sm">
                Más populares
              </p>

              <h2 className="text-4xl font-black text-gray-900">
                Pizzas recomendadas
              </h2>
            </div>

            <button
              onClick={() =>
                navigate("/menu")
              }
              className="border border-gray-200 hover:border-gray-900 px-6 py-3 rounded-2xl font-semibold transition w-fit"
            >
              Ver todo el menú
            </button>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading &&
            pizzas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                {pizzas.map((p) => {
                  const precio =
                    p.variantes?.[0]
                      ?.precio || 0;

                  return (
                    <div
                      key={p.id_producto}
                      className="group bg-white border border-gray-100 rounded-[32px] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      <div
                        className="relative overflow-hidden h-64 cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/detalle/producto/${p.id_producto}`
                          )
                        }
                      >
                        <img
                          src={
                            p.imagen &&
                            p.imagen.startsWith(
                              "http"
                            )
                              ? p.imagen
                              : "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
                          }
                          alt={p.nombre}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                        <div className="absolute top-4 left-4 bg-white text-gray-900 px-4 py-2 rounded-full font-black shadow-lg">
                          S/ {precio}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-2xl font-black text-gray-900 mb-3">
                          {p.nombre}
                        </h3>

                        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">
                          {p.descripcion}
                        </p>

                        <button
                          onClick={() =>
                            navigate(
                              `/detalle/producto/${p.id_producto}`
                            )
                          }
                          className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition"
                        >
                          Ver producto
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </section>

      {/* OFERTAS */}

      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-red-600 font-semibold mb-3 uppercase tracking-wider text-sm">
              Promociones
            </p>

            <h2 className="text-4xl font-black text-gray-900">
              Ofertas destacadas
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {ofertas.map((of) => (
              <div
                key={of.id_promocion}
                onClick={() =>
                  navigate(
                    `/detalle/promo/${of.id_promocion}`
                  )
                }
                className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
              >
                <div className="relative overflow-hidden h-72">
                  <img
                    src={
                      of.imagen &&
                      of.imagen.startsWith(
                        "http"
                      )
                        ? of.imagen
                        : "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700"
                    }
                    alt={of.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute bottom-6 left-6">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold w-fit mb-4 shadow-lg">
                      Oferta especial
                    </div>

                    <h3 className="text-3xl font-black text-white">
                      {of.titulo}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Desde
                    </p>

                    <p className="text-3xl font-black text-gray-900">
                      S/ {of.precio}
                    </p>
                  </div>

                  <button className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-semibold transition">
                    Ver promo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="px-6 lg:px-10 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-[40px] overflow-hidden relative">
            <div className="absolute inset-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute top-0 left-0 w-72 h-72 bg-red-600/20 rounded-full blur-3xl" />

            <div className="relative z-10 px-8 py-20 lg:px-20 text-center">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                Haz tu pedido ahora
              </h2>

              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
                Una experiencia moderna,
                rápida y profesional para
                tus clientes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() =>
                    navigate("/menu")
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-semibold transition shadow-xl"
                >
                  Ir al menú
                </button>

                <button
                  onClick={() =>
                    navigate("/contacto")
                  }
                  className="bg-white text-gray-900 px-10 py-4 rounded-2xl font-semibold transition hover:bg-gray-100"
                >
                  Contacto
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}