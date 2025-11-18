// src/hooks/useCategories.ts
import { useState, useEffect } from "react";
import { getAuthHeaders } from "../services/apiClient";

const API_CATEGORIES_URL = import.meta.env.VITE_API_URL + "/api/categories";

export function useCategories() {
  const [categories, setCategories] = useState<
    { id: number; description: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_CATEGORIES_URL, { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("Error de autenticación o red");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.categories) {
          setCategories(data.categories);
        } else {
          setError("No se pudieron cargar las categorías.");
        }
      })
      .catch(() => setError("Error al cargar categorías"))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}
