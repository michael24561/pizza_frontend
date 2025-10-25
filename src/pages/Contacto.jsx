import React, { useState } from 'react';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    alert('¡Mensaje enviado! Te contactaremos pronto.');
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: ''
    });
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Visítanos',
      content: 'Av. Pizza 123, Ciudad Feliz',
      description: 'Estamos en el corazón de la ciudad'
    },
    {
      icon: '📞',
      title: 'Llámamos',
      content: '+51 987 654 321',
      description: 'Lun-Dom: 10:00 AM - 11:00 PM'
    },
    {
      icon: '✉️',
      title: 'Escríbenos',
      content: 'hola@happypizza.com',
      description: 'Respondemos en menos de 2 horas'
    },
    {
      icon: '🕒',
      title: 'Horario',
      content: '10:00 AM - 11:00 PM',
      description: 'Todos los días del año'
    }
  ];

  const faqs = [
    {
      question: '¿Cuál es el tiempo de entrega?',
      answer: 'Nuestro tiempo de entrega promedio es de 30-45 minutos, dependiendo de tu ubicación y la demanda del momento.'
    },
    {
      question: '¿Hacen entregas a domicilio?',
      answer: 'Sí, realizamos entregas a domicilio en toda la ciudad. El costo de delivery depende de tu ubicación.'
    },
    {
      question: '¿Aceptan tarjetas de crédito?',
      answer: 'Aceptamos todas las tarjetas de crédito y débito, además de pago en efectivo y Yape/Plin.'
    },
    {
      question: '¿Puedo personalizar mi pizza?',
      answer: '¡Por supuesto! Puedes agregar o quitar ingredientes según tus preferencias al realizar tu pedido.'
    },
    {
      question: '¿Tienen opciones vegetarianas?',
      answer: 'Sí, tenemos varias opciones vegetarianas y podemos adaptar cualquier pizza a tus necesidades dietéticas.'
    },
    {
      question: '¿Qué medidas de seguridad toman?',
      answer: 'Implementamos estrictos protocolos de seguridad e higiene en la preparación y entrega de todos nuestros productos.'
    }
  ];

  return (
    <div className="contacto-page">
      {/* Hero Section */}
      <section className="contacto-hero">
        <div className="container">
          <div className="contacto-header">
            <h1>📞 Contáctanos</h1>
            <p>Estamos aquí para ayudarte. ¡Tu satisfacción es nuestra prioridad!</p>
          </div>
        </div>
      </section>

      {/* Información de Contacto */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="contact-icon">{info.icon}</div>
                <h3>{info.title}</h3>
                <p className="contact-content">{info.content}</p>
                <p className="contact-description">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario y Mapa */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-form-grid">
            {/* Formulario */}
            <div className="form-container">
              <h2>📝 Envíanos un mensaje</h2>
              <p>¿Tienes alguna pregunta o sugerencia? Escríbenos y te responderemos pronto.</p>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Correo electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+51 987 654 321"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="asunto">Asunto *</label>
                    <select
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="pedido">Consulta sobre pedido</option>
                      <option value="queja">Queja o reclamo</option>
                      <option value="sugerencia">Sugerencia</option>
                      <option value="trabajo">Trabaja con nosotros</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje *</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  📤 Enviar Mensaje
                </button>
              </form>
            </div>

            {/* Mapa */}
            <div className="map-container">
              <h2>📍 Encuéntranos</h2>
              <div className="map-placeholder">
                <div className="map-content">
                  <div className="map-icon">🗺️</div>
                  <h3>Happy Pizza - Sucursal Principal</h3>
                  <p>Av. Pizza 123, Ciudad Feliz</p>
                  <p>📍 Frente al Parque Central</p>
                  <div className="map-features">
                    <span>🅿️ Estacionamiento gratuito</span>
                    <span>♿ Acceso para sillas de ruedas</span>
                    <span>🍽️ Comedor climatizado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-header">
            <h2>❓ Preguntas Frecuentes</h2>
            <p>Respuestas a las dudas más comunes de nuestros clientes</p>
          </div>
          
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>🍕 ¿Listo para ordenar?</h2>
            <p>No esperes más para disfrutar de la mejor pizza de la ciudad</p>
            <div className="cta-actions">
              <button className="btn btn-primary btn-large">🚀 Ordenar Ahora</button>
              <button className="btn btn-secondary btn-large">📱 Llamar Ahora</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;