export default function NewTicket() {
  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Crear Nuevo Ticket
      </h2>
      <form className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          placeholder="Asunto"
          className="border rounded p-2"
        />
        <textarea
          placeholder="Descripción del problema"
          className="border rounded p-2 h-32 resize-none"
        />
        <select className="border rounded p-2">
          <option>Prioridad baja</option>
          <option>Prioridad media</option>
          <option>Prioridad alta</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Enviar Ticket
        </button>
      </form>
    </div>
  );
}
