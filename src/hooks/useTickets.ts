// src/hooks/useTickets.ts
import { useState } from "react";
import {
  createTicket,
  getMyTickets,
  assignTicket,
} from "../services/apiClient";
import { Ticket, CreateTicketData } from "../types";
import { useAuth } from "../context/AuthContext";

export function useTickets() {
  const { tickets, setTickets } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        // Recargar tickets después de crear uno nuevo
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
        // Actualizar el ticket en el estado local
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

  return {
    tickets,
    loading,
    error,
    fetchMyTickets,
    createNewTicket,
    assignTicketToAgent,
  };
}
