// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (token !== null || savedUser !== null) {
      api.get("/status/")
        .then((resp) => {
          if (resp.data.is_authenticated) {
            const freshUser = { ...JSON.parse(savedUser || '{}'), ...resp.data };
            setUser(freshUser);
            localStorage.setItem("user", JSON.stringify(freshUser));
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("auth_scheme");
          localStorage.removeItem("user");
          setUser(null);
        })
        .finally(() => {
          setAuthLoading(false);
        });
    } else {
      setAuthLoading(false);
    }
  }, []);

  const loginWithToken = (token, scheme = "Token", userData = null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("auth_scheme", scheme);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      setUser({ logged: true });
    }
    setAuthLoading(false);
  };

  const logout = async () => {
    try { await api.get("/logout/"); } catch (e) { /*ignore*/ }
    localStorage.removeItem("token");
    localStorage.removeItem("auth_scheme");
    localStorage.removeItem("user");
    setUser(null);
    setAuthLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginWithToken, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
