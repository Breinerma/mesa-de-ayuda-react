interface TicketCardProps {
  title: string;
  description: string;
  status: "Abierto" | "En progreso" | "Cerrado";
}

export default function TicketCard({
  title,
  description,
  status,
}: TicketCardProps) {
  const color =
    status === "Abierto"
      ? "bg-green-100 text-green-700"
      : status === "En progreso"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-200 text-gray-700";

  return (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-3 text-sm">{description}</p>
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
        {status}
      </span>
    </div>
  );
}
