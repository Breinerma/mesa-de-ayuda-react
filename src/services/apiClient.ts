// src/services/apiClient.ts
const API_BASE_URL = import.meta.env.VITE_API_URL as string;

// Helper para obtener el token
const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

// Helper para headers con autenticación
export const getAuthHeaders = () => ({
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
    const errorText = await response.text();
    console.error("Error al Obtener datos del usuario:", errorText);
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
    const errorText = await response.text();
    console.error("Error En el inicio de sesión:", errorText);
    throw new Error("Error en el inicio de sesión");
  }

  return response.json();
}

export async function getAuthMe(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al Obtener información del usuario:", errorText);
    throw new Error("Error al obtener información del usuario");
  }
  return response.json();
}

// ==================== USERS ====================
export async function getAllUsers(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al Obtener usuarios: ", errorText);
    throw new Error("Error al obtener usuarios");
  }
  return response.json();
}

export async function getUserById(userId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al obtener usuario:", errorText);
    throw new Error("Error al obtener usuario");
  }

  return response.json();
}

export async function updateUserProfile(data: {
  name?: string;
  job_title?: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al actualizar perfil:", errorText);
    throw new Error("Error al actualizar perfil");
  }
  return response.json();
}

export async function getAgents(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/users/agentes`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al actualizar perfil:", errorText);
    throw new Error("Error al obtener agentes");
  }

  return response.json();
}

export async function updateUserRole(
  userId: string,
  rol_id: number
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, rol_id }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al actualizar perfil:", errorText);
    throw new Error("Error al actualizar rol");
  }

  return response.json();
}

export async function deactivateUser(userId: string): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/api/users/${userId}/deactivate`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al actualizar perfil:", errorText);
    throw new Error("Error al desactivar usuario");
  }

  return response.json();
}

export async function activateUser(userId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/activate`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al actualizar perfil:", errorText);
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
  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al crear ticket: ", errorText);
    throw new Error("Error al crear ticket");
  }

  return response.json();
}

export async function createTicketWithImages({
  title,
  description,
  category_id,
  priority_id,
  images,
}: {
  title: string;
  description: string;
  category_id: number;
  priority_id: number;
  images: File[];
}) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("category_id", String(category_id));
  formData.append("priority_id", String(priority_id));
  for (const file of images) {
    if (file.size > 3 * 1024 * 1024) {
      throw new Error(
        "Cada imagen debe pesar menos de 3 MB. Inténtalo de nuevo."
      );
    }
    formData.append("images", file);
  }
  const response = await fetch(
    "https://helpdesks.up.railway.app/api/tickets/with-images",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error("Error al crear ticket: " + error);
  }

  return response.json();
}

export async function getMyTickets(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/tickets/my-tickets`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al obtener tickets: ", errorText);
    throw new Error("Error al obtener tickets");
  }

  return response.json();
}

export async function getTickets(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/tickets/all`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al obtener tickets: ", errorText);
    throw new Error("Error al obtener tickets");
  }

  return response.json();
}

export async function getTicketWithImages(ticketId: number) {
  const response = await fetch(
    `https://helpdesks.up.railway.app/api/tickets/${ticketId}/with-images`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Error al obtener el ticket");
  const data = await response.json();
  return data.ticket;
}

export async function assignTicket(
  ticketId: number,
  agente_id: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/api/tickets/${ticketId}/assign`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ agente_id }),
    }
  );

  if (!response.ok) {
    throw new Error("Error al asignar ticket");
  }

  return response.json();
}

export async function updateTicketStatus(
  ticketId: number,
  sw_status: number,
  description: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/api/tickets/${ticketId}/status`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ sw_status, description }),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Error al actualizar estado del ticket: " + errorText);
  }
  return response.json();
}

export async function returnTicket(
  ticketId: number,
  reason: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/api/tickets/${ticketId}/return`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al devolver ticket:", errorText);
    throw new Error("Error al devolver ticket");
  }

  return response.json();
}

export async function updateTicketPriority(
  ticketId: number,
  priority_id: number
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/api/tickets/${ticketId}/priority`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ priority_id }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al actualizar perfil:", errorText);
    throw new Error("Error al actualizar prioridad");
  }

  return response.json();
}

// Agregar esta función en src/services/apiClient.ts

export async function updateTicketCategory(
  ticketId: number,
  category_id: number
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/api/tickets/${ticketId}/category`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ category_id }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al actualizar categoría:", errorText);
    throw new Error("Error al actualizar categoría");
  }

  return response.json();
}

// ==================== CATEGORIES ====================
export async function createCategory(name: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al actualizar perfil:", errorText);
    throw new Error("Error al crear categoría");
  }
  return response.json();
}

// ==================== MESSAGES ====================
export async function getTicketConversation(ticketId: number) {
  const response = await fetch(
    `https://helpdesks.up.railway.app/api/tickets/${ticketId}/conversation`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    const msg = await response.text();
    throw new Error("Error al obtener la conversación: " + msg);
  }
  const data = await response.json();
  console.log("Conversación recibida:", data);
  const mensajes = data?.conversation?.global?.messages;
  if (Array.isArray(mensajes)) {
    return mensajes;
  }
  return [];
}

export async function sendTicketMessage(ticketId: number, content: string) {
  const response = await fetch(
    `https://helpdesks.up.railway.app/api/tickets/${ticketId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );
  const data = await response.json();
  if (!response.ok || data.success !== true) {
    throw new Error(
      "Error al enviar mensaje: " + (data.text || JSON.stringify(data))
    );
  }
  return data;
}

export async function replyToTicket(ticketId: number, content: string) {
  const response = await fetch(
    `https://helpdesks.up.railway.app/api/tickets/${ticketId}/reply`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );
  const data = await response.json();
  if (!response.ok || data.success !== true) {
    throw new Error("Error al enviar respuesta " + (data.text || ""));
  }
  return data;
}
