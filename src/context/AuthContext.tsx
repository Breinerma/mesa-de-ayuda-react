// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Ticket } from "../types";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  loading: boolean;
  logout: () => void;
  isAdmin: boolean;
  isAgent: boolean;
  isUser: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("userInfo");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing user info:", error);
        localStorage.removeItem("userInfo");
      }
    }
    setLoading(false);
  }, []);

  // Actualizar localStorage cuando cambia el usuario
  useEffect(() => {
    if (user) {
      localStorage.setItem("userInfo", JSON.stringify(user));
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    setTickets([]);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  // Helpers para verificar roles
  const isAdmin = user?.rol === "admin";
  const isAgent = user?.rol === "agente";
  const isUser = user?.rol === "usuario";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        tickets,
        setTickets,
        loading,
        logout,
        isAdmin,
        isAgent,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
};
