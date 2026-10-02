import React from 'react';
import { Participant } from '../types/planner';
import { TimezoneSelector } from './TimezoneSelector';
import { CityItem } from '../data/cities';
import { Trash2, AlertCircle, Clock, X } from 'lucide-react';
import { getParticipantLocalTime } from '../utils/timezoneUtils';
import { DayPhaseIcon } from './DayPhaseIcon';

interface ParticipantCardProps {
  participant: Participant;
  selectedDate: string;
  selectedTimeUtc: string;
  canRemove: boolean;
  onUpdate: (updated: Participant) => void;
  onRemove: (id: string) => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  selectedDate,
  selectedTimeUtc,
  canRemove,
  onUpdate,
  onRemove,
}) => {
  // Compute real-time local time preview
  const localInfo = getParticipantLocalTime(selectedDate, selectedTimeUtc, participant);

  // Validate working hours: end time must be after start time
  const [startH, startM] = participant.workStart.split(':').map(Number);
  const [endH, endM] = participant.workEnd.split(':').map(Number);
  const startMinutes = (startH || 0) * 60 + (startM || 0);
  const endMinutes = (endH || 0) * 60 + (endM || 0);
  const isWorkHoursValid = endMinutes > startMinutes;

  const handleCitySelect = (city: CityItem) => {
    onUpdate({
      ...participant,
      cityName: city.city,
      countryName: city.country,
      timezone: city.timezone,
      flag: city.flag,
    });
  };

  return (
    <div className="bg-[#ffffff] border border-[#1e1e1e]/15 p-6 flex flex-col justify-between transition-all hover:border-[#111111] hover:shadow-md relative group">
      
      {/* Small Delete Option at Top Right Corner */}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(participant.id)}
          className="absolute top-2.5 right-2.5 p-1.5 text-[#838282] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all rounded"
          title="Delete Participant"
          aria-label="Delete participant"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Top Header: Name Input */}
      <div>
        <div className="flex items-center justify-between mb-4 pr-5">
          <input
            type="text"
            value={participant.name}
            onChange={(e) => onUpdate({ ...participant, name: e.target.value.toUpperCase() })}
            placeholder="PARTICIPANT NAME"
            className="font-clash font-bold text-xl uppercase tracking-tight text-[#111111] bg-transparent border-b border-transparent hover:border-[#1e1e1e]/30 focus:border-[#111111] focus:outline-none w-full py-0.5"
          />
        </div>

        {/* Location & Timezone Selector */}
        <div className="mb-4">
          <label className="block text-[10px] font-satoshi font-bold tracking-[0.15em] text-[#838282] uppercase mb-1">
            LOCATION & TIME ZONE
          </label>
          <TimezoneSelector
            currentCityName={participant.cityName}
            currentCountryName={participant.countryName}
            currentTimezone={participant.timezone}
            onSelect={handleCitySelect}
          />
        </div>

        {/* Location Summary Line */}
        <div className="flex items-center justify-between text-xs font-satoshi py-2 px-3 bg-[#f2f2f2] border border-[#1e1e1e]/10 mb-4">
          <div className="flex items-center gap-2 font-medium text-[#111111]">
            <span>{participant.flag || '📍'}</span>
            <span className={participant.cityName ? 'text-[#111111] font-medium' : 'text-[#838282] italic'}>
              {participant.cityName ? `${participant.countryName} · ${participant.cityName}` : 'Location Not Selected'}
            </span>
          </div>
          <span className="font-mono text-[10px] font-semibold text-[#838282]">
            {participant.cityName ? localInfo.offsetStr : 'SELECT CITY'}
          </span>
        </div>

        {/* Working Hours Input */}
        <div className="mb-4">
          <label className="block text-[10px] font-satoshi font-bold tracking-[0.15em] text-[#838282] uppercase mb-1">
            PREFERRED WORKING HOURS (LOCAL)
          </label>

          <div className="flex items-center gap-2">
            {/* Start Time */}
            <input
              type="time"
              value={participant.workStart}
              onChange={(e) => onUpdate({ ...participant, workStart: e.target.value })}
              className="w-full bg-[#f2f2f2] border border-[#1e1e1e]/20 px-3 py-2 text-xs font-satoshi font-bold text-[#111111] focus:border-[#111111] focus:outline-none"
            />
            <span className="text-xs font-bold text-[#838282]">—</span>
            {/* End Time */}
            <input
              type="time"
              value={participant.workEnd}
              onChange={(e) => onUpdate({ ...participant, workEnd: e.target.value })}
              className={`w-full bg-[#f2f2f2] border px-3 py-2 text-xs font-satoshi font-bold text-[#111111] focus:outline-none ${
                isWorkHoursValid ? 'border-[#1e1e1e]/20 focus:border-[#111111]' : 'border-red-500 text-red-600'
              }`}
            />
          </div>

          {!isWorkHoursValid && (
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-satoshi font-semibold text-red-600">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Ending time must be after starting time.</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Real-time Converted Local Time Badge */}
      <div className="pt-3 border-t border-[#1e1e1e]/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#838282] font-satoshi">
          <Clock className="w-3.5 h-3.5" />
          <span>Local Time:</span>
        </div>
        <div className="text-right flex items-center gap-1.5">
          {participant.cityName ? (
            <>
              <DayPhaseIcon time24Str={localInfo.formattedTime24} size={16} />
              <span className="font-clash font-bold text-base text-[#111111]">
                {localInfo.formattedTime12}
              </span>
              {localInfo.dateStatus !== 'SAME DAY' && (
                <span className="text-[10px] font-satoshi font-bold tracking-wider px-1.5 py-0.5 bg-[#111111] text-[#ffffff] uppercase">
                  {localInfo.dateStatus}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs font-satoshi font-semibold text-[#838282] italic">
              Select Location Above
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
