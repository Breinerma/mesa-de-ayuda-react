// src/pages/DashboardAdmin.tsx
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";
import { useUsers } from "../hooks/useUsers";
import { useCategories } from "../hooks/useCategories";
import { useState, useEffect } from "react";
import "./styles/user.css";
import ChatModal from "../components/ChatModal";
import {
  createCategory,
  updateTicketPriority,
  updateTicketCategory,
} from "../services/apiClient";
import { Ticket } from "../types";

type ViewType = "tickets" | "users";
interface AddCategoryFormProps {
  onCategoryCreated?: (category: { id: number; description: string }) => void;
}

function AddCategoryForm({ onCategoryCreated }: AddCategoryFormProps) {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await createCategory(categoryName);
      if (result.success) {
        alert("Categoría creada exitosamente");
        setCategoryName("");
        if (onCategoryCreated) {
          onCategoryCreated(result.category);
        }
      }
    } catch (err) {
      setError("No se pudo crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <input
        type="text"
        placeholder="Nueva categoría"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        required
        style={{ color: "#151d26", marginRight: "12px" }}
      />
      <button
        style={{ color: "#151d26" }}
        className="table-btn"
        type="submit"
        disabled={loading || !categoryName}
      >
        Crear Categoría
      </button>
      {error && <span style={{ color: "red", marginLeft: 12 }}>{error}</span>}
    </form>
  );
}

export default function DashboardAdmin() {
  const { user, logout } = useAuth();
  const { tickets, fetchAllTickets, assignTicketToAgent, changeTicketStatus } =
    useTickets();
  const {
    users,
    agents,
    fetchAllUsers,
    fetchAgents,
    changeUserRole,
    toggleUserStatus,
  } = useUsers();
  const { categories } = useCategories();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("tickets");
  const [filterStatus, setFilterStatus] = useState<number | "">("");
  const [filterPriority, setFilterPriority] = useState<number | "">("");
  const [search, setSearch] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    fetchAllTickets();
    fetchAllUsers();
    fetchAgents();
  }, []);

  const handleAssignTicket = async () => {
    if (selectedTicket && selectedAgent) {
      try {
        await assignTicketToAgent(selectedTicket, selectedAgent);
        await changeTicketStatus(selectedTicket, 2, "Asignado a agente");
        await fetchAllTickets();
        setShowAssignModal(false);
        setSelectedTicket(null);
        setSelectedAgent("");
        alert("Ticket asignado y actualizado");
      } catch (error) {
        alert("Error al asignar o actualizar estado");
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

  const handleChangePriority = async (
    ticketId: number,
    newPriority: number
  ) => {
    try {
      await updateTicketPriority(ticketId, newPriority);
      await fetchAllTickets();
    } catch (error) {
      alert("Error al cambiar la prioridad");
    }
  };

  const handleChangeCategory = async (
    ticketId: number,
    newCategory: number
  ) => {
    try {
      await updateTicketCategory(ticketId, newCategory);
      await fetchAllTickets();
    } catch (error) {
      alert("Error al cambiar la categoría");
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = (t.title + t.description)
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "" ? true : t.sw_status === filterStatus;

    const matchesPriority =
      filterPriority === "" ? true : t.priority_id === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

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
        return "Asignado";
      case 3:
        return "En Progreso";
      case 4:
        return "Entregado";
      case 5:
        return "Devuelto";
      case 6:
        return "Resuelto";
      case 7:
        return "Cerrado";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="dashboard-bg">
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
              className={currentView === "tickets" ? "active" : ""}
              onClick={() => {
                setCurrentView("tickets");
                setSidebarOpen(false);
              }}
            >
              Tickets
            </a>
          </li>
          <li>
            <a
              href="#"
              className={currentView === "users" ? "active" : ""}
              onClick={() => {
                setCurrentView("users");
                setSidebarOpen(false);
              }}
            >
              Gestión de Usuarios
            </a>
          </li>
        </ul>
      </div>
      <main className="user-main">
        <div className="user-panel">
          <div className="user-header-card">
            <span className="user-panel-title">
              Admin Soporte - <b>{user?.name}</b>
            </span>
            <button className="logout-btn" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
          <div className="user-controls">
            <input
              className="user-search"
              placeholder={`Buscar ${
                currentView === "tickets" ? "tickets" : "usuarios"
              }...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <AddCategoryForm />
            {currentView === "tickets" && (
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
                  <option value={2}>Asignado</option>
                  <option value={3}>En Progreso</option>
                  <option value={4}>Entregado</option>
                  <option value={5}>Devuelto</option>
                  <option value={6}>Resuelto</option>
                  <option value={7}>Cerrado</option>
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
          {currentView === "tickets" && (
            <div className="card">
              <h2 style={{ color: "#151d26", marginBottom: 12 }}>
                Todos los Tickets ({filteredTickets.length})
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
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            background: "#e8f4f8",
                            borderRadius: "4px",
                            fontSize: "0.9em",
                            marginBottom: "4px",
                          }}
                        >
                          {t.tb_category.description}
                        </span>
                        <br />
                        <select
                          value={t.category_id}
                          onChange={(e) =>
                            handleChangeCategory(t.id, Number(e.target.value))
                          }
                          style={{ marginTop: "4px", width: "100%" }}
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.description}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span
                          className={`priority-badge priority-${t.tb_priority?.description?.toLowerCase()}`}
                        >
                          {t.tb_priority.description}
                        </span>
                        <br />
                        <select
                          value={t.priority_id}
                          onChange={(e) =>
                            handleChangePriority(t.id, Number(e.target.value))
                          }
                          style={{ marginTop: "4px" }}
                        >
                          <option value={1}>Baja</option>
                          <option value={2}>Media</option>
                          <option value={3}>Alta</option>
                        </select>
                      </td>
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
                            changeTicketStatus(
                              t.id,
                              Number(e.target.value),
                              "Cambio manual de estado"
                            )
                          }
                          style={{ marginTop: "4px" }}
                        >
                          <option value={1}>Abierto</option>
                          <option value={2}>Asignado</option>
                          <option value={3}>En Progreso</option>
                          <option value={4}>Entregado</option>
                          <option value={5}>Devuelto</option>
                          <option value={6}>Resuelto</option>
                          <option value={7}>Cerrado</option>
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
                      <td>
                        <button
                          className="table-btn btn-asignar-verde"
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
          {currentView === "users" && (
            <div className="card">
              <h2 style={{ color: "#151d26", marginBottom: 12 }}>
                Gestión de Usuarios ({filteredUsers.length})
              </h2>
              <table className="styled-table">
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
                        {u.sw_active === 1 ? (
                          <span className="badge-estado-azul">Activo</span>
                        ) : (
                          <span className="badge-estado-gris">Inactivo</span>
                        )}
                      </td>
                      <td>
                        <button
                          className={
                            u.sw_active === 1
                              ? "table-btn btn-desasignar-rojo"
                              : "table-btn btn-asignar-verde"
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
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "20px",
                  }}
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

          {showChatModal && selectedTicket && (
            <ChatModal
              ticketId={selectedTicket}
              onClose={() => setShowChatModal(false)}
              currentUser={user}
            />
          )}
        </div>
      </main>
    </div>
  );
}
