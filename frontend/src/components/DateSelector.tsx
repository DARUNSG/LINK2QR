import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateTime } from 'luxon';

interface DateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onChangeDate: (newDate: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onChangeDate }) => {
  const todayIso = DateTime.now().toISODate() || '2026-10-15';
  const tomorrowIso = DateTime.now().plus({ days: 1 }).toISODate() || '2026-10-16';
  const nextWeekIso = DateTime.now().plus({ days: 7 }).toISODate() || '2026-10-22';

  // Format nice display string for selected date
  const dt = DateTime.fromISO(selectedDate);
  const displayFormatted = dt.isValid ? dt.toFormat('EEEE, d MMMM yyyy') : selectedDate;

  return (
    <div className="w-full bg-[#ffffff] p-6 border border-[#1e1e1e]/15 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div>
          <div className="flex items-center gap-2 text-xs font-satoshi font-bold tracking-[0.2em] uppercase text-[#838282] mb-1">
            <CalendarIcon className="w-4 h-4 text-[#111111]" />
            <span>MEETING DATE</span>
          </div>
          <h3 className="font-clash font-bold text-2xl text-[#111111] tracking-tight">
            {displayFormatted}
          </h3>
          <p className="text-xs font-satoshi text-[#838282] mt-1">
            All Daylight Saving Rules (DST) & local offset math adjust automatically for this date.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Presets */}
          <button
            onClick={() => onChangeDate(todayIso)}
            className={`px-3 py-1.5 text-xs font-satoshi font-bold tracking-wider uppercase border transition-all ${
              selectedDate === todayIso
                ? 'bg-[#111111] text-[#ffffff] border-[#111111]'
                : 'bg-transparent text-[#111111] border-[#1e1e1e]/20 hover:border-[#111111]'
            }`}
          >
            TODAY
          </button>
          <button
            onClick={() => onChangeDate(tomorrowIso)}
            className={`px-3 py-1.5 text-xs font-satoshi font-bold tracking-wider uppercase border transition-all ${
              selectedDate === tomorrowIso
                ? 'bg-[#111111] text-[#ffffff] border-[#111111]'
                : 'bg-transparent text-[#111111] border-[#1e1e1e]/20 hover:border-[#111111]'
            }`}
          >
            TOMORROW
          </button>
          <button
            onClick={() => onChangeDate(nextWeekIso)}
            className={`px-3 py-1.5 text-xs font-satoshi font-bold tracking-wider uppercase border transition-all ${
              selectedDate === nextWeekIso
                ? 'bg-[#111111] text-[#ffffff] border-[#111111]'
                : 'bg-transparent text-[#111111] border-[#1e1e1e]/20 hover:border-[#111111]'
            }`}
          >
            NEXT WEEK
          </button>

          {/* Date Picker Input */}
          <div className="relative inline-block">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  onChangeDate(e.target.value);
                }
              }}
              className="bg-[#f2f2f2] border border-[#1e1e1e]/30 px-3 py-1.5 text-xs font-satoshi font-bold text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
