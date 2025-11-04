import clsx from 'clsx';

export default function Badge({ children, color = 'blue', className }) {
  const palette = {
    blue: 'bg-blue-600/30 text-blue-100 border-blue-400 shadow-[0_0_16px_0_rgba(37,99,235,0.45)]',
    cyan: 'bg-cyan-600/30 text-cyan-100 border-cyan-400 shadow-[0_0_16px_0_rgba(8,145,178,0.45)]',
    amber: 'bg-amber-600/30 text-amber-100 border-amber-400 shadow-[0_0_16px_0_rgba(245,158,11,0.45)]',
    emerald: 'bg-emerald-600/30 text-emerald-100 border-emerald-400 shadow-[0_0_16px_0_rgba(16,185,129,0.45)]',
    rose: 'bg-rose-600/30 text-rose-100 border-rose-400 shadow-[0_0_16px_0_rgba(244,63,94,0.45)]',
    violet: 'bg-violet-600/30 text-violet-100 border-violet-400 shadow-[0_0_16px_0_rgba(139,92,246,0.45)]',
  }[color] || '';
  return (
    <span className={clsx('inline-flex items-center text-sm px-3 py-1.5 rounded-xl border-2 backdrop-blur-md font-semibold ring-1 ring-white/5', palette, className)}>
      {children}
    </span>
  );
}
