import { motion } from 'framer-motion';
import BackgroundFX from '../components/BackgroundFX';

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex overflow-hidden">
      <BackgroundFX className="z-0" />
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <div className="inline-flex items-center gap-3">
            <h1 className="mt-2 text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
              ALQUILERES PELADO
            </h1>
          </div>
          <p className="mt-3 text-slate-300 max-w-md mx-auto">Dashboard para gestión de alquileres de autos.</p>
        </motion.div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6 shadow-2xl">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
