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
        setStatus("Error de autenticación ☠️");
        return;
      }

      try {
        const userInfo = await fetchUserData(data.session.access_token);
        console.log("Datos del backend:", userInfo);

        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        setStatus("Sesión válida ✅");
        navigate("/dashboard-user"); 
      } catch (e) {
        console.error(e);
        setStatus("Error al obtener datos del usuario");
      }
    };

    handleAuth();
  }, [navigate]);

  return <p>{status}</p>;
}
