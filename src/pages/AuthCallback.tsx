// src/pages/AuthCallback.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatBackendUser } from "../types";
export default function AuthCallback() {
  const [status, setStatus] = useState("Verificando sesión...");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setStatus("Error: no hay sesión");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;
        // Guardar tokens
        localStorage.setItem("access_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }
        const response = await fetch(
          "https://helpdesks.up.railway.app/api/auth/me",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok) {
          throw new Error("Backend no autorizó");
        }

        const result = await response.json();
        const formattedUser = formatBackendUser(result.user);

        localStorage.setItem("userInfo", JSON.stringify(formattedUser));
        setUser(formattedUser);

        // Redirigir según el rol
        switch (formattedUser.rol) {
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
        console.error(err);
        setStatus("Error en la autenticación");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    handleAuth();
  }, [navigate, setUser]);

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
      }}
    >
      {status}
    </div>
  );
}
