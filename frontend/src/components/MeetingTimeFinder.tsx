import React from 'react';
import { Participant } from '../types/planner';
import { calculateOverlappingWorkingHours } from '../utils/timezoneUtils';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface MeetingTimeFinderProps {
  participants: Participant[];
  selectedDate: string;
  selectedTimeUtc: string;
  onSelectTimeUtc: (utcTimeStr: string) => void;
}

export const MeetingTimeFinder: React.FC<MeetingTimeFinderProps> = ({
  participants,
  selectedDate,
  selectedTimeUtc,
  onSelectTimeUtc,
}) => {
  const overlapWindows = calculateOverlappingWorkingHours(selectedDate, participants);
  const hasOverlap = overlapWindows.length > 0;

  // Calculate total available overlap hours across all windows
  const totalOverlapHours = overlapWindows.reduce((acc, w) => acc + w.durationHours, 0);

  return (
    <div className="w-full bg-[#ffffff] border border-[#1e1e1e]/15 p-6 mb-10 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e1e1e]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase mb-1 [word-spacing:0.2em]">
            <Clock className="w-4 h-4 text-[#111111]" />
            <span>CALCULATED OVERLAP WINDOWS</span>
          </div>
          <h3 className="font-clash font-bold text-2xl text-[#111111] uppercase tracking-wide [word-spacing:0.25em]">
            {hasOverlap ? 'COMMON WORKING WINDOWS IDENTIFIED' : 'NO COMMON WORKING WINDOW'}
          </h3>
        </div>

        {hasOverlap ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] text-[#ffffff] font-clash font-bold text-sm tracking-wider uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>{totalOverlapHours} {totalOverlapHours === 1 ? 'HOUR' : 'HOURS'} AVAILABLE</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f2f2f2] border border-[#1e1e1e]/20 text-[#838282] font-satoshi font-bold text-xs tracking-wider uppercase">
            <AlertTriangle className="w-4 h-4 text-[#838282]" />
            <span>0 HOURS OVERLAP</span>
          </div>
        )}
      </div>

      <div className="mt-6">
        {hasOverlap ? (
          <div>
            <p className="text-xs font-satoshi text-[#838282] mb-4">
              Click any calculated window below to set the meeting reference time:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {overlapWindows.map((win, idx) => {
                const isSelected = selectedTimeUtc === win.startUtc;

                return (
                  <button
                    key={idx}
                    onClick={() => onSelectTimeUtc(win.startUtc)}
                    className={`p-5 text-left border transition-all duration-200 group relative ${
                      isSelected
                        ? 'border-[#111111] bg-[#111111] text-[#ffffff] shadow-md'
                        : 'border-[#1e1e1e]/20 bg-[#f2f2f2] text-[#111111] hover:border-[#111111] hover:bg-[#ffffff]'
                    }`}
                  >
                    <div className="text-[10px] font-satoshi font-bold tracking-[0.18em] uppercase opacity-75 mb-1">
                      COMMON WINDOW #{idx + 1}
                    </div>

                    <div className="font-clash font-bold text-xl tracking-tight mb-2">
                      {win.labelUtc}
                    </div>

                    <div className="flex items-center justify-between text-xs font-satoshi opacity-90 border-t border-current/20 pt-2 mt-2">
                      <span>{win.durationHours} Hours Available</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#f2f2f2] border border-[#1e1e1e]/10 p-6 text-center">
            <h4 className="font-clash font-bold text-lg text-[#111111] uppercase tracking-tight mb-2">
              NO OVERLAPPING WORKING HOURS ON THIS DATE
            </h4>
            <p className="max-w-xl mx-auto text-xs font-satoshi text-[#838282] leading-relaxed">
              The selected participants’ preferred working hours do not overlap across their local time zones on {selectedDate}.
              Consider expanding working hours (e.g. earlier start or later end times) or choosing a different meeting date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
