// src/pages/DashboardAgent.tsx
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";
import { useState, useEffect } from "react";
import ChatModal from "../components/ChatModal";
import "./styles/user.css";
import { Ticket } from "../types";

type AgentView = "assigned" | "open";
type ViewType = "tickets" | "users";

function isTicketAssignedToMe(ticket: Ticket, myUserId: string): boolean {
  if (!ticket.history) return false;
  const lastAssign = [...ticket.history]
    .reverse()
    .find((h) => h.assigned_user_id);
  if (lastAssign && lastAssign.assigned_user_id) {
    return lastAssign.assigned_user_id === myUserId;
  }
  return false;
}

export default function DashboardAgent() {
  const { user, logout } = useAuth();
  const { tickets, fetchAllTickets, assignTicketToAgent, changeTicketStatus } =
    useTickets();

  // Menú móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentViewT] = useState<ViewType>("tickets");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<number | "">("");
  const [filterPriority, setFilterPriority] = useState<number | "">("");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<AgentView>("assigned");
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    fetchAllTickets();
  }, []);

  if (!user?.id) return null;

  // Filtrar tickets asignados a mí
  const myAssignedTickets = tickets.filter((t) =>
    isTicketAssignedToMe(t, user.id)
  );

  // Filtrar tickets abiertos o devueltos (sin asignar)
  const openTickets = tickets.filter(
    (t) =>
      !t.history?.some((h) => h.assigned_user_id) &&
      (t.sw_status === 1 || t.sw_status === 4)
  );

  // Aplicar filtros de búsqueda y estados según la vista actual
  const getFilteredTickets = () => {
    const sourceTickets =
      currentView === "assigned" ? myAssignedTickets : openTickets;

    return sourceTickets.filter((t) => {
      const matchesSearch = (t.title + t.description)
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === "" ? true : t.sw_status === filterStatus;

      const matchesPriority =
        filterPriority === "" ? true : t.priority_id === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  const filteredTickets = getFilteredTickets();

  const handleAssignToMe = async (ticketId: number) => {
    try {
      await assignTicketToAgent(ticketId, user.id);
      await changeTicketStatus(ticketId, 6, "Agente se asignó ticket");
      await fetchAllTickets();
      alert("Ticket asignado y actualizado a 'Asignado'");
    } catch (error) {
      alert("Error al asignar o actualizar estado");
    }
  };

  const handleChangeStatus = async (
    ticketId: number,
    newStatus: number,
    comment: string
  ) => {
    try {
      await changeTicketStatus(ticketId, newStatus, comment);
      await fetchAllTickets();
    } catch (error) {
      alert("Error al cambiar el estado");
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
              Mis Tickets Asignados ({myAssignedTickets.length})
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
              Tickets Abiertos / Devueltos ({openTickets.length})
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
            {currentViewT === "tickets" && (
              <>
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  style={{ color: "#151d26" }}
                >
                  <option value="">Todos los estados</option>
                  <option value={1}>Abierto</option>
                  <option value={4}>Devuelto</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) =>
                    setFilterPriority(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  style={{ color: "#151d26" }}
                >
                  <option value="">Todas las prioridades</option>
                  <option value={1}>Baja</option>
                  <option value={2}>Media</option>
                  <option value={3}>Alta</option>
                </select>
              </>
            )}
          </div>

          {/* VISTA: MIS TICKETS ASIGNADOS */}
          {currentView === "assigned" && (
            <div className="card">
              <h2 style={{ color: "#151d26", marginBottom: 12 }}>
                Mis Tickets Asignados ({filteredTickets.length})
              </h2>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Usuario</th>
                    <th>Categoría</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Chat</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No tienes tickets asignados
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((t) => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>
                          <strong>{t.title}</strong>
                        </td>
                        <td>{t.tb_user?.name || "Sin usuario"}</td>
                        <td>{t.tb_category?.description || "Sin categoría"}</td>
                        <td>{t.tb_priority?.description || "Sin prioridad"}</td>
                        <td>
                          <span
                            className={`status ${getStatusText(
                              t.sw_status
                            ).toLowerCase()}`}
                          >
                            {getStatusText(t.sw_status)}
                          </span>
                          <br />
                          <select
                            value={t.sw_status}
                            onChange={(e) =>
                              handleChangeStatus(
                                t.id,
                                Number(e.target.value),
                                "Cambio de estado por agente"
                              )
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
                            className="chat-button table-btn"
                            onClick={() => {
                              setSelectedTicket(t.id);
                              setShowChatModal(true);
                            }}
                          >
                            Chat
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VISTA: TICKETS ABIERTOS/DEVUELTOS */}
          {currentView === "open" && (
            <div className="card">
              <h2 style={{ color: "#151d26", marginBottom: 12 }}>
                Tickets Abiertos / Devueltos ({filteredTickets.length})
              </h2>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Usuario</th>
                    <th>Categoría</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No hay tickets abiertos o devueltos disponibles
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((t) => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>
                          <strong>{t.title}</strong>
                        </td>
                        <td>{t.tb_user?.name || "Sin usuario"}</td>
                        <td>{t.tb_category?.description || "Sin categoría"}</td>
                        <td>{t.tb_priority?.description || "Sin prioridad"}</td>
                        <td>
                          <span
                            className={`status ${getStatusText(
                              t.sw_status
                            ).toLowerCase()}`}
                          >
                            {getStatusText(t.sw_status)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="table-btn btn-asignar-amarillo"
                            onClick={() => handleAssignToMe(t.id)}
                          >
                            Asignarme
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* MODAL DE CHAT */}
          {showChatModal && selectedTicket && (
            <ChatModal
              ticketId={selectedTicket}
              onClose={() => {
                setShowChatModal(false);
                setSelectedTicket(null);
              }}
              currentUser={user}
            />
          )}
        </div>
      </main>
    </div>
  );
}
