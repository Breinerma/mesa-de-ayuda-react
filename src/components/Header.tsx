export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Panel de Soporte</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          UR
        </div>
      </div>
    </header>
  );
}
