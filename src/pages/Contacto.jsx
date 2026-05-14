import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ChevronDown,
  Pizza,
  MessageCircle,
  Headphones,
  ShieldCheck,
} from "lucide-react";

const Contacto = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSending(true);

      // Simulación envío
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Mensaje enviado correctamente 🍕");

      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      });
    } catch (error) {
      toast.error("No se pudo enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visítanos",
      content: "Av. Pizza 123, Ciudad Feliz",
      description: "Estamos en el corazón de la ciudad",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: Phone,
      title: "Llámanos",
      content: "+51 987 654 321",
      description: "Atención todos los días",
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: Mail,
      title: "Correo",
      content: "hola@happypizza.com",
      description: "Respuesta rápida garantizada",
      color: "from-gray-800 to-black",
    },
    {
      icon: Clock,
      title: "Horario",
      content: "10:00 AM - 11:00 PM",
      description: "Abierto todos los días",
      color: "from-red-600 to-red-800",
    },
  ];

  const faqs = [
    {
      question: "¿Cuál es el tiempo de entrega?",
      answer:
        "Nuestro tiempo promedio es de 30 a 45 minutos dependiendo de la zona y demanda.",
    },
    {
      question: "¿Aceptan Yape y Plin?",
      answer:
        "Sí. Puedes pagar con Yape, Plin, tarjetas y efectivo.",
    },
    {
      question: "¿Puedo personalizar mi pizza?",
      answer:
        "Claro. Puedes agregar o quitar ingredientes durante tu pedido.",
    },
    {
      question: "¿Tienen opciones vegetarianas?",
      answer:
        "Sí, contamos con pizzas y acompañamientos vegetarianos.",
    },
    {
      question: "¿Realizan delivery?",
      answer:
        "Sí. Hacemos entregas en toda la ciudad con seguimiento en tiempo real.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600"
            alt="Pizza"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-32">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8">
              <Pizza className="w-4 h-4 text-red-500" />

              <span className="text-white text-sm font-semibold tracking-wide">
                HAPPY PIZZA
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Estamos aquí
              <span className="block text-red-500">
                para ayudarte
              </span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              ¿Tienes dudas, sugerencias o necesitas ayuda con tu
              pedido? Nuestro equipo está listo para atenderte.
            </p>
          </motion.div>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${info.color} flex items-center justify-center text-white mb-6`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3">
                    {info.title}
                  </h3>

                  <p className="font-semibold text-gray-900 mb-2">
                    {info.content}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {info.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[32px] border border-gray-100 p-8 lg:p-10 shadow-sm"
          >
            <div className="mb-10">
              <div className="inline-flex items-center gap-3 bg-red-50 text-red-600 px-4 py-2 rounded-full mb-5">
                <MessageCircle className="w-4 h-4" />
                <span className="font-semibold text-sm">
                  Formulario de contacto
                </span>
              </div>

              <h2 className="text-4xl font-black mb-4">
                Envíanos un mensaje
              </h2>

              <p className="text-gray-500 leading-relaxed">
                Completa el formulario y nuestro equipo te
                responderá lo antes posible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Nombre completo
                  </label>

                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="correo@email.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Teléfono
                  </label>

                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+51 999 999 999"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Asunto
                  </label>

                  <select
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Selecciona</option>
                    <option value="pedido">
                      Consulta sobre pedido
                    </option>
                    <option value="reclamo">
                      Reclamo
                    </option>
                    <option value="sugerencia">
                      Sugerencia
                    </option>
                    <option value="trabajo">
                      Trabaja con nosotros
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-sm">
                  Mensaje
                </label>

                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Escribe tu mensaje..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white py-5 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-3"
              >
                {sending ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* MAP / INFO */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
              <div className="h-[420px] relative">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200"
                  alt="Mapa"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-3xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white">
                      <MapPin className="w-7 h-7" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black mb-2">
                        Happy Pizza
                      </h3>

                      <p className="text-gray-600 mb-3">
                        Av. Pizza 123, Ciudad Feliz
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="bg-red-50 text-red-600 px-3 py-2 rounded-full font-semibold">
                          🅿️ Estacionamiento
                        </span>

                        <span className="bg-gray-100 px-3 py-2 rounded-full font-semibold">
                          ♿ Acceso universal
                        </span>

                        <span className="bg-orange-50 text-orange-600 px-3 py-2 rounded-full font-semibold">
                          🍕 Delivery rápido
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUPPORT CARDS */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-7">
                <Headphones className="w-10 h-10 text-red-600 mb-5" />

                <h3 className="text-2xl font-black mb-3">
                  Atención premium
                </h3>

                <p className="text-gray-500 leading-relaxed">
                  Nuestro equipo responde rápidamente todas tus
                  consultas.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 p-7">
                <ShieldCheck className="w-10 h-10 text-green-600 mb-5" />

                <h3 className="text-2xl font-black mb-3">
                  Compra segura
                </h3>

                <p className="text-gray-500 leading-relaxed">
                  Tus pedidos y datos están protegidos con
                  seguridad avanzada.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-600 font-semibold uppercase tracking-wider text-sm mb-4">
              Preguntas frecuentes
            </p>

            <h2 className="text-5xl font-black mb-6">
              Todo lo que necesitas saber
            </h2>

            <p className="text-gray-500 text-lg">
              Resolvemos las dudas más comunes de nuestros
              clientes.
            </p>
          </div>

          <div className="space-y-5">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                layout
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setActiveFaq(
                      activeFaq === index ? null : index
                    )
                  }
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <h3 className="font-bold text-lg">
                    {faq.question}
                  </h3>

                  <ChevronDown
                    className={`w-6 h-6 transition-transform ${
                      activeFaq === index
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="px-8 pb-8 text-gray-500 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-10 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-[40px] overflow-hidden relative">
            <div className="absolute inset-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 px-8 py-20 lg:px-20 text-center">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                ¿Listo para ordenar?
              </h2>

              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
                Disfruta de pizzas artesanales con ingredientes
                frescos y delivery rápido.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() =>
                    (window.location.href = "/menu")
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-bold transition"
                >
                  🍕 Ir al menú
                </button>

                <button
                  onClick={() =>
                    window.open("tel:+51987654321")
                  }
                  className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold hover:bg-gray-100 transition"
                >
                  📞 Llamar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;