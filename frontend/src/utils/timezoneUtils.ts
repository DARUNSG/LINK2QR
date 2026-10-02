import { DateTime } from 'luxon';
import { Participant, ParticipantLocalTime, OverlapWindow, TimelineSlot } from '../types/planner';

/**
 * Converts a time string "14:30" to decimal hours (14.5)
 */
export const timeToDecimal = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) + (m || 0) / 60;
};

/**
 * Converts decimal hours (14.5) to "14:30" format
 */
export const decimalToTime = (dec: number): string => {
  const h = Math.floor(dec);
  const m = Math.round((dec - h) * 60);
  const hStr = String(h % 24).padStart(2, '0');
  const mStr = String(m % 60).padStart(2, '0');
  return `${hStr}:${mStr}`;
};

/**
 * Converts decimal hours (14.5) to 12-hour format "2:30 PM"
 */
export const decimalTo12h = (dec: number): string => {
  const timeStr = decimalToTime(dec);
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
};

/**
 * Calculates a participant's local time given a date (YYYY-MM-DD) and a selected UTC time ("HH:mm")
 */
export const getParticipantLocalTime = (
  dateStr: string,
  timeUtcStr: string,
  p: Participant
): ParticipantLocalTime => {
  // Safe default date fallback
  const validDateStr = dateStr || DateTime.now().toISODate() || '2026-10-15';
  const validUtcStr = timeUtcStr || '12:00';

  // Construct UTC DateTime
  const utcDateTime = DateTime.fromISO(`${validDateStr}T${validUtcStr}:00`, { zone: 'utc' });
  
  // Target timezone local DateTime
  const localDateTime = utcDateTime.setZone(p.timezone);

  // Check if timezone is valid
  const isValid = localDateTime.isValid;
  const safeLocal = isValid ? localDateTime : utcDateTime;

  // Determine date boundary difference relative to the reference UTC date
  const refIsoDate = validDateStr;
  const localIsoDate = safeLocal.toISODate();

  let dateStatus: 'SAME DAY' | 'NEXT DAY' | 'PREVIOUS DAY' = 'SAME DAY';
  if (localIsoDate && refIsoDate) {
    if (localIsoDate > refIsoDate) {
      dateStatus = 'NEXT DAY';
    } else if (localIsoDate < refIsoDate) {
      dateStatus = 'PREVIOUS DAY';
    }
  }

  // Format offset string e.g. UTC+05:30 or UTC-05:00
  const offsetMinutes = safeLocal.offset; // e.g. 330 for +5:30
  const offsetHours = offsetMinutes / 60;
  const offsetSign = offsetHours >= 0 ? '+' : '-';
  const absH = Math.floor(Math.abs(offsetHours));
  const absM = Math.abs(offsetMinutes) % 60;
  const offsetStr = `UTC${offsetSign}${String(absH).padStart(2, '0')}:${String(absM).padStart(2, '0')}`;

  // Check if participant local time falls within their specified working hours
  const localDecimal = safeLocal.hour + safeLocal.minute / 60;
  const startDec = timeToDecimal(p.workStart);
  const endDec = timeToDecimal(p.workEnd);
  
  let isWithinWorkHours = false;
  if (startDec < endDec) {
    isWithinWorkHours = localDecimal >= startDec && localDecimal <= endDec;
  } else {
    // Night shift edge case (e.g. 22:00 to 06:00)
    isWithinWorkHours = localDecimal >= startDec || localDecimal <= endDec;
  }

  const formattedTime12 = safeLocal.toFormat('h:mm a');
  const formattedTime24 = safeLocal.toFormat('HH:mm');
  const formattedDate = safeLocal.toFormat('ccc, LLL d');

  const location = p.cityName ? `${p.cityName}, ${p.countryName}` : p.countryName || p.timezone;

  return {
    participantId: p.id,
    name: p.name,
    location,
    timezone: p.timezone,
    dateStr: localIsoDate || validDateStr,
    formattedTime12,
    formattedTime24,
    formattedDate,
    dateStatus,
    offsetStr,
    isWithinWorkHours,
  };
};

/**
 * Calculates continuous overlapping working hours across ALL participants on a given date.
 * Scans 24 UTC hours in 15-minute steps (96 slots).
 */
export const calculateOverlappingWorkingHours = (
  dateStr: string,
  participants: Participant[]
): OverlapWindow[] => {
  if (!participants || participants.length < 2) return [];

  const slotsInDay = 96; // 15-minute increments (24 * 4)
  const isOverlapArray: boolean[] = new Array(slotsInDay).fill(false);

  for (let i = 0; i < slotsInDay; i++) {
    const utcDecimal = i * 0.25;
    const timeUtcStr = decimalToTime(utcDecimal);

    // Check if ALL participants are within their working hours at this UTC minute
    const allWorking = participants.every(p => {
      const local = getParticipantLocalTime(dateStr, timeUtcStr, p);
      return local.isWithinWorkHours;
    });

    isOverlapArray[i] = allWorking;
  }

  // Find contiguous true blocks in isOverlapArray
  const windows: OverlapWindow[] = [];
  let inBlock = false;
  let blockStart = 0;

  for (let i = 0; i < slotsInDay; i++) {
    if (isOverlapArray[i] && !inBlock) {
      inBlock = true;
      blockStart = i;
    } else if (!isOverlapArray[i] && inBlock) {
      inBlock = false;
      const startDec = blockStart * 0.25;
      const endDec = i * 0.25;
      const duration = endDec - startDec;
      
      if (duration >= 0.25) { // Minimum 15-minute window
        windows.push({
          startUtc: decimalToTime(startDec),
          endUtc: decimalToTime(endDec),
          startUtcDecimal: startDec,
          endUtcDecimal: endDec,
          durationHours: duration,
          labelUtc: `${decimalToTime(startDec)} — ${decimalToTime(endDec)} UTC`,
          label12hUtc: `${decimalTo12h(startDec)} — ${decimalTo12h(endDec)} UTC`,
        });
      }
    }
  }

  // Handle wrap-around or block till end of day
  if (inBlock) {
    const startDec = blockStart * 0.25;
    const endDec = 24.0;
    const duration = endDec - startDec;
    windows.push({
      startUtc: decimalToTime(startDec),
      endUtc: decimalToTime(endDec),
      startUtcDecimal: startDec,
      endUtcDecimal: endDec,
      durationHours: duration,
      labelUtc: `${decimalToTime(startDec)} — 24:00 UTC`,
      label12hUtc: `${decimalTo12h(startDec)} — 12:00 AM UTC`,
    });
  }

  return windows;
};

/**
 * Generates 48 half-hour timeline slots (00:00 UTC to 23:30 UTC) for visualization
 */
export const generateTimelineGrid = (
  dateStr: string,
  participants: Participant[]
): TimelineSlot[] => {
  const slots: TimelineSlot[] = [];
  const numSlots = 48; // 30-minute intervals

  for (let i = 0; i < numSlots; i++) {
    const utcDecimal = i * 0.5;
    const timeUtcStr24 = decimalToTime(utcDecimal);
    const timeUtcStr12 = decimalTo12h(utcDecimal);

    const participantDetails = participants.map(p => {
      const local = getParticipantLocalTime(dateStr, timeUtcStr24, p);
      return {
        participantId: p.id,
        isWorking: local.isWithinWorkHours,
        localTimeStr: local.formattedTime12,
        localDateStatus: local.dateStatus,
      };
    });

    const isAllOverlap = participantDetails.length > 0 && participantDetails.every(d => d.isWorking);

    slots.push({
      utcDecimal,
      timeUtcStr24,
      timeUtcStr12,
      isAllOverlap,
      participantDetails,
    });
  }

  return slots;
};

/**
 * Formats a clean plain text summary for copying to clipboard
 */
export const generateMeetingSummaryText = (
  meetingTitle: string,
  dateStr: string,
  selectedTimeUtc: string,
  participants: Participant[]
): string => {
  // Format date readable
  const dtUtc = DateTime.fromISO(`${dateStr}T${selectedTimeUtc}:00`, { zone: 'utc' });
  const formattedDate = dtUtc.isValid ? dtUtc.toFormat('dd MMMM yyyy') : dateStr;
  const formattedUtcTime12 = dtUtc.isValid ? dtUtc.toFormat('h:mm a') : selectedTimeUtc;

  let text = `📅 ${meetingTitle.toUpperCase() || 'TEAM MEETING'}\n`;
  text += `Date: ${formattedDate}\n`;
  text += `Selected Time: ${formattedUtcTime12} UTC (${selectedTimeUtc} UTC)\n\n`;
  text += `LOCAL PARTICIPANT TIMES:\n`;

  participants.forEach(p => {
    const local = getParticipantLocalTime(dateStr, selectedTimeUtc, p);
    const dateTag = local.dateStatus !== 'SAME DAY' ? ` · ${local.dateStatus}` : '';
    text += `• ${p.name.toUpperCase()} (${local.location}) — ${local.formattedTime12}${dateTag} [${local.timezone}]\n`;
  });

  text += `\nOrganized with TimeSync Meeting Planner`;
  return text;
};
