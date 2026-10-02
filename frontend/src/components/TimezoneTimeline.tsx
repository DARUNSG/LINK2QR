import React from 'react';
import { Participant } from '../types/planner';
import { generateTimelineGrid } from '../utils/timezoneUtils';

interface TimezoneTimelineProps {
  participants: Participant[];
  selectedDate: string;
  selectedTimeUtc: string;
  onSelectTimeUtc: (utcTimeStr: string) => void;
}

export const TimezoneTimeline: React.FC<TimezoneTimelineProps> = ({
  participants,
  selectedDate,
  selectedTimeUtc,
  onSelectTimeUtc,
}) => {
  const timelineSlots = generateTimelineGrid(selectedDate, participants);

  // We display 24 hourly columns (or 48 half-hour slots). 24 primary columns with half-hour subdivisions works beautifully!
  const hoursAxis = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full bg-[#ffffff] border border-[#1e1e1e]/15 p-6 mb-10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1e1e1e]/10">
        <div>
          <h4 className="font-clash font-bold text-xl text-[#111111] uppercase tracking-wide">
            24-HOUR OVERLAP TIMELINE
          </h4>
          <p className="text-xs font-satoshi text-[#838282] mt-0.5 flex items-center gap-1">
            <span>💡 <strong>Beginner Tip:</strong> The black bars show when <em>everyone</em> is awake and working. Click any box to pick that meeting time!</span>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-satoshi text-[#111111]">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-[#111111] border border-[#111111]" />
            <span className="font-bold">SHARED OVERLAP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-[#b6b5b5]" />
            <span>Working Hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-[#f2f2f2] border border-[#1e1e1e]/20" />
            <span className="text-[#838282]">Off Hours</span>
          </div>
        </div>
      </div>

      {/* Horizontally Scrollable Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[800px]">
          
          {/* Header Row: UTC Hours Axis */}
          <div className="grid grid-cols-[180px_1fr] border-b border-[#1e1e1e]/20 mb-2">
            <div className="text-xs font-satoshi font-bold tracking-wider text-[#838282] uppercase py-2">
              UTC TIME →
            </div>
            <div className="grid grid-cols-24 divide-x divide-[#1e1e1e]/10 text-center">
              {hoursAxis.map((h) => {
                const timeStr = `${String(h).padStart(2, '0')}:00`;
                const isSelected = selectedTimeUtc.startsWith(String(h).padStart(2, '0'));

                return (
                  <button
                    key={h}
                    onClick={() => onSelectTimeUtc(timeStr)}
                    className={`py-1.5 text-[10px] font-mono font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#111111] text-[#ffffff]'
                        : 'text-[#838282] hover:bg-[#111111]/10 hover:text-[#111111]'
                    }`}
                    title={`Select ${timeStr} UTC`}
                  >
                    {String(h).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rows for Each Participant */}
          <div className="space-y-3 py-2">
            {participants.map((p) => {
              return (
                <div key={p.id} className="grid grid-cols-[180px_1fr] items-center">
                  {/* Left Label */}
                  <div className="pr-4 overflow-hidden">
                    <div className="font-clash font-bold text-xs uppercase text-[#111111] truncate">
                      {p.name}
                    </div>
                    <div className="text-[10px] font-satoshi text-[#838282] truncate">
                      {p.cityName} ({p.workStart}–{p.workEnd})
                    </div>
                  </div>

                  {/* Right Timeline Bar for Participant */}
                  <div className="grid grid-cols-48 h-8 border border-[#1e1e1e]/15 bg-[#f2f2f2]">
                    {timelineSlots.map((slot, idx) => {
                      const detail = slot.participantDetails.find((d) => d.participantId === p.id);
                      const isWorking = detail?.isWorking ?? false;
                      const isAllOverlap = slot.isAllOverlap;
                      const isSelectedSlot = slot.timeUtcStr24 === selectedTimeUtc;

                      let bgClass = 'bg-[#f2f2f2]'; // Off hours
                      if (isAllOverlap) {
                        bgClass = 'bg-[#111111]'; // Full team overlap!
                      } else if (isWorking) {
                        bgClass = 'bg-[#b6b5b5]'; // Participant working
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => onSelectTimeUtc(slot.timeUtcStr24)}
                          className={`h-full transition-opacity border-r border-[#1e1e1e]/5 relative ${bgClass} hover:opacity-80 ${
                            isSelectedSlot ? 'ring-2 ring-[#111111] z-10' : ''
                          }`}
                          title={`${p.name}: ${detail?.localTimeStr} (${slot.timeUtcStr24} UTC)`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* COMMON OVERLAP SUMMARY ROW */}
          <div className="grid grid-cols-[180px_1fr] items-center pt-4 border-t border-[#1e1e1e]/20 mt-3">
            <div className="font-clash font-bold text-xs uppercase tracking-wider text-[#111111]">
              COMMON OVERLAP
            </div>

            <div className="grid grid-cols-48 h-9 border border-[#111111] bg-[#f2f2f2]">
              {timelineSlots.map((slot, idx) => {
                const isAllOverlap = slot.isAllOverlap;
                const isSelectedSlot = slot.timeUtcStr24 === selectedTimeUtc;

                return (
                  <button
                    key={idx}
                    onClick={() => onSelectTimeUtc(slot.timeUtcStr24)}
                    className={`h-full flex items-center justify-center transition-all ${
                      isAllOverlap
                        ? 'bg-[#111111] text-[#ffffff] font-bold'
                        : 'bg-[#e5e5e5] text-transparent hover:bg-[#c9c9c9]'
                    } ${isSelectedSlot ? 'ring-2 ring-offset-1 ring-[#111111] z-10' : ''}`}
                    title={
                      isAllOverlap
                        ? `Shared Overlap Available at ${slot.timeUtcStr24} UTC`
                        : `No complete overlap at ${slot.timeUtcStr24} UTC`
                    }
                  >
                    {isAllOverlap && idx % 2 === 0 && (
                      <span className="text-[9px] font-mono">█</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
