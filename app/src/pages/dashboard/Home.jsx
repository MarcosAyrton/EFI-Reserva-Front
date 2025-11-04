import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import BackgroundFX from '../../components/BackgroundFX';
import { useQuery } from '@tanstack/react-query';
import * as carsService from '../../services/cars';

export default function Home() {
  const { user } = useAuth();
  const role = user?.role;
  const isAdmin = role === 'admin';
  const navigate = useNavigate();

  // Featured cars for customer home
  const { data: allCars = [], isLoading: loadingFeat, isError: errorFeat } = useQuery({
    queryKey: ['cars', 'featured'],
    queryFn: () => carsService.listCars(),
    enabled: !isAdmin,
  });

  const featured = (allCars || [])
    .filter((c) => (c.available ?? c.availble) && Number(c.stock ?? 0) > 0)
    .slice(0, 6);

  return (
    <div className="space-y-8 relative">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6">
        <BackgroundFX className="z-0" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
            {isAdmin
              ? 'Bienvenido al Sistema de Gestión de Alquileres de Autos "PELADO"'
              : `Encontrá tu próximo auto, ${user?.username ? user.username : 'bienvenido'}!`}
          </h1>
          <p className="mt-2 text-slate-300/90 max-w-2xl">
            {isAdmin
              ? 'Gestioná la flota, controlá los alquileres y monitoreá métricas en tiempo real.'
              : 'Explorá la flota disponible, elegí las fechas y reservá en segundos con una experiencia ágil y segura.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => navigate('/dashboard/cars')}>Ver autos</Button>
            </motion.div>
            {isAdmin && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="secondary" onClick={() => navigate('/dashboard/rentals')}>Ver alquileres</Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Admin-only stats */}
      {isAdmin ? (
        <section className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Estado" value="Administrador" hint="Rol actual" color="blue" />
            <StatCard title="Seguridad" value="JWT activo" hint="Sesión protegida" color="cyan" />
            <StatCard title="Performance" value="Ultra rápido" hint="React + Vite + Query" color="violet" />
          </div>

          {/* Estadísticas (mock) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard title="Ganancias del mes" value="$ 1.245.300" delta="▲ 12%" color="emerald" />
            <KpiCard title="Proyección por activos" value="$ 532.800" delta="▲ 5%" color="cyan" />
            <KpiCard title="Alquileres activos" value="18" delta="▲ 2" color="violet" />
            <KpiCard title="Ocupación de flota" value="76%" delta="▲ 4%" color="blue" />
          </div>
        </section>
      ) : (
        // Customer-only sections
        <>
          <FeaturedStrip loading={loadingFeat} error={errorFeat} items={featured} onSeeAll={() => navigate('/dashboard/cars')} />
          <HowItWorks />
          <Perks />
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, hint, color = 'blue' }) {
  const palette = {
    blue: 'from-blue-600/15 to-blue-500/5 border-blue-500/30',
    cyan: 'from-cyan-500/15 to-cyan-400/5 border-cyan-400/30',
    violet: 'from-violet-500/15 to-violet-400/5 border-violet-400/30',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className={`rounded-xl border bg-gradient-to-br ${palette[color]} p-4 backdrop-blur-sm`}
      whileHover={{ y: -2 }}
    >
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-1 text-xl font-semibold text-slate-100">{value}</div>
      <div className="mt-2 text-xs text-slate-400">{hint}</div>
    </motion.div>
  );
}

function KpiCard({ title, value, delta, color = 'blue' }) {
  const palette = {
    blue: {
      bg: 'from-blue-600/15 to-blue-500/5 border-blue-500/30',
      ring: 'ring-blue-500/40',
    },
    cyan: {
      bg: 'from-cyan-500/15 to-cyan-400/5 border-cyan-400/30',
      ring: 'ring-cyan-400/40',
    },
    violet: {
      bg: 'from-violet-500/15 to-violet-400/5 border-violet-400/30',
      ring: 'ring-violet-400/40',
    },
    emerald: {
      bg: 'from-emerald-600/15 to-emerald-500/5 border-emerald-500/30',
      ring: 'ring-emerald-500/40',
    },
  }[color] || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3 }}
      className={`relative rounded-xl border bg-gradient-to-br ${palette.bg} p-4 backdrop-blur-sm`}
    >
      {delta && (
        <span className={`absolute -top-2 -right-2 text-[10px] px-2 py-1 rounded-full border border-slate-700/60 bg-slate-900/80 text-emerald-300 ${palette.ring} ring-2`}>{delta}</span>
      )}
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-100 tracking-tight">{value}</div>
      <div className="mt-2 h-1 w-full bg-slate-800/60 rounded-full overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 w-1/2 animate-[shimmer_2.4s_infinite]" />
      </div>
    </motion.div>
  );
}

function FeaturedStrip({ loading, error, items, onSeeAll }) {
  return (
    <section className="relative rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Autos destacados</h2>
          <p className="text-sm text-slate-400">Disponibles ahora mismo</p>
        </div>
        <Button variant="secondary" onClick={onSeeAll}>Ver todos</Button>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 w-64 shrink-0 rounded-xl bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg border border-amber-800 bg-amber-900/20 text-amber-200 text-sm">No pudimos cargar los autos destacados.</div>
      ) : items?.length ? (
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none]">
          {items.map((c) => (
            <motion.article key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="shrink-0 w-72 rounded-xl border border-slate-800/70 bg-slate-900/60 overflow-hidden group">
              <div className="relative h-32 w-full overflow-hidden">
                {c.image ? (
                  <img src={c.image} alt={`${c.brand} ${c.model}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" loading="lazy" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-slate-400 text-sm bg-slate-900/50">Sin imagen</div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent" />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-100 truncate">{c.brand} {c.model}</div>
                  <div className="text-sm text-cyan-300 font-semibold">${c.price_day}</div>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">{c.color} • {c.age}</div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400">No hay autos disponibles por el momento.</div>
      )}
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: 'Elegí el auto', desc: 'Explorá el catálogo y seleccioná el modelo que más te guste.', icon: iconsSpark.car },
    { title: 'Definí las fechas', desc: 'Indicá cuántos días lo necesitás y te mostramos el total.', icon: iconsSpark.calendar },
    { title: 'Confirmá y disfrutá', desc: 'Confirmá tu reserva y retiralo en el horario acordado.', icon: iconsSpark.check },
  ];
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">¿Cómo funciona?</h2>
        <p className="text-sm text-slate-400">Reservá en 3 pasos simples</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }}
            className="relative rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
            <div className="mb-2 h-10 w-10 rounded-lg grid place-items-center border border-slate-800/70 bg-slate-900/80 text-cyan-300">
              <s.icon />
            </div>
            <div className="font-semibold text-slate-100">{s.title}</div>
            <div className="text-sm text-slate-400 mt-1">{s.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Perks() {
  const perks = [
    { title: 'Atención 24/7', desc: 'Soporte siempre disponible para ayudarte.', icon: iconsSpark.support },
    { title: 'Pagos seguros', desc: 'Tu información protegida con estándares modernos.', icon: iconsSpark.lock },
    { title: 'Flota renovada', desc: 'Vehículos modernos y controlados periódicamente.', icon: iconsSpark.star },
    { title: 'Retiro ágil', desc: 'Proceso simple para que salgas manejando en minutos.', icon: iconsSpark.flash },
  ];
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Beneficios</h2>
        <p className="text-sm text-slate-400">Todo pensado para una gran experiencia</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {perks.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }}
            className="relative rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
            <div className="mb-2 h-10 w-10 rounded-lg grid place-items-center border border-slate-800/70 bg-slate-900/80 text-cyan-300">
              <p.icon />
            </div>
            <div className="font-semibold text-slate-100">{p.title}</div>
            <div className="text-sm text-slate-400 mt-1">{p.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const iconsSpark = {
  car: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 13l2-5a3 3 0 0 1 2.82-2h8.36A3 3 0 0 1 19 8l2 5" />
      <path d="M7 13h10" />
      <circle cx="7" cy="16.5" r="1.5" />
      <circle cx="17" cy="16.5" r="1.5" />
    </svg>
  ),
  calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  support: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 15a4 4 0 1 1 8 0v1" />
    </svg>
  ),
  lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  star: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  flash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 2l10 9h-6l6 11-10-9h6z" />
    </svg>
  ),
};

/*
@keyframes shimmer {
  0% { transform: translateX(-50%); }
  50% { transform: translateX(60%); }
  100% { transform: translateX(120%); }
}
*/
