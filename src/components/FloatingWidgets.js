// frontend/src/components/FloatingWidgets.js
// Burbujas flotantes de redes sociales (WhatsApp, Instagram, Facebook) +
// chat flotante de NILA, el asistente virtual de FERIM.
import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

// ⚙️ REEMPLAZA estos valores con los reales de FERIM:
const SOCIAL = {
  // WhatsApp: número en formato internacional SIN '+' ni espacios (ej: 57 + número)
  whatsapp: 'https://wa.me/573154720276?text=Hola%20FERIM,%20quiero%20más%20información',
  instagram: 'https://instagram.com/ferim',
  facebook: 'https://facebook.com/ferim',
};

// --- Iconos (SVG inline, sin dependencias) ---
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="white" aria-hidden="true">
    <path d="M17.6 6.3A7.85 7.85 0 0 0 12 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1A7.9 7.9 0 0 0 12 19.9 7.94 7.94 0 0 0 17.6 6.3Zm-5.6 12.2c-1.2 0-2.4-.3-3.4-.9l-.24-.15-2.5.66.67-2.43-.16-.25A6.6 6.6 0 1 1 12 18.5Zm3.6-4.9c-.2-.1-1.18-.58-1.36-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.43.05a5.3 5.3 0 0 1-1.56-.96 5.86 5.86 0 0 1-1.08-1.35c-.11-.2-.01-.3.09-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35-.05-.1-.44-1.07-.6-1.46-.16-.38-.32-.33-.44-.34h-.38a.73.73 0 0 0-.53.25 2.23 2.23 0 0 0-.69 1.65c0 .97.71 1.91.81 2.04.1.13 1.39 2.12 3.37 2.97.47.2.84.33 1.13.42.47.15.9.13 1.24.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.08-.18-.13-.38-.23Z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="white" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="white" aria-hidden="true">
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.29-.04-1.28-.13-2.43-.13-2.4 0-4.07 1.47-4.07 4.17v2.33H7.8V13h2.7v8h3Z" />
  </svg>
);

const bubbleBase = {
  width: '52px',
  height: '52px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'transform 0.15s ease',
};

function Bubble({ href, label, bg, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      style={{ ...bubbleBase, background: bg }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </a>
  );
}

// --- NILA: respuestas simples por palabras clave (sin backend de IA por ahora) ---
function nilaReply(text) {
  const t = text.toLowerCase();
  if (/(hola|buenas|buenos dias|buenas tardes|hey)/.test(t))
    return '¡Hola! 😊 ¿En qué puedo ayudarte hoy? Puedo orientarte sobre propiedades, reservas o mantenimiento.';
  if (/(propiedad|apartamento|casa|arriendo|alquil)/.test(t))
    return 'Puedes explorar todas las propiedades en la sección "Propiedades disponibles" o en el Mapa 🗺️. ¿Buscas algún tipo o zona en particular?';
  if (/(reserva|reservar|agendar)/.test(t))
    return 'Para reservar, entra al detalle de una propiedad y pulsa "Reservar". Necesitas una cuenta de inquilino. ¿Quieres que te explique el paso a paso?';
  if (/(mantenimiento|daño|falla|reparar|arreglo)/.test(t))
    return 'Si tienes un problema en tu propiedad, usa "Reportar mantenimiento". El propietario gestionará tu solicitud y asignará un técnico. 🛠️';
  if (/(precio|costo|cuanto|valor)/.test(t))
    return 'Cada propiedad muestra su precio en COP en la tarjeta y en el detalle. ¿Te ayudo a encontrar opciones por presupuesto?';
  if (/(gracias|graciass|muchas gracias)/.test(t))
    return '¡Con gusto! 🙌 Si necesitas algo más, aquí estaré.';
  return 'Gracias por tu mensaje. 🙌 Un asesor de FERIM puede ayudarte con más detalle; mientras tanto, ¿quieres info sobre propiedades, reservas o mantenimiento?';
}

const WELCOME = '¡Hola! Soy NILA 🤖, la asistente virtual de FERIM. Estoy aquí para ayudarte a encontrar tu próximo hogar, hacer reservas o reportar mantenimiento. ¿En qué te ayudo?';

export default function FloatingWidgets() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'nila', text: WELCOME }]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, thinking]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || thinking) return;

    setMessages((prev) => [...prev, { from: 'user', text }]);
    setInput('');
    setThinking(true);

    let reply;
    try {
      // 1) Consulta el banco de preguntas de FERIM (el "agente" propio).
      const res = await api.post('/chats/ask', { query: text });
      // 2) Si la FAQ no tiene match, usa el fallback de respuestas inteligentes.
      reply = res.data?.matched ? res.data.answer : nilaReply(text);
    } catch (err) {
      reply = nilaReply(text); // si el backend falla, no dejar a NILA muda
    } finally {
      setThinking(false);
    }
    setMessages((prev) => [...prev, { from: 'nila', text: reply }]);
  };

  return (
    <>
      {/* Burbujas de redes sociales: esquina inferior derecha (stack vertical) */}
      <div
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 1000,
        }}
      >
        <Bubble href={SOCIAL.facebook} label="Facebook" bg="#1877F2"><FacebookIcon /></Bubble>
        <Bubble
          href={SOCIAL.instagram}
          label="Instagram"
          bg="radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)"
        >
          <InstagramIcon />
        </Bubble>
        <Bubble href={SOCIAL.whatsapp} label="WhatsApp" bg="#25D366"><WhatsAppIcon /></Bubble>
      </div>

      {/* NILA: chat flotante, esquina inferior izquierda */}
      <div style={{ position: 'fixed', left: '20px', bottom: '20px', zIndex: 1000 }}>
        {open && (
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              left: 0,
              width: '320px',
              maxWidth: '85vw',
              height: '440px',
              backgroundColor: 'white',
              borderRadius: '14px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#e67e22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 'bold', lineHeight: 1.1 }}>NILA</div>
                  <div style={{ fontSize: '11px', opacity: 0.85 }}>Asistente virtual de FERIM</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Cerrar chat" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            {/* Mensajes */}
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', backgroundColor: '#f5f7fa' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      fontSize: '13.5px',
                      lineHeight: 1.4,
                      backgroundColor: m.from === 'user' ? '#3498db' : 'white',
                      color: m.from === 'user' ? 'white' : '#2c3e50',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      borderBottomRightRadius: m.from === 'user' ? '4px' : '12px',
                      borderBottomLeftRadius: m.from === 'nila' ? '4px' : '12px',
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {thinking && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ padding: '8px 12px', borderRadius: '12px', fontSize: '13px', backgroundColor: 'white', color: '#888', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', fontStyle: 'italic' }}>
                    NILA está escribiendo…
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form onSubmit={send} style={{ display: 'flex', borderTop: '1px solid #eee', padding: '8px' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={thinking}
                style={{ flex: 1, border: 'none', outline: 'none', padding: '8px', fontSize: '14px' }}
              />
              <button type="submit" style={{ background: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold' }}>➤</button>
            </form>
          </div>
        )}

        {/* Botón lanzador de NILA */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir chat con NILA"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          <span style={{ fontSize: '20px' }}>{open ? '×' : '🤖'}</span>
          {!open && <span>Chatea con NILA</span>}
        </button>
      </div>
    </>
  );
}
