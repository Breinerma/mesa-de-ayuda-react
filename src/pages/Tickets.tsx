export default function Tickets() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Lista de Tickets
      </h2>
      <table className="w-full text-left border-collapse bg-white shadow rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Asunto</th>
            <th className="p-3 border">Estado</th>
            <th className="p-3 border">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50">
            <td className="p-3 border">#101</td>
            <td className="p-3 border">Falla de conexión</td>
            <td className="p-3 border text-green-600">Abierto</td>
            <td className="p-3 border">24/10/2025</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="p-3 border">#102</td>
            <td className="p-3 border">Pantalla azul</td>
            <td className="p-3 border text-yellow-600">En progreso</td>
            <td className="p-3 border">23/10/2025</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
