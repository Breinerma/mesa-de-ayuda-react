// src/components/ChatModal.tsx
import { useMessages } from "../hooks/useMessages";
import { useEffect, useState } from "react";

interface ChatModalProps {
  ticketId: number;
  onClose: () => void;
  currentUser: any;
}

export function ChatModal({ ticketId, onClose, currentUser }: ChatModalProps) {
  const { messages, fetchMessages, sendMessage, loading } = useMessages();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchMessages(ticketId);
  }, [ticketId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await sendMessage(ticketId, newMessage);
      setNewMessage("");
    } catch (err) {
      alert("Error al enviar mensaje");
    }
  };

  const getRoleName = (rolId: number | undefined) => {
    if (!rolId) return "Usuario";
    switch (rolId) {
      case 1:
        return "Usuario";
      case 2:
        return "Agente";
      case 3:
        return "Admin";
      default:
        return "Usuario";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 600, minHeight: 360 }}
      >
        <h2>Chat del Ticket #{ticketId}</h2>
        <div style={{ maxHeight: 250, overflowY: "auto", marginBottom: 12 }}>
          {loading && <div>Cargando...</div>}
          {messages.length === 0 && !loading && <em>No hay mensajes.</em>}
          {messages.map((msg: any) => {
            const isSelf = msg.user_id === currentUser?.id;

            // CORRECCIÓN: usar tb_user en lugar de user
            const nombreUsuario =
              msg.tb_user?.name || msg.user?.name || "Usuario";

            // Si es el usuario actual, usa currentUser.rol_id
            // Si no, busca en tb_user.rol_id o user.rol_id
            const rolId = isSelf
              ? currentUser?.rol_id
              : msg.tb_user?.rol_id || msg.user?.rol_id || 1;

            const rol = getRoleName(rolId);

            return (
              <div
                key={msg.id}
                style={{
                  background: isSelf ? "#e9fce9" : "#f4f8fd",
                  textAlign: isSelf ? "right" : "left",
                  padding: "8px 12px",
                  borderRadius: 9,
                  margin: "12px 0 4px 0",
                  border: isSelf
                    ? "1.2px solid #12c484"
                    : "1.2px solid #bbd2f0",
                  maxWidth: "90%",
                  marginLeft: isSelf ? "auto" : 0,
                  marginRight: isSelf ? 0 : "auto",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: isSelf ? "#129655" : "#1a3578",
                    fontSize: "1.06em",
                  }}
                >
                  {isSelf ? "Tú" : nombreUsuario}
                  <span
                    style={{
                      fontWeight: 400,
                      color: "#8ab",
                      fontSize: ".98em",
                      marginLeft: 7,
                    }}
                  >
                    ({rol})
                  </span>
                </div>
                <div style={{ margin: "6px 0 2px 0", fontSize: "1.14em" }}>
                  {msg.content}
                </div>
                <div
                  style={{
                    fontSize: ".96em",
                    color: "#587",
                    marginTop: 2,
                    fontStyle: "italic",
                  }}
                >
                  {new Date(msg.sent_at).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Escribe un mensaje…"
            className="user-search"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1 }}
            disabled={!ticketId}
          />
          <button className="user-create-btn" disabled={!newMessage.trim()}>
            Enviar
          </button>
        </form>
        <button
          className="cancel-button"
          style={{ marginTop: 12 }}
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ChatModal;
