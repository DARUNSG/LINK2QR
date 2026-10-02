import React, { useState, useEffect } from 'react';
import { PeriodSlot, Subject, TimetableCell, AttendanceRecord, DayOfWeek, DAYS_OF_WEEK } from '../types/student';
import { Clock, CheckCircle2, XCircle, AlertCircle, User, CalendarDays } from 'lucide-react';

interface TodayScheduleProps {
  periods: PeriodSlot[];
  subjects: Subject[];
  timetable: TimetableCell[];
  attendance: AttendanceRecord[];
  onMarkAttendance: (periodNumber: number, subjectId: string, status: 'PRESENT' | 'ABSENT' | 'CANCELLED') => void;
  onNavigateToSetup: () => void;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({
  periods,
  subjects,
  timetable,
  attendance,
  onMarkAttendance,
  onNavigateToSetup,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => {
    const dayIdx = new Date().getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
    return dayIdx === 0 ? 'Monday' : DAYS_OF_WEEK[dayIdx - 1];
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const subjectMap = new Map(subjects.map(s => [s.id, s]));

  // Today's date string YYYY-MM-DD
  const todayDateStr = currentTime.toISOString().split('T')[0];

  // Get slots for selected day
  const daySlots = timetable.filter(t => t.day === selectedDay);

  // Time helper to parse "HH:MM" into minutes from midnight
  const parseMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Find active period
  const activePeriod = periods.find(p => {
    const start = parseMinutes(p.startTime);
    const end = parseMinutes(p.endTime);
    return currentMinutes >= start && currentMinutes <= end;
  });

  // Find upcoming period
  const nextPeriod = periods
    .filter(p => parseMinutes(p.startTime) > currentMinutes)
    .sort((a, b) => parseMinutes(a.startTime) - parseMinutes(b.startTime))[0];

  const getAttendanceForPeriod = (periodNum: number, subjectId: string) => {
    return attendance.find(
      a => a.date === todayDateStr && a.periodNumber === periodNum && a.subjectId === subjectId
    );
  };

  return (
    <div className="space-y-6">
      {/* Live Clock & Active Period Banner */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#323232]">
              <Clock className="w-4 h-4 text-[#323232]" /> Live Schedule Monitor
            </div>
            <h2 className="text-3xl font-black text-[#323232] mt-1">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h2>
            <p className="text-sm font-semibold text-gray-700 mt-1">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Active Period Status Card */}
          <div className="p-4 rounded-lg bg-[#DDD0C8] border-2 border-[#323232] min-w-[260px] shadow-[2px_2px_0px_#323232]">
            {activePeriod ? (
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-[#323232] text-[#DDD0C8] text-xs font-black rounded-full mb-1">
                  🔴 CLASS IN PROGRESS
                </span>
                <h4 className="font-extrabold text-lg text-[#323232]">
                  Period {activePeriod.periodNumber} ({activePeriod.startTime} - {activePeriod.endTime})
                </h4>
                {(() => {
                  const slot = daySlots.find(s => s.periodNumber === activePeriod.periodNumber);
                  const subj = slot ? subjectMap.get(slot.subjectId) : null;
                  return subj ? (
                    <div className="mt-1">
                      <div className="font-bold text-[#323232]">{subj.name}</div>
                      <div className="text-xs font-semibold text-gray-700 flex items-center gap-1 mt-0.5">
                        <User className="w-3.5 h-3.5 text-[#323232]" /> Handled by {subj.staffName}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs font-black text-[#323232] mt-1 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#323232] text-[#DDD0C8] font-black rounded text-[11px]">[ - ]</span> Free Period / No Class
                    </div>
                  );
                })()}
              </div>
            ) : nextPeriod ? (
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-[#323232] text-[#DDD0C8] text-xs font-black rounded-full mb-1">
                  ⏱️ NEXT UPCOMING CLASS
                </span>
                <h4 className="font-extrabold text-base text-[#323232]">
                  Period {nextPeriod.periodNumber} ({nextPeriod.startTime} - {nextPeriod.endTime})
                </h4>
                {(() => {
                  const slot = daySlots.find(s => s.periodNumber === nextPeriod.periodNumber);
                  const subj = slot ? subjectMap.get(slot.subjectId) : null;
                  return subj ? (
                    <div className="mt-1">
                      <div className="font-bold text-[#323232]">{subj.name}</div>
                      <div className="text-xs font-semibold text-gray-700">
                        This subject handled by <span className="font-black underline text-[#323232]">{subj.staffName}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs font-black text-[#323232] mt-1 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#323232] text-[#DDD0C8] font-black rounded text-[11px]">[ - ]</span> Free Period / No Class
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-2">
                <span className="text-[#323232] font-extrabold text-sm">🎉 Classes Done For Today</span>
                <p className="text-xs font-semibold text-gray-600 mt-1">Enjoy your rest!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold border-2 border-[#323232] transition-all ${
                isSelected
                  ? 'bg-[#323232] text-[#DDD0C8] shadow-[3px_3px_0px_#323232]'
                  : 'bg-[#DDD0C8] text-[#323232] hover:bg-[#F4ECE6]'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Period Cards List */}
      {daySlots.length === 0 ? (
        <div className="cream-card p-8 text-center rounded-xl bg-[#F4ECE6] border-2 border-[#323232] shadow-[4px_4px_0px_#323232]">
          <CalendarDays className="w-12 h-12 text-[#323232] mx-auto mb-3" />
          <h3 className="text-xl font-black text-[#323232]">No Class Schedule Set for {selectedDay}</h3>
          <p className="text-xs font-semibold text-gray-700 mt-1 max-w-md mx-auto">
            You haven't uploaded or configured your timetable periods for {selectedDay} yet.
          </p>
          <button
            onClick={onNavigateToSetup}
            className="grey-btn px-5 py-2.5 rounded-lg text-xs font-extrabold mt-4 shadow-[2px_2px_0px_#323232]"
          >
            ✏️ Upload / Setup Timetable Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {periods.map((p) => {
            const slot = daySlots.find(s => s.periodNumber === p.periodNumber);
            const subject = slot ? subjectMap.get(slot.subjectId) : null;
            const currentAtt = subject ? getAttendanceForPeriod(p.periodNumber, subject.id) : null;
            const isCurrentActive = activePeriod?.periodNumber === p.periodNumber;

            return (
              <div
                key={p.periodNumber}
                className={`cream-card p-5 rounded-xl border-2 border-[#323232] transition-all relative ${
                  isCurrentActive ? 'ring-4 ring-[#323232]/30 bg-[#E8DFD9]' : 'bg-[#F4ECE6] shadow-[3px_3px_0px_#323232]'
                }`}
              >
                {isCurrentActive && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#323232] text-[#DDD0C8] text-[10px] font-black rounded-full uppercase">
                    Active Class
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-md bg-[#323232] text-[#DDD0C8] font-black text-sm flex items-center justify-center border border-[#323232] shadow-[1px_1px_0px_#323232]">
                    {p.periodNumber}
                  </span>
                  <div>
                    <h4 className="font-black text-base text-[#323232]">
                      Period {p.periodNumber}
                    </h4>
                    <p className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#323232]" /> {p.startTime} - {p.endTime}
                    </p>
                  </div>
                </div>

                {subject ? (
                  <div className="mt-4 pt-3 border-t-2 border-[#323232]/15">
                    <h3 className="text-lg font-black text-[#323232] tracking-tight">{subject.name}</h3>
                    
                    <div className="mt-1.5 p-2 bg-[#DDD0C8] border border-[#323232]/30 rounded-md">
                      <p className="text-xs font-bold text-[#323232] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#323232] shrink-0" />
                        <span>This subject handled by <span className="font-extrabold underline">{subject.staffName}</span></span>
                      </p>
                    </div>

                    {/* Attendance Controls */}
                    <div className="mt-4">
                      <div className="text-xs font-black text-[#323232] mb-1.5 flex items-center justify-between">
                        <span>Mark Attendance for Today:</span>
                        {currentAtt && (
                          <span className="font-black underline uppercase text-[11px] text-[#323232]">
                            Status: {currentAtt.status}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => onMarkAttendance(p.periodNumber, subject.id, 'PRESENT')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-extrabold border-2 border-[#323232] transition-all flex items-center justify-center gap-1 ${
                            currentAtt?.status === 'PRESENT'
                              ? 'bg-[#323232] text-[#DDD0C8] shadow-[2px_2px_0px_#323232]'
                              : 'bg-[#DDD0C8] text-[#323232] hover:bg-[#CEBFB6]'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </button>

                        <button
                          onClick={() => onMarkAttendance(p.periodNumber, subject.id, 'ABSENT')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-extrabold border-2 border-[#323232] transition-all flex items-center justify-center gap-1 ${
                            currentAtt?.status === 'ABSENT'
                              ? 'bg-[#1E1E1E] text-white shadow-[2px_2px_0px_#323232]'
                              : 'bg-[#DDD0C8] text-[#323232] hover:bg-[#CEBFB6]'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </button>

                        <button
                          onClick={() => onMarkAttendance(p.periodNumber, subject.id, 'CANCELLED')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-extrabold border-2 border-[#323232] transition-all flex items-center justify-center gap-1 ${
                            currentAtt?.status === 'CANCELLED'
                              ? 'bg-[#CEBFB6] text-[#323232] shadow-[2px_2px_0px_#323232]'
                              : 'bg-[#DDD0C8] text-[#323232] hover:bg-[#CEBFB6]'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Cancelled
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t-2 border-[#323232]/10 text-center py-4 bg-[#DDD0C8]/40 rounded-lg border border-[#323232]/20">
                    <span className="inline-block px-3 py-1 bg-[#323232] text-[#DDD0C8] font-black text-sm rounded shadow-[1px_1px_0px_#323232]">
                      [ - ]
                    </span>
                    <p className="text-xs font-bold text-gray-700 mt-1">Free Period / No Class</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
