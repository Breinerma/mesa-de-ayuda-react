import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const [status, setStatus] = useState("Verificando sesión...");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // 1️⃣ Obtener sesión de Supabase
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setStatus("Error: no hay sesión");
          return;
        }

        const accessToken = data.session.access_token;

        // 2️⃣ Llamar al backend
        const response = await fetch("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          throw new Error("Backend no autorizó");
        }

        const result = await response.json();
        const backendUser = result.user;

        // 3️⃣ Convertir rol_id → rol string
        const roleMap = {
          1: "usuario",
          2: "agente",
          3: "admin",
        } as const;

        const formattedUser = {
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          rol: roleMap[backendUser.rol_id],
          job_title: backendUser.job_title,
        };

        // 4️⃣ Guardar en AuthContext y localStorage
        localStorage.setItem("userInfo", JSON.stringify(formattedUser));
        setUser(formattedUser);

        // 5️⃣ Redirigir según rol
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
