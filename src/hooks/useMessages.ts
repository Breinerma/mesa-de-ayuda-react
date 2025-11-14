// src/hooks/useMessages.ts
import { useState } from "react";
import {
  sendTicketMessage,
  replyToTicket,
  getTicketMessages,
} from "../services/apiClient";
import { Message } from "../types";
import { useAuth } from "../context/AuthContext";

export function useMessages() {
  const { isAdmin, isAgent } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async (ticketId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTicketMessages(ticketId);
      if (response.success) {
        setMessages(response.messages || []);
        return response.messages;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener mensajes"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (ticketId: number, content: string) => {
    setLoading(true);
    setError(null);
    try {
      const response =
        isAdmin || isAgent
          ? await replyToTicket(ticketId, content)
          : await sendTicketMessage(ticketId, content);

      if (response.success) {
        // Agregar el mensaje nuevo al estado
        setMessages((prev) => [...prev, response.message]);
        return response;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar mensaje");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    setMessages,
  };
}
