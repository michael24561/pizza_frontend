import { useState } from 'react';

export default function Sidebar() {
  const [currentPath, setCurrentPath] = useState('/');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const isActive = (path) => currentPath === path;

  const handleNavigation = (path) => {
    setCurrentPath(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 shadow-xl z-50 border-b-4 border-yellow-400">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center gap-4">
            {/* Botón menú móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-400">
                <span className="text-3xl">🍕</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black text-white tracking-tight">HAPPY PIZZA</h1>
                <p className="text-xs text-yellow-200 font-semibold">Panel de Administración</p>
              </div>
            </div>
          </div>

          {/* Acciones del header */}
          <div className="flex items-center gap-3">
            {/* Botón colapsar (desktop) */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm">{sidebarCollapsed ? 'Expandir' : 'Colapsar'}</span>
            </button>

            {/* Notificaciones */}
            <button className="relative bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">3</span>
            </button>

            {/* Usuario */}
            <div className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl cursor-pointer transition-all">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-black text-gray-900 border-2 border-white">
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-white font-bold text-sm">Admin</p>
                <p className="text-yellow-200 text-xs">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-20 left-0 h-[calc(100vh-5rem)] bg-white border-r-4 border-orange-300 shadow-2xl transition-all duration-500 z-40 overflow-y-auto ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4">
          {/* Menú de Navegación */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
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
              </button>
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

          {/* Información del sistema */}
          {!sidebarCollapsed && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Versión del Sistema</p>
                  <p className="text-sm font-black text-gray-900">v1.0.0</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Estado:</span>
                  <span className="flex items-center gap-1 text-green-600 font-bold">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Activo
                  </span>
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

      {/* CONTENIDO PRINCIPAL */}
      <main className={`pt-20 transition-all duration-500 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <div className="p-8">
          {/* Dashboard Content */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {menuItems.find(item => item.path === currentPath)?.label || 'Dashboard'}
            </h2>
            <p className="text-gray-600">
              Gestiona y supervisa todas las operaciones de Happy Pizza
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">📦</span>
                <span className="text-3xl font-black">24</span>
              </div>
              <p className="font-bold text-red-100">Pedidos Hoy</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">💰</span>
                <span className="text-3xl font-black">S/ 1,250</span>
              </div>
              <p className="font-bold text-orange-100">Ventas del Día</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-2xl shadow-lg text-gray-900">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">👥</span>
                <span className="text-3xl font-black">156</span>
              </div>
              <p className="font-bold text-yellow-800">Clientes Activos</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">⭐</span>
                <span className="text-3xl font-black">4.8</span>
              </div>
              <p className="font-bold text-green-100">Calificación</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {[
                { icon: '🛒', text: 'Nuevo pedido #1234', time: 'Hace 5 min', color: 'bg-red-100 text-red-600' },
                { icon: '✅', text: 'Pedido #1233 completado', time: 'Hace 15 min', color: 'bg-green-100 text-green-600' },
                { icon: '👤', text: 'Nuevo cliente registrado', time: 'Hace 30 min', color: 'bg-blue-100 text-blue-600' },
                { icon: '📊', text: 'Reporte semanal generado', time: 'Hace 1 hora', color: 'bg-purple-100 text-purple-600' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${activity.color}`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}