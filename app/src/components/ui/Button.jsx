import clsx from 'clsx';

export default function Button({ as: Tag = 'button', variant = 'primary', size = 'md', className, loading, disabled, children, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed';
  const neon = 'shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_20px_2px_rgba(59,130,246,0.35)] active:scale-[0.98]';
  const variants = {
    primary: 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 focus:ring-2 focus:ring-cyan-500/60 focus:ring-offset-0',
    secondary: 'bg-slate-800/70 text-slate-100 hover:bg-slate-700/80 border border-slate-700 focus:ring-2 focus:ring-slate-500/50',
    ghost: 'bg-transparent text-slate-100 hover:bg-slate-800/50 focus:ring-2 focus:ring-slate-700/60',
    danger: 'bg-gradient-to-br from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 focus:ring-2 focus:ring-rose-500/60',
  };
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };
  return (
    <Tag
      className={clsx(base, neon, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
      {children}
    </Tag>
  );
}
