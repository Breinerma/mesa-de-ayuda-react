// src/pages/DashboardAgent.tsx
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";
import { useState, useEffect } from "react";
import TicketChat from "../components/TicketChat";
import "./styles/user.css";

type AgentView = "assigned" | "open";

export default function DashboardAgent() {
  const { user, logout } = useAuth();
  const { tickets, fetchMyTickets, assignTicketToAgent, updateStatus } =
    useTickets();

  // Menú móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<AgentView>("assigned");

  useEffect(() => {
    fetchMyTickets();
  }, []);

  // Tickets asignados al agente
  const filteredAssigned = tickets
    .filter((t) => t.agente_id === user?.id)
    .filter((t) =>
      (t.title + t.description).toLowerCase().includes(search.toLowerCase())
    );
  // Tickets abiertos y devueltos, sin agente asignado
  const filteredOpen = tickets
    .filter((t) => (t.sw_status === 1 || t.sw_status === 4) && !t.agente_id)
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

  const handleAssignToMe = async (ticketId: number) => {
    try {
      await assignTicketToAgent(ticketId, user!.id);
      await fetchMyTickets();
      alert("Ticket asignado exitosamente");
    } catch (error) {
      alert("Error al asignar ticket");
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
    <div className="dashboard-bg">
      {/* Hamburguesa móvil y overlay */}
      <button
        className="menu-hamburger"
        style={{ display: sidebarOpen ? "none" : undefined }}
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menú lateral"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`sidebar user-sidebar${
          sidebarOpen ? " sidebar-mobile-show" : ""
        }`}
      >
        <div className="brand">Mesa de Ayuda</div>
        <ul>
          <li>
            <a
              href="#"
              className={currentView === "assigned" ? "active" : ""}
              onClick={() => {
                setCurrentView("assigned");
                setSidebarOpen(false);
              }}
            >
              Mis Tickets Asignados
            </a>
          </li>
          <li>
            <a
              href="#"
              className={currentView === "open" ? "active" : ""}
              onClick={() => {
                setCurrentView("open");
                setSidebarOpen(false);
              }}
            >
              Tickets Abiertos / Devueltos
            </a>
          </li>
        </ul>
      </div>
      <main className="user-main">
        <div className="user-panel">
          <div className="user-header-card">
            <span className="user-panel-title">
              Agente Soporte - <b>{user?.name}</b>
            </span>
            <button className="logout-btn" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
          <div className="user-controls">
            <input
              className="user-search"
              placeholder="Buscar tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {currentView === "assigned" && (
            <div className="card">
              <h2 style={{ color: "#151d26", marginBottom: 12 }}>
                Tickets Asignados ({filteredAssigned.length})
              </h2>
              <table className="styled-table">
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
                  {filteredAssigned.map((t) => (
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
          )}

          {currentView === "open" && (
            <div className="card">
              <h2 style={{ color: "#151d26", marginBottom: 12 }}>
                Tickets Abiertos / Devueltos ({filteredOpen.length})
              </h2>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Categoria</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpen.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>
                        <strong>{t.title}</strong>
                      </td>
                      <td>{t.tb_category.description}</td>
                      <td>{t.tb_priority.description}</td>
                      <td>{getStatusText(t.sw_status)}</td>
                      <td>
                        <button
                          className="table-btn btn-asignar-amarillo"
                          onClick={() => handleAssignToMe(t.id)}
                        >
                          Asignar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedTicket && (
            <TicketChat
              ticket={
                [...filteredAssigned, ...filteredOpen].find(
                  (t) => t.id === selectedTicket
                )!
              }
              onClose={() => setSelectedTicket(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
