import "./Login.css";
import { supabase } from "../supabaseClient";
import googleIcon from "../assets/google.svg";

export default function Login() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) alert("☠️ Error al iniciar sesión con Google");
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h1 className="login-title">Mesa de Ayuda</h1>
        <div className="google-card">
          <button onClick={handleGoogleLogin} className="google-signin-button">
            <img src={googleIcon} alt="Google" className="google-icon-large" />
            <h2 className="signin-text">Iniciar sesión</h2>
          </button>
        </div>
      </div>
    </div>
  );
}
