import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationsContext';
import { generateRentalPDF } from '../utils/pdf';

export default function NotificationsBell() {
  const { items, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications() || {};
  const [open, setOpen] = useState(false);

  const onToggle = () => setOpen((o) => !o);

  const count = unreadCount || 0;

  return (
    <div className="relative">
      <button
        aria-label="Notificaciones"
        onClick={onToggle}
        className="relative h-10 w-10 grid place-items-center rounded-lg border border-slate-800/70 bg-slate-900/60 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:shadow-[0_0_18px_2px_rgba(34,211,238,0.10)] transition-all"
      >
        <BellIcon />
        {!!count && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold grid place-items-center bg-rose-600 text-white border border-rose-300/60">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-auto rounded-xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md shadow-2xl z-50"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 border-b border-slate-800/70 bg-slate-950/60">
              <div className="text-sm font-semibold text-slate-200">Notificaciones</div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-slate-400 hover:text-slate-200" onClick={markAllAsRead}>Marcar leídas</button>
                <span className="opacity-30">•</span>
                <button className="text-xs text-slate-400 hover:text-slate-200" onClick={clearAll}>Limpiar</button>
              </div>
            </div>

            {(!items || items.length === 0) ? (
              <div className="p-4 text-sm text-slate-400">Sin notificaciones</div>
            ) : (
              <ul className="divide-y divide-slate-800/70">
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      className="w-full text-left px-3 py-3 hover:bg-slate-800/50 flex gap-3"
                      onClick={() => {
                        markAsRead(n.id);
                        handleNotificationClick(n);
                        setOpen(false);
                      }}
                    >
                      <div className="mt-0.5">
                        {n.type === 'success' ? <Dot color="emerald" /> : n.type === 'warning' ? <Dot color="amber" /> : <Dot color="cyan" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-100 flex items-center gap-2">
                          {n.title}
                          {!n.read && <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-cyan-400/50 text-cyan-200 bg-cyan-500/10">Nuevo</span>}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</div>
                        <div className="text-[10px] text-slate-500 mt-1">{formatTime(n.createdAt)}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function handleNotificationClick(n) {
  if (n.type === 'rental-confirmed' && n.payload) {
    try {
      const { rental, car, person } = n.payload;
      const url = generateRentalPDF({ rental, car, person });
      if (url) window.open(url, '_blank', 'noopener');
    } catch (e) {
      // silent
    }
  }
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8a6 6 0 1 1 12 0v3c0 .8.3 1.6.9 2.1l.6.5c.9.7.4 2.1-.8 2.1H5.3c-1.2 0-1.7-1.4-.8-2.1l.6-.5c.6-.5.9-1.3.9-2.1V8" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function Dot({ color = 'cyan' }) {
  const map = {
    emerald: 'bg-emerald-500 shadow-[0_0_12px_2px_rgba(16,185,129,0.5)]',
    amber: 'bg-amber-500 shadow-[0_0_12px_2px_rgba(245,158,11,0.5)]',
    cyan: 'bg-cyan-500 shadow-[0_0_12px_2px_rgba(6,182,212,0.5)]',
  };
  return <span className={`h-2.5 w-2.5 rounded-full inline-block ${map[color]}`} />;
}

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return '';
  }
}
