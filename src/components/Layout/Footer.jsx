import React from 'react';

import {
  Facebook,
  Instagram,
  Phone,
  MapPin,
  Mail,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  HP
                </span>
              </div>

              <div>
                <h3 className="font-black text-xl text-white">
                  HAPPY PIZZA
                </h3>

                <p className="text-sm text-gray-500">
                  Pizza artesanal premium
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-400">
              Ingredientes frescos, preparación artesanal y una
              experiencia moderna para disfrutar la mejor pizza.
            </p>

            <div className="flex gap-3 mt-6">
              <button className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-red-600 transition-all flex items-center justify-center">
                <Facebook size={18} />
              </button>

              <button className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-red-600 transition-all flex items-center justify-center">
                <Instagram size={18} />
              </button>
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">
              Navegación
            </h4>

            <div className="space-y-3 text-sm">
              <a
                href="/"
                className="block hover:text-white transition-all"
              >
                Inicio
              </a>

              <a
                href="/menu"
                className="block hover:text-white transition-all"
              >
                Menú
              </a>

              <a
                href="/pedidos"
                className="block hover:text-white transition-all"
              >
                Pedidos
              </a>

              <a
                href="/contacto"
                className="block hover:text-white transition-all"
              >
                Contacto
              </a>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">
              Contacto
            </h4>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-red-500 mt-0.5"
                />

                <span>
                  Av. Pizza 123
                  <br />
                  Lima, Perú
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-red-500" />

                <span>+51 987 654 321</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-red-500" />

                <span>info@happypizza.com</span>
              </div>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">
              Suscríbete
            </h4>

            <p className="text-sm text-gray-400 mb-5">
              Recibe promociones y novedades directamente en tu
              correo.
            </p>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full h-12 px-4 rounded-xl bg-gray-900 border border-gray-700 focus:border-red-500 outline-none transition-all"
              />

              <button className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 transition-all text-white font-medium">
                Suscribirme
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Happy Pizza. Todos los derechos reservados.
          </p>

          <div className="flex gap-6 text-sm text-gray-500">
            <a href="/privacidad" className="hover:text-white">
              Privacidad
            </a>

            <a href="/terminos" className="hover:text-white">
              Términos
            </a>

            <a href="/cookies" className="hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;