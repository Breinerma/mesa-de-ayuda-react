// src/types/index.ts

export type RolId = 1 | 2 | 3;
export type RolType = "usuario" | "agente" | "admin";

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  refresh_token: string | null;
  rol_id: RolId;
  created_at: string;
  sw_active: number;
  job_title: string | null;
  picture_url: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  rol: RolType;
  rol_id: RolId;
  job_title: string | null;
  sw_active: number;
  picture_url: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  description: string;
}

export interface Priority {
  id: number;
  description: string;
}

export interface TicketUser {
  id: string;
  name: string;
  email: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  created_at: string;
  sw_status: number;
  category_id: number;
  priority_id: number;
  user_id: string;
  agente_id?: string | null;
  tb_category: Category;
  tb_priority: Priority;
  tb_user: TicketUser;
  tb_agente?: TicketUser | null;
}

export interface CreateTicketData {
  title: string;
  description: string;
  category_id: number;
  priority_id: number;
}

export interface UpdateProfileData {
  name?: string;
  job_title?: string;
}

// Mapeo de roles
export const roleMap: Record<RolId, RolType> = {
  1: "usuario",
  2: "agente",
  3: "admin",
};

export const roleIdMap: Record<RolType, RolId> = {
  usuario: 1,
  agente: 2,
  admin: 3,
};

// Helper para convertir usuario del backend al formato local
export function formatBackendUser(backendUser: BackendUser): User {
  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    rol: roleMap[backendUser.rol_id],
    rol_id: backendUser.rol_id,
    job_title: backendUser.job_title,
    sw_active: backendUser.sw_active,
    picture_url: backendUser.picture_url,
    created_at: backendUser.created_at,
  };
}
