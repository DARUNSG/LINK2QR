export interface Participant {
  id: string;
  name: string;
  cityName: string;
  countryName: string;
  timezone: string; // IANA timezone string e.g. "Asia/Kolkata"
  flag?: string;
  workStart: string; // "09:00" in 24-hour format
  workEnd: string;   // "18:00" in 24-hour format
}

export interface ParticipantLocalTime {
  participantId: string;
  name: string;
  location: string;
  timezone: string;
  dateStr: string;          // ISO Date string e.g. "2026-10-15"
  formattedTime12: string;  // e.g. "8:30 PM"
  formattedTime24: string;  // e.g. "20:30"
  formattedDate: string;    // e.g. "Thu, Oct 15"
  dateStatus: 'SAME DAY' | 'NEXT DAY' | 'PREVIOUS DAY';
  offsetStr: string;        // e.g. "UTC+5.5" or "+05:30"
  isWithinWorkHours: boolean;
}

export interface OverlapWindow {
  startUtc: string;         // e.g. "14:00"
  endUtc: string;           // e.g. "16:00"
  startUtcDecimal: number;  // e.g. 14
  endUtcDecimal: number;    // e.g. 16
  durationHours: number;    // e.g. 2
  labelUtc: string;         // e.g. "14:00 — 16:00 UTC"
  label12hUtc: string;      // e.g. "2:00 PM — 4:00 PM UTC"
}

export interface TimelineSlot {
  utcDecimal: number;       // e.g. 14.5 for 14:30
  timeUtcStr24: string;     // e.g. "14:30"
  timeUtcStr12: string;     // e.g. "2:30 PM"
  isAllOverlap: boolean;
  participantDetails: {
    participantId: string;
    isWorking: boolean;
    localTimeStr: string;
    localDateStatus: 'SAME DAY' | 'NEXT DAY' | 'PREVIOUS DAY';
  }[];
}
