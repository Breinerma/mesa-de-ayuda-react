// src/pages/DashboardUser.tsx
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";
import { useUsers } from "../hooks/useUsers";
import { useState, useEffect } from "react";
import TicketChat from "../components/TicketChat";
import { Ticket } from "../types";
import "./styles/user.css";

export default function DashboardUser() {
  const { user, logout } = useAuth();
  const { tickets, loading, fetchMyTickets, createNewTicket } = useTickets();
  const { updateProfile } = useUsers();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [search, setSearch] = useState("");

  // Formulario de nuevo ticket
  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    category_id: 1,
    priority_id: 2,
  });

  // Formulario de perfil
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    job_title: user?.job_title || "",
  });

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNewTicket(ticketForm);
      setShowCreateModal(false);
      setTicketForm({
        title: "",
        description: "",
        category_id: 1,
        priority_id: 2,
      });
      alert("Ticket creado exitosamente");
    } catch (error) {
      alert("Error al crear ticket");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      setShowProfileModal(false);
      alert("Perfil actualizado exitosamente");
    } catch (error) {
      alert("Error al actualizar perfil");
    }
  };

  const filtered = tickets.filter((t) =>
    (t.title + t.description).toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Mesa de Ayuda</h2>
        <ul>
          <li>
            <a href="#" className="active">
              Mis Tickets
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setShowProfileModal(true)}>
              Mi Perfil
            </a>
          </li>
        </ul>
      </aside>

      <main className="main">
        <div className="main-content-wrapper">
          <header className="dashboard-header">
            <h1>Bienvenido, {user?.name}</h1>
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
            <button
              className="create-button"
              onClick={() => setShowCreateModal(true)}
            >
              + Crear Ticket
            </button>
          </div>

          <div className="card">
            <h2>Mis Tickets ({filtered.length})</h2>

            {loading && <p>Cargando tickets...</p>}

            {!loading && filtered.length === 0 && (
              <p>No tienes tickets. ¡Crea uno nuevo!</p>
            )}

            {filtered.map((t) => (
              <div key={t.id} className="ticket">
                <div className="ticket-info">
                  <strong>{t.title}</strong>
                  <p>{t.description}</p>
                  <small>
                    Categoría: {t.tb_category.description} | Prioridad:{" "}
                    {t.tb_priority.description}
                  </small>
                </div>

                <div className="status-container">
                  <span
                    className={`status ${getStatusText(
                      t.sw_status
                    ).toLowerCase()}`}
                  >
                    {getStatusText(t.sw_status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal Crear Ticket */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Crear Nuevo Ticket</h2>
            <form onSubmit={handleCreateTicket}>
              <input
                type="text"
                placeholder="Título"
                value={ticketForm.title}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Descripción"
                value={ticketForm.description}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, description: e.target.value })
                }
                required
                rows={4}
              />
              <select
                value={ticketForm.category_id}
                onChange={(e) =>
                  setTicketForm({
                    ...ticketForm,
                    category_id: Number(e.target.value),
                  })
                }
              >
                <option value={1}>Técnico</option>
                <option value={2}>Administrativo</option>
                <option value={3}>Soporte</option>
              </select>
              <select
                value={ticketForm.priority_id}
                onChange={(e) =>
                  setTicketForm({
                    ...ticketForm,
                    priority_id: Number(e.target.value),
                  })
                }
              >
                <option value={1}>Baja</option>
                <option value={2}>Media</option>
                <option value={3}>Alta</option>
              </select>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button type="submit" className="create-button">
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="cancel-button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Perfil */}
      {showProfileModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowProfileModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Perfil</h2>
            <form onSubmit={handleUpdateProfile}>
              <input
                type="text"
                placeholder="Nombre"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Cargo"
                value={profileForm.job_title}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, job_title: e.target.value })
                }
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button type="submit" className="create-button">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="cancel-button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
