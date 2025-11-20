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
        setStatus("Procesando autenticación con Google...");

        // Esperar a que Supabase procese el hash
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessTokenFromHash = hashParams.get("access_token");

        console.log("🔍 Hash en URL:", window.location.hash);
        console.log(
          "🔍 Token del hash:",
          accessTokenFromHash?.substring(0, 30) + "..."
        );

        if (accessTokenFromHash) {
          setStatus("Token encontrado, procesando...");
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        const { data, error } = await supabase.auth.getSession();

        console.log("📦 Sesión de Supabase:", data);
        console.log("⚠️ Error de Supabase:", error);

        if (error) {
          console.error("❌ Error obteniendo sesión:", error);
          throw new Error(`Error de Supabase: ${error.message}`);
        }

        if (!data.session) {
          console.error("❌ No hay sesión después de procesar");
          setStatus("Error: no se pudo crear la sesión");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;

        console.log(
          "✅ Token de Supabase obtenido:",
          accessToken.substring(0, 30) + "..."
        );

        // Guardar tokens
        localStorage.setItem("access_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        setStatus("Conectando con el servidor...");

        // Enviar token al backend
        const response = await fetch(
          "https://helpdesks.up.railway.app/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("📡 Respuesta del backend:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Error del backend:", errorText);
          throw new Error(
            `Backend rechazó el token (${response.status}): ${errorText}`
          );
        }

        const result = await response.json();
        console.log("👤 Datos del usuario:", result);

        const formattedUser = formatBackendUser(result.user);

        console.log("✅ Usuario formateado:", formattedUser);
        console.log("🎭 Rol del usuario:", formattedUser.rol);
        console.log("🔢 Rol ID:", formattedUser.rol_id);

        localStorage.setItem("userInfo", JSON.stringify(formattedUser));
        setUser(formattedUser);

        setStatus("¡Autenticación exitosa! Redirigiendo...");

        // Limpiar el hash de la URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        // Redirigir según el rol con logs
        setTimeout(() => {
          console.log("🚀 Redirigiendo usuario con rol:", formattedUser.rol);

          if (formattedUser.rol === "admin") {
            console.log("➡️ Redirigiendo a /dashboard-admin");
            navigate("/dashboard-admin", { replace: true });
          } else if (formattedUser.rol === "agente") {
            console.log("➡️ Redirigiendo a /dashboard-agent");
            navigate("/dashboard-agent", { replace: true });
          } else {
            console.log("➡️ Redirigiendo a /dashboard-user");
            navigate("/dashboard-user", { replace: true });
          }
        }, 500);
      } catch (err) {
        console.error("❌ Error completo:", err);
        setStatus(
          `Error: ${err instanceof Error ? err.message : "Error desconocido"}`
        );
        setTimeout(() => navigate("/"), 4000);
      }
    };

    handleAuth();
  }, [navigate, setUser]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #66a4eaff 0%, #0059ffff 100%)",
        color: "white",
        fontSize: "1.2em",
        gap: "20px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3em" }}>
        {status.includes("Error") ? "❌" : "⏳"}
      </div>
      <div>{status}</div>
      <div style={{ fontSize: "0.8em", opacity: 0.7, maxWidth: "500px" }}>
        {status.includes("Error")
          ? "Revisa la consola del navegador (F12) para más detalles"
          : "Esto puede tomar unos segundos..."}
      </div>
    </div>
  );
}
