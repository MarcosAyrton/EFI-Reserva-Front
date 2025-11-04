import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-8">
      {/* Background accents (subtle) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      {/* Full-width bar like navbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/80 border-t border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between">
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-8" />
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300/90">
              <a className="hover:text-white transition-colors" href="#" onClick={(e)=>e.preventDefault()}>Acerca</a>
              <span className="opacity-30">•</span>
              <a className="hover:text-white transition-colors" href="#" onClick={(e)=>e.preventDefault()}>Términos</a>
              <span className="opacity-30">•</span>
              <a className="hover:text-white transition-colors" href="#" onClick={(e)=>e.preventDefault()}>Privacidad</a>
              <span className="opacity-30">•</span>
              <a className="hover:text-white transition-colors" href="#" onClick={(e)=>e.preventDefault()}>Contacto</a>
            </nav>
            <div className="flex items-center gap-3">
              <a aria-label="GitHub" href="#" onClick={(e)=>e.preventDefault()} className="p-2 rounded-lg border border-slate-800/70 bg-slate-900/50 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:shadow-[0_0_20px_2px_rgba(34,211,238,0.10)] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.112-4.555-4.944 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.841-2.338 4.688-4.566 4.937.359.31.678.921.678 1.856 0 1.339-.012 2.419-.012 2.749 0 .268.18.58.688.482C19.138 20.194 22 16.44 22 12.017 22 6.484 17.523 2 12 2Z" clipRule="evenodd"/></svg>
              </a>
              <a aria-label="LinkedIn" href="#" onClick={(e)=>e.preventDefault()} className="p-2 rounded-lg border border-slate-800/70 bg-slate-900/50 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:shadow-[0_0_20px_2px_rgba(34,211,238,0.10)] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.24 8.16h4.52V24H.24V8.16zM8.09 8.16h4.33v2.15h.06c.6-1.13 2.06-2.33 4.24-2.33 4.53 0 5.37 2.98 5.37 6.85V24h-4.52v-7.29c0-1.74-.03-3.98-2.42-3.98-2.42 0-2.79 1.89-2.79 3.85V24H8.09V8.16z"/></svg>
              </a>
            </div>
          </div>

          {/* Rights only */}
          <div className="mt-2 text-xs text-slate-400 text-center md:text-right">
            © {year} ALQUILERES PELADO. Todos los derechos reservados.
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
