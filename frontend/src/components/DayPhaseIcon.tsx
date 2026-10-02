import React from 'react';

export type DayPhaseType = 'DAYTIME' | 'EVENING' | 'NIGHT';

export interface DayPhaseInfo {
  phase: DayPhaseType;
  label: string;
  iconType: 'sun' | 'sunset' | 'moon';
}

export const getDayPhaseInfo = (time24Str: string): DayPhaseInfo => {
  if (!time24Str) return { phase: 'DAYTIME', label: 'DAYTIME', iconType: 'sun' };

  const [h] = time24Str.split(':').map(Number);
  const hour = typeof h === 'number' && !isNaN(h) ? h : 12;

  if (hour >= 6 && hour < 17) {
    return { phase: 'DAYTIME', label: 'DAYTIME', iconType: 'sun' };
  } else if (hour >= 17 && hour < 21) {
    return { phase: 'EVENING', label: 'EVENING', iconType: 'sunset' };
  } else {
    return { phase: 'NIGHT', label: 'NIGHT', iconType: 'moon' };
  }
};

interface DayPhaseIconProps {
  time24Str: string;
  size?: number; // size in px, default 18
  className?: string;
  showLabel?: boolean;
}

export const DayPhaseIcon: React.FC<DayPhaseIconProps> = ({
  time24Str,
  size = 18,
  className = '',
  showLabel = false,
}) => {
  const info = getDayPhaseInfo(time24Str);

  return (
    <div
      className={`inline-flex items-center gap-1.5 transition-transform duration-200 hover:scale-110 select-none ${className}`}
      title={`${info.label} (${time24Str})`}
    >
      {/* ☀️ DAYTIME: Vibrant Filled Golden Sun */}
      {info.iconType === 'sun' && (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 shadow-xs">
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0 drop-shadow-xs"
          >
            <circle cx="12" cy="12" r="5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            <path
              d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[10px] font-satoshi font-extrabold tracking-wide uppercase text-amber-800">
            {showLabel ? info.label : 'DAY'}
          </span>
        </div>
      )}

      {/* 🌅 EVENING: Sunset Horizon */}
      {info.iconType === 'sunset' && (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-300/80 text-orange-900 shadow-xs">
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0 drop-shadow-xs"
          >
            <path d="M12 4v4m0 0l-2-2m2 2l2-2" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 18h16M2 21h20" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 18a5 5 0 0 1 10 0" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
          </svg>
          <span className="text-[10px] font-satoshi font-extrabold tracking-wide uppercase text-orange-800">
            {showLabel ? info.label : 'SUNSET'}
          </span>
        </div>
      )}

      {/* 🌙 NIGHT: Luminous Crescent Moon with Star */}
      {info.iconType === 'moon' && (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700/80 text-indigo-100 shadow-xs">
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0 drop-shadow-xs"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="#818CF8"
              stroke="#6366F1"
              strokeWidth="1.5"
            />
            <circle cx="18" cy="6" r="1" fill="#E0E7FF" />
          </svg>
          <span className="text-[10px] font-satoshi font-extrabold tracking-wide uppercase text-indigo-200">
            {showLabel ? info.label : 'NIGHT'}
          </span>
        </div>
      )}
    </div>
  );
};
