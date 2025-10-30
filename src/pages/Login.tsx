import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, fetchUserData } from "../services/apiClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { setUser, setTickets } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Iniciando sesión...");

    try {
      const { token } = await loginUser(email, password);
      const data = await fetchUserData(token);
      const { user, ticket } = data;

      setUser(user);
      setTickets(ticket);
      localStorage.setItem("userInfo", JSON.stringify(data));

      if (user.rol === "admin") navigate("/dashboard-admin");
      else if (user.rol === "agente") navigate("/dashboard-agent");
      else navigate("/dashboard-user");
    } catch (err) {
      setStatus("Error al iniciar sesión");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
      <p>{status}</p>
    </form>
  );
}
