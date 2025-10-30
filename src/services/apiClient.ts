export async function fetchUserData(token: string): Promise<any> {
  const response = await fetch("Inserte una api aquí de carlos /user-data", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener datos del usuario");
  return response.json();
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string }> {
  const response = await fetch("Insete una api aquí de carlos /login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Error en el inicio de sesión");
  return response.json();
}
