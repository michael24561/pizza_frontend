import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Aquí cambia la URL a la de tu backend real (por ejemplo http://127.0.0.1:8000/api/token/)
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });

      // Si tu backend devuelve access y refresh tokens
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      alert("✅ Inicio de sesión exitoso!");
      window.location.href = "/home"; // redirige a tu página principal
    } catch (err) {
      console.error(err);
      setError("❌ Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg p-2 w-full mb-3"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg p-2 w-full mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-lg w-full hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
