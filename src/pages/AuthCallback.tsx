import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const [status, setStatus] = useState("Verificando sesión...");
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        setStatus("Error de autenticación ☠️ " + error);
        console.log("Datos de sesión Supabase:", data);
        console.log("Error Supabase:", error);
        return;
      }

      try {
        const user = data.session.user;
        localStorage.setItem("user", JSON.stringify(user));
        setStatus("Sesión válida (^_^)");
        navigate("/dashboard-user");
      } catch (e: any) {
        console.error("Error al procesar la sesión:", e);
        setStatus("Error al obtener datos del usuario ☠️ " + e.message);
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
        flexDirection: "column",
        backgroundColor: "#2f97ff",
        color: "white",
        fontFamily: "Arial, sans-serif",
        fontSize: "1.2em",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>Mesa de Ayuda</h1>
      <p>{status}</p>
    </div>
  );
}
