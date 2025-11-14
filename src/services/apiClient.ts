// src/services/apiClient.ts
const API_BASE_URL = import.meta.env.VITE_API_URL as string;

// Helper para obtener el token
const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

// Helper para headers con autenticación
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ==================== AUTH ====================
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

export async function getAuthMe(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener información del usuario");
  }

  return response.json();
}

// ==================== USERS ====================
export async function getAllUsers(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener usuarios");
  }

  return response.json();
}

export async function getUserById(userId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener usuario");
  }

  return response.json();
}

export async function updateUserProfile(data: {
  name?: string;
  job_title?: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar perfil");
  }

  return response.json();
}

export async function getAgents(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/users/agentes`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener agentes");
  }

  return response.json();
}

export async function updateUserRole(
  userId: string,
  rol_id: number
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, rol_id }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar rol");
  }

  return response.json();
}

export async function deactivateUser(userId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/deactivate`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Error al desactivar usuario");
  }

  return response.json();
}

export async function activateUser(userId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/activate`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Error al activar usuario");
  }

  return response.json();
}

// ==================== TICKETS ====================
export async function createTicket(data: {
  title: string;
  description: string;
  category_id: number;
  priority_id: number;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear ticket");
  }

  return response.json();
}

export async function getMyTickets(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/tickets/my-tickets`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener tickets");
  }

  return response.json();
}

export async function assignTicket(
  ticketId: number,
  agente_id: string
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/assign`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ agente_id }),
  });

  if (!response.ok) {
    throw new Error("Error al asignar ticket");
  }

  return response.json();
}
