import { useAuth } from "../context/AuthContext";
import "./styles/agent.css";

export default function DashboardAdmin() {
  const { user, logout } = useAuth();

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

          <div className="card">
            <h2>Gestión General</h2>
            <p>
              Desde este panel podrás administrar usuarios, roles y categorías.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
