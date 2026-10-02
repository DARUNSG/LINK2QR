import { PeriodSlot, Subject, TimetableCell, AttendanceRecord } from '../types/student';

const PERIODS_KEY = 'classmate_periods_v2';
const SUBJECTS_KEY = 'classmate_subjects_v1';
const TIMETABLE_KEY = 'classmate_timetable_v1';
const ATTENDANCE_KEY = 'classmate_attendance_v1';
const NOTIFICATIONS_ENABLED_KEY = 'classmate_notif_enabled_v1';
const TIMETABLE_IMAGE_KEY = 'classmate_timetable_image_v1';

export const DEFAULT_PERIODS: PeriodSlot[] = [
  { periodNumber: 1, startTime: '08:30', endTime: '09:20', label: 'Period 1' },
  { periodNumber: 2, startTime: '09:20', endTime: '10:10', label: 'Period 2' },
  { periodNumber: 3, startTime: '10:25', endTime: '11:15', label: 'Period 3' },
  { periodNumber: 4, startTime: '11:15', endTime: '12:05', label: 'Period 4' },
  { periodNumber: 5, startTime: '12:05', endTime: '12:55', label: 'Period 5' },
  { periodNumber: 6, startTime: '13:45', endTime: '14:35', label: 'Period 6' },
  { periodNumber: 7, startTime: '14:35', endTime: '15:25', label: 'Period 7' },
  { periodNumber: 8, startTime: '15:25', endTime: '16:15', label: 'Period 8' },
  { periodNumber: 9, startTime: '16:15', endTime: '17:05', label: 'Period 9' },
];

export const DEMO_SUBJECTS: Subject[] = [
  { id: 'subj-1', name: 'Mathematics & Calculus', staffName: 'Prof. R. Sharma', code: 'MATH101' },
  { id: 'subj-2', name: 'Data Structures & Algo', staffName: 'Dr. K. Anitha', code: 'CS201' },
  { id: 'subj-3', name: 'Physics & Electronics', staffName: 'Prof. M. Rajesh', code: 'PHY102' },
  { id: 'subj-4', name: 'Web Dev & PWA Lab', staffName: 'Mrs. S. Priya', code: 'CS205' },
  { id: 'subj-5', name: 'Database Systems', staffName: 'Mr. V. Ramesh', code: 'CS203' },
];

export const DEMO_TIMETABLE: TimetableCell[] = [
  // Monday
  { day: 'Monday', periodNumber: 1, subjectId: 'subj-1' },
  { day: 'Monday', periodNumber: 2, subjectId: 'subj-2' },
  { day: 'Monday', periodNumber: 3, subjectId: 'subj-3' },
  { day: 'Monday', periodNumber: 4, subjectId: 'subj-4' },
  { day: 'Monday', periodNumber: 5, subjectId: 'subj-5' },
  { day: 'Monday', periodNumber: 6, subjectId: 'subj-1' },
  { day: 'Monday', periodNumber: 7, subjectId: 'subj-2' },
  { day: 'Monday', periodNumber: 8, subjectId: 'subj-3' },
  { day: 'Monday', periodNumber: 9, subjectId: 'subj-4' },
  // Tuesday
  { day: 'Tuesday', periodNumber: 1, subjectId: 'subj-2' },
  { day: 'Tuesday', periodNumber: 2, subjectId: 'subj-1' },
  { day: 'Tuesday', periodNumber: 3, subjectId: 'subj-4' },
  { day: 'Tuesday', periodNumber: 4, subjectId: 'subj-5' },
  { day: 'Tuesday', periodNumber: 5, subjectId: 'subj-3' },
  { day: 'Tuesday', periodNumber: 6, subjectId: 'subj-2' },
  { day: 'Tuesday', periodNumber: 7, subjectId: 'subj-1' },
  { day: 'Tuesday', periodNumber: 8, subjectId: 'subj-5' },
  { day: 'Tuesday', periodNumber: 9, subjectId: 'subj-4' },
  // Wednesday
  { day: 'Wednesday', periodNumber: 1, subjectId: 'subj-3' },
  { day: 'Wednesday', periodNumber: 2, subjectId: 'subj-5' },
  { day: 'Wednesday', periodNumber: 3, subjectId: 'subj-1' },
  { day: 'Wednesday', periodNumber: 4, subjectId: 'subj-2' },
  { day: 'Wednesday', periodNumber: 5, subjectId: 'subj-4' },
  { day: 'Wednesday', periodNumber: 6, subjectId: 'subj-3' },
  { day: 'Wednesday', periodNumber: 7, subjectId: 'subj-5' },
  { day: 'Wednesday', periodNumber: 8, subjectId: 'subj-1' },
  { day: 'Wednesday', periodNumber: 9, subjectId: 'subj-2' },
  // Thursday
  { day: 'Thursday', periodNumber: 1, subjectId: 'subj-4' },
  { day: 'Thursday', periodNumber: 2, subjectId: 'subj-3' },
  { day: 'Thursday', periodNumber: 3, subjectId: 'subj-2' },
  { day: 'Thursday', periodNumber: 4, subjectId: 'subj-1' },
  { day: 'Thursday', periodNumber: 5, subjectId: 'subj-5' },
  { day: 'Thursday', periodNumber: 6, subjectId: 'subj-4' },
  { day: 'Thursday', periodNumber: 7, subjectId: 'subj-3' },
  { day: 'Thursday', periodNumber: 8, subjectId: 'subj-2' },
  { day: 'Thursday', periodNumber: 9, subjectId: 'subj-1' },
  // Friday
  { day: 'Friday', periodNumber: 1, subjectId: 'subj-5' },
  { day: 'Friday', periodNumber: 2, subjectId: 'subj-4' },
  { day: 'Friday', periodNumber: 3, subjectId: 'subj-3' },
  { day: 'Friday', periodNumber: 4, subjectId: 'subj-2' },
  { day: 'Friday', periodNumber: 5, subjectId: 'subj-1' },
  { day: 'Friday', periodNumber: 6, subjectId: 'subj-5' },
  { day: 'Friday', periodNumber: 7, subjectId: 'subj-4' },
  { day: 'Friday', periodNumber: 8, subjectId: 'subj-3' },
  { day: 'Friday', periodNumber: 9, subjectId: 'subj-2' },
  // Saturday
  { day: 'Saturday', periodNumber: 1, subjectId: 'subj-1' },
  { day: 'Saturday', periodNumber: 2, subjectId: 'subj-2' },
  { day: 'Saturday', periodNumber: 3, subjectId: 'subj-3' },
  { day: 'Saturday', periodNumber: 4, subjectId: 'subj-4' },
  { day: 'Saturday', periodNumber: 5, subjectId: 'subj-5' },
  { day: 'Saturday', periodNumber: 6, subjectId: 'subj-1' },
  { day: 'Saturday', periodNumber: 7, subjectId: 'subj-2' },
  { day: 'Saturday', periodNumber: 8, subjectId: 'subj-3' },
  { day: 'Saturday', periodNumber: 9, subjectId: 'subj-4' },
];

export const DEMO_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', date: '2026-09-01', day: 'Monday', periodNumber: 1, subjectId: 'subj-1', status: 'PRESENT' },
  { id: 'att-2', date: '2026-09-01', day: 'Monday', periodNumber: 2, subjectId: 'subj-2', status: 'PRESENT' },
  { id: 'att-3', date: '2026-09-01', day: 'Monday', periodNumber: 3, subjectId: 'subj-3', status: 'ABSENT' },
  { id: 'att-4', date: '2026-09-02', day: 'Tuesday', periodNumber: 1, subjectId: 'subj-2', status: 'PRESENT' },
  { id: 'att-5', date: '2026-09-02', day: 'Tuesday', periodNumber: 2, subjectId: 'subj-1', status: 'PRESENT' },
  { id: 'att-6', date: '2026-09-03', day: 'Wednesday', periodNumber: 1, subjectId: 'subj-3', status: 'PRESENT' },
  { id: 'att-7', date: '2026-09-03', day: 'Wednesday', periodNumber: 2, subjectId: 'subj-5', status: 'PRESENT' },
];

// Helper functions
export function getStoredPeriods(): PeriodSlot[] {
  const data = localStorage.getItem(PERIODS_KEY);
  if (!data) return DEFAULT_PERIODS;
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length >= 9) {
      return parsed;
    }
    return DEFAULT_PERIODS;
  } catch {
    return DEFAULT_PERIODS;
  }
}

export function saveStoredPeriods(periods: PeriodSlot[]): void {
  localStorage.setItem(PERIODS_KEY, JSON.stringify(periods));
}

export function getStoredSubjects(): Subject[] {
  const data = localStorage.getItem(SUBJECTS_KEY);
  if (!data) return DEMO_SUBJECTS;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_SUBJECTS;
  } catch {
    return DEMO_SUBJECTS;
  }
}

export function saveStoredSubjects(subjects: Subject[]): void {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
}

export function getStoredTimetable(): TimetableCell[] {
  const data = localStorage.getItem(TIMETABLE_KEY);
  if (!data) return DEMO_TIMETABLE;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_TIMETABLE;
  } catch {
    return DEMO_TIMETABLE;
  }
}

export function saveStoredTimetable(timetable: TimetableCell[]): void {
  localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
}

export function getStoredAttendance(): AttendanceRecord[] {
  const data = localStorage.getItem(ATTENDANCE_KEY);
  if (!data) return DEMO_ATTENDANCE;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_ATTENDANCE;
  } catch {
    return DEMO_ATTENDANCE;
  }
}

export function saveStoredAttendance(attendance: AttendanceRecord[]): void {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));
}

export function getStoredNotificationStatus(): boolean {
  return localStorage.getItem(NOTIFICATIONS_ENABLED_KEY) === 'true';
}

export function saveStoredNotificationStatus(enabled: boolean): void {
  localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled));
}

export function getStoredTimetableImage(): string | null {
  return localStorage.getItem(TIMETABLE_IMAGE_KEY);
}

export function saveStoredTimetableImage(imageDataUrl: string | null): void {
  if (imageDataUrl) {
    localStorage.setItem(TIMETABLE_IMAGE_KEY, imageDataUrl);
  } else {
    localStorage.removeItem(TIMETABLE_IMAGE_KEY);
  }
}

export function loadDemoData(): {
  periods: PeriodSlot[];
  subjects: Subject[];
  timetable: TimetableCell[];
  attendance: AttendanceRecord[];
} {
  saveStoredPeriods(DEFAULT_PERIODS);
  saveStoredSubjects(DEMO_SUBJECTS);
  saveStoredTimetable(DEMO_TIMETABLE);
  saveStoredAttendance(DEMO_ATTENDANCE);

  return {
    periods: DEFAULT_PERIODS,
    subjects: DEMO_SUBJECTS,
    timetable: DEMO_TIMETABLE,
    attendance: DEMO_ATTENDANCE
  };
}
