import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const [currentPath, setCurrentPath] = useState('/');

  const handleOrderClick = () => {
    setCurrentPath('/menu');
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    setCurrentPath('/carrito');
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleNavigation = (path) => {
    setCurrentPath(path);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    // Aquí puedes agregar lógica para limpiar el token de autenticación, etc.
    console.log('Cerrando sesión...');
    
    // Redirigir al login
    window.location.href = '/login';
  };

  const isActive = (path) => currentPath === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b-4 border-red-600">
      <nav className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavigation('/')}>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-400 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🍕</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                  HAPPY PIZZA
                </h1>
                <p className="text-xs text-red-600 font-bold">Sabor que te hace feliz</p>
              </div>
            </div>

            {/* Menú de Navegación - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => handleNavigation('/')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600 hover:scale-105'
                }`}
              >
                <span className="text-xl">🏠</span>
                <span>Inicio</span>
              </button>

              <button
                onClick={() => handleNavigation('/menu')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  isActive('/menu')
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600 hover:scale-105'
                }`}
              >
                <span className="text-xl">🍕</span>
                <span>Menú</span>
              </button>

              <button
                onClick={() => handleNavigation('/pedidos')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  isActive('/pedidos')
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600 hover:scale-105'
                }`}
              >
                <span className="text-xl">📦</span>
                <span>Mis Pedidos</span>
              </button>

              <button
                onClick={() => handleNavigation('/contacto')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  isActive('/contacto')
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600 hover:scale-105'
                }`}
              >
                <span className="text-xl">📞</span>
                <span>Contacto</span>
              </button>

              <button
                onClick={handleOrderClick}
                className="ml-3 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-black px-6 py-3 rounded-xl hover:from-yellow-500 hover:to-orange-500 transform hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <span className="text-xl">🚀</span>
                <span>Ordenar Ahora</span>
              </button>
            </div>

            {/* Carrito y Usuario */}
            <div className="flex items-center gap-3">
              {/* Carrito */}
              <button
                onClick={handleCartClick}
                className="relative bg-red-50 hover:bg-red-100 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 group"
              >
                <span className="text-2xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Usuario con menú desplegable */}
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold px-4 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <span className="text-xl">👤</span>
                  <span className="hidden md:inline">Mi Cuenta</span>
                </button>

                {/* Menú desplegable del perfil */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border-2 border-red-100 overflow-hidden z-50">
                    <div className="p-2">
                      <button
                        onClick={() => handleNavigation('/perfil')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 font-semibold"
                      >
                        <span className="text-xl">👤</span>
                        <span>Mi Perfil</span>
                      </button>

                      <button
                        onClick={() => handleNavigation('/pedidos')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 font-semibold"
                      >
                        <span className="text-xl">📦</span>
                        <span>Mis Pedidos</span>
                      </button>

                      <button
                        onClick={() => handleNavigation('/configuracion')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 font-semibold"
                      >
                        <span className="text-xl">⚙️</span>
                        <span>Configuración</span>
                      </button>

                      <div className="border-t border-gray-200 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 font-bold"
                      >
                        <span className="text-xl">🚪</span>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de menú móvil */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-red-50 transition-all"
              >
                <span className={`w-6 h-0.5 bg-red-600 rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-red-600 rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-red-600 rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Menú Móvil */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t-2 border-red-200 transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4 space-y-2">
            <button
              onClick={() => handleNavigation('/')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <span className="text-2xl">🏠</span>
              <span>Inicio</span>
            </button>

            <button
              onClick={() => handleNavigation('/menu')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                isActive('/menu')
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <span className="text-2xl">🍕</span>
              <span>Menú</span>
            </button>

            <button
              onClick={() => handleNavigation('/pedidos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                isActive('/pedidos')
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <span className="text-2xl">📦</span>
              <span>Mis Pedidos</span>
            </button>

            <button
              onClick={() => handleNavigation('/contacto')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                isActive('/contacto')
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <span className="text-2xl">📞</span>
              <span>Contacto</span>
            </button>

            <button
              onClick={() => handleNavigation('/perfil')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 sm:hidden"
            >
              <span className="text-2xl">👤</span>
              <span>Mi Perfil</span>
            </button>

            <button
              onClick={() => handleNavigation('/configuracion')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 sm:hidden"
            >
              <span className="text-2xl">⚙️</span>
              <span>Configuración</span>
            </button>

            {/* Botón de cerrar sesión en móvil */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-300 sm:hidden"
            >
              <span className="text-2xl">🚪</span>
              <span>Cerrar Sesión</span>
            </button>

            <button
              onClick={handleOrderClick}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-black px-6 py-4 rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 shadow-lg mt-4"
            >
              <span className="text-2xl">🚀</span>
              <span>Ordenar Ahora</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay para cerrar menú móvil */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm -z-10"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Overlay para cerrar menú de perfil */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsProfileMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;