// src/pages/DashboardAgent.tsx
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";
import { useState, useEffect } from "react";
import TicketChat from "../components/TicketChat";
import "./styles/agent.css";

export default function DashboardAgent() {
  const { user, logout } = useAuth();
  const { tickets, fetchMyTickets, updateStatus } = useTickets();

  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const filtered = tickets
    .filter((t) => t.agente_id === user?.id)
    .filter((t) =>
      (t.title + t.description).toLowerCase().includes(search.toLowerCase())
    );

  const handleChangeStatus = async (ticketId: number, newStatus: number) => {
    try {
      await updateStatus(ticketId, newStatus);
      alert("Estado actualizado con éxito");
    } catch (error) {
      alert("Error al actualizar estado");
    }
  };

  const getStatusText = (sw_status: number) => {
    switch (sw_status) {
      case 1:
        return "Abierto";
      case 2:
        return "En Progreso";
      case 3:
        return "Cerrado";
      case 4:
        return "Devuelto";
      case 5:
        return "Resuelto";
      case 6:
        return "Asignado";
      case 7:
        return "En Espera";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Mesa de Ayuda</h2>
        <ul>
          <li>
            <a href="#" className="active">
              Mis Tickets Asignados
            </a>
          </li>
        </ul>
      </aside>
      <main className="main">
        <div className="main-content-wrapper">
          <header className="dashboard-header">
            <h1>Panel del Agente - {user?.name}</h1>
            <button className="logout-button" onClick={logout}>
              Cerrar sesión
            </button>
          </header>
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            <input
              className="search"
              placeholder="Buscar tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="card">
            <h2>Tickets Asignados ({filtered.length})</h2>
            <table style={{ width: "100%", marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Chat</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>
                      <strong>{t.title}</strong>
                    </td>
                    <td>{t.tb_category.description}</td>
                    <td>{t.tb_priority.description}</td>
                    <td>
                      <select
                        value={t.sw_status}
                        onChange={(e) =>
                          handleChangeStatus(t.id, Number(e.target.value))
                        }
                      >
                        <option value={1}>Abierto</option>
                        <option value={2}>En Progreso</option>
                        <option value={3}>Cerrado</option>
                        <option value={4}>Devuelto</option>
                        <option value={5}>Resuelto</option>
                        <option value={6}>Asignado</option>
                        <option value={7}>En Espera</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="chat-button"
                        onClick={() => setSelectedTicket(t.id)}
                      >
                        Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Chat modal */}
          {selectedTicket && (
            <TicketChat
              ticket={filtered.find((t) => t.id === selectedTicket)!}
              onClose={() => setSelectedTicket(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
