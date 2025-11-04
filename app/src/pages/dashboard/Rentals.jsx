import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import * as rentalsService from '../../services/rentals';
import * as carsService from '../../services/cars';
import * as clientsService from '../../services/clients';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { generateRentalPDF } from '../../utils/pdf';

function categorize(rentals) {
  const list = Array.isArray(rentals) ? rentals : [];
  const today = new Date(); today.setHours(12,0,0,0);
  const fmt = (d) => { try { const x = new Date(d); x.setHours(12,0,0,0); return x; } catch { return null; } };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };

  const activos = [];
  const porVencer = [];
  const finalizados = [];
  for (const r of list) {
    const active = Boolean(r.is_active);
    const endStr = (r.completion_date || '').slice(0, 10);
    const end = fmt(endStr);
    if (!active) {
      finalizados.push(r);
      continue;
    }
    if (!end) { activos.push(r); continue; }
    if (end < today) {
      // técnicamente vencidos pero aún activos
      porVencer.push(r); // los tratamos como "por vencer/vencidos" en UI moderna
    } else if (end <= addDays(today, 3)) {
      porVencer.push(r);
    } else {
      activos.push(r);
    }
  }
  return { activos, porVencer, finalizados };
}

export default function Rentals() {
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['rentals'],
    queryFn: () => rentalsService.listRentals().catch((e) => {
      e._friendly = true; throw e;
    }),
  });

  const { activos, porVencer, finalizados } = categorize(data || []);

  const tabs = useMemo(() => ([
    { key: 'activos', label: `Activos (${activos.length})`, color: 'cyan' },
    { key: 'porvencer', label: `Por vencer (${porVencer.length})`, color: 'amber' },
    { key: 'finalizados', label: `Finalizados (${finalizados.length})`, color: 'emerald' },
  ]), [activos.length, porVencer.length, finalizados.length]);
  const [tab, setTab] = useState(tabs[0]?.key || 'activos');

  const current = tab === 'activos' ? activos : tab === 'porvencer' ? porVencer : finalizados;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alquileres</h1>
          <p className="text-sm text-slate-400">Panel de control — Activos, por vencer y finalizados</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => refetch()}>Refrescar</Button>
        </div>
      </div>

      {/* KPIs */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <KpiCard title="Activos" value={activos.length} color="cyan" />
          <KpiCard title="Por vencer" value={porVencer.length} color="amber" />
          <KpiCard title="Finalizados" value={finalizados.length} color="emerald" />
        </div>
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {/* Content */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl border border-slate-800/70 bg-slate-900/60 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-4 rounded-md bg-yellow-900/30 border border-yellow-800 text-yellow-200">
          No pudimos listar los alquileres.
        </div>
      )}

      {!isLoading && !isError && (
        <RentalsGrid items={current} badgeKey={tab} />
      )}
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="relative rounded-xl border border-slate-800/80 bg-slate-900/60 p-1 flex items-center gap-1">
      {tabs.map((t) => (
        <button key={t.key} onClick={() => onChange(t.key)}
          className={`relative px-3 py-2 rounded-lg text-sm transition-all ${active===t.key?'text-white':'text-slate-400 hover:text-slate-200'}`}>
          <span className="relative z-10">{t.label}</span>
          {active===t.key && (
            <motion.span layoutId="pill" className={`absolute inset-0 rounded-lg ${bgByColor(t.color)} opacity-30`} />
          )}
        </button>
      ))}
    </div>
  );
}

function bgByColor(color) {
  return {
    cyan: 'bg-cyan-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    blue: 'bg-blue-500',
  }[color] || 'bg-cyan-500';
}

function KpiCard({ title, value, color = 'cyan' }) {
  const ring = {
    cyan: 'from-cyan-600/15 to-cyan-400/5 border-cyan-400/30',
    amber: 'from-amber-600/15 to-amber-400/5 border-amber-400/30',
    emerald: 'from-emerald-600/15 to-emerald-400/5 border-emerald-400/30',
  }[color];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ y: -3 }}
      className={`rounded-xl border bg-gradient-to-br ${ring} p-4 backdrop-blur-sm flex items-center justify-between`}>
      <div className="text-sm text-slate-400">{title}</div>
      <div className="text-2xl font-semibold text-slate-100">{value}</div>
    </motion.div>
  );
}

function RentalsGrid({ items, badgeKey }) {
  const [detail, setDetail] = useState(null); // rental selected
  const [open, setOpen] = useState(false);

  return (
    <div>
      {items?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r) => (
            <motion.article key={r.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} whileHover={{ y: -3 }}
              className="relative rounded-xl border border-slate-800/70 bg-slate-900/60 p-4 overflow-hidden group">
              {/* glow on hover */}
              <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-cyan-500/30" />

              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-100"># {r.id}</div>
                <Badge color={badgeKey==='activos'?'cyan':badgeKey==='porvencer'?'amber':'emerald'}>{labelByKey(badgeKey)}</Badge>
              </div>
              <div className="mt-2 text-sm text-slate-300">Auto ID: {r.car_id} • Usuario ID: {r.user_id}</div>
              <div className="mt-1 text-xs text-slate-400">Desde: {(r.start_date||'').slice(0,10)} • Hasta: {(r.completion_date||'').slice(0,10)}</div>
              <div className="mt-2 text-sm font-medium text-slate-100">Total: ${Number(r.total||0)}</div>

              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="secondary" onClick={() => { setDetail(r); setOpen(true); }}>Ver detalle</Button>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400">Sin registros</div>
      )}

      {open && detail && (
        <RentalDetailModal rental={detail} onClose={() => { setOpen(false); setDetail(null); }} />
      )}
    </div>
  );
}

function labelByKey(key) {
  return key === 'activos' ? 'Activo' : key === 'porvencer' ? 'Por vencer' : 'Finalizado';
}

function RentalDetailModal({ rental, onClose }) {
  // Load car and person on demand
  const { data: car, isLoading: loadingCar, isError: errorCar } = useQuery({
    queryKey: ['car', rental.car_id],
    queryFn: () => carsService.getCar(rental.car_id),
    enabled: Boolean(rental?.car_id),
  });
  const { data: person, isLoading: loadingPerson, isError: errorPerson } = useQuery({
    queryKey: ['person-by-user', rental.user_id],
    queryFn: () => clientsService.getPersonByUserId(rental.user_id),
    enabled: Boolean(rental?.user_id),
  });

  const start = (rental.start_date||'').slice(0,10);
  const end = (rental.completion_date||'').slice(0,10);
  const daily = Number(rental.daily_rate ?? car?.price_day ?? 0);
  const total = Number(rental.total ?? 0);

  return (
    <Modal open onClose={onClose} ariaLabel={`Detalle alquiler #${rental.id}`} panelClassName="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">Alquiler #{rental.id}</h3>
        <p className="text-sm text-slate-400 mt-1">Información completa del alquiler</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-sm font-semibold text-slate-200 mb-2">Auto</div>
          {loadingCar ? (
            <div className="h-20 rounded bg-slate-800/60 animate-pulse" />
          ) : errorCar ? (
            <div className="text-sm text-rose-300">No pudimos cargar el auto</div>
          ) : car ? (
            <div className="text-sm text-slate-300 space-y-1">
              <div>Vehículo: <span className="text-slate-100">{car.brand} {car.model}</span></div>
              <div>Color: <span className="text-slate-100">{car.color}</span></div>
              <div>Año: <span className="text-slate-100">{car.age}</span></div>
              <div>Precio/día: <span className="text-slate-100">${car.price_day}</span></div>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-sm font-semibold text-slate-200 mb-2">Cliente</div>
          {loadingPerson ? (
            <div className="h-20 rounded bg-slate-800/60 animate-pulse" />
          ) : errorPerson ? (
            <div className="text-sm text-rose-300">No pudimos cargar los datos del cliente</div>
          ) : person ? (
            <div className="text-sm text-slate-300 space-y-1">
              <div>Nombre: <span className="text-slate-100">{person.name}</span></div>
              <div>DNI: <span className="text-slate-100">{person.dni}</span></div>
              <div>Teléfono: <span className="text-slate-100">{person.phone}</span></div>
              <div>Género: <span className="text-slate-100">{person.gender}</span></div>
              <div>Nacimiento: <span className="text-slate-100">{(person.birthday||'').slice(0,10)}</span></div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Info label="Desde" value={start} />
          <Info label="Hasta" value={end} />
          <Info label="Tarifa diaria" value={`$ ${Number.isFinite(daily)?daily:0}`} />
          <Info label="Total" value={`$ ${Number.isFinite(total)?total:0}`} />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        <Button onClick={() => {
          try {
            const url = generateRentalPDF({ rental, car, person });
            if (url) window.open(url, '_blank', 'noopener');
          } catch {}
        }}>Ver PDF</Button>
      </div>
    </Modal>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-800/70 bg-slate-900/50 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-slate-100 font-medium">{value || '-'}</div>
    </div>
  );
}
