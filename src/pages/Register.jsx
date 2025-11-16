import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    // Validación de contraseñas
    if (contrasena !== confirmarContrasena) {
      setErrors({ contrasena: ["Las contraseñas no coinciden"] });
      setLoading(false);
      return;
    }

    const payload = {
      usuario,
      correo,
      telefono: telefono ? Number(telefono) : null,
      contrasena,
    };

    // Intento primario: POST a /clientes/
    try {
      const res = await api.post("/clientes/", payload);
      // 201 creado -> registro exitoso
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      // si hay errores de validación, DRF devuelve objeto con campos
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ["Error de conexión"] });
      }
    } finally {
      setLoading(false);
    }
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

      <div className="w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                ÚNETE A HAPPY PIZZA
              </h1>
              <p className="text-yellow-300 font-bold text-xs">¡Crea tu cuenta y disfruta!</p>
              <p className="text-red-100 text-xs mt-0.5">Sabor que te hace feliz 🍕</p>
            </div>

            {/* Separador decorativo */}
            <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500"></div>

            {/* Form section con scroll oculto */}
            <div className="p-5 bg-gradient-to-br from-gray-50 to-orange-50 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {success ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-green-300">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mb-2">¡Registro Exitoso!</h3>
                  <p className="text-gray-600 text-sm">Redirigiendo al inicio de sesión...</p>
                  <div className="mt-4">
                    <div className="w-8 h-8 mx-auto border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Usuario input */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-1.5 text-sm flex items-center gap-2">
                      <span className="text-base">👤</span>
                      Usuario *
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
                        placeholder="Tu nombre de usuario"
                        required
                      />
                    </div>
                  </div>

                  {/* Correo input */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-1.5 text-sm flex items-center gap-2">
                      <span className="text-base">📧</span>
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all shadow-sm text-sm"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Teléfono input */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-1.5 text-sm flex items-center gap-2">
                      <span className="text-base">📱</span>
                      Teléfono
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all shadow-sm text-sm"
                        placeholder="999 999 999"
                      />
                    </div>
                  </div>

                  {/* Contraseña input */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-1.5 text-sm flex items-center gap-2">
                      <span className="text-base">🔒</span>
                      Contraseña *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all shadow-sm text-sm"
                        placeholder="Mínimo 6 caracteres"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirmar Contraseña input */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-1.5 text-sm flex items-center gap-2">
                      <span className="text-base">✅</span>
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={confirmarContrasena}
                        onChange={(e) => setConfirmarContrasena(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all shadow-sm text-sm"
                        placeholder="Repite tu contraseña"
                        required
                      />
                    </div>
                  </div>

                  {/* Términos y condiciones */}
                  <div className="flex items-start text-xs">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-1 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      required
                    />
                    <label className="ml-2 text-gray-700">
                      Acepto los{" "}
                      <a href="#" className="text-red-600 hover:text-red-700 font-bold">
                        términos y condiciones
                      </a>
                      {" "}y la{" "}
                      <a href="#" className="text-red-600 hover:text-red-700 font-bold">
                        política de privacidad
                      </a>
                    </label>
                  </div>

                  {/* Error messages */}
                  {errors && (
                    <div className="bg-red-100 border-l-4 border-red-600 p-2.5 rounded-xl shadow-md">
                      <div className="flex items-center">
                        <div className="text-xl mr-2">⚠️</div>
                        <div>
                          {Object.entries(errors).map(([k, v]) => (
                            <p key={k} className="text-red-800 text-xs font-bold">
                              <strong className="capitalize">{k}:</strong> {Array.isArray(v) ? v.join(", ") : String(v)}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit button */}
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
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          <span className="text-lg mr-2">🚀</span>
                          CREAR CUENTA
                        </>
                      )}
                    </span>
                    {/* Efecto de brillo al hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </form>
              )}

              {/* Login link */}
              {!success && (
                <div className="mt-4 text-center p-2.5 bg-white rounded-xl shadow-md border-2 border-gray-200">
                  <p className="text-gray-700 text-xs font-semibold">
                    ¿Ya tienes una cuenta?{" "}
                  </p>
                  <a href="/login" className="inline-block mt-0.5 text-red-600 hover:text-red-700 font-black text-sm hover:underline transition-all">
                    🍕 Inicia sesión aquí
                  </a>
                </div>
              )}
            </div>

            {/* Footer decoration mejorado */}
            <div className="h-3 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400"></div>
          </div>
        </div>

        {/* Additional info mejorada */}
        <div className="mt-3 text-center bg-black/50 backdrop-blur-md rounded-xl p-2.5 shadow-xl border-2 border-red-600/50">
          <p className="text-white font-bold text-xs flex items-center justify-center gap-2">
            <span className="text-lg">🍕</span>
            Únete a la familia Happy Pizza
            <span className="text-lg">🍕</span>
          </p>
          <p className="text-yellow-400 text-xs mt-0.5">Más de 10,000 clientes satisfechos</p>
        </div>
      </div>
    </div>
  );
}