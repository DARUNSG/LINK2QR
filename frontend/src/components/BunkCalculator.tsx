import React, { useState } from 'react';
import { Subject, TimetableCell, AttendanceRecord, PeriodSlot } from '../types/student';
import { calculateAttendanceStats, generateBunkRecommendations } from '../utils/attendanceCalc';
import { Target, CheckCircle2, AlertTriangle, ShieldCheck, Calendar, Info, Sparkles } from 'lucide-react';

interface BunkCalculatorProps {
  periods: PeriodSlot[];
  subjects: Subject[];
  timetable: TimetableCell[];
  attendance: AttendanceRecord[];
}

export const BunkCalculator: React.FC<BunkCalculatorProps> = ({
  periods,
  subjects,
  timetable,
  attendance,
}) => {
  const [targetPercentage, setTargetPercentage] = useState(80);

  const stats = calculateAttendanceStats(subjects, timetable, attendance, targetPercentage);
  const recommendations = generateBunkRecommendations(subjects, timetable, stats, new Date(), 7);

  // Overall statistics
  const totalConductedAll = stats.reduce((acc, s) => acc + s.totalConducted, 0);
  const totalAttendedAll = stats.reduce((acc, s) => acc + s.attended, 0);
  const overallPct = totalConductedAll > 0 ? (totalAttendedAll / totalConductedAll) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Target Setup Banner */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-[#323232] text-[#DDD0C8] text-xs font-black rounded-full mb-2 uppercase border border-[#323232]">
              🎯 Minimum 80% Target Engine
            </span>
            <h2 className="text-3xl font-black text-[#323232] tracking-tight">
              Attendance Target & Safe Bunk Analytics
            </h2>
            <p className="text-xs font-semibold text-gray-700 mt-1">
              Calculates exact classes to attend or safe classes you can bunk to maintain target attendance.
            </p>
          </div>

          {/* Overall Percentage Card */}
          <div className="p-4 rounded-lg bg-[#DDD0C8] border-2 border-[#323232] text-center min-w-[200px] shadow-[2px_2px_0px_#323232]">
            <div className="text-xs font-black uppercase text-gray-700">Overall Attendance</div>
            <div className="text-4xl font-black text-[#323232] mt-1">
              {overallPct.toFixed(1)}%
            </div>
            <div className="mt-1">
              {overallPct >= targetPercentage ? (
                <span className="px-2.5 py-0.5 bg-[#323232] text-[#DDD0C8] text-[10px] font-black rounded-full">
                  ✅ TARGET SAFE (≥ {targetPercentage}%)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 border-2 border-[#323232] bg-[#F4ECE6] text-[#323232] text-[10px] font-black rounded-full">
                  ⚠️ BELOW TARGET (&lt; {targetPercentage}%)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Target Slider */}
        <div className="mt-6 pt-4 border-t-2 border-[#323232]/20 flex items-center gap-4">
          <label className="text-xs font-black uppercase text-[#323232] whitespace-nowrap">
            Minimum Target Percentage: <span className="underline font-black text-sm text-[#323232]">{targetPercentage}%</span>
          </label>
          <input
            type="range"
            min="60"
            max="95"
            value={targetPercentage}
            onChange={(e) => setTargetPercentage(Number(e.target.value))}
            className="w-full accent-[#323232] cursor-pointer"
          />
        </div>
      </div>

      {/* Subject Wise 80% Analysis Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[#323232] flex items-center gap-2">
          <Target className="w-5 h-5 text-[#323232]" /> Subject-wise Target Analysis & Bunk Margin
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map(subj => {
            const isSafe = subj.percentage >= targetPercentage;

            return (
              <div
                key={subj.subjectId}
                className={`cream-card p-5 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] relative transition-all shadow-[3px_3px_0px_#323232]`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-black text-[#323232]">{subj.subjectName}</h4>
                    <p className="text-xs font-bold text-gray-700">
                      Handled by: <span className="underline font-extrabold text-[#323232]">{subj.staffName}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#323232]">{subj.percentage}%</span>
                    <div className="text-[10px] font-bold text-gray-600">
                      {subj.attended}/{subj.totalConducted} Class(es)
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#DDD0C8] border-2 border-[#323232] h-4 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-[#323232] h-full transition-all"
                    style={{ width: `${Math.min(100, subj.percentage)}%` }}
                  />
                </div>

                {/* Specific Commands Calculation Output */}
                <div className="mt-4 pt-3 border-t-2 border-[#323232]/15">
                  {subj.totalConducted === 0 ? (
                    <div className="p-3 bg-[#DDD0C8] border border-[#323232]/30 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#323232] shrink-0" />
                      <span>No classes recorded yet for this subject. Attend the first class!</span>
                    </div>
                  ) : !isSafe ? (
                    <div className="p-3 bg-[#E8DFD9] border-2 border-[#323232] rounded-lg text-xs font-bold text-[#323232] flex items-start gap-2 shadow-[2px_2px_0px_#323232]">
                      <AlertTriangle className="w-5 h-5 text-[#323232] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-extrabold text-sm text-[#323232]">
                          ⚠️ ATTENDANCE SHORTAGE!
                        </div>
                        <p className="mt-0.5">
                          To reach minimum {targetPercentage}%, you <span className="underline font-black">MUST ATTEND</span> next{' '}
                          <span className="px-2 py-0.5 bg-[#323232] text-[#DDD0C8] font-black rounded">{subj.classesToAttendFor80Pct}</span>{' '}
                          consecutive class(es) properly without missing!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#DDD0C8] border-2 border-[#323232] rounded-lg text-xs font-bold text-[#323232] flex items-start gap-2 shadow-[2px_2px_0px_#323232]">
                      <ShieldCheck className="w-5 h-5 text-[#323232] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-extrabold text-sm text-[#323232]">
                          ✅ SAFE ATTENDANCE MARGIN
                        </div>
                        <p className="mt-0.5">
                          You can <span className="underline font-black text-[#323232]">SAFELY BUNK</span> up to{' '}
                          <span className="px-2 py-0.5 bg-[#323232] text-[#DDD0C8] font-black rounded">{subj.safeBunkCount}</span>{' '}
                          class(es) while maintaining above {targetPercentage}% attendance!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date-wise Bunk Recommendations Table */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-[#323232] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#323232]" /> Date-Wise Smart Bunk Recommendation Planner
            </h3>
            <p className="text-xs font-semibold text-gray-700 mt-0.5">
              Specific date & period recommendations on which classes are safe to skip vs which you must attend.
            </p>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-xs font-bold text-gray-600 italic">No upcoming classes scheduled in the next 7 days.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#323232] bg-[#DDD0C8]">
                  <th className="p-3 font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">Date & Day</th>
                  <th className="p-3 font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">Period</th>
                  <th className="p-3 font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">Subject Name</th>
                  <th className="p-3 font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">Staff Name</th>
                  <th className="p-3 font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">Recommendation</th>
                  <th className="p-3 font-extrabold text-xs text-[#323232]">Reason & Advice</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((rec, i) => (
                  <tr key={i} className="border-b border-[#323232]/10 hover:bg-[#DDD0C8]">
                    <td className="p-3 text-xs font-black text-[#323232] border-r border-[#323232]/10">
                      {rec.date} ({rec.dayName})
                    </td>
                    <td className="p-3 text-xs font-extrabold text-[#323232] border-r border-[#323232]/10">
                      Period {rec.periodNumber}
                    </td>
                    <td className="p-3 text-xs font-black text-[#323232] border-r border-[#323232]/10">
                      {rec.subjectName}
                    </td>
                    <td className="p-3 text-xs font-bold text-gray-700 border-r border-[#323232]/10">
                      {rec.staffName}
                    </td>
                    <td className="p-3 text-xs border-r border-[#323232]/10 font-black">
                      {rec.recommendation === 'SAFE_TO_BUNK' ? (
                        <span className="px-2.5 py-1 bg-[#323232] text-[#DDD0C8] border border-[#323232] rounded-full font-black text-[11px]">
                          🟢 SAFE TO BUNK
                        </span>
                      ) : rec.recommendation === 'MUST_ATTEND' ? (
                        <span className="px-2.5 py-1 bg-[#F4ECE6] text-[#323232] border-2 border-[#323232] rounded-full font-black text-[11px]">
                          🔴 MUST ATTEND
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-[#DDD0C8] text-[#323232] border border-[#323232]/40 rounded-full font-bold text-[11px]">
                          ⚪ NEUTRAL
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-xs font-bold text-[#323232]">
                      {rec.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
