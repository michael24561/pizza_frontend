import { Routes, Route, useLocation } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import useCheckoutVerifier from './hooks/useCheckoutVerifier';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Pedidos from './pages/Pedidos';
import Contacto from './pages/Contacto';
import Carrito from './pages/Carrito';
import Perfil from './pages/Perfil';
import Register from './pages/Register';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import PagoExitoso from './pages/PagoExitoso';

import './App.css';

function AppContent() {
  const location = useLocation();

  // Verificar checkouts pendientes de Mercado Pago en CUALQUIER página
  useCheckoutVerifier();

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route
          path="/detalle/:type/:id"
          element={<ProductDetail />}
        />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return <AppContent />;
}