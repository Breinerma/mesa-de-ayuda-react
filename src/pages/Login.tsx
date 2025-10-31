import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", email, password);
    // Aquí luego se integrará la función real de loginUser()
  };

  return (
    <div className="login-body">
      <div className="login-card">
        <div className="header">
          <h1>Ingrese a la Mesa de Ayuda</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Usuario o correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-button">
              Iniciar sesión
            </button>
          </div>

          <div className="help-link">
            <a href="#">¿Necesitas ayuda?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
