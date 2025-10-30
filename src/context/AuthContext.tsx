import { createContext, useContext, useState, ReactNode } from "react";

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
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);

  const logout = () => {
    setUser(null);
    setTickets([]);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, tickets, setTickets, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
