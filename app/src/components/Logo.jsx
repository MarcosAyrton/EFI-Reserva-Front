export default function Logo({ className = 'h-8 w-8' }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#0ea5e9"/>
          </linearGradient>
        </defs>
        <rect x="4" y="20" width="56" height="24" rx="6" stroke="url(#g)" strokeWidth="4"/>
        <circle cx="18" cy="44" r="6" fill="#0ea5e9"/>
        <circle cx="46" cy="44" r="6" fill="#3b82f6"/>
        <path d="M12 28h40" stroke="url(#g)" strokeWidth="4" strokeLinecap="round"/>
      </svg>
      <span className="text-lg font-bold tracking-tight text-slate-100">ALQUILERES PELADO</span>
    </div>
  );
}
