// src/hooks/useUsers.ts
import { useState } from "react";
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  getAgents,
  updateUserRole,
  deactivateUser,
  activateUser,
} from "../services/apiClient";
import { User, UpdateProfileData, formatBackendUser } from "../types";
import { useAuth } from "../context/AuthContext";

export function useUsers() {
  const { user: currentUser, setUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsers();
      if (response.success) {
        const formattedUsers = response.users.map(formatBackendUser);
        setUsers(formattedUsers);
        return formattedUsers;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener usuarios"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAgents();
      if (response.success) {
        const formattedAgents = response.agentes.map(formatBackendUser);
        setAgents(formattedAgents);
        return formattedAgents;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener agentes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserById(userId);
      if (response.success) {
        return formatBackendUser(response.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener usuario");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUserProfile(data);
      if (response.success) {
        const updatedUser = formatBackendUser(response.user);
        setUser(updatedUser);
        return updatedUser;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar perfil"
      );
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (userId: string, rolId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUserRole(userId, rolId);
      if (response.success) {
        // Actualizar en la lista local
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, rol_id: rolId as 1 | 2 | 3 } : u
          )
        );
        return formatBackendUser(response.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar rol");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, activate: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = activate
        ? await activateUser(userId)
        : await deactivateUser(userId);

      if (response.success) {
        // Actualizar en la lista local
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, sw_active: activate ? 1 : 0 } : u
          )
        );
        return response;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cambiar estado del usuario"
      );
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    agents,
    loading,
    error,
    fetchAllUsers,
    fetchAgents,
    fetchUserById,
    updateProfile,
    changeUserRole,
    toggleUserStatus,
  };
}
