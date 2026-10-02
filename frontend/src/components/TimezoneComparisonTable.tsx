import React from 'react';
import { Participant } from '../types/planner';
import { getParticipantLocalTime } from '../utils/timezoneUtils';
import { DayPhaseIcon } from './DayPhaseIcon';

interface TimezoneComparisonTableProps {
  participants: Participant[];
  selectedDate: string;
  selectedTimeUtc: string;
}

export const TimezoneComparisonTable: React.FC<TimezoneComparisonTableProps> = ({
  participants,
  selectedDate,
  selectedTimeUtc,
}) => {
  return (
    <div className="w-full bg-[#ffffff] border border-[#1e1e1e]/15 mb-10 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[#1e1e1e]/10 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-[#f2f2f2]/50">
        <div>
          <h4 className="font-clash font-bold text-lg text-[#111111] uppercase tracking-wide [word-spacing:0.2em]">
            LOCAL TIME COMPARISON MATRIX
          </h4>
          <p className="text-xs font-satoshi text-[#838282]">
            Instant local time calculation for every participant at {selectedTimeUtc} UTC
          </p>
        </div>
        <div className="text-xs font-mono font-semibold px-3 py-1 bg-[#111111] text-[#ffffff] self-start md:self-auto">
          REFERENCE DATE: {selectedDate}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1e1e1e]/15 bg-[#f2f2f2] text-[11px] font-satoshi font-bold tracking-[0.15em] text-[#838282] uppercase">
              <th className="py-3 px-6">Participant</th>
              <th className="py-3 px-6">Location</th>
              <th className="py-3 px-6">Time Zone</th>
              <th className="py-3 px-6">Work Hours</th>
              <th className="py-3 px-6 text-right">Local Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]/10 text-xs font-satoshi">
            {participants.map((p) => {
              const local = getParticipantLocalTime(selectedDate, selectedTimeUtc, p);

              return (
                <tr key={p.id} className="hover:bg-[#f2f2f2]/60 transition-colors">
                  {/* Name */}
                  <td className="py-4 px-6 font-clash font-bold text-sm text-[#111111] uppercase">
                    {p.name}
                  </td>

                  {/* Location */}
                  <td className="py-4 px-6 font-medium text-[#111111]">
                    <div className="flex items-center gap-1.5">
                      <span>{p.flag || '📍'}</span>
                      <span className={p.cityName ? 'text-[#111111]' : 'text-[#838282] italic'}>
                        {p.cityName ? `${p.cityName}, ${p.countryName}` : 'Select Location'}
                      </span>
                    </div>
                  </td>

                  {/* Time Zone & Offset */}
                  <td className="py-4 px-6 font-mono text-[#838282]">
                    <span>{p.timezone || 'Not Selected'}</span>
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-[#f2f2f2] border border-[#1e1e1e]/10 text-[#111111]">
                      {p.cityName ? local.offsetStr : 'SELECT CITY'}
                    </span>
                  </td>

                  {/* Work Hours */}
                  <td className="py-4 px-6 font-mono text-[#838282]">
                    {p.workStart} — {p.workEnd}
                  </td>

                  {/* Local Time */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      <DayPhaseIcon time24Str={local.formattedTime24} size={15} />
                      <span className="font-clash font-bold text-base text-[#111111]">
                        {local.formattedTime12}
                      </span>

                      {local.dateStatus !== 'SAME DAY' ? (
                        <span className="text-[10px] font-satoshi font-bold tracking-wider px-2 py-0.5 bg-[#111111] text-[#ffffff] uppercase">
                          {local.dateStatus}
                        </span>
                      ) : (
                        <span className={`w-2 h-2 rounded-full ${local.isWithinWorkHours ? 'bg-black' : 'bg-gray-300'}`} title={local.isWithinWorkHours ? 'Within Working Hours' : 'Outside Working Hours'} />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
