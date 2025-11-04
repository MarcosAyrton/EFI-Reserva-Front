import clsx from 'clsx';

export default function Input({ label, error, className, ...props }) {
  return (
    <label className={clsx('flex flex-col gap-1 text-slate-200', className)}>
      {label && <span className="text-sm text-slate-300">{label}</span>}
      <input
        className={clsx(
          'h-11 rounded-lg bg-slate-900/60 border border-slate-700/70 px-3 text-slate-100 placeholder:text-slate-400 outline-none transition-all duration-200',
          'focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-500/30 hover:border-slate-600',
          'shadow-[inset_0_0_0_0_rgba(0,0,0,0)] focus:shadow-[0_0_16px_2px_rgba(34,211,238,0.15)]'
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </label>
  );
}
