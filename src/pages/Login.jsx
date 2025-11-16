import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginWithToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resp = await api.post("/login/", { usuario, contrasena: password });

      const detail = resp.data.detail?.toLowerCase();

      if (detail === "inicio de sesión exitoso") {
        loginWithToken("", "Cookie", { usuario });
        navigate("/");
        return;
      }

      setError("No se pudo iniciar sesión.");

    } catch (err) {
      setError("No se pudo iniciar sesión. Verifica tus credenciales.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-red-950 to-black flex items-center justify-center p-4 overflow-hidden">
      {/* Fondo de pizza con overlay oscuro - FIJO */}
      <div 
        className="fixed inset-0 opacity-20 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&h=1080&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      
      {/* Patrón de pizzas pequeñas estáticas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl opacity-10"
            style={{
              left: `${(i * 7) % 90}%`,
              top: `${(i * 13) % 90}%`,
            }}
          >
            🍕
          </div>
        ))}
      </div>

      {/* Elementos decorativos con forma de pizza - FIJOS */}
      <div className="fixed top-10 left-10 w-32 h-32 border-4 border-red-600/30 rounded-full z-0"></div>
      <div className="fixed bottom-20 right-20 w-40 h-40 border-4 border-orange-500/30 rounded-full z-0"></div>
      <div className="fixed top-1/3 right-10 w-24 h-24 border-4 border-yellow-400/30 rounded-full z-0"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card principal con marco negro */}
        <div className="bg-gradient-to-br from-gray-900 to-black p-1 rounded-3xl shadow-2xl">
          <div className="bg-white rounded-3xl overflow-hidden">
            {/* Header con diseño mejorado */}
            <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-5 text-center overflow-hidden">
              {/* Patrón de fondo */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`
                }}></div>
              </div>
              
              {/* Pizzas decorativas en el header */}
              <div className="absolute top-2 left-4 text-xl opacity-20">🍕</div>
              <div className="absolute top-2 right-4 text-lg opacity-20">🍕</div>
              <div className="absolute bottom-1 left-1/4 text-base opacity-20">🍕</div>
              <div className="absolute bottom-1 right-1/4 text-lg opacity-20">🍕</div>
              
              {/* Logo principal */}
              <div className="relative mb-2">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-400 relative">
                  <div className="text-3xl">🍕</div>
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>
              
              <h1 className="text-2xl font-black text-white tracking-wide mb-1 drop-shadow-lg relative">
                HAPPY PIZZA
              </h1>
              <p className="text-yellow-300 font-bold text-xs">¡Bienvenido de vuelta!</p>
              <p className="text-red-100 text-xs mt-0.5">Sabor que te hace feliz 🍕</p>
            </div>

            {/* Separador decorativo */}
            <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500"></div>

            {/* Form section con mejor diseño */}
            <div className="p-5 bg-gradient-to-br from-gray-50 to-orange-50">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Usuario input con mejor diseño */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1.5 text-sm flex items-center gap-2">
                    <span className="text-base">👤</span>
                    Usuario
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all shadow-sm text-sm"
                      placeholder="Ingresa tu usuario"
                      required
                    />
                  </div>
                </div>

                {/* Password input con mejor diseño */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1.5 text-sm flex items-center gap-2">
                    <span className="text-base">🔒</span>
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all shadow-sm text-sm"
                      placeholder="Ingresa tu contraseña"
                      required
                    />
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                    <span className="ml-2 text-gray-700 font-semibold group-hover:text-red-600 transition-colors">Recordarme</span>
                  </label>
                  <a href="#" className="text-red-600 hover:text-red-700 font-bold hover:underline transition-all">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                {/* Error message mejorado */}
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-600 p-2.5 rounded-xl shadow-md">
                    <div className="flex items-center">
                      <div className="text-xl mr-2">⚠️</div>
                      <div>
                        <p className="text-red-800 text-xs font-bold">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit button mejorado */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-black py-3 rounded-xl hover:from-red-700 hover:via-red-600 hover:to-orange-600 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group text-sm"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Ingresando...
                      </>
                    ) : (
                      <>
                        <span className="text-lg mr-2">🚀</span>
                        INICIAR SESIÓN
                      </>
                    )}
                  </span>
                  {/* Efecto de brillo al hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>

              {/* Register link mejorado */}
              <div className="mt-4 text-center p-2.5 bg-white rounded-xl shadow-md border-2 border-gray-200">
                <p className="text-gray-700 text-xs font-semibold">
                  ¿No tienes una cuenta?{" "}
                </p>
                <a href="/register" className="inline-block mt-0.5 text-red-600 hover:text-red-700 font-black text-sm hover:underline transition-all">
                  🍕 Regístrate aquí
                </a>
              </div>
            </div>

            {/* Footer decoration mejorado */}
            <div className="h-3 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400"></div>
          </div>
        </div>

        {/* Additional info mejorada */}
        <div className="mt-3 text-center bg-black/50 backdrop-blur-md rounded-xl p-2.5 shadow-xl border-2 border-red-600/50">
          <p className="text-white font-bold text-xs flex items-center justify-center gap-2">
            <span className="text-lg">🍕</span>
            La mejor pizza de la ciudad
            <span className="text-lg">🍕</span>
          </p>
          <p className="text-yellow-400 text-xs mt-0.5">Más de 10,000 clientes satisfechos</p>
        </div>
      </div>
    </div>
  );
}