import React, { useState } from 'react';
import { Subject, TimetableCell, AttendanceRecord } from '../types/student';
import { runAIAttendanceEngine, answerStudentAIQuery } from '../utils/aiAttendanceEngine';
import { Sparkles, Bot, ShieldCheck, AlertTriangle, Send, User, CheckCircle2 } from 'lucide-react';

interface AIAttendanceAssistantProps {
  subjects: Subject[];
  timetable: TimetableCell[];
  attendance: AttendanceRecord[];
}

export const AIAttendanceAssistant: React.FC<AIAttendanceAssistantProps> = ({
  subjects,
  timetable,
  attendance,
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'USER' | 'AI'; text: string }>>([
    {
      sender: 'AI',
      text: '🤖 Hello! I am your ClassMate AI Attendance & Bunk Predictor Engine. I analyze your timetable, weekly classes, handling staff info, and predict your attendance score. Ask me anything!',
    },
  ]);

  const aiEngineResult = runAIAttendanceEngine(subjects, timetable, attendance, 80);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const queryText = userQuery.trim();
    setUserQuery('');

    const aiReply = answerStudentAIQuery(queryText, subjects, timetable, attendance);

    setChatMessages(prev => [
      ...prev,
      { sender: 'USER', text: queryText },
      { sender: 'AI', text: aiReply },
    ]);
  };

  const handleQuickPrompt = (promptText: string) => {
    const aiReply = answerStudentAIQuery(promptText, subjects, timetable, attendance);
    setChatMessages(prev => [
      ...prev,
      { sender: 'USER', text: promptText },
      { sender: 'AI', text: aiReply },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-[#323232] text-[#DDD0C8] text-xs font-black rounded-full mb-2 uppercase flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" /> ClassMate Vision & Attendance AI Engine
            </span>
            <h2 className="text-3xl font-black text-[#323232] tracking-tight">
              AI Attendance Detector & Semester Predictor
            </h2>
            <p className="text-xs font-semibold text-gray-700 mt-1">
              Automated detection of timetable schedules, weekly class periods, staff names, and AI attendance forecasting.
            </p>
          </div>

          {/* AI Risk Score Badge */}
          <div className="p-4 rounded-lg bg-[#DDD0C8] border-2 border-[#323232] text-center min-w-[220px] shadow-[2px_2px_0px_#323232]">
            <div className="text-xs font-black uppercase text-gray-700">AI Overall Risk Status</div>
            <div className="text-2xl font-black text-[#323232] mt-1 flex items-center justify-center gap-1.5">
              {aiEngineResult.overallRiskLevel === 'SAFE' ? (
                <>
                  <ShieldCheck className="w-6 h-6 text-[#323232]" />
                  <span>ZONE SAFE</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-[#323232]" />
                  <span>ACTION NEEDED</span>
                </>
              )}
            </div>
            <div className="text-xs font-bold text-gray-700 mt-1">
              Predicted Semester Score: <span className="font-black text-[#323232] underline">{aiEngineResult.overallPredictedPct}%</span>
            </div>
          </div>
        </div>

        {/* AI Summary Bar */}
        <div className="mt-4 p-3 bg-[#DDD0C8] border-2 border-[#323232] rounded-lg text-xs font-black text-[#323232]">
          {aiEngineResult.aiSummaryReport}
        </div>
      </div>

      {/* Subject-Wise AI Predictions */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[#323232] flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#323232]" /> Subject-Wise AI Risk Forecast & Recommended Action Plans
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiEngineResult.predictions.map(pred => (
            <div
              key={pred.subjectId}
              className="cream-card p-5 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[3px_3px_0px_#323232]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-lg font-black text-[#323232]">{pred.subjectName}</h4>
                  <p className="text-xs font-bold text-gray-700 mt-0.5">
                    This subject handled by <span className="underline font-black">{pred.staffName}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#323232]">{pred.currentPct}%</span>
                  <div className="text-[10px] font-bold text-gray-600">
                    Est. Semester: {pred.predictedSemesterPct}%
                  </div>
                </div>
              </div>

              {/* AI Advice Box */}
              <div className="mt-3 p-3 bg-[#DDD0C8] border border-[#323232]/30 rounded-lg text-xs font-bold text-[#323232]">
                {pred.aiAdvice}
              </div>

              {/* Action Plan */}
              <div className="mt-2.5 p-3 bg-[#323232] text-[#DDD0C8] rounded-lg text-xs font-black flex items-start gap-2 shadow-[2px_2px_0px_#323232]">
                <CheckCircle2 className="w-4 h-4 text-[#DDD0C8] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase text-[#DDD0C8]/80 block">AI Recommended Action Plan:</span>
                  <span>{pred.recommendedAction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive AI Chat Assistant Widget */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <h3 className="text-xl font-black text-[#323232] flex items-center gap-2 mb-3">
          <Bot className="w-5 h-5 text-[#323232]" /> 🤖 Ask ClassMate AI Assistant
        </h3>
        <p className="text-xs font-semibold text-gray-700 mb-4">
          Ask any question about your timetable, bunk limits, staff details, or attendance goals.
        </p>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleQuickPrompt('Can I bunk tomorrow?')}
            className="cream-btn px-3 py-1.5 rounded-lg text-xs font-extrabold"
          >
            ❓ Can I bunk tomorrow?
          </button>
          <button
            onClick={() => handleQuickPrompt('Show my attendance percentage')}
            className="cream-btn px-3 py-1.5 rounded-lg text-xs font-extrabold"
          >
            📊 Attendance Summary
          </button>
          <button
            onClick={() => handleQuickPrompt('Show staff details')}
            className="cream-btn px-3 py-1.5 rounded-lg text-xs font-extrabold"
          >
            👨‍🏫 Staff Handling List
          </button>
        </div>

        {/* Chat Log */}
        <div className="space-y-3 max-h-80 overflow-y-auto p-4 bg-[#DDD0C8] border-2 border-[#323232] rounded-xl mb-4">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-xl text-xs max-w-lg font-bold border-2 ${
                  msg.sender === 'USER'
                    ? 'bg-[#323232] text-[#DDD0C8] border-[#323232] rounded-br-none shadow-[2px_2px_0px_#323232]'
                    : 'bg-[#F4ECE6] text-[#323232] border-[#323232] rounded-bl-none shadow-[2px_2px_0px_#323232]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Query Input */}
        <form onSubmit={handleSendQuery} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI: e.g. Can I skip Monday period 1?"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="flex-1 p-3 rounded-lg border-2 border-[#323232] bg-[#DDD0C8] text-xs font-bold text-[#323232] focus:outline-none"
          />
          <button
            type="submit"
            className="grey-btn px-5 py-3 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#323232]"
          >
            <Send className="w-4 h-4" /> Send AI
          </button>
        </form>
      </div>
    </div>
  );
};
