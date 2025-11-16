import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección principal */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y redes sociales */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-400">
                <span className="text-3xl">🍕</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white leading-none">HAPPY PIZZA</h3>
                <p className="text-yellow-400 text-sm font-bold mt-1">
                  La felicidad en cada bocado
                </p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              Las mejores pizzas artesanales de la ciudad, hechas con amor y los ingredientes más frescos.
            </p>

            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-2xl hover:scale-110 transform transition-all duration-300 shadow-lg"
                aria-label="Facebook"
              >
                📘
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-2xl hover:scale-110 transform transition-all duration-300 shadow-lg"
                aria-label="Instagram"
              >
                📷
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-2xl hover:scale-110 transform transition-all duration-300 shadow-lg"
                aria-label="WhatsApp"
              >
                💬
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-2xl hover:scale-110 transform transition-all duration-300 shadow-lg"
                aria-label="TikTok"
              >
                🎵
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              Enlaces Rápidos
            </h4>
            <nav className="space-y-3">
              <a 
                href="/menu" 
                className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors group"
              >
                <span className="text-xl group-hover:scale-125 transition-transform">🍕</span>
                <span className="font-semibold">Nuestro Menú</span>
              </a>
              <a 
                href="/pedidos" 
                className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors group"
              >
                <span className="text-xl group-hover:scale-125 transition-transform">📦</span>
                <span className="font-semibold">Mis Pedidos</span>
              </a>
              <a 
                href="/contacto" 
                className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors group"
              >
                <span className="text-xl group-hover:scale-125 transition-transform">📞</span>
                <span className="font-semibold">Contáctanos</span>
              </a>
              <a 
                href="/promociones" 
                className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors group"
              >
                <span className="text-xl group-hover:scale-125 transition-transform">🎉</span>
                <span className="font-semibold">Promociones</span>
              </a>
              <a 
                href="/nosotros" 
                className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors group"
              >
                <span className="text-xl group-hover:scale-125 transition-transform">ℹ️</span>
                <span className="font-semibold">Sobre Nosotros</span>
              </a>
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">📍</span>
              Información
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-400">
                <span className="text-xl mt-1">🏢</span>
                <div>
                  <p className="font-semibold text-white">Dirección</p>
                  <p className="text-sm">Av. Pizza 123, San Isidro<br />Lima, Perú</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <span className="text-xl mt-1">📱</span>
                <div>
                  <p className="font-semibold text-white">Teléfono</p>
                  <p className="text-sm">+51 987 654 321</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <span className="text-xl mt-1">⏰</span>
                <div>
                  <p className="font-semibold text-white">Horario</p>
                  <p className="text-sm">Lunes a Domingo<br />10:00 AM - 11:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <span className="text-xl mt-1">✉️</span>
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p className="text-sm">info@happypizza.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">📬</span>
              Newsletter
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Suscríbete y recibe ofertas exclusivas, promociones especiales y novedades directamente en tu correo.
            </p>
            
            {subscribed ? (
              <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-4 text-center">
                <span className="text-3xl mb-2 block">✅</span>
                <p className="text-green-400 font-bold text-sm">
                  ¡Suscripción exitosa!
                </p>
              </div>
            ) : (
              <div onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                    required
                  />
                  <button
                    onClick={handleSubscribe}
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center text-gray-900 hover:scale-110 transition-transform"
                  >
                    ✉️
                  </button>
                </div>
                <button
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-xl hover:from-red-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Suscribirse Ahora
                </button>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <div className="flex-1 text-center p-3 bg-gray-800 rounded-xl border border-gray-700">
                <p className="text-2xl font-black text-yellow-400">500+</p>
                <p className="text-xs text-gray-400 font-semibold">Clientes</p>
              </div>
              <div className="flex-1 text-center p-3 bg-gray-800 rounded-xl border border-gray-700">
                <p className="text-2xl font-black text-yellow-400">4.8★</p>
                <p className="text-xs text-gray-400 font-semibold">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Separador decorativo */}
        <div className="border-t-2 border-gray-800"></div>

        {/* Footer inferior */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              &copy; 2024 <span className="font-bold text-white">Happy Pizza</span>. Todos los derechos reservados.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Hecho con ❤️ y mucho 🍕
            </p>
          </div>

          <div className="flex gap-6">
            <a 
              href="/privacidad" 
              className="text-gray-400 hover:text-yellow-400 text-sm font-semibold transition-colors"
            >
              Privacidad
            </a>
            <a 
              href="/terminos" 
              className="text-gray-400 hover:text-yellow-400 text-sm font-semibold transition-colors"
            >
              Términos
            </a>
            <a 
              href="/cookies" 
              className="text-gray-400 hover:text-yellow-400 text-sm font-semibold transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>

      {/* Decoración inferior */}
      <div className="h-2 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400"></div>
    </footer>
  );
};

export default Footer;