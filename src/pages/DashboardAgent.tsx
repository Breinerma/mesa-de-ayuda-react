import { useAuth } from "../context/AuthContext";
import "./styles/agent.css";

export default function DashboardAgent() {
  const { user, tickets, logout } = useAuth();

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
            <a href="#">Tickets</a>
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
            <h1>Panel del Agente {user?.name}</h1>
            <button className="logout-button" onClick={logout}>
              Cerrar sesión
            </button>
          </header>

          <div className="card">
            <h2>Tickets Asignados</h2>
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
                    <div className="action-container">
                      <button className="assign-button">Asignar</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay tickets disponibles.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
