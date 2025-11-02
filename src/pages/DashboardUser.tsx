import { useAuth } from "../context/AuthContext";
import "./styles/user.css";

export default function DashboardUser() {
  const { user, tickets, logout } = useAuth();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Mesa de Ayuda</h2>
        <ul>
          <li><a href="#" className="active">Inicio</a></li>
          <li><a href="#">Mis Tickets</a></li>
          <li><a href="#">Nuevo Ticket</a></li>
          <li><a href="#">Configuración</a></li>
        </ul>
      </aside>

      {/* Contenido principal */}
      <main className="main">
        <div className="main-content-wrapper">
          <header className="dashboard-header">
            <h1>Bienvenido {user?.name}</h1>
            <button className="logout-button" onClick={logout}>
              Cerrar sesión
            </button>
          </header>

          <div className="card">
            <h2>Mis Tickets</h2>
            <div id="tickets-list">
              {tickets && tickets.length > 0 ? (
                tickets.map((t, i) => (
                  <div key={i} className="ticket">
                    <div className="ticket-info">
                      <strong>{t.title}</strong>
                      <p>{t.description}</p>
                    </div>
                    <div className="status-container">
                      <span
                        className={`status ${t.status
                          .toLowerCase()
                          .replace(/\s/g, "")}`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tienes tickets registrados.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
