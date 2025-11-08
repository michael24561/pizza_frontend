import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Pedidos from './pages/Pedidos';
import Contacto from './pages/Contacto';
import Carrito from './pages/Carrito';
import Perfil from './pages/Perfil';
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css';

// Componente principal que contiene la lógica del layout
function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app">
      {!isAuthPage && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}