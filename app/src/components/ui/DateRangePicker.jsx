import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useMemo } from 'react';

export default function DateRangePicker({ start, end, onChange }) {
  const selected = useMemo(() => ({ from: start, to: end }), [start, end]);
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  return (
    <div className="relative rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 overflow-hidden">
      {/* Vertical month separator (only on md+ screens) */}
      <div className="pointer-events-none absolute top-3 bottom-3 left-1/2 -translate-x-1/2 w-px bg-slate-700/60 rounded-full hidden md:block" />
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={(range) => onChange?.(range || { from: undefined, to: undefined })}
        numberOfMonths={2}
        fromDate={today}
        disabled={{ before: today }}
        styles={{
          caption: { color: '#e2e8f0' },
          head_cell: { color: '#94a3b8' },
          day: { color: '#cbd5e1' },
        }}
        classNames={{
          months: 'flex gap-3',
          month: 'bg-transparent',
          caption: 'pb-2',
          table: 'text-sm',
          head_cell: 'text-slate-400',
          day: 'rounded-md hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/40',
          day_selected: 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500',
          range_start: 'bg-cyan-600 text-white',
          range_end: 'bg-blue-600 text-white',
          day_today: 'border border-cyan-400/40',
          nav_button: 'text-slate-300 hover:text-white',
        }}
      />
    </div>
  );
}
