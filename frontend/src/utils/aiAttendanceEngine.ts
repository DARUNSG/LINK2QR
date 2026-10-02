import { Subject, TimetableCell, AttendanceRecord, SubjectAttendanceStats, AIAttendancePrediction } from '../types/student';
import { calculateAttendanceStats } from './attendanceCalc';

/**
 * AI Attendance Engine: Calculates predictive end-of-semester attendance percentages,
 * risk scores, and generates automated AI advice & bunk strategies per subject.
 */
export function runAIAttendanceEngine(
  subjects: Subject[],
  timetable: TimetableCell[],
  attendance: AttendanceRecord[],
  targetPct: number = 80
): {
  predictions: AIAttendancePrediction[];
  overallRiskLevel: 'SAFE' | 'MODERATE_RISK' | 'HIGH_RISK';
  overallPredictedPct: number;
  aiSummaryReport: string;
} {
  const stats = calculateAttendanceStats(subjects, timetable, attendance, targetPct);

  let totalAttendedAll = 0;
  let totalConductedAll = 0;

  const predictions: AIAttendancePrediction[] = stats.map(stat => {
    totalAttendedAll += stat.attended;
    totalConductedAll += stat.totalConducted;

    // Estimate remaining classes in semester (assuming ~30 periods per subject per semester)
    const estimatedRemaining = Math.max(10, 35 - stat.totalConducted);
    
    // Predicted end-semester percentage assuming 85% attendance rate in remaining classes
    const predictedAttended = stat.attended + Math.round(estimatedRemaining * 0.85);
    const predictedTotal = stat.totalConducted + estimatedRemaining;
    const predictedSemesterPct = Number(((predictedAttended / predictedTotal) * 100).toFixed(1));

    let riskLevel: 'SAFE' | 'MODERATE_RISK' | 'HIGH_RISK' = 'SAFE';
    let aiAdvice = '';
    let recommendedAction = '';

    if (stat.totalConducted === 0) {
      riskLevel = 'SAFE';
      aiAdvice = `🤖 AI Detection: No classes conducted yet for ${stat.subjectName}. Attend the first 3 classes to establish a 100% attendance base.`;
      recommendedAction = `Attend upcoming ${stat.subjectName} period handled by ${stat.staffName}.`;
    } else if (stat.percentage < targetPct) {
      riskLevel = 'HIGH_RISK';
      aiAdvice = `🚨 AI Warning: Attendance for ${stat.subjectName} is currently ${stat.percentage}% (Below ${targetPct}% limit!). Handled by ${stat.staffName}. You are in CRITICAL attendance shortage zone.`;
      recommendedAction = `MUST ATTEND the next ${stat.classesToAttendFor80Pct} consecutive class(es) without bunking to reach ${targetPct}%!`;
    } else if (stat.percentage < targetPct + 5) {
      riskLevel = 'MODERATE_RISK';
      aiAdvice = `⚠️ AI Caution: Attendance for ${stat.subjectName} is ${stat.percentage}%. You are near the border limit of ${targetPct}%.`;
      recommendedAction = `Do not bunk any upcoming classes. Safe bunk margin is limited to ${stat.safeBunkCount} class(es).`;
    } else {
      riskLevel = 'SAFE';
      aiAdvice = `✅ AI Safe Zone: Attendance for ${stat.subjectName} is ${stat.percentage}%. Handled by ${stat.staffName}. Your attendance is strong!`;
      recommendedAction = `You can safely bunk up to ${stat.safeBunkCount} class(es) if required while remaining above ${targetPct}%.`;
    }

    return {
      subjectId: stat.subjectId,
      subjectName: stat.subjectName,
      staffName: stat.staffName,
      currentPct: stat.percentage,
      predictedSemesterPct,
      riskLevel,
      aiAdvice,
      recommendedAction,
    };
  });

  const overallCurrentPct = totalConductedAll > 0 ? Number(((totalAttendedAll / totalConductedAll) * 100).toFixed(1)) : 100;
  const highRiskCount = predictions.filter(p => p.riskLevel === 'HIGH_RISK').length;
  const modRiskCount = predictions.filter(p => p.riskLevel === 'MODERATE_RISK').length;

  let overallRiskLevel: 'SAFE' | 'MODERATE_RISK' | 'HIGH_RISK' = 'SAFE';
  let aiSummaryReport = '';

  if (highRiskCount > 0) {
    overallRiskLevel = 'HIGH_RISK';
    aiSummaryReport = `🤖 AI Analysis: You have ${highRiskCount} subject(s) below the minimum ${targetPct}% threshold. Priority action needed!`;
  } else if (modRiskCount > 0) {
    overallRiskLevel = 'MODERATE_RISK';
    aiSummaryReport = `🤖 AI Analysis: Your overall attendance is ${overallCurrentPct}%. ${modRiskCount} subject(s) are near the boundary line.`;
  } else {
    overallRiskLevel = 'SAFE';
    aiSummaryReport = `🤖 AI Analysis: Excellent performance! All subjects are above the ${targetPct}% attendance target.`;
  }

  return {
    predictions,
    overallRiskLevel,
    overallPredictedPct: overallCurrentPct,
    aiSummaryReport,
  };
}

/**
 * Smart AI Chat Assistant Q&A response generator.
 */
export function answerStudentAIQuery(
  query: string,
  subjects: Subject[],
  timetable: TimetableCell[],
  attendance: AttendanceRecord[]
): string {
  const q = query.toLowerCase();
  const stats = calculateAttendanceStats(subjects, timetable, attendance, 80);

  if (q.includes('bunk') || q.includes('miss') || q.includes('skip')) {
    const safeSubjs = stats.filter(s => s.safeBunkCount > 0);
    if (safeSubjs.length > 0) {
      return `🤖 AI Bunk Assistant: You can safely bunk: ${safeSubjs.map(s => `${s.subjectName} (${s.safeBunkCount} class(es) safe)`).join(', ')}. All other subjects require attendance to stay above 80%!`;
    } else {
      return `🤖 AI Warning: Bunking is NOT RECOMMENDED right now! Your subjects are currently at or below 80%. Attend upcoming classes to build your attendance margin!`;
    }
  } else if (q.includes('percentage') || q.includes('score') || q.includes('report')) {
    return `🤖 AI Report: Your subject attendance breakdown: ${stats.map(s => `${s.subjectName} (${s.staffName}): ${s.percentage}%`).join(' | ')}.`;
  } else if (q.includes('staff') || q.includes('teacher') || q.includes('professor')) {
    return `🤖 AI Staff Mapping: Subjects & handling staff: ${subjects.map(s => `${s.name} handled by ${s.staffName}`).join(' | ')}.`;
  } else {
    return `🤖 AI Assistant: I am tracking your timetable, staff names, period counts, and 80% attendance rule. Ask me "Can I bunk tomorrow?", "Show my attendance percentage", or "Which subject is critical?" for instant advice!`;
  }
}
