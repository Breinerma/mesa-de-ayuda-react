import { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardUser from "./pages/DashboardUser";
import DashboardAgent from "./pages/DashboardAgent";
import DashboardAdmin from "./pages/DashboardAdmin";
import AuthCallback from "./pages/AuthCallback";

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: string[];
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(user.rol)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route
          path="/dashboard-user"
          element={
            <ProtectedRoute allowedRoles={["usuario"]}>
              <DashboardUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-agent"
          element={
            <ProtectedRoute allowedRoles={["agente"]}>
              <DashboardAgent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
