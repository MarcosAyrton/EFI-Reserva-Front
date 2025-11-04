import Button from '../../components/ui/Button';

export default function Clients() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Refrescar</Button>
          <Button>Agregar cliente</Button>
        </div>
      </div>
      <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 text-center">
        Listado de clientes próximamente...
      </div>
    </div>
  );
}
