import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ 
  sidebarCollapsed, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Inicio' },
    { path: '/menu', icon: '🍽️', label: 'Menú' },
    { path: '/pedidos', icon: '🛒', label: 'Pedidos' },
    { path: '/productos', icon: '📦', label: 'Productos' },
    { path: '/clientes', icon: '👥', label: 'Clientes' },
    { path: '/empleados', icon: '👨‍💼', label: 'Empleados' },
    { path: '/inventario', icon: '📋', label: 'Inventario' },
    { path: '/reportes', icon: '📊', label: 'Reportes' },
    { path: '/configuracion', icon: '⚙️', label: 'Configuración' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-20 left-0 h-[calc(100vh-5rem)] bg-white border-r-4 border-orange-300 shadow-2xl transition-all duration-500 z-40 overflow-y-auto ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4">
          {/* Menú de Navegación */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-red-600 hover:scale-105'
                }`}
              >
                {/* Barra lateral activa */}
                {isActive(item.path) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400 rounded-r-full shadow-lg"></div>
                )}

                {/* Icono */}
                <span
                  className={`text-3xl transition-transform duration-300 ${
                    isActive(item.path) ? 'scale-110' : 'group-hover:scale-125'
                  }`}
                >
                  {item.icon}
                </span>

                {/* Texto del menú */}
                {!sidebarCollapsed && (
                  <span className="font-bold text-lg whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {/* Tooltip para sidebar colapsado */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-6 px-4 py-2 bg-gray-900 text-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap text-sm font-bold shadow-xl z-50">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Sección de Ayuda */}
          {!sidebarCollapsed && (
            <div className="mt-8 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-orange-200 shadow-lg">
              <div className="text-center mb-4">
                <span className="text-5xl">💡</span>
              </div>
              <h3 className="font-black text-lg text-gray-900 mb-2 text-center">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Consulta nuestra guía de usuario
              </p>
              <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
                Ver Guía
              </button>
            </div>
          )}

          {/* Información del sistema (solo visible cuando no está colapsado) */}
          {!sidebarCollapsed && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Versión del Sistema</p>
                  <p className="text-sm font-black text-gray-900">v1.0.0</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay para móvil */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}