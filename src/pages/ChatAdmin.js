// frontend/src/pages/ChatAdmin.js
// Gestión del banco de preguntas/respuestas de NILA.
import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function ChatAdmin() {
  const [chats, setChats] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/chats');
      setChats(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error al cargar preguntas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/chats/add', { question, answer });
      setQuestion('');
      setAnswer('');
      setMsg('✅ Pregunta agregada.');
      load();
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error al agregar la pregunta.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;
    try {
      await api.delete(`/chats/${id}`);
      setChats((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || 'No se pudo eliminar.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>🤖 Preguntas de NILA</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Administra el banco de preguntas y respuestas que usa la asistente virtual.
      </p>

      {/* Formulario para agregar */}
      <form onSubmit={handleAdd} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0 }}>Agregar pregunta</h2>
        {msg && <p style={{ color: msg.startsWith('✅') ? 'green' : 'red' }}>{msg}</p>}
        <div style={{ marginBottom: '12px' }}>
          <label>Pregunta:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            placeholder="Ej: ¿Cómo reservo una propiedad?"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Respuesta:</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            placeholder="Ej: Abre el detalle de la propiedad y pulsa 'Reservar'."
            style={{ width: '100%', padding: '8px', marginTop: '5px', height: '70px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Guardar
        </button>
      </form>

      {/* Lista existente */}
      <h2>Preguntas guardadas ({chats.length})</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : chats.length === 0 ? (
        <p>Aún no hay preguntas. Agrega la primera arriba.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chats.map((c) => (
            <li key={c._id} style={{ backgroundColor: 'white', padding: '14px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <strong>P:</strong> {c.question}
                  <br />
                  <span style={{ color: '#555' }}><strong>R:</strong> {c.answer}</span>
                </div>
                <button
                  onClick={() => handleDelete(c._id)}
                  style={{ alignSelf: 'flex-start', padding: '6px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
