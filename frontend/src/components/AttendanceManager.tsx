import React, { useState } from 'react';
import { Subject, TimetableCell, AttendanceRecord, PeriodSlot, DAYS_OF_WEEK, DayOfWeek } from '../types/student';
import { CheckCircle2, XCircle, AlertCircle, Plus, Trash2, Calendar, User, BookOpen } from 'lucide-react';

interface AttendanceManagerProps {
  periods: PeriodSlot[];
  subjects: Subject[];
  timetable: TimetableCell[];
  attendance: AttendanceRecord[];
  onAddAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  onDeleteAttendance: (id: string) => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  periods,
  subjects,
  timetable,
  attendance,
  onAddAttendance,
  onDeleteAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedPeriodNumber, setSelectedPeriodNumber] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<'PRESENT' | 'ABSENT' | 'CANCELLED'>('PRESENT');

  React.useEffect(() => {
    if (!subjects.some(s => s.id === selectedSubjectId) && subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // Compute total weekly period counts per subject
  const weeklyCounts: Record<string, number> = {};
  timetable.forEach(cell => {
    if (cell.subjectId) {
      weeklyCounts[cell.subjectId] = (weeklyCounts[cell.subjectId] || 0) + 1;
    }
  });

  const subjectMap = new Map(subjects.map(s => [s.id, s]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) return;

    const dateObj = new Date(selectedDate);
    const dayIdx = dateObj.getDay();
    const dayName = dayIdx === 0 ? 'Monday' : DAYS_OF_WEEK[dayIdx - 1];

    onAddAttendance({
      date: selectedDate,
      day: dayName,
      periodNumber: selectedPeriodNumber,
      subjectId: selectedSubjectId,
      status: selectedStatus,
    });
  };

  return (
    <div className="space-y-6">
      {/* Subject Weekly Breakdown Cards */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <h2 className="text-2xl font-black text-[#323232] flex items-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-[#323232]" /> Weekly Period Allocation per Subject
        </h2>
        <p className="text-xs font-semibold text-gray-700 mb-4">
          Shows total scheduled periods in one week for each subject.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {subjects.map(subj => {
            const count = weeklyCounts[subj.id] || 0;
            return (
              <div key={subj.id} className="p-4 bg-[#DDD0C8] border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232]">
                <h4 className="font-extrabold text-base text-[#323232]">{subj.name}</h4>
                <p className="text-xs font-bold text-gray-700 mt-0.5">
                  Handled by: <span className="underline text-[#323232]">{subj.staffName}</span>
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-[#323232]/20 pt-2">
                  <span className="text-xs font-bold text-gray-700">Weekly Classes:</span>
                  <span className="px-2.5 py-0.5 bg-[#323232] text-[#DDD0C8] font-black text-xs rounded-full">
                    {count} period(s) / week
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Attendance Entry Form */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <h3 className="text-xl font-black text-[#323232] flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-[#323232]" /> Manual Attendance Logger
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-[#323232] mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2.5 rounded-lg border-2 border-[#323232] bg-[#DDD0C8] text-sm font-bold text-[#323232] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#323232] mb-1">Subject & Staff</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full p-2.5 rounded-lg border-2 border-[#323232] bg-[#DDD0C8] text-sm font-bold text-[#323232] focus:outline-none"
              required
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.staffName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#323232] mb-1">Period Number</label>
            <select
              value={selectedPeriodNumber}
              onChange={(e) => setSelectedPeriodNumber(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border-2 border-[#323232] bg-[#DDD0C8] text-sm font-bold text-[#323232] focus:outline-none"
            >
              {periods.map(p => (
                <option key={p.periodNumber} value={p.periodNumber}>
                  Period {p.periodNumber} ({p.startTime} - {p.endTime})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#323232] mb-1">Attendance Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full p-2.5 rounded-lg border-2 border-[#323232] bg-[#DDD0C8] text-sm font-bold text-[#323232] focus:outline-none"
            >
              <option value="PRESENT">✅ PRESENT</option>
              <option value="ABSENT">❌ ABSENT (Bunked)</option>
              <option value="CANCELLED">⚠️ CANCELLED</option>
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="grey-btn px-6 py-2.5 rounded-lg text-xs font-black shadow-[2px_2px_0px_#323232]"
            >
              + Save Attendance Entry
            </button>
          </div>
        </form>
      </div>

      {/* Attendance History Log */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <h3 className="text-xl font-black text-[#323232] mb-4">Recorded Attendance Logs</h3>

        {attendance.length === 0 ? (
          <p className="text-xs font-bold text-gray-600 italic">No attendance records logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#323232] bg-[#DDD0C8]">
                  <th className="p-3 font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">Date & Day</th>
                  <th className="p-3 font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">Period</th>
                  <th className="p-3 font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">Subject Name</th>
                  <th className="p-3 font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">Staff Name</th>
                  <th className="p-3 font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">Status</th>
                  <th className="p-3 font-extrabold text-xs text-[#323232] text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {attendance
                  .slice()
                  .reverse()
                  .map((rec) => {
                    const subj = subjectMap.get(rec.subjectId);
                    return (
                      <tr key={rec.id} className="border-b border-[#323232]/10 hover:bg-[#DDD0C8]">
                        <td className="p-3 text-xs font-bold text-[#323232] border-r border-[#323232]/10">
                          {rec.date} ({rec.day})
                        </td>
                        <td className="p-3 text-xs font-black text-[#323232] border-r border-[#323232]/10">
                          Period {rec.periodNumber}
                        </td>
                        <td className="p-3 text-xs font-extrabold text-[#323232] border-r border-[#323232]/10">
                          {subj?.name || rec.subjectId}
                        </td>
                        <td className="p-3 text-xs font-bold text-gray-700 border-r border-[#323232]/10">
                          {subj?.staffName || 'N/A'}
                        </td>
                        <td className="p-3 text-xs font-black border-r border-[#323232]/10">
                          <span
                            className={`px-2 py-0.5 rounded-full border ${
                              rec.status === 'PRESENT'
                                ? 'bg-[#323232] text-[#DDD0C8] border-[#323232]'
                                : rec.status === 'ABSENT'
                                ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                                : 'bg-[#DDD0C8] text-[#323232] border-[#323232]'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => onDeleteAttendance(rec.id)}
                            className="p-1.5 bg-[#DDD0C8] border border-[#323232] hover:bg-[#323232] hover:text-[#DDD0C8] rounded transition-all text-[#323232]"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
