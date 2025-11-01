import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { fetchUserData } from "../services/apiClient";
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
        const userInfo = await fetchUserData(data.session.access_token);
        console.log("Datos del backend:", userInfo);

        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        setStatus("Sesión válida (^_^)");
        navigate("/dashboard-user");
      } catch (e) {
        console.error(e);
        setStatus("Error al obtener datos del usuario ☠️");
      }
      try {
        const userInfo = await fetchUserData(data.session.access_token);
        console.log("Datos del backend:", userInfo);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setStatus("Sesión válida (^_^)");
        navigate("/dashboard-user");
      } catch (e: any) {
        console.error("Error al obtener datos del usuario:", e);
        setStatus("Error al obtener datos del usuario ☠️ " + e.message);
      }
    };

    handleAuth();
  }, [navigate]);

  return <p>{status}</p>;
}
