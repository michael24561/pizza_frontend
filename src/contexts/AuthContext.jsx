import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

import api from "../api";

export const AuthContext = createContext(null);

/* ─────────────────────────────────────────
   CUSTOM HOOK
───────────────────────────────────────── */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    console.error(
      "useAuth debe usarse dentro de AuthProvider"
    );

    return {
      user: null,
      setUser: () => {},
      loginWithToken: () => {},
      logout: () => {},
      authLoading: false,
    };
  }

  return context;
}

/* ─────────────────────────────────────────
   PROVIDER
───────────────────────────────────────── */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error(err);
      }
    }

    if (token || savedUser) {
      api
        .get("/status/")
        .then((resp) => {
          if (resp.data.is_authenticated) {
            const freshUser = {
              ...(savedUser
                ? JSON.parse(savedUser)
                : {}),
              ...resp.data,
            };

            setUser(freshUser);

            localStorage.setItem(
              "user",
              JSON.stringify(freshUser)
            );
          }
        })
        .catch(() => {
          localStorage.removeItem("token");

          localStorage.removeItem(
            "auth_scheme"
          );

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

  /* ─────────────────────────────────────────
     LOGIN
  ───────────────────────────────────────── */

  const loginWithToken = (
    token,
    scheme = "Token",
    userData = null
  ) => {
    localStorage.setItem("token", token);

    localStorage.setItem(
      "auth_scheme",
      scheme
    );

    if (userData) {
      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      setUser(userData);
    } else {
      setUser({ logged: true });
    }

    setAuthLoading(false);
  };

  /* ─────────────────────────────────────────
     LOGOUT
  ───────────────────────────────────────── */

  const logout = async () => {
    try {
      await api.get("/logout/");
    } catch (e) {
      console.error(e);
    }

    localStorage.removeItem("token");

    localStorage.removeItem("auth_scheme");

    localStorage.removeItem("user");

    setUser(null);

    setAuthLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginWithToken,
        logout,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};