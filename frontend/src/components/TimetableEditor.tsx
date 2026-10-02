import React, { useState } from 'react';
import { PeriodSlot, Subject, TimetableCell, DAYS_OF_WEEK, DayOfWeek } from '../types/student';
import { Plus, Trash2, Camera, Eye, User, BookOpen, Clock, X, Image as ImageIcon, Sparkles, CheckCircle2, Bot } from 'lucide-react';
import { getStoredTimetableImage, saveStoredTimetableImage } from '../utils/storage';
import { analyzeTimetableImageAI } from '../utils/aiTimetableParser';

interface TimetableEditorProps {
  periods: PeriodSlot[];
  subjects: Subject[];
  timetable: TimetableCell[];
  onSaveSubjects: (subjects: Subject[]) => void;
  onSaveTimetable: (timetable: TimetableCell[]) => void;
  onSavePeriods: (periods: PeriodSlot[]) => void;
  onLoadDemo: () => void;
}

export const TimetableEditor: React.FC<TimetableEditorProps> = ({
  periods: initialPeriods,
  subjects: initialSubjects,
  timetable: initialTimetable,
  onSaveSubjects,
  onSaveTimetable,
  onSavePeriods,
  onLoadDemo,
}) => {
  const [subjectsList, setSubjectsList] = useState<Subject[]>(initialSubjects);
  const [periodsList, setPeriodsList] = useState<PeriodSlot[]>(initialPeriods);
  const [timetableMatrix, setTimetableMatrix] = useState<TimetableCell[]>(initialTimetable);
  const [timetablePhoto, setTimetablePhoto] = useState<string | null>(getStoredTimetableImage);
  const [showFullPhotoModal, setShowFullPhotoModal] = useState(false);

  // AI Scanner state
  const [isAIScanning, setIsAIScanning] = useState(false);
  const [aiDetectedSuccess, setAiDetectedSuccess] = useState<string | null>(null);

  // New subject inputs
  const [newSubjName, setNewSubjName] = useState('');
  const [newStaffName, setNewStaffName] = useState('');

  // Handle Photo Upload with Automatic AI Vision Timetable & Staff Detection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setTimetablePhoto(dataUrl);
      saveStoredTimetableImage(dataUrl);

      // Trigger Automatic AI Detection
      setIsAIScanning(true);
      setAiDetectedSuccess(null);

      setTimeout(async () => {
        const result = await analyzeTimetableImageAI(dataUrl);

        // Auto-add detected subjects with handling staff names
        const newSubjects: Subject[] = result.subjects.map((item, i) => ({
          id: `ai-subj-${Date.now()}-${i}`,
          name: item.name,
          staffName: item.staffName,
        }));

        setSubjectsList(newSubjects);
        onSaveSubjects(newSubjects);

        setPeriodsList(result.periods);
        onSavePeriods(result.periods);

        // Map AI detected subject IDs to timetable matrix safely (preserving free slots as [ - ])
        const aiMatrix: TimetableCell[] = result.timetable.map(cell => {
          if (!cell.subjectId) {
            return { ...cell, subjectId: '' }; // Free Period [ - ]
          }
          const parts = cell.subjectId.split('-');
          const num = Number(parts[parts.length - 1]);
          const matchingIdx = !isNaN(num) && num > 0 ? num - 1 : 0;
          const targetSubj = newSubjects[matchingIdx % newSubjects.length] || newSubjects[0];
          return {
            ...cell,
            subjectId: targetSubj ? targetSubj.id : '',
          };
        });

        setTimetableMatrix(aiMatrix);
        onSaveTimetable(aiMatrix);

        setIsAIScanning(false);
        setAiDetectedSuccess(`🤖 AI Vision Engine scanned timetable with ${result.confidenceScore}% accuracy! Detected ${result.detectedCount} active classes & ${result.freeSlotsCount} free periods marked as [ - ].`);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  // Remove Photo
  const handleRemovePhoto = () => {
    setTimetablePhoto(null);
    saveStoredTimetableImage(null);
    setAiDetectedSuccess(null);
  };

  // Add Subject
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;

    const newSubj: Subject = {
      id: `subj-${Date.now()}`,
      name: newSubjName.trim(),
      staffName: newStaffName.trim() || 'Staff Not Specified',
    };

    const updated = [...subjectsList, newSubj];
    setSubjectsList(updated);
    onSaveSubjects(updated);
    setNewSubjName('');
    setNewStaffName('');
  };

  // Delete Subject
  const handleDeleteSubject = (id: string) => {
    const updatedSubjs = subjectsList.filter(s => s.id !== id);
    const updatedTable = timetableMatrix.filter(t => t.subjectId !== id);
    setSubjectsList(updatedSubjs);
    setTimetableMatrix(updatedTable);
    onSaveSubjects(updatedSubjs);
    onSaveTimetable(updatedTable);
  };

  // Update Timetable Cell
  const handleCellChange = (day: DayOfWeek, periodNumber: number, subjectId: string) => {
    const filtered = timetableMatrix.filter(t => !(t.day === day && t.periodNumber === periodNumber));
    let updated: TimetableCell[];
    if (subjectId) {
      updated = [...filtered, { day, periodNumber, subjectId }];
    } else {
      updated = filtered;
    }
    setTimetableMatrix(updated);
    onSaveTimetable(updated);
  };

  // Period time edit
  const handlePeriodTimeChange = (periodNum: number, field: 'startTime' | 'endTime', val: string) => {
    const updated = periodsList.map(p => {
      if (p.periodNumber === periodNum) {
        return { ...p, [field]: val };
      }
      return p;
    });
    setPeriodsList(updated);
    onSavePeriods(updated);
  };

  // Add Period Slot
  const handleAddPeriodSlot = () => {
    const nextNum = periodsList.length + 1;
    const updated = [
      ...periodsList,
      { periodNumber: nextNum, startTime: '16:00', endTime: '17:00', label: `Period ${nextNum}` }
    ];
    setPeriodsList(updated);
    onSavePeriods(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#323232] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#323232]" /> Setup Timetable & Staff Info
          </h2>
          <p className="text-xs font-semibold text-gray-700 mt-1">
            Upload your timetable photo to automatically detect subjects, handling staff names, and weekly period schedules using AI Vision!
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onLoadDemo}
            className="cream-btn px-4 py-2 rounded-lg text-xs font-black"
          >
            ⚡ Load Sample Timetable
          </button>

          {/* 📷 Upload Timetable Photo Button */}
          <label className="grey-btn px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#323232]">
            <Camera className="w-4 h-4 text-[#DDD0C8]" /> 📷 Upload Timetable Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* AI Scanning Status Banner */}
      {isAIScanning && (
        <div className="cream-card p-6 text-center rounded-xl border-2 border-[#323232] bg-[#DDD0C8] shadow-[4px_4px_0px_#323232] animate-pulse">
          <Bot className="w-10 h-10 text-[#323232] mx-auto mb-2 animate-bounce" />
          <h4 className="font-black text-lg text-[#323232]">🤖 AI Vision Engine Scanning Timetable Photo...</h4>
          <p className="text-xs font-bold text-gray-700 mt-1">
            Extracting subject names, handling staff details, period slots, and weekly class schedule automatically!
          </p>
        </div>
      )}

      {/* AI Success Notification */}
      {aiDetectedSuccess && !isAIScanning && (
        <div className="p-4 bg-[#323232] text-[#DDD0C8] border-2 border-[#323232] rounded-xl text-xs font-black flex items-center justify-between shadow-[3px_3px_0px_#323232]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#DDD0C8]" />
            <span>{aiDetectedSuccess}</span>
          </div>
          <button
            onClick={() => setAiDetectedSuccess(null)}
            className="p-1 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 📷 Timetable Photo Reference Card */}
      {timetablePhoto ? (
        <div className="cream-card p-5 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-black text-[#323232]">
              <ImageIcon className="w-5 h-5 text-[#323232]" />
              <span>Uploaded Timetable Photo Reference</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFullPhotoModal(true)}
                className="grey-btn px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 shadow-[2px_2px_0px_#323232]"
              >
                <Eye className="w-3.5 h-3.5" /> View Full Photo
              </button>
              <label className="cream-btn px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer">
                <Camera className="w-3.5 h-3.5 text-[#323232]" /> Replace Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              <button
                onClick={handleRemovePhoto}
                className="p-1.5 border-2 border-[#323232] bg-[#DDD0C8] hover:bg-[#323232] hover:text-[#DDD0C8] text-[#323232] rounded-md transition-all"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Thumbnail preview */}
          <div
            onClick={() => setShowFullPhotoModal(true)}
            className="cursor-pointer border-2 border-[#323232] rounded-lg overflow-hidden bg-[#DDD0C8] max-h-64 flex items-center justify-center p-2 group relative"
          >
            <img
              src={timetablePhoto}
              alt="Uploaded Timetable Photo"
              className="max-h-60 object-contain rounded"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#DDD0C8] font-black text-xs gap-1.5">
              <Eye className="w-4 h-4" /> Click to Zoom Full Image
            </div>
          </div>
        </div>
      ) : (
        <div className="cream-card p-6 text-center rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
          <Camera className="w-10 h-10 text-[#323232] mx-auto mb-2" />
          <h4 className="font-extrabold text-base text-[#323232]">No Timetable Photo Uploaded Yet</h4>
          <p className="text-xs font-semibold text-gray-700 mt-0.5 max-w-md mx-auto">
            Upload a picture of your class timetable from your phone gallery or camera. AI Vision will automatically detect your subjects, staff names, and period schedule!
          </p>
          <label className="grey-btn px-5 py-2.5 rounded-lg text-xs font-black mt-3 inline-flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#323232]">
            <Camera className="w-4 h-4" /> 📷 Select Timetable Photo (AI Auto-Detect)
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>
      )}

      {/* Full Photo Modal */}
      {showFullPhotoModal && timetablePhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="cream-card p-4 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#323232] mb-3">
              <h3 className="font-black text-lg text-[#323232] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#323232]" /> Original Uploaded Timetable Photo
              </h3>
              <button
                onClick={() => setShowFullPhotoModal(false)}
                className="p-1.5 border-2 border-[#323232] rounded-lg bg-[#DDD0C8] hover:bg-[#323232] hover:text-[#DDD0C8] text-[#323232] font-black text-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto flex-1 flex items-center justify-center p-2 bg-[#DDD0C8] rounded-lg">
              <img
                src={timetablePhoto}
                alt="Full Timetable Photo"
                className="max-w-full max-h-[75vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Manage Subjects & Staff */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <h3 className="text-xl font-black text-[#323232] mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#323232]" /> Step 1: Subjects & Handling Staff Names
        </h3>

        <form onSubmit={handleAddSubject} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div>
            <label className="block text-xs font-black uppercase text-[#323232] mb-1">Subject Name</label>
            <input
              type="text"
              placeholder="e.g. Mathematics, Physics, Data Structures"
              value={newSubjName}
              onChange={(e) => setNewSubjName(e.target.value)}
              className="w-full p-2.5 rounded-lg border-2 border-[#323232] bg-[#DDD0C8] text-xs font-bold text-[#323232] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-[#323232] mb-1">Handling Staff Name</label>
            <input
              type="text"
              placeholder="e.g. Prof. Sharma, Dr. Anitha"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              className="w-full p-2.5 rounded-lg border-2 border-[#323232] bg-[#DDD0C8] text-xs font-bold text-[#323232] focus:outline-none"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="grey-btn w-full py-2.5 px-4 rounded-lg text-xs font-black shadow-[2px_2px_0px_#323232]"
            >
              + Add Subject & Staff
            </button>
          </div>
        </form>

        {/* Existing Subjects List */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase text-[#323232]">Current Subjects List ({subjectsList.length})</h4>
          {subjectsList.length === 0 ? (
            <p className="text-xs font-bold text-gray-600 italic">No subjects added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {subjectsList.map((s, idx) => (
                <div key={s.id} className="p-3 bg-[#DDD0C8] border-2 border-[#323232] rounded-lg flex items-center justify-between shadow-[2px_2px_0px_#323232]">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#323232] text-[#DDD0C8] rounded mr-2">
                      #{idx + 1}
                    </span>
                    <span className="font-extrabold text-sm text-[#323232]">{s.name}</span>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">
                      This subject handled by <span className="underline">{s.staffName}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSubject(s.id)}
                    className="p-1 bg-[#F4ECE6] border border-[#323232] hover:bg-[#323232] hover:text-[#DDD0C8] text-[#323232] rounded transition-all ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Period Timings Editor */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-[#323232] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#323232]" /> Step 2: Period Timing Configuration
          </h3>
          <button
            onClick={handleAddPeriodSlot}
            className="cream-btn px-3 py-1.5 rounded-lg text-xs font-extrabold"
          >
            + Add Period Slot
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {periodsList.map((p) => (
            <div key={p.periodNumber} className="p-3 bg-[#DDD0C8] border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232]">
              <div className="font-black text-xs text-[#323232] border-b border-[#323232]/20 pb-1 mb-2">
                Period {p.periodNumber}
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-700 block">Start Time:</label>
                <input
                  type="time"
                  value={p.startTime}
                  onChange={(e) => handlePeriodTimeChange(p.periodNumber, 'startTime', e.target.value)}
                  className="w-full text-xs font-bold p-1 border border-[#323232] rounded bg-[#F4ECE6] text-[#323232]"
                />
                <label className="text-[10px] font-bold text-gray-700 block mt-1">End Time:</label>
                <input
                  type="time"
                  value={p.endTime}
                  onChange={(e) => handlePeriodTimeChange(p.periodNumber, 'endTime', e.target.value)}
                  className="w-full text-xs font-bold p-1 border border-[#323232] rounded bg-[#F4ECE6] text-[#323232]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Timetable Matrix Builder */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <h3 className="text-xl font-black text-[#323232] mb-4">
          Step 3: Map Periods (1, 2, 3, 4...) for Each Day (Monday - Saturday)
        </h3>

        {subjectsList.length === 0 ? (
          <div className="p-4 bg-[#DDD0C8] border border-[#323232]/30 rounded-lg text-xs font-bold text-[#323232]">
            Please add at least 1 subject in Step 1 or upload your timetable photo to auto-detect.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="border-b-2 border-[#323232] bg-[#DDD0C8]">
                  <th className="p-3 text-left font-black text-xs uppercase text-[#323232] border-r-2 border-[#323232]">
                    Day / Period
                  </th>
                  {periodsList.map(p => (
                    <th key={p.periodNumber} className="p-3 text-center font-extrabold text-xs text-[#323232] border-r border-[#323232]/20">
                      Period {p.periodNumber}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS_OF_WEEK.map((day) => (
                  <tr key={day} className="border-b border-[#323232]/20 hover:bg-[#DDD0C8]">
                    <td className="p-3 font-extrabold text-xs text-[#323232] border-r-2 border-[#323232] bg-[#DDD0C8]">
                      {day}
                    </td>
                    {periodsList.map(p => {
                      const currentCell = timetableMatrix.find(t => t.day === day && t.periodNumber === p.periodNumber);
                      const validSubjectId = subjectsList.some(s => s.id === currentCell?.subjectId) ? currentCell?.subjectId : '';
                      return (
                        <td key={p.periodNumber} className="p-2 border-r border-[#323232]/20 text-center">
                          <select
                            value={validSubjectId || ''}
                            onChange={(e) => handleCellChange(day, p.periodNumber, e.target.value)}
                            className="w-full text-xs font-extrabold p-2 border-2 border-[#323232] rounded-lg bg-[#F4ECE6] text-[#323232] focus:outline-none"
                          >
                            <option value="">[ - ] Free Period</option>
                            {subjectsList.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.staffName})
                              </option>
                            ))}
                          </select>
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
    </div>
  );
};
