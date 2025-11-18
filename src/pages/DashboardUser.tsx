// src/pages/DashboardUser.tsx
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";
import { useUsers } from "../hooks/useUsers";
import {
  createTicket,
  createTicketWithImages,
  getTicketMessages,
  sendTicketMessage,
} from "../services/apiClient";
import { useCategories } from "../hooks/useCategories";
import { useState, useEffect } from "react";
import "./styles/user.css";

export default function DashboardUser() {
  const { user, logout } = useAuth();
  const { tickets, loading, fetchMyTickets, devolverTicket } = useTickets();
  const { updateProfile } = useUsers();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [search, setSearch] = useState("");
  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    category_id: 1,
    priority_id: 2,
  });
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    job_title: user?.job_title || "",
  });

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const filtered = tickets.filter((t) =>
    (t.title + t.description).toLowerCase().includes(search.toLowerCase())
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statusColorClass = (sw_status: number) => {
    switch (sw_status) {
      case 1:
        return "badge badge-abierto";
      case 2:
        return "badge badge-progreso";
      case 3:
        return "badge badge-cerrado";
      case 4:
        return "badge badge-devuelto";
      case 5:
        return "badge badge-resuelto";
      case 6:
        return "badge badge-asignado";
      case 7:
        return "badge badge-espera";
      default:
        return "badge badge-desconocido";
    }
  };
  const statusText = (sw_status: number) => {
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
        return "En espera";
      default:
        return "Desconocido";
    }
  };

  const [chatOpen, setChatOpen] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  async function openChatForTicket(ticketId: number) {
    setChatOpen(ticketId);
    setChatLoading(true);
    try {
      const res = await getTicketMessages(ticketId);
      setChatMessages(res.messages || []);
    } catch (err) {
      alert("No se pudo cargar el chat");
      setChatMessages([]);
    }
    setChatLoading(false);
  }
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatOpen || !newMessage.trim()) return;
    try {
      await sendTicketMessage(chatOpen, newMessage);
      setNewMessage(""); // Vuelve a pedir lista mensajes
      const res = await getTicketMessages(chatOpen);
      setChatMessages(res.messages || []);
    } catch (err) {
      alert("No se pudo enviar el mensaje");
    }
  }

  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length > 5) {
      setImageError("No puedes adjuntar más de 5 imágenes.");
      return;
    }
    if (images.find((f) => f.size > 3 * 1024 * 1024)) {
      setImageError("Cada imagen debe pesar máximo 3 MB.");
      return;
    }
    setSubiendo(true);
    try {
      if (images.length > 0) {
        await createTicketWithImages({
          title: ticketForm.title,
          description: ticketForm.description,
          category_id: ticketForm.category_id,
          priority_id: ticketForm.priority_id,
          images: images,
        });
      } else {
        await createTicket(ticketForm); // la versión JSON
      }
      setSubiendo(false);
      setShowCreateModal(false);
      setTicketForm({
        title: "",
        description: "",
        category_id: 1,
        priority_id: 2,
      });
      setImages([]);
      alert(
        "Ticket creado exitosamente. Puede tardar unos minutos en ser procesado."
      );
    } catch (err) {
      setSubiendo(false);
      alert(typeof err === "string" ? err : (err as Error).message);
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
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  return (
    <div className="dashboard-bg">
      <>
        {/* ==== MENÚ HAMBURGUESA (solo visible en móvil) ==== */}
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
        {/* ==== OVERLAY para cerrar sidebar tocando fuera ==== */}
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </>

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
              className="active"
              onClick={() => setSidebarOpen(false)}
            >
              Mis Tickets
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => {
                setShowProfileModal(true);
                setSidebarOpen(false);
              }}
            >
              Mi Perfil
            </a>
          </li>
        </ul>
      </div>

      <main className="user-main">
        <div className="user-panel">
          <div className="user-header-card">
            <span className="user-panel-title">
              Bienvenido, <b>{user?.name}</b>
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
            <button
              className="user-create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + Crear Ticket
            </button>
          </div>
          {/* Cards grid */}
          <div className="user-cards">
            {loading && <p>Cargando tickets...</p>}
            {!loading && filtered.length === 0 && (
              <p>No tienes tickets todavía.</p>
            )}
            {filtered.map((t) => (
              <div key={t.id} className="user-ticket-card">
                <div className="user-card-header">
                  <span className="user-card-title">{t.title}</span>
                  <span className={statusColorClass(t.sw_status)}>
                    {statusText(t.sw_status)}
                  </span>
                </div>
                <div className="user-card-desc">{t.description}</div>
                <div className="user-card-meta">
                  <button
                    className="user-return-btn"
                    style={{ marginRight: 8, background: "#3171e1" }}
                    onClick={() => openChatForTicket(t.id)}
                  >
                    Ver chat
                  </button>
                  <span>
                    Categoría: <strong>{t.tb_category.description}</strong>
                  </span>
                  <span>
                    Prioridad: <strong>{t.tb_priority.description}</strong>
                  </span>
                </div>
                {(t.sw_status === 3 || t.sw_status === 5) && (
                  <button
                    className="user-return-btn"
                    onClick={() => {
                      const reason = prompt("Razón de devolución: ");
                      if (reason) {
                        devolverTicket(t.id, reason)
                          .then(() => alert("Ticket devuelto exitosamente"))
                          .catch((err) => alert(err.message));
                      }
                    }}
                  >
                    Devolver Ticket
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* =================== Modal Crear Ticket =================== */}
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
                    setTicketForm({
                      ...ticketForm,
                      description: e.target.value,
                    })
                  }
                  required
                  rows={4}
                />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    const files = Array.from(e.target.files);
                    if (files.length > 5) {
                      setImageError("Solo puedes adjuntar hasta 5 imágenes.");
                      setImages([]);
                      return;
                    }
                    const tooBig = files.find((f) => f.size > 3 * 1024 * 1024);
                    if (tooBig) {
                      setImageError("Cada imagen debe pesar máximo 3 MB.");
                      setImages([]);
                    } else {
                      setImages(files);
                      setImageError(null);
                    }
                  }}
                />
                {imageError && (
                  <div
                    style={{
                      color: "red",
                      fontSize: ".95em",
                      marginBottom: "7px",
                    }}
                  >
                    {imageError}
                  </div>
                )}
                {images.length > 0 && (
                  <ul
                    style={{ fontSize: ".95em", paddingLeft: 15, marginTop: 4 }}
                  >
                    {images.map((file) => (
                      <li key={file.name}>
                        <b>{file.name}</b> –{" "}
                        {(file.size / 1024 / 1024).toFixed(1)} Mb
                      </li>
                    ))}
                  </ul>
                )}

                <select
                  value={ticketForm.category_id}
                  onChange={(e) =>
                    setTicketForm({
                      ...ticketForm,
                      category_id: Number(e.target.value),
                    })
                  }
                  required
                >
                  {categoriesLoading && (
                    <option value="">Cargando categorías...</option>
                  )}
                  {!categoriesLoading && (
                    <option value="">Seleccione una categoría:</option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.description}
                    </option>
                  ))}
                </select>
                {categoriesError && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.93em",
                      marginTop: "7px",
                    }}
                  >
                    {categoriesError}
                  </div>
                )}

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
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "20px" }}
                >
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
        {/* ==================== Modal Chat ==================== */}
        {chatOpen && (
          <div className="modal-overlay" onClick={() => setChatOpen(null)}>
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 600, minHeight: 360 }}
            >
              <h2>Chat del Ticket #{chatOpen}</h2>
              {chatLoading ? (
                <p>Cargando mensajes...</p>
              ) : (
                <div
                  style={{
                    maxHeight: 250,
                    overflowY: "auto",
                    marginBottom: 12,
                  }}
                >
                  {chatMessages.length === 0 && <em>No hay mensajes aún.</em>}
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        background: "#f4f8fd",
                        margin: "7px 0",
                        padding: "6px 10px",
                        borderRadius: 8,
                        textAlign: msg.user_id === user?.id ? "right" : "left",
                      }}
                    >
                      <span style={{ fontSize: ".98em" }}>{msg.content}</span>
                      <br />
                      <small style={{ color: "#598", fontStyle: "italic" }}>
                        {new Date(msg.sent_at).toLocaleString()}
                        {msg.user_id === user?.id && " (tú)"}
                      </small>
                    </div>
                  ))}
                </div>
              )}
              <form
                onSubmit={handleSendMessage}
                style={{ display: "flex", gap: 8 }}
              >
                <input
                  type="text"
                  placeholder="Escribe tu mensaje…"
                  className="user-search"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ flex: 1 }}
                  disabled={!chatOpen}
                />
                <button
                  className="user-create-btn"
                  disabled={!newMessage.trim()}
                >
                  Enviar
                </button>
              </form>
              <button
                className="cancel-button"
                style={{ marginTop: 12 }}
                onClick={() => setChatOpen(null)}
              >
                Cerrar chat
              </button>
            </div>
          </div>
        )}
        {/* =================== Modal Perfil =================== */}
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
                  className="text-color"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Cargo"
                  className="text-color"
                  value={profileForm.job_title}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      job_title: e.target.value,
                    })
                  }
                />

                <div
                  style={{ display: "flex", gap: "10px", marginTop: "20px" }}
                >
                  {subiendo && (
                    <div
                      style={{
                        color: "#1a3578",
                        background: "#f5faff",
                        borderRadius: 7,
                        padding: "10px 16px",
                        margin: "13px 0",
                      }}
                    >
                      Enviando ticket y archivos... Esto puede tardar unos
                      minutos. Por favor NO cierres la ventana.
                    </div>
                  )}
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
      </main>
    </div>
  );
}
