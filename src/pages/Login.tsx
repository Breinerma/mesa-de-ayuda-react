import { useState } from "react";
import "./Login.css";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", email, password);
    setStatus("🔧 Pronto se integrará el login con backend");
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
      setStatus("☠️ Error al iniciar sesión con Google");
    } else {
      setStatus("Redirigiendo a Google...");
    }
  };

  return (
    <div className="login-body">
      <div className="login-card">
        <div className="header">
          <h1>Mesa de Ayuda</h1>
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
        </form>

        {/* Botón Google debajo del formulario */}
        <button onClick={handleGoogleLogin} className="google-button">
          <img
            src="../assets/google.svg"
            alt="Google"
            className="google-icon"
          />
          Iniciar sesión con Google
        </button>

        {status && <p className="status-msg">{status}</p>}

        <div className="help-link">
          <a href="#">¿Necesitas ayuda?</a>
        </div>
      </div>
    </div>
  );
}
