import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import * as clientsService from '../../services/clients';

export default function Profile() {
  const { user } = useAuth();
  const userId = user?.id;

  // Traemos directamente los datos de la persona por id de usuario
  const { data: person, isLoading, isError } = useQuery({
    queryKey: ['person-by-user', userId],
    queryFn: () => clientsService.getPersonByUserId(userId),
    enabled: Boolean(userId),
  });

  const initials = getInitials(person?.name);

  return (
    <div className="space-y-5">
      {/* Header futurista */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6"
      >
        {/* Accentos de fondo */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-24 -right-16 h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          {/* Avatar con iniciales */}
          <div className="relative h-16 w-16 shrink-0 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 grid place-items-center text-xl font-bold text-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-violet-400">
              {initials}
            </span>
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-cyan-500/10" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
              Tu perfil
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Datos personales asociados a tu cuenta
            </p>
          </div>
        </div>
      </motion.section>

      {/* Card principal */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-md p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6),0_0_40px_4px_rgba(34,211,238,0.06)]"
      >
        {/* ornamentos SVG sutiles */}
        <svg className="pointer-events-none absolute -top-6 -right-6 w-40 h-40 opacity-[0.07]" viewBox="0 0 200 200" fill="none" aria-hidden>
          <defs>
            <linearGradient id="p-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="70" stroke="url(#p-grad)" strokeWidth="2" />
          <circle cx="100" cy="100" r="50" stroke="url(#p-grad)" strokeWidth="2" />
        </svg>

        {isLoading ? (
          <LoadingSkeleton />
        ) : isError ? (
          <div className="rounded-lg border border-rose-800/50 bg-rose-900/20 p-4 text-rose-200 text-sm">No pudimos cargar tus datos.</div>
        ) : person ? (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <NameBadge name={person.name} />
                <div>
                  <div className="text-lg font-semibold text-slate-100 leading-none">{person.name || 'Sin nombre'}</div>
                  <div className="mt-1 text-xs text-slate-400">Información verificada</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <InfoRow label="Documento (DNI)" value={person.dni} icon={icons.id} />
              <InfoRow label="Fecha de nacimiento" value={(person.birthday || '').slice(0,10)} icon={icons.birthday} />
              <InfoRow label="Teléfono" value={person.phone} icon={icons.phone} />
              <InfoRow label="Género" value={person.gender} icon={icons.gender} />
              <InfoRow label="Nombre" value={person.name} icon={icons.user} />
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-300">No se encontraron datos de la persona.</div>
        )}
      </motion.section>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-40 rounded bg-slate-800/60 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl border border-slate-800/70 bg-slate-900/50 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function NameBadge({ name }) {
  const initials = getInitials(name);
  return (
    <div className="relative h-12 w-12 shrink-0 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 grid place-items-center text-base font-bold text-slate-100">
      <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-violet-400">{initials}</span>
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5" />
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-800/70 bg-slate-900/50 p-4 flex items-start gap-3">
      <div className="h-9 w-9 shrink-0 grid place-items-center rounded-lg border border-slate-800/70 bg-slate-900/80 text-cyan-300">
        <Icon />
      </div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
        <div className="mt-0.5 text-slate-100 font-medium">{value || '-'}</div>
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) return 'P';
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] || '';
  const b = parts[1]?.[0] || '';
  return (a + b).toUpperCase();
}

const icons = {
  user: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  id: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9h10M7 13h6" />
    </svg>
  ),
  phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72 12.66 12.66 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.16a2 2 0 0 1 2.11-.45 12.66 12.66 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  birthday: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  gender: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="5" />
      <path d="M12 13v7" />
    </svg>
  ),
};
