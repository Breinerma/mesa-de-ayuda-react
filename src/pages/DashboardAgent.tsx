import { useAuth } from "../context/AuthContext";

export default function DashboardAgent() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Panel del Agente {user?.name}</h1>
      <button onClick={logout}>Cerrar sesión</button>
      <p>Aquí verás todos los tickets del sistema.</p>
    </div>
  );
}
