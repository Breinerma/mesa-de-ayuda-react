import { useAuth } from "../context/AuthContext";
import "./styles/admin.css";
import { useState } from "react";

export default function DashboardAdmin() {
  const { user, tickets, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");

  const filtered = tickets?.filter((t) =>
    (t.title + t.description + t.status)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Mesa de Ayuda</h2>
        <ul>
          <li>
            <a href="#" className="active">
              Inicio
            </a>
          </li>
          <li>
            <a href="#">Gestión de Usuarios</a>
          </li>
          <li>
            <a href="#">Roles</a>
          </li>
          <li>
            <a href="#">Configuración</a>
          </li>
        </ul>
      </aside>

      <main className="main">
        <div className="main-content-wrapper">
          <header className="dashboard-header">
            <h1>Panel del Administrador {user?.name}</h1>
            <button className="logout-button" onClick={logout}>
              Cerrar sesión
            </button>
          </header>

          {/* BUSCADOR + SELECTOR DE VISTA */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            <input
              className="search"
              placeholder="Buscar tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Admin SÍ ve el selector */}
            <button
              className="assign-button"
              onClick={() => setView(view === "cards" ? "table" : "cards")}
            >
              {view === "cards" ? "Ver tabla" : "Ver tarjetas"}
            </button>
          </div>

          {/* LISTADO */}
          <div className="card">
            <h2>Tickets</h2>

            {/* TARJETAS */}
            {view === "cards" && (
              <div>
                {filtered?.map((t, i) => (
                  <div key={i} className="ticket">
                    <div className="ticket-info">
                      <strong>{t.title}</strong>
                      <p>{t.description}</p>
                    </div>

                    <div className="status-container">
                      <span className={`status ${t.status.toLowerCase()}`}>
                        {t.status}
                      </span>
                    </div>

                    <div className="action-container">
                      <button className="assign-button">Asignar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TABLA */}
            {view === "table" && (
              <table style={{ width: "100%", marginTop: "20px" }}>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered?.map((t, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{t.title}</strong>
                      </td>
                      <td>{t.description}</td>
                      <td>
                        <span className={`status ${t.status.toLowerCase()}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <button className="assign-button">Asignar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
