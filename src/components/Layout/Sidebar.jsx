import { useState } from 'react';

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  UserCog,
  Boxes,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const [currentPath, setCurrentPath] = useState('/');

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const menuItems = [
    {
      path: '/',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },

    {
      path: '/pedidos',
      icon: ShoppingBag,
      label: 'Pedidos',
    },

    {
      path: '/productos',
      icon: Package,
      label: 'Productos',
    },

    {
      path: '/clientes',
      icon: Users,
      label: 'Clientes',
    },

    {
      path: '/empleados',
      icon: UserCog,
      label: 'Empleados',
    },

    {
      path: '/inventario',
      icon: Boxes,
      label: 'Inventario',
    },

    {
      path: '/reportes',
      icon: BarChart3,
      label: 'Reportes',
    },

    {
      path: '/configuracion',
      icon: Settings,
      label: 'Configuración',
    },
  ];

  const isActive = (path) => currentPath === path;

  const handleNavigation = (path) => {
    setCurrentPath(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* MOBILE BUTTON */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-5 left-5 z-50 lg:hidden w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-md flex items-center justify-center"
      >
        <Menu size={20} />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          bg-white
          border-r
          border-gray-200
          z-50
          transition-all
          duration-300
          flex
          flex-col
          ${
            sidebarCollapsed ? 'w-24' : 'w-72'
          }
          ${
            mobileMenuOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* HEADER */}
        <div className="h-20 border-b border-gray-200 px-6 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-black text-gray-900">
                HAPPY PIZZA
              </h1>

              <p className="text-xs text-gray-500">
                Administración
              </p>
            </div>
          )}

          {/* COLLAPSE */}
          <button
            onClick={() =>
              setSidebarCollapsed(!sidebarCollapsed)
            }
            className="hidden lg:flex w-10 h-10 rounded-xl hover:bg-gray-100 transition-all items-center justify-center"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

          {/* MOBILE CLOSE */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden w-10 h-10 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    h-14
                    rounded-2xl
                    transition-all
                    duration-200
                    group
                    ${
                      isActive(item.path)
                        ? 'bg-red-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className="flex-shrink-0"
                  />

                  {!sidebarCollapsed && (
                    <span className="font-medium">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 p-4">
          {!sidebarCollapsed ? (
            <div className="rounded-2xl bg-gray-100 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Sistema activo
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Happy Pizza v1.0.0
              </p>

              <div className="flex items-center gap-2 mt-4">
                <div className="w-2 h-2 rounded-full bg-green-500" />

                <span className="text-xs text-gray-600">
                  Todos los servicios operativos
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}