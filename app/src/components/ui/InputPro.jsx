import { useState, forwardRef } from 'react';
import clsx from 'clsx';

const baseField = 'h-11 w-full rounded-xl bg-slate-900/60 border border-slate-800/80 px-4 text-slate-100 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-500/30 shadow-[inset_0_0_0_0_rgba(0,0,0,0)] focus:shadow-[0_0_22px_3px_rgba(34,211,238,0.10)]';

const InputPro = forwardRef(function InputPro({ label, error, leftIcon, rightIcon, type = 'text', className, inputClassName, ...props }, ref) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const t = isPassword && show ? 'text' : type;

  return (
    <label className={clsx('block text-slate-200', className)}>
      {label && <span className="mb-1 block text-sm text-slate-300">{label}</span>}
      <div className={clsx('relative')}
      >
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input ref={ref} type={t}
          className={clsx(baseField, leftIcon && 'pl-10', (isPassword || rightIcon) && 'pr-10', inputClassName)}
          {...props}
        />
        {isPassword ? (
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
            {show ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3l18 18"/><path d="M10.73 5.08A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a17.7 17.7 0 0 1-3.37 4.65"/><path d="M6.61 6.61C4.06 8.26 2 12 2 12s3 7 10 7c1.64 0 3.16-.36 4.5-.98"/><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        ) : rightIcon ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </span>
        ) : null}
      </div>
      {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
    </label>
  );
});

export default InputPro;
