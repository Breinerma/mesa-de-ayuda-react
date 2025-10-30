import { useAuth } from "../context/AuthContext";

export default function DashboardUser() {
  const { user, tickets, logout } = useAuth();

  return (
    <div>
      <h1>Bienvenido {user?.name}</h1>
      <button onClick={logout}>Cerrar sesión</button>
      <h2>Mis Tickets</h2>
      {tickets.map((t, i) => (
        <p key={i}>
          {t.title} — {t.status}
        </p>
      ))}
    </div>
  );
}
