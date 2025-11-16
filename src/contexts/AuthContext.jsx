// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // puedes guardar {usuario, correo, ...}

  useEffect(() => {
    // Al cargar la app, intentar recuperar usuario si hay token
    const token = localStorage.getItem("token");
    if (token) {
      // Intento: pedir /status/ o /clientes/actual para confirmar token.
      api.get("/status/")
        .then(res => {
          // backend devolvió éxito -> marcar usuario como logueado (no incluye datos de usuario en este endpoint)
          setUser({ logged: true });
        })
        .catch(()=> {
          localStorage.removeItem("token");
          localStorage.removeItem("auth_scheme");
          setUser(null);
        });
    }
  }, []);

  const loginWithToken = (token, scheme = "Token", userData = null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("auth_scheme", scheme);
    if (userData) setUser(userData);
    else setUser({ logged: true });
  };

  const logout = async () => {
    // opcional: llamar /logout/ si tu backend lo soporta
    try { await api.get("/logout/"); } catch(e){ /*ignore*/ }
    localStorage.removeItem("token");
    localStorage.removeItem("auth_scheme");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
