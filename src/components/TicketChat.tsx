// src/components/TicketChat.tsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../hooks/useMessages";
import { Ticket } from "../types";
import "./TicketChat.css";

interface TicketChatProps {
  ticket: Ticket;
  onClose: () => void;
}

export default function TicketChat({ ticket, onClose }: TicketChatProps) {
  const { user } = useAuth();
  const { messages, loading, fetchMessages, sendMessage } = useMessages();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages(ticket.id);
  }, [ticket.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(ticket.id, newMessage);
      setNewMessage("");
    } catch (error) {
      alert("Error al enviar mensaje");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (sw_status: number) => {
    switch (sw_status) {
      case 1:
        return "Abierto";
      case 2:
        return "En Progreso";
      case 3:
        return "Cerrado";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header del Chat */}
        <div className="chat-header">
          <div>
            <h2>{ticket.title}</h2>
            <p className="chat-subtitle">
              Ticket #{ticket.id} •{" "}
              <span
                className={`status ${getStatusText(
                  ticket.sw_status
                ).toLowerCase()}`}
              >
                {getStatusText(ticket.sw_status)}
              </span>
            </p>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Descripción del Ticket */}
        <div className="ticket-description">
          <strong>Descripción:</strong>
          <p>{ticket.description}</p>
          <div className="ticket-meta">
            <span>
              <strong>Categoría:</strong> {ticket.tb_category.description}
            </span>
            <span>
              <strong>Prioridad:</strong> {ticket.tb_priority.description}
            </span>
            <span>
              <strong>Creado por:</strong> {ticket.tb_user.name}
            </span>
          </div>
        </div>

        {/* Área de Mensajes */}
        <div className="chat-messages">
          {loading && messages.length === 0 && (
            <p className="loading-messages">Cargando mensajes...</p>
          )}

          {!loading && messages.length === 0 && (
            <p className="no-messages">
              No hay mensajes aún. ¡Sé el primero en escribir!
            </p>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.user_id === user?.id ? "message-own" : "message-other"
              }`}
            >
              <div className="message-header">
                <strong>{msg.user?.name || "Usuario"}</strong>
                <span className="message-time">{formatDate(msg.sent_at)}</span>
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input para Nuevo Mensaje */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="chat-send-button"
            disabled={loading || !newMessage.trim()}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
