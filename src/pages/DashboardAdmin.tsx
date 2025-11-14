// src/pages/DashboardAdmin.tsx
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";
import { useUsers } from "../hooks/useUsers";
import { useState, useEffect } from "react";
import "./styles/admin.css";

type ViewType = "tickets" | "users";

export default function DashboardAdmin() {
  const { user, logout } = useAuth();
  const { tickets, fetchMyTickets, assignTicketToAgent } = useTickets();
  const {
    users,
    agents,
    fetchAllUsers,
    fetchAgents,
    changeUserRole,
    toggleUserStatus,
  } = useUsers();

  const [currentView, setCurrentView] = useState<ViewType>("tickets");
  const [search, setSearch] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState("");

  useEffect(() => {
    fetchMyTickets();
    fetchAllUsers();
    fetchAgents();
  }, []);

  const handleAssignTicket = async () => {
    if (selectedTicket && selectedAgent) {
      try {
        await assignTicketToAgent(selectedTicket, selectedAgent);
        setShowAssignModal(false);
        setSelectedTicket(null);
        setSelectedAgent("");
        alert("Ticket asignado exitosamente");
      } catch (error) {
        alert("Error al asignar ticket");
      }
    }
  };

  const handleChangeRole = async (userId: string, newRolId: number) => {
    if (confirm("¿Estás seguro de cambiar el rol de este usuario?")) {
      try {
        await changeUserRole(userId, newRolId);
        alert("Rol actualizado exitosamente");
      } catch (error) {
        alert("Error al actualizar rol");
      }
    }
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: number
  ) => {
    const action = currentStatus === 1 ? "desactivar" : "activar";
    if (confirm(`¿Estás seguro de ${action} este usuario?`)) {
      try {
        await toggleUserStatus(userId, currentStatus === 0);
        alert(
          `Usuario ${
            action === "desactivar" ? "desactivado" : "activado"
          } exitosamente`
        );
      } catch (error) {
        alert(`Error al ${action} usuario`);
      }
    }
  };

  const filteredTickets = tickets.filter((t) =>
    (t.title + t.description).toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    (u.name + u.email + u.job_title)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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

  const getRoleName = (rol_id: number) => {
    switch (rol_id) {
      case 1:
        return "Usuario";
      case 2:
        return "Agente";
      case 3:
        return "Admin";
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
            <a
              href="#"
              className={currentView === "tickets" ? "active" : ""}
              onClick={() => setCurrentView("tickets")}
            >
              Tickets
            </a>
          </li>
          <li>
            <a
              href="#"
              className={currentView === "users" ? "active" : ""}
              onClick={() => setCurrentView("users")}
            >
              Gestión de Usuarios
            </a>
          </li>
        </ul>
      </aside>

      <main className="main">
        <div className="main-content-wrapper">
          <header className="dashboard-header">
            <h1>Panel del Administrador - {user?.name}</h1>
            <button className="logout-button" onClick={logout}>
              Cerrar sesión
            </button>
          </header>

          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            <input
              className="search"
              placeholder={`Buscar ${
                currentView === "tickets" ? "tickets" : "usuarios"
              }...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* VISTA DE TICKETS */}
          {currentView === "tickets" && (
            <div className="card">
              <h2>Todos los Tickets ({filteredTickets.length})</h2>
              <table style={{ width: "100%", marginTop: "20px" }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Usuario</th>
                    <th>Categoría</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Agente</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>
                        <strong>{t.title}</strong>
                      </td>
                      <td>{t.tb_user.name}</td>
                      <td>{t.tb_category.description}</td>
                      <td>{t.tb_priority.description}</td>
                      <td>
                        <span
                          className={`status ${getStatusText(
                            t.sw_status
                          ).toLowerCase()}`}
                        >
                          {getStatusText(t.sw_status)}
                        </span>
                      </td>
                      <td>{t.agente_id ? "Asignado" : "Sin asignar"}</td>
                      <td>
                        <button
                          className="assign-button"
                          onClick={() => {
                            setSelectedTicket(t.id);
                            setShowAssignModal(true);
                          }}
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

          {/* VISTA DE USUARIOS */}
          {currentView === "users" && (
            <div className="card">
              <h2>Gestión de Usuarios ({filteredUsers.length})</h2>
              <table style={{ width: "100%", marginTop: "20px" }}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Cargo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.job_title || "Sin cargo"}</td>
                      <td>
                        <select
                          value={u.rol_id}
                          onChange={(e) =>
                            handleChangeRole(u.id, Number(e.target.value))
                          }
                          disabled={u.id === user?.id}
                        >
                          <option value={1}>Usuario</option>
                          <option value={2}>Agente</option>
                          <option value={3}>Admin</option>
                        </select>
                      </td>
                      <td>
                        <span
                          className={`status ${
                            u.sw_active === 1 ? "open" : "closed"
                          }`}
                        >
                          {u.sw_active === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={
                            u.sw_active === 1
                              ? "deactivate-button"
                              : "activate-button"
                          }
                          onClick={() =>
                            handleToggleUserStatus(u.id, u.sw_active)
                          }
                          disabled={u.id === user?.id}
                        >
                          {u.sw_active === 1 ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Asignar Ticket */}
      {showAssignModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAssignModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Asignar Ticket a Agente</h2>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
            >
              <option value="">Seleccionar agente...</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.email}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="assign-button"
                onClick={handleAssignTicket}
                disabled={!selectedAgent}
              >
                Asignar
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowAssignModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
