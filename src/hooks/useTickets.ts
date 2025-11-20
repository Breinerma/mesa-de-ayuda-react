// src/hooks/useTickets.ts
import { useState } from "react";
import {
  createTicket,
  getTickets,
  getMyTickets,
  assignTicket,
  updateTicketPriority,
  returnTicket,
  updateTicketStatus,
} from "../services/apiClient";
import { CreateTicketData } from "../types";
import { useAuth } from "../context/AuthContext";

export function useTickets() {
  const { tickets, setTickets } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTickets();
      if (response.success) {
        setTickets(response.tickets || []);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener todos los tickets"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyTickets();
      if (response.success) {
        setTickets(response.tickets || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener tickets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createNewTicket = async (data: CreateTicketData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createTicket(data);
      if (response.success) {
        await fetchMyTickets();
        return response;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear ticket");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignTicketToAgent = async (ticketId: number, agenteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await assignTicket(ticketId, agenteId);
      if (response.success) {
        setTickets(
          tickets.map((t) =>
            t.id === ticketId ? { ...t, agente_id: agenteId } : t
          )
        );
        return response;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar ticket");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeTicketStatus = async (
    ticketId: number,
    sw_status: number,
    description = "Actualización de estado"
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateTicketStatus(
        ticketId,
        sw_status,
        description
      );
      if (response.success) {
        await fetchMyTickets();
        return response;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar estado"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const devolverTicket = async (ticketId: number, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await returnTicket(ticketId, reason);
      if (response.success) {
        await fetchMyTickets();
        return response;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al devolver ticket");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets,
    loading,
    error,
    fetchAllTickets,
    fetchMyTickets,
    createNewTicket,
    assignTicketToAgent,
    devolverTicket,
    changeTicketStatus,
  };
}
