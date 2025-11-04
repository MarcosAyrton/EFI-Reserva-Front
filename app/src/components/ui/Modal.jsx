import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function Modal({ open, onClose, children, className, panelClassName, disableBackdropClose, ariaLabel = 'Modal' }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (!disableBackdropClose) onClose?.(); }}
          />

          {/* Decorative SVG orbits */}
          <svg className="pointer-events-none absolute w-[120vmax] h-[120vmax] opacity-[0.06]" viewBox="0 0 800 800" fill="none">
            <defs>
              <linearGradient id="m-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3ee"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
            <circle cx="400" cy="400" r="230" stroke="url(#m-grad)" strokeWidth="1" />
            <circle cx="400" cy="400" r="320" stroke="url(#m-grad)" strokeWidth="1" />
            <circle cx="400" cy="400" r="410" stroke="url(#m-grad)" strokeWidth="1" />
          </svg>

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-label={ariaLabel}
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.6 }}
            className={clsx('relative w-[92%] sm:w-[88%] md:w-auto max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/75 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6),0_0_40px_4px_rgba(34,211,238,0.08)]', className)}
          >
            <div className={clsx('p-5 md:p-6 overflow-y-auto max-h-[82vh] pr-1', panelClassName)}>
              {children}
            </div>

            <button aria-label="Cerrar"
              onClick={onClose}
              className="absolute top-2 right-2 h-10 w-10 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white hover:border-cyan-500/50 shadow-[0_0_20px_2px_rgba(34,211,238,0.10)] focus:outline-none focus:ring-2 focus:ring-cyan-500/40">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
