// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type User = {
  id: string;
  name: string;
  rol: "usuario" | "agente" | "admin";
  job_title: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  tickets: any[];
  setTickets: (tickets: any[]) => void;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("userInfo");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    setTickets([]);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, tickets, setTickets, loading, logout }}
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
