import React from 'react';
import { Participant } from '../types/planner';
import { getParticipantLocalTime } from '../utils/timezoneUtils';
import { Clock } from 'lucide-react';
import { DayPhaseIcon } from './DayPhaseIcon';

interface SelectedMeetingTimeProps {
  selectedTimeUtc: string; // e.g. "15:00"
  selectedDate: string;
  participants: Participant[];
  onSelectTimeUtc: (newTime: string) => void;
}

export const SelectedMeetingTime: React.FC<SelectedMeetingTimeProps> = ({
  selectedTimeUtc,
  selectedDate,
  participants,
  onSelectTimeUtc,
}) => {
  return (
    <div className="w-full bg-[#111111] text-[#ffffff] p-8 md:p-10 mb-10 border border-[#111111] shadow-xl">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#ffffff]/15 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-satoshi font-bold tracking-[0.2em] text-[#bfbfbf] uppercase mb-2 [word-spacing:0.2em]">
            <Clock className="w-4 h-4 text-[#ffffff]" />
            <span>SELECTED MEETING TIME</span>
          </div>
          
          <div className="flex items-baseline gap-4 flex-wrap">
            <h2 className="font-clash font-bold text-4xl sm:text-5xl md:text-6xl text-[#ffffff] tracking-wide">
              {selectedTimeUtc} UTC
            </h2>

            {/* Time Adjuster Input */}
            <div className="flex items-center gap-2 bg-[#1e1e1e] border border-[#ffffff]/20 px-3 py-1.5 rounded-none">
              <span className="text-[10px] font-satoshi font-bold text-[#b6b5b5] uppercase">CHANGE TIME:</span>
              <input
                type="time"
                value={selectedTimeUtc}
                onChange={(e) => onSelectTimeUtc(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-[#ffffff] focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="text-left md:text-right">
          <div className="text-xs font-satoshi text-[#b6b5b5] uppercase tracking-widest">
            REFERENCE DATE
          </div>
          <div className="font-clash font-bold text-xl text-[#ffffff] mt-0.5">
            {selectedDate}
          </div>
        </div>
      </div>

      {/* Grid Displaying Converted Local Times for Every Participant */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {participants.map((p) => {
          const local = getParticipantLocalTime(selectedDate, selectedTimeUtc, p);

          return (
            <div
              key={p.id}
              className="bg-[#1e1e1e] border border-[#ffffff]/10 p-5 flex flex-col justify-between hover:border-[#ffffff]/40 transition-colors"
            >
              <div>
                {/* Participant Name & Flag */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-satoshi font-bold tracking-[0.15em] text-[#b6b5b5] uppercase">
                    {p.name}
                  </span>
                  <span className="text-sm">{p.flag || '🌐'}</span>
                </div>

                {/* Country / City Heading */}
                <h3 className="font-clash font-bold text-lg text-[#ffffff] uppercase tracking-wide truncate">
                  {p.countryName || p.cityName}
                </h3>
                <div className="text-[11px] font-satoshi text-[#838282] truncate">
                  {p.cityName} · {local.offsetStr}
                </div>
              </div>

              {/* Converted Local Time & Solar Phase Icon (Sun, Sunset, Moon) */}
              <div className="mt-6 pt-4 border-t border-[#ffffff]/10">
                <div className="flex items-center justify-between">
                  <div className="font-clash font-bold text-3xl text-[#ffffff] tracking-tight leading-none">
                    {local.formattedTime12}
                  </div>
                  {/* Solar Phase Icon (☀️ Daytime, 🌅 Evening, 🌙 Night) */}
                  <DayPhaseIcon time24Str={local.formattedTime24} size={22} showLabel={false} />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-satoshi">
                  <span className="text-[#838282]">{local.formattedDate}</span>

                  {local.dateStatus !== 'SAME DAY' ? (
                    <span className="font-satoshi font-bold tracking-widest text-[10px] px-2 py-0.5 bg-[#ffffff] text-[#111111] uppercase">
                      {local.dateStatus}
                    </span>
                  ) : (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 ${local.isWithinWorkHours ? 'text-[#bfbfbf]' : 'text-red-400'}`}>
                      {local.isWithinWorkHours ? 'WORKING HOURS' : 'OUTSIDE HOURS'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
