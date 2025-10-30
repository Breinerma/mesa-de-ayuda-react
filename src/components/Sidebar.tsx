import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navLink = (path: string, label: string) => (
    <Link
      to={path}
      className={`px-3 py-2 rounded transition font-medium ${
        location.pathname === path
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <aside className="bg-gray-900 text-gray-100 w-64 h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-blue-400">Helpdesk</h2>

      <nav className="flex flex-col gap-2">
        {navLink("/", "Dashboard")}
        {navLink("/tickets", "Tickets")}
        {navLink("/new", "Nuevo Ticket")}
      </nav>

      <div className="mt-auto text-sm text-gray-500 border-t border-gray-800 pt-4">
        <p>© 2025 Helpdesk System</p>
      </div>
    </aside>
  );
}
