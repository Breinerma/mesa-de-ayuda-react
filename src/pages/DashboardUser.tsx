import { useAuth } from "../context/AuthContext";
import "./styles/user.css";
import { useState } from "react";

export default function DashboardUser() {
  const { user, tickets, logout } = useAuth();

  const [search, setSearch] = useState("");

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
            <a href="#">Mis Tickets</a>
          </li>
          <li>
            <a href="#">Nuevo Ticket</a>
          </li>
          <li>
            <a href="#">Configuración</a>
          </li>
        </ul>
      </aside>

      <main className="main">
        <div className="main-content-wrapper">
          <header className="dashboard-header">
            <h1>Bienvenido {user?.name}</h1>
            <button className="logout-button" onClick={logout}>
              Cerrar sesión
            </button>
          </header>

          {/* SOLO BUSCADOR */}
          <div style={{ marginBottom: "20px" }}>
            <input
              className="search"
              placeholder="Buscar mis tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="card">
            <h2>Mis Tickets</h2>

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
              </div>
            ))}

            {filtered?.length === 0 && <p>No tienes tickets registrados.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
