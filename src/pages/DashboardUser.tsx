import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

export default function DashboardUser() {
  const { user, tickets, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bienvenido {user?.name}</h1>
      </header>
      <button onClick={logout}>Cerrar sesión</button>
      <main className="dashboard-content">
        <div className="card">
          <h2>Mis Tickets</h2>
          {tickets.map((t, i) => (
            <p key={i}>
              {t.title} — {t.status}
            </p>
          ))}
        </div>
      </main>
    </div>
  );
}
