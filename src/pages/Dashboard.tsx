import TicketCard from "../components/TicketCard";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tickets Recientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TicketCard
          title="Error de inicio de sesión"
          description="El usuario no puede ingresar al sistema"
          status="Abierto"
        />
        <TicketCard
          title="Problema con impresora"
          description="La impresora no responde desde ayer"
          status="En progreso"
        />
        <TicketCard
          title="Solicitud de acceso a base de datos"
          description="Nuevo usuario requiere permisos"
          status="Cerrado"
        />
      </div>
    </div>
  );
}
