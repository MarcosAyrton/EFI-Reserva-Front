import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import BackgroundFX from '../components/BackgroundFX';
import Footer from '../components/Footer';
import NotificationsBell from '../components/NotificationsBell';

const LinkItem = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `relative px-3.5 py-2.5 rounded-lg text-[15px] font-medium tracking-wide transition-colors ${isActive ? 'text-white' : 'text-slate-200 hover:text-white'}`}
  >
    {({ isActive }) => (
      <span className="inline-flex items-center">
        {label}
        <span className={`absolute left-2 right-2 -bottom-1 h-px rounded-full transition-opacity ${isActive ? 'opacity-100 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400' : 'opacity-0 group-hover:opacity-100'}`} />
      </span>
    )}
  </NavLink>
);

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;
  const [open, setOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Close on route change via NavLink click, on ESC, and on resize to md+
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, []);

  // Lock body scroll when side drawer is open (mobile)
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden flex flex-col">
      <BackgroundFX className="z-0" />
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 bg-slate-900/90 border-b border-slate-800/80 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden h-10 w-10 grid place-items-center rounded-lg border border-slate-800/70 bg-slate-900/60 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:shadow-[0_0_18px_2px_rgba(34,211,238,0.10)] transition-all"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
            <Logo />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3 group">
            <LinkItem to="/dashboard" label="Inicio" />
            <LinkItem to="/dashboard/cars" label="Autos" />
            {role === 'admin' && <LinkItem to="/dashboard/rentals" label="Alquileres" />}
          </nav>

          {/* Right actions (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <NotificationsBell />
            <span className="hidden lg:inline text-sm text-slate-300/90">{user?.username} • {role}</span>
            <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/profile')}>Perfil</Button>
            <Button variant="danger" size="sm" onClick={onLogout}>Salir</Button>
          </div>

          {/* Right minimal (mobile): bell + profile icon as button */}
          <div className="md:hidden flex items-center gap-2">
            <NotificationsBell />
            <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/profile')}>Perfil</Button>
          </div>
        </div>

        {/* Mobile side drawer menu */}
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                key="drawer-backdrop"
                className="fixed inset-0 z-40 md:hidden bg-slate-950/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />

              {/* Drawer */}
              <motion.aside
                key="drawer"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.7 }}
                className="fixed top-0 left-0 bottom-0 z-50 md:hidden w-[84vw] max-w-[320px] border-r border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-2xl"
              >
                {/* Drawer header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <Logo className="h-7 w-7" />
                  </div>
                  <button
                    className="h-10 w-10 grid place-items-center rounded-lg border border-slate-800/70 bg-slate-900/60 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:shadow-[0_0_18px_2px_rgba(34,211,238,0.10)] transition-all"
                    aria-label="Cerrar menú"
                    onClick={() => setOpen(false)}
                  >
                    <CloseIcon />
                  </button>
                </div>

                {/* Drawer content */}
                <nav className="px-2 py-2">
                  <ul className="space-y-1">
                    <li>
                      <NavLink to="/dashboard" onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive? 'text-white bg-slate-800/60 border border-slate-700/70':'text-slate-300 hover:text-white hover:bg-slate-800/40'}`}>
                        <span>Inicio</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/dashboard/cars" onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive? 'text-white bg-slate-800/60 border border-slate-700/70':'text-slate-300 hover:text-white hover:bg-slate-800/40'}`}>
                        <span>Autos</span>
                      </NavLink>
                    </li>
                    {role === 'admin' && (
                      <li>
                        <NavLink to="/dashboard/rentals" onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive? 'text-white bg-slate-800/60 border border-slate-700/70':'text-slate-300 hover:text-white hover:bg-slate-800/40'}`}>
                          <span>Alquileres</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>

                  <div className="my-3 h-px w-full bg-slate-800/80" />

                  <div className="grid grid-cols-2 gap-2 px-1">
                    <Button variant="secondary" size="sm" onClick={() => { setOpen(false); navigate('/dashboard/profile'); }}>Perfil</Button>
                    <Button variant="danger" size="sm" onClick={() => { setOpen(false); onLogout(); }}>Salir</Button>
                  </div>
                </nav>

                {/* Decorative bottom accents */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32">
                  <div className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl" />
                  <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-violet-600/20 blur-2xl" />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </header>

      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="relative z-10 max-w-7xl mx-auto p-4 flex-1 w-full">
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
