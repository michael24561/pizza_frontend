import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PagoExitoso = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          borderRadius: "24px",
          padding: "3rem 2.5rem",
          textAlign: "center",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Ícono de check animado */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00b894, #00cec9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: "0 8px 32px rgba(0, 184, 148, 0.4)",
          }}
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            width="45"
            height="45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
          </motion.svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            color: "#fff",
            fontSize: "1.8rem",
            fontWeight: "700",
            marginBottom: "0.75rem",
          }}
        >
          ¡Pago Exitoso!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "1rem",
            lineHeight: "1.6",
            marginBottom: "2rem",
          }}
        >
          Tu pedido ha sido registrado correctamente.
          <br />
          ¡Gracias por tu compra! 🍕
        </motion.p>

        {/* Barra de progreso */}
        <div
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            background: "rgba(255,255,255,0.1)",
            overflow: "hidden",
            marginBottom: "1rem",
          }}
        >
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            style={{
              height: "100%",
              borderRadius: "3px",
              background: "linear-gradient(90deg, #00b894, #00cec9)",
            }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.85rem",
          }}
        >
          Redirigiendo al inicio en{" "}
          <span style={{ color: "#00cec9", fontWeight: "600" }}>
            {countdown}s
          </span>
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => navigate("/", { replace: true })}
          style={{
            marginTop: "1.5rem",
            padding: "0.7rem 2rem",
            borderRadius: "12px",
            border: "1px solid rgba(0, 206, 201, 0.3)",
            background: "rgba(0, 206, 201, 0.1)",
            color: "#00cec9",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(0, 206, 201, 0.2)";
            e.target.style.borderColor = "rgba(0, 206, 201, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(0, 206, 201, 0.1)";
            e.target.style.borderColor = "rgba(0, 206, 201, 0.3)";
          }}
        >
          Ir al inicio ahora
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PagoExitoso;
