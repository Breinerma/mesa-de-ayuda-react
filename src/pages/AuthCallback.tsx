import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const [status, setStatus] = useState("Verificando sesión...");
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.error("Error obteniendo sesión:", error);
          setStatus("Error de autenticación ☠️");
          return;
        }

        const session = data.session;
        const user = session.user;

        console.log("Usuario autenticado: ", user);

        // Guardar datos esenciales del usuario en localStorage
        const userInfo = {
          id: user.id,
          email: user.email ?? "",
          name: user.user_metadata?.name ?? "Usuario",
          rol: user.user_metadata?.rol ?? "usuario",
        };

        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("access_token", session.access_token);
        localStorage.setItem("refresh_token", session.refresh_token);

        setStatus("Sesión válida ✅");
        switch (userInfo.rol) {
          case "admin":
            navigate("/dashboard-admin");
            break;
          case "agente":
            navigate("/dashboard-agent");
            break;
          default:
            navigate("/dashboard-user");
            break;
        }
      } catch (err) {
        console.error("Error en la autenticación:", err);
        setStatus("Error en la autenticación ☠️");
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#2f97ff",
        color: "white",
        fontSize: "1.2em",
        flexDirection: "column",
      }}
    >
      <p>{status}</p>
    </div>
  );
}
