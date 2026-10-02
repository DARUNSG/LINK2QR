export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface PeriodSlot {
  periodNumber: number;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:00"
  label?: string;    // e.g. "Period 1"
}

export interface Subject {
  id: string;
  name: string;
  staffName: string;
  code?: string;
}

export interface TimetableCell {
  day: DayOfWeek;
  periodNumber: number;
  subjectId: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'CANCELLED';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  day: DayOfWeek;
  periodNumber: number;
  subjectId: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface SubjectAttendanceStats {
  subjectId: string;
  subjectName: string;
  staffName: string;
  weeklyCount: number;
  totalConducted: number;
  attended: number;
  missed: number;
  cancelled: number;
  percentage: number; // 0 to 100
  isAboveTarget: boolean; // >= 80%
  classesToAttendFor80Pct: number; // How many consecutive classes needed to hit 80%
  safeBunkCount: number; // How many classes can be safely skipped while staying >= 80%
}

export interface DateBunkRecommendation {
  date: string;
  dayName: DayOfWeek;
  periodNumber: number;
  subjectName: string;
  staffName: string;
  recommendation: 'SAFE_TO_BUNK' | 'MUST_ATTEND' | 'NEUTRAL';
  reason: string;
}

export interface AIDetectedTimetable {
  subjects: { name: string; staffName: string }[];
  periods: PeriodSlot[];
  timetable: TimetableCell[];
  confidenceScore: number; // 0 to 100
  detectedCount: number;
  freeSlotsCount: number;
  ocrRawLogs?: string[];
}

export interface AIAttendancePrediction {
  subjectId: string;
  subjectName: string;
  staffName: string;
  currentPct: number;
  predictedSemesterPct: number;
  riskLevel: 'SAFE' | 'MODERATE_RISK' | 'HIGH_RISK';
  aiAdvice: string;
  recommendedAction: string;
}
