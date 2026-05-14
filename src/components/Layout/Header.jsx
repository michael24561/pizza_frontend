import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSucursal } from '../../contexts/SucursalContext';
import { AuthContext } from '../../contexts/AuthContext';
import StoreLocator from './StoreLocator';

import {
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  LogOut,
  Package,
  Phone,
  Home,
  Pizza,
} from 'lucide-react';

const Header = () => {
  const { sucursalSeleccionada, setSucursalSeleccionada } = useSucursal();
  const { user, logout } = useContext(AuthContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);

  const [cartCount] = useState(3);

  const location = useLocation();
  const navigate = useNavigate();

  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setSucursalSeleccionada(null);
    setIsProfileMenuOpen(false);
  };

  const isActive = (path) => currentPath === path;

  const navItemClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-red-600 text-white shadow-md'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* LOGO */}
            <div
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-red-600 flex items-center justify-center shadow-sm">
                <Pizza size={22} className="text-white" />
              </div>

              <div>
                <h1 className="text-xl font-black tracking-tight text-gray-900">
                  HAPPY PIZZA
                </h1>

                <p className="text-xs text-gray-500">
                  Pizza artesanal premium
                </p>
              </div>
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => handleNavigation('/')}
                className={navItemClass('/')}
              >
                <Home size={18} />
                Inicio
              </button>

              <button
                onClick={() => handleNavigation('/menu')}
                className={navItemClass('/menu')}
              >
                <Pizza size={18} />
                Menú
              </button>

              <button
                onClick={() => setIsStoreLocatorOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                <MapPin size={18} />
                Tiendas
              </button>

              <button
                onClick={() => handleNavigation('/pedidos')}
                className={navItemClass('/pedidos')}
              >
                <Package size={18} />
                Pedidos
              </button>

              <button
                onClick={() => handleNavigation('/contacto')}
                className={navItemClass('/contacto')}
              >
                <Phone size={18} />
                Contacto
              </button>
            </nav>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {/* Sucursal */}
              {sucursalSeleccionada && (
                <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
                  <MapPin size={16} className="text-red-600" />

                  <span className="text-sm text-gray-700 font-medium">
                    {sucursalSeleccionada.direccion}
                  </span>
                </div>
              )}

              {/* CART */}
              <button
                onClick={() => handleNavigation('/carrito')}
                className="relative w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center"
              >
                <ShoppingCart size={20} className="text-gray-800" />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* PROFILE */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileMenuOpen(!isProfileMenuOpen)
                  }
                  className="flex items-center gap-2 px-4 h-11 rounded-xl bg-red-600 hover:bg-red-700 transition-all text-white font-medium"
                >
                  <User size={18} />

                  <span className="hidden md:block">
                    {user ? user.usuario : 'Mi cuenta'}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-14 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-2">
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-xs text-gray-500">
                              Sesión iniciada
                            </p>

                            <p className="font-semibold text-gray-900 truncate">
                              {user.usuario}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              handleNavigation('/perfil')
                            }
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all text-left"
                          >
                            <User size={18} />
                            Mi perfil
                          </button>

                          <button
                            onClick={() =>
                              handleNavigation('/pedidos')
                            }
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all text-left"
                          >
                            <Package size={18} />
                            Mis pedidos
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all text-left"
                          >
                            <LogOut size={18} />
                            Cerrar sesión
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              handleNavigation('/login')
                            }
                            className="w-full px-4 py-3 rounded-xl hover:bg-gray-100 transition-all text-left"
                          >
                            Iniciar sesión
                          </button>

                          <button
                            onClick={() =>
                              handleNavigation('/register')
                            }
                            className="w-full px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all text-left"
                          >
                            Crear cuenta
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* MOBILE BTN */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center"
              >
                {isMenuOpen ? (
                  <X size={22} />
                ) : (
                  <Menu size={22} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="p-4 space-y-2">
              <button
                onClick={() => handleNavigation('/')}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100"
              >
                Inicio
              </button>

              <button
                onClick={() => handleNavigation('/menu')}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100"
              >
                Menú
              </button>

              <button
                onClick={() => handleNavigation('/pedidos')}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100"
              >
                Pedidos
              </button>

              <button
                onClick={() => handleNavigation('/contacto')}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100"
              >
                Contacto
              </button>
            </div>
          </div>
        )}
      </header>

      <StoreLocator
        isOpen={isStoreLocatorOpen}
        onClose={() => setIsStoreLocatorOpen(false)}
      />
    </>
  );
};

export default Header;