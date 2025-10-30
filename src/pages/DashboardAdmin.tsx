import { useAuth } from "../context/AuthContext";

export default function DashboardAdmin() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Panel del Administrador {user?.name}</h1>
      <button onClick={logout}>Cerrar sesión</button>
      <p>Gestión de usuarios, roles y categorías.</p>
    </div>
  );
}
