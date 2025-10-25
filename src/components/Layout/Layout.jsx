import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-orange-50">
      {/* Header/Navbar */}
      <Header
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Sidebar solo si NO estamos en Home */}
      { !isHome && (
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}

      {/* Contenido Principal */}
      <main
        className={`pt-20 transition-all duration-500 ${
          !isHome ? (sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72') : ''
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}