import { Subject, TimetableCell, AttendanceRecord, SubjectAttendanceStats, DateBunkRecommendation, DayOfWeek, DAYS_OF_WEEK } from '../types/student';

/**
 * Calculates subject-wise attendance statistics and 80% target metrics.
 */
export function calculateAttendanceStats(
  subjects: Subject[],
  timetable: TimetableCell[],
  attendanceRecords: AttendanceRecord[],
  targetPercentage: number = 80
): SubjectAttendanceStats[] {
  // Count weekly period allocations per subject
  const weeklyCounts: Record<string, number> = {};
  timetable.forEach(cell => {
    if (cell.subjectId) {
      weeklyCounts[cell.subjectId] = (weeklyCounts[cell.subjectId] || 0) + 1;
    }
  });

  return subjects.map(subject => {
    const records = attendanceRecords.filter(r => r.subjectId === subject.id);
    let attended = 0;
    let missed = 0;
    let cancelled = 0;

    records.forEach(r => {
      if (r.status === 'PRESENT') attended++;
      else if (r.status === 'ABSENT') missed++;
      else if (r.status === 'CANCELLED') cancelled++;
    });

    const totalConducted = attended + missed;
    const percentage = totalConducted > 0 ? (attended / totalConducted) * 100 : 100;
    const targetDecimal = targetPercentage / 100;

    let classesToAttendFor80Pct = 0;
    let safeBunkCount = 0;

    if (totalConducted === 0) {
      classesToAttendFor80Pct = 0;
      safeBunkCount = 0;
    } else if (percentage < targetPercentage) {
      // Formula: (attended + N) / (totalConducted + N) >= targetDecimal
      // N * (1 - targetDecimal) >= targetDecimal * totalConducted - attended
      // N >= (targetDecimal * totalConducted - attended) / (1 - targetDecimal)
      const rawN = (targetDecimal * totalConducted - attended) / (1 - targetDecimal);
      classesToAttendFor80Pct = Math.max(0, Math.ceil(rawN));
      safeBunkCount = 0;
    } else {
      // Formula: attended / (totalConducted + B) >= targetDecimal
      // targetDecimal * B <= attended - targetDecimal * totalConducted
      // B <= (attended - targetDecimal * totalConducted) / targetDecimal
      const rawB = (attended - targetDecimal * totalConducted) / targetDecimal;
      safeBunkCount = Math.max(0, Math.floor(rawB));
      classesToAttendFor80Pct = 0;
    }

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      staffName: subject.staffName,
      weeklyCount: weeklyCounts[subject.id] || 0,
      totalConducted,
      attended,
      missed,
      cancelled,
      percentage: Number(percentage.toFixed(1)),
      isAboveTarget: percentage >= targetPercentage,
      classesToAttendFor80Pct,
      safeBunkCount
    };
  });
}

/**
 * Generate date-wise bunk recommendations for upcoming schedule.
 */
export function generateBunkRecommendations(
  subjects: Subject[],
  timetable: TimetableCell[],
  stats: SubjectAttendanceStats[],
  startDate: Date = new Date(),
  daysAhead: number = 7
): DateBunkRecommendation[] {
  const recommendations: DateBunkRecommendation[] = [];
  const subjectMap = new Map(subjects.map(s => [s.id, s]));
  const statMap = new Map(stats.map(s => [s.subjectId, s]));

  for (let i = 0; i < daysAhead; i++) {
    const currDate = new Date(startDate);
    currDate.setDate(startDate.getDate() + i);

    const dayIndex = currDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
    if (dayIndex === 0) continue; // Skip Sunday

    const dayName = DAYS_OF_WEEK[dayIndex - 1]; // Convert 1..6 to Monday..Saturday
    const formattedDate = currDate.toISOString().split('T')[0];

    const daySlots = timetable.filter(t => t.day === dayName && t.subjectId);

    daySlots.forEach(slot => {
      const subject = subjectMap.get(slot.subjectId);
      const stat = statMap.get(slot.subjectId);

      if (!subject || !stat) return;

      let recType: 'SAFE_TO_BUNK' | 'MUST_ATTEND' | 'NEUTRAL' = 'NEUTRAL';
      let reason = '';

      if (stat.totalConducted === 0) {
        recType = 'NEUTRAL';
        reason = 'No attendance recorded yet. Attend to establish high percentage!';
      } else if (stat.percentage < 80) {
        recType = 'MUST_ATTEND';
        reason = `Attendance is ${stat.percentage}%. Need to attend next ${stat.classesToAttendFor80Pct} class(es) to reach 80%!`;
      } else if (stat.safeBunkCount > 0) {
        recType = 'SAFE_TO_BUNK';
        reason = `Attendance is ${stat.percentage}%. Safe to bunk up to ${stat.safeBunkCount} class(es) while staying above 80%!`;
      } else {
        recType = 'MUST_ATTEND';
        reason = `Attendance is exactly ${stat.percentage}%. Bunking now will drop you below 80%!`;
      }

      recommendations.push({
        date: formattedDate,
        dayName,
        periodNumber: slot.periodNumber,
        subjectName: subject.name,
        staffName: subject.staffName,
        recommendation: recType,
        reason
      });
    });
  }

  return recommendations;
}
