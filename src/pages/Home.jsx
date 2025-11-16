import { useEffect, useState } from "react";

export default function Home() {
  const [pizzas, setPizzas] = useState([
    { id: 1, titulo: "Margherita", imagen: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop", precio: 25 },
    { id: 2, titulo: "Pepperoni", imagen: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop", precio: 30 },
    { id: 3, titulo: "Hawaiana", imagen: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop", precio: 28 },
    { id: 4, titulo: "Suprema", imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop", precio: 35 }
  ]);

  const [ofertas, setOfertas] = useState([
    { id: 1, titulo: "2x1 en Pizzas Medianas", imagen: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop", descuento: "50%" },
    { id: 2, titulo: "Combo Familiar", imagen: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop", descuento: "30%" },
    { id: 3, titulo: "Pizza + Bebida Gratis", imagen: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop", descuento: "Gratis" }
  ]);

  const [locate, setLocate] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleSetLocation = () => {
    if (inputValue.trim()) {
      setLocate(inputValue);
    }
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

            {locate ? (
              <a 
                href="/oferts" 
                className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-8 py-4 rounded-full hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                🎉 Ver Ofertas Especiales
              </a>
            ) : (
              <a 
                href="#ubicacion" 
                className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-8 py-4 rounded-full hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                📍 Ingresar Ubicación
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
              Bienvenido a Happy Pizza
            </h2>
            <p className="text-gray-600 text-lg">
              Ingresa tu dirección para personalizar tu pedido y ver las mejores ofertas
            </p>
          </div>

          {!locate ? (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl shadow-lg border-2 border-red-100">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="relative flex-1 w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Ej: Av. Principal 123, San Isidro"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors text-gray-700"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSetLocation()}
                  />
                </div>
                <button 
                  onClick={handleSetLocation}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all duration-200 shadow-lg whitespace-nowrap"
                >
                  🍕 Ver Menú
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg border-2 border-green-200">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-green-600 font-semibold">Entrega en:</p>
                  <p className="text-xl font-bold text-gray-800">{locate}</p>
                </div>
              </div>
              <a 
                href="/oferts" 
                className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                🎉 Explorar Menú Completo
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-12 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Categorías Populares</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/oferts" className="group">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center">
                <div className="text-5xl mb-3">💰</div>
                <p className="text-gray-900 font-bold text-lg">Ofertas</p>
                <p className="text-gray-700 text-sm mt-1">Ahorra hoy</p>
              </div>
            </a>

            <a href="/combos" className="group">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center">
                <div className="text-5xl mb-3">🍕</div>
                <p className="text-white font-bold text-lg">Combos</p>
                <p className="text-red-100 text-sm mt-1">Para compartir</p>
              </div>
            </a>

            <a href="/drinks" className="group">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center">
                <div className="text-5xl mb-3">🥤</div>
                <p className="text-white font-bold text-lg">Bebidas</p>
                <p className="text-blue-100 text-sm mt-1">Refrescantes</p>
              </div>
            </a>

            <a href="/pizzas" className="group">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center">
                <div className="text-5xl mb-3">🍕</div>
                <p className="text-white font-bold text-lg">Pizzas</p>
                <p className="text-orange-100 text-sm mt-1">Artesanales</p>
              </div>
            </a>
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
            {pizzas.map((p) => (
              <div 
                key={p.id} 
                className="flex-shrink-0 w-72 snap-center group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-red-300">
                  <div className="relative overflow-hidden">
                    <img 
                      src={p.imagen} 
                      alt={p.titulo} 
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      S/ {p.precio}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{p.titulo}</h3>
                    <p className="text-gray-600 text-sm mb-4">Deliciosa pizza con ingredientes frescos</p>
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 rounded-xl hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
                      🛒 ¡Pedir Ahora!
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            {ofertas.map((of) => (
              <div 
                key={of.id} 
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-4 border-red-600 group relative"
              >
                {/* Badge de descuento */}
                <div className="absolute top-4 left-4 z-10 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform">
                  {of.descuento}
                </div>

                <div className="relative overflow-hidden">
                  <img 
                    src={of.imagen} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    alt={of.titulo}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">{of.titulo}</h4>
                  <button className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 rounded-xl hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
                    🎉 ¡Aprovechar Oferta!
                  </button>
                </div>
              </div>
            ))}
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