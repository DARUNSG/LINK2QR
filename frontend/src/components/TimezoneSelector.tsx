import React, { useState, useRef, useEffect } from 'react';
import { WORLD_CITIES, CityItem } from '../data/cities';
import { Search, ChevronDown, Check } from 'lucide-react';

interface TimezoneSelectorProps {
  currentCityName: string;
  currentCountryName: string;
  currentTimezone: string;
  onSelect: (city: CityItem) => void;
}

const RECOMMENDED_CITIES = [
  { city: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧' },
  { city: 'New York', country: 'USA', timezone: 'America/New_York', flag: '🇺🇸' },
  { city: 'Chennai', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
];

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  currentCityName,
  currentCountryName,
  currentTimezone,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = WORLD_CITIES.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.city.toLowerCase().includes(term) ||
      c.country.toLowerCase().includes(term) ||
      c.timezone.toLowerCase().includes(term) ||
      c.standardOffset.toLowerCase().includes(term)
    );
  });

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#f2f2f2] border border-[#1e1e1e]/20 hover:border-[#111111] px-4 py-2.5 flex items-center justify-between text-left transition-colors duration-150 cursor-pointer"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {currentCityName ? (
            <>
              <span className="font-satoshi font-bold text-sm text-[#111111] truncate">
                {currentCityName}, {currentCountryName}
              </span>
              <span className="text-xs text-[#838282] font-mono shrink-0">
                ({currentTimezone})
              </span>
            </>
          ) : (
            <span className="font-satoshi font-medium text-xs text-[#838282] italic flex items-center gap-1.5">
              <span>📍</span>
              <span>Select Location / Time Zone...</span>
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-[#111111] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-[#ffffff] border border-[#111111] z-50 shadow-2xl max-h-[360px] flex flex-col">
          {/* Search Input Header */}
          <div className="p-3 border-b border-[#1e1e1e]/10 bg-[#f2f2f2] flex items-center gap-2 sticky top-0">
            <Search className="w-4 h-4 text-[#838282]" />
            <input
              type="text"
              placeholder="Search city, country, or timezone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-xs font-satoshi font-medium text-[#111111] focus:outline-none"
            />
          </div>

          {/* Recommended Locations Section (Shown when search is empty) */}
          {!searchTerm && (
            <div className="p-3 bg-[#f8f9fa] border-b border-[#1e1e1e]/10">
              <span className="text-[10px] font-satoshi font-bold tracking-[0.15em] text-[#838282] uppercase block mb-2">
                ⭐ RECOMMENDED LOCATIONS (CLICK TO SELECT)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {RECOMMENDED_CITIES.map((rec) => {
                  const fullItem = WORLD_CITIES.find(c => c.city === rec.city) || {
                    id: rec.city,
                    city: rec.city,
                    country: rec.country,
                    timezone: rec.timezone,
                    flag: rec.flag,
                    standardOffset: 'UTC',
                  };
                  return (
                    <button
                      key={rec.city}
                      type="button"
                      onClick={() => {
                        onSelect(fullItem as CityItem);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className="px-2.5 py-1 text-xs font-satoshi font-semibold bg-[#ffffff] hover:bg-[#111111] hover:text-[#ffffff] border border-[#1e1e1e]/15 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>{rec.flag}</span>
                      <span>{rec.city}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* List of All Cities */}
          <div className="overflow-y-auto flex-1 divide-y divide-[#1e1e1e]/5">
            {filteredCities.length > 0 ? (
              filteredCities.map((item) => {
                const isSelected = item.timezone === currentTimezone && item.city === currentCityName;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-[#111111] hover:text-[#ffffff] transition-colors group cursor-pointer ${
                      isSelected ? 'bg-[#f2f2f2] text-[#111111] font-bold' : 'text-[#111111]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-base leading-none">{item.flag}</span>
                      <div className="overflow-hidden">
                        <div className="text-xs font-satoshi font-bold tracking-tight truncate group-hover:text-[#ffffff]">
                          {item.city}, <span className="font-normal text-[#838282] group-hover:text-[#bfbfbf]">{item.country}</span>
                        </div>
                        <div className="text-[10px] text-[#838282] group-hover:text-[#c9c9c9] font-mono">
                          {item.timezone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 border border-[#1e1e1e]/10 group-hover:border-[#ffffff]/30 text-[#838282] group-hover:text-[#ffffff]">
                        {item.standardOffset}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#111111] group-hover:text-[#ffffff]" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs font-satoshi text-[#838282]">
                No matching city or time zone found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
