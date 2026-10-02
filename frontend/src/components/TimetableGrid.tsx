import React, { useState } from 'react';
import { PeriodSlot, Subject, TimetableCell, DAYS_OF_WEEK, DayOfWeek } from '../types/student';
import { User, Clock, Calendar, Printer, Camera, Eye, X } from 'lucide-react';
import { getStoredTimetableImage } from '../utils/storage';

interface TimetableGridProps {
  periods: PeriodSlot[];
  subjects: Subject[];
  timetable: TimetableCell[];
  onNavigateToSetup: () => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  periods,
  subjects,
  timetable,
  onNavigateToSetup,
}) => {
  const [photo, setPhoto] = useState<string | null>(getStoredTimetableImage);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const subjectMap = new Map(subjects.map(s => [s.id, s]));

  const getCellData = (day: DayOfWeek, periodNumber: number) => {
    const slot = timetable.find(t => t.day === day && t.periodNumber === periodNumber);
    if (!slot) return null;
    return subjectMap.get(slot.subjectId) || null;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#323232] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#323232]" /> Weekly Class Timetable Matrix
          </h2>
          <p className="text-xs font-semibold text-gray-700 mt-1">
            Complete period-by-period view (1, 2, 3, 4...) with subject names and handling staff info.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {photo && (
            <button
              onClick={() => setShowPhotoModal(true)}
              className="cream-btn px-3.5 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-[#323232]" /> 📷 View Timetable Photo
            </button>
          )}
          <button
            onClick={handlePrint}
            className="cream-btn px-3.5 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Timetable
          </button>
          <button
            onClick={onNavigateToSetup}
            className="grey-btn px-4 py-2 rounded-lg text-xs font-extrabold shadow-[2px_2px_0px_#323232]"
          >
            ✏️ Edit Timetable
          </button>
        </div>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && photo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="cream-card p-4 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#323232] mb-3">
              <h3 className="font-black text-lg text-[#323232] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#323232]" /> Uploaded Timetable Photo
              </h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="p-1.5 border-2 border-[#323232] rounded-lg bg-[#DDD0C8] hover:bg-[#323232] hover:text-[#DDD0C8] font-black text-xs text-[#323232]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto flex-1 flex items-center justify-center p-2 bg-[#DDD0C8] rounded-lg">
              <img
                src={photo}
                alt="Uploaded Timetable Photo"
                className="max-w-full max-h-[75vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {subjects.length === 0 || timetable.length === 0 ? (
        <div className="cream-card p-10 text-center rounded-xl bg-[#F4ECE6] border-2 border-[#323232] shadow-[4px_4px_0px_#323232]">
          <Calendar className="w-12 h-12 text-[#323232] mx-auto mb-3" />
          <h3 className="text-xl font-extrabold text-[#323232]">No Timetable Uploaded Yet</h3>
          <p className="text-xs font-semibold text-gray-700 mt-1">
            Click "Upload / Setup" in the menu or use the button below to upload your timetable photo and add your subjects.
          </p>
          <button
            onClick={onNavigateToSetup}
            className="grey-btn px-6 py-2.5 rounded-lg text-xs font-extrabold mt-4 shadow-[2px_2px_0px_#323232]"
          >
            📷 Upload Timetable Photo & Setup
          </button>
        </div>
      ) : (
        <div className="cream-card p-4 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232] overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b-2 border-[#323232] bg-[#DDD0C8]">
                <th className="p-3 text-left font-black text-xs uppercase tracking-wider text-[#323232] border-r-2 border-[#323232] w-32">
                  Day / Period
                </th>
                {periods.map(p => (
                  <th key={p.periodNumber} className="p-3 text-center font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">
                    <div>Period {p.periodNumber}</div>
                    <div className="text-[10px] font-bold text-gray-600 flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5 text-[#323232]" /> {p.startTime} - {p.endTime}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS_OF_WEEK.map((day, idx) => (
                <tr key={day} className={`border-b border-[#323232]/20 ${idx % 2 === 0 ? 'bg-[#F4ECE6]' : 'bg-[#EAE2DC]'}`}>
                  <td className="p-3 font-extrabold text-sm text-[#323232] border-r-2 border-[#323232] bg-[#DDD0C8]">
                    {day}
                  </td>
                  {periods.map(p => {
                    const subj = getCellData(day, p.periodNumber);
                    return (
                      <td key={p.periodNumber} className="p-3 text-center border-r border-[#323232]/10 align-top min-w-[140px]">
                        {subj ? (
                          <div className="p-2.5 bg-[#DDD0C8] border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232] text-left">
                            <div className="text-xs font-black text-[#323232] leading-snug">
                              {subj.name}
                            </div>
                            
                            <div className="mt-1.5 pt-1.5 border-t border-[#323232]/20 text-[11px] font-bold text-gray-700">
                              <span className="text-[10px] text-gray-600 block">Handled by:</span>
                              <span className="font-extrabold text-[#323232]">{subj.staffName}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-4 text-center">
                            <span className="inline-block px-2.5 py-0.5 bg-[#323232] text-[#DDD0C8] font-black text-xs rounded border border-[#323232]">
                              [ - ]
                            </span>
                            <span className="text-[10px] font-bold text-gray-700 block mt-1">Free Period</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
