// src/services/apiClient.ts
const API_BASE_URL = import.meta.env.VITE_API_URL as string;

export async function fetchUserData(token: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/user-data`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener datos del usuario");
  }

  return response.json();
}

/**
 * @param email Correo electrónico del usuario
 * @param password Contraseña del usuario
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Error en el inicio de sesión");
  }

  return response.json();
}
