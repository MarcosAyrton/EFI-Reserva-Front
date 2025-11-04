import { memo } from 'react';
import { motion } from 'framer-motion';

function BackgroundFX({ variant = 'orbits', className = '' }) {
  if (variant === 'orbits') {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
        {/* Gradient blobs */}
        <div className="absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-[24rem] w-[24rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute top-1/3 -left-10 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl" />
        {/* Animated orbital paths */}
        <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ duration: 1.2 }}
          className="absolute -top-10 left-0 w-[120%] h-[140%]" viewBox="0 0 1200 1000" fill="none">
          <defs>
            <linearGradient id="fx-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {[80, 140, 220, 320, 440].map((r, i) => (
            <motion.path
              key={r}
              d={`M 100 ${200 + i * 90} C 400 ${r}, 800 ${600 - r}, 1100 ${200 + i * 90}`}
              stroke="url(#fx-g)"
              strokeWidth={0.8}
              strokeOpacity={0.35}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5 + i * 0.6, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
            />
          ))}
        </motion.svg>
      </div>
    );
  }
  // Fallback minimal blobs
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
    </div>
  );
}

export default memo(BackgroundFX);
