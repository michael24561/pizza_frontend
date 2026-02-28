import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productoService, promocionService } from "../api/productoService";
import { categoriaService } from "../api/categoriaService";
import sucursalService from "../api/sucursalService";
import { useSucursal } from "../contexts/SucursalContext";

export default function Home() {
  const navigate = useNavigate();
  const [pizzas, setPizzas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const { sucursalSeleccionada, setSucursalSeleccionada } = useSucursal();
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSucursalList, setShowSucursalList] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, categoriasRes, promosRes, sucursalesRes] = await Promise.all([
          productoService.getAll(),
          categoriaService.getAll(),
          promocionService.getAll(),
          sucursalService.getAll()
        ]);

        // Extraer solo pizzas para mostrarlas en la sección principal
        const allProducts = productosRes.data;
        const onlyPizzas = allProducts.filter(p => p.categoria_nombre && p.categoria_nombre.toLowerCase().includes('pizza'));

        console.log("Productos:", productosRes.data);
        console.log("Categorias:", categoriasRes.data);
        console.log("Sucursales:", sucursalesRes);

        setPizzas(onlyPizzas);
        setCategorias(categoriasRes.data);
        setOfertas(promosRes.data);
        setSucursales(sucursalesRes.data || sucursalesRes);
      } catch (error) {
        console.error("Error fetching data de tallado:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectSucursal = (sucursal) => {
    setSucursalSeleccionada(sucursal);
    setShowSucursalList(false);
  };

  // Helper function to map category names to emojis/colors if desired, or just use defaults
  const getCategoryStyle = (index) => {
    const styles = [
      { gradient: "from-yellow-400 to-orange-400", icon: "💰", textColor: "text-gray-900" },
      { gradient: "from-red-500 to-red-600", icon: "🍕", textColor: "text-white" },
      { gradient: "from-blue-400 to-blue-500", icon: "🥤", textColor: "text-white" },
      { gradient: "from-orange-500 to-red-500", icon: "🔥", textColor: "text-white" }
    ];
    return styles[index % styles.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER / BANNER */}
      <header className="relative w-full h-[500px] overflow-hidden">
        {/* Banner Image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=500&fit=crop"
            alt="banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 h-full flex items-center px-8 md:px-16">
          <div className="max-w-xl text-white">
            {/* Logo pequeño en el banner */}
            <div className="mb-6 flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-400">
                <span className="text-3xl">🍕</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">HAPPY PIZZA</h2>
                <p className="text-sm text-orange-400">Sabor que te hace feliz</p>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
              Un lugar cálido para probar cosas nuevas con sabor al hogar
            </h1>

            {sucursalSeleccionada ? (
              <div className="flex flex-col items-start gap-4">
                <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/50 flex items-center gap-2">
                  <span className="text-green-400">●</span>
                  <span className="text-sm font-medium">Comprando en: {sucursalSeleccionada.direccion}</span>
                </div>
                <a
                  href="/oferts"
                  className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-8 py-4 rounded-full hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  🎉 Ver Ofertas Especiales
                </a>
              </div>
            ) : (
              <a
                href="#ubicacion"
                className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-8 py-4 rounded-full hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                📍 Elige tu Sucursal
              </a>
            )}
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-16 fill-gray-50">
            <path d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </header>

      {/* UBICACIÓN */}
      <section id="ubicacion" className="py-16 px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🎯 Delivery a tu puerta
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {sucursalSeleccionada ? "Tu Tienda Happy Pizza" : "Bienvenido a Happy Pizza"}
            </h2>
            <p className="text-gray-600 text-lg">
              {sucursalSeleccionada
                ? `Estás comprando en nuestra sede de ${sucursalSeleccionada.direccion}`
                : "Selecciona una sucursal para personalizar tu pedido y ver disponibilidad real"}
            </p>
          </div>

          {!sucursalSeleccionada ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {sucursales.map(s => (
                <div
                  key={s.id_sucursal}
                  className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-red-400 transition-all cursor-pointer group"
                  onClick={() => handleSelectSucursal(s)}
                >
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500 transition-colors">
                    <svg className="w-6 h-6 text-red-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{s.direccion}</h3>
                  <p className="text-gray-600 text-sm mb-4"><i className="bi bi-telephone"></i> {s.telefono}</p>
                  <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                    <i className="bi bi-clock"></i>
                    Abierto: {s.hora_inicio} - {s.hora_cierre}
                  </div>
                  <button className="w-full mt-6 bg-gray-100 text-gray-800 font-bold py-2 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all">
                    Seleccionar Local
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg border-2 border-green-200 max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-inner">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-green-600 font-semibold uppercase tracking-wider">Local Seleccionado:</p>
                  <p className="text-2xl font-black text-gray-800">{sucursalSeleccionada.direccion}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSucursalSeleccionada(null)}
                  className="flex-1 bg-white text-gray-700 font-bold px-6 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all"
                >
                  🔄 Cambiar Local
                </button>
                <button
                  onClick={() => navigate('/menu')}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  🚀 Hacer Pedido
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-12 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Categorías Populares</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.length > 0 ? (
              categorias.map((cat, index) => {
                const style = getCategoryStyle(index);
                return (
                  <a key={cat.id_categoria} href={`/menu?categoria=${cat.id_categoria}`} className="group">
                    <div className={`bg-gradient-to-br ${style.gradient} p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center h-full flex flex-col justify-center items-center`}>
                      <div className="text-5xl mb-3">{style.icon}</div>
                      <p className={`${style.textColor} font-bold text-lg`}>{cat.nombre}</p>
                      <p className={`text-opacity-80 ${style.textColor} text-sm mt-1`}>{cat.descripcion || "Delicioso"}</p>
                    </div>
                  </a>
                );
              })
            ) : (
              <p className="col-span-4 text-center text-gray-500">Cargando categorías...</p>
            )}
          </div>
        </div>
      </section>

      {/* PIZZAS */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🔥 Lo más pedido
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestras Pizzas</h2>
            <p className="text-gray-600 text-lg">Hechas con amor y los mejores ingredientes</p>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide">
            {pizzas.length > 0 ? (
              pizzas.map((p) => {
                const precioMostrar = p.variantes && p.variantes.length > 0 ? p.variantes[0].precio : 0;
                return (
                  <div
                    key={p.id_producto}
                    className="flex-shrink-0 w-72 snap-center group"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-red-300 h-full flex flex-col">
                      <div className="relative overflow-hidden h-56 cursor-pointer" onClick={() => navigate(`/detalle/producto/${p.id_producto}`)}>
                        <img
                          src={p.imagen && p.imagen.startsWith('http') ? p.imagen : "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop"}
                          alt={p.nombre}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          S/ {precioMostrar}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 cursor-pointer" onClick={() => navigate(`/detalle/producto/${p.id_producto}`)}>{p.nombre}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{p.descripcion}</p>
                        <button
                          onClick={() => navigate(`/detalle/producto/${p.id_producto}`)}
                          className="mt-auto w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 rounded-xl hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
                          🛒 ¡Pedir Ahora!
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center py-8">
                <p className="text-gray-500">Cargando pizzas...</p>
                {!loading && pizzas.length === 0 && <p className="text-gray-400 text-sm">No hay pizzas disponibles en este momento.</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* OFERTAS */}
      <section className="py-16 px-8 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ⚡ Tiempo limitado
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Promos del Día</h2>
            <p className="text-gray-600 text-lg">Aprovecha estas increíbles ofertas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ofertas.length > 0 ? (
              ofertas.map((of) => (
                <div
                  key={of.id_promocion}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-4 border-red-600 group relative cursor-pointer"
                  onClick={() => navigate(`/detalle/promo/${of.id_promocion}`)}
                >
                  {/* Badge de precio */}
                  <div className="absolute top-4 left-4 z-10 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform">
                    S/ {of.precio}
                  </div>

                  <div className="relative overflow-hidden">
                    <img
                      src={of.imagen && of.imagen.startsWith('http') ? of.imagen : "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop"}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      alt={of.titulo}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">{of.titulo}</h4>
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 rounded-xl hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                      onClick={(e) => { e.stopPropagation(); navigate(`/detalle/promo/${of.id_promocion}`); }}>
                      🎉 ¡Aprovechar Oferta!
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8 col-span-3">
                <p className="text-gray-500">Cargando promociones...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-20 px-8 bg-gradient-to-r from-red-600 to-red-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para ordenar?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Disfruta de las mejores pizzas con entrega rápida a tu puerta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/menu"
              className="bg-white text-red-600 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              🍕 Ver Menú Completo
            </a>
            <a
              href="/contact"
              className="bg-yellow-400 text-gray-900 font-bold px-10 py-4 rounded-full hover:bg-yellow-500 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              📞 Llamar Ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}