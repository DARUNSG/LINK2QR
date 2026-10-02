import React, { useState } from 'react';
import { Participant } from '../types/planner';
import { getParticipantLocalTime, generateMeetingSummaryText } from '../utils/timezoneUtils';
import { Copy, Check, FileText } from 'lucide-react';

interface MeetingSummaryProps {
  selectedDate: string;
  selectedTimeUtc: string;
  participants: Participant[];
}

export const MeetingSummary: React.FC<MeetingSummaryProps> = ({
  selectedDate,
  selectedTimeUtc,
  participants,
}) => {
  const [meetingTitle, setMeetingTitle] = useState('GLOBAL TEAM ALIGNMENT');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = generateMeetingSummaryText(meetingTitle, selectedDate, selectedTimeUtc, participants);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full bg-[#ffffff] border border-[#1e1e1e]/15 p-8 mb-16 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1e1e1e]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase mb-1">
            <FileText className="w-4 h-4 text-[#111111]" />
            <span>FINAL MEETING SUMMARY</span>
          </div>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            className="font-clash font-bold text-3xl uppercase tracking-tight text-[#111111] bg-transparent border-b border-transparent hover:border-[#1e1e1e]/20 focus:border-[#111111] focus:outline-none py-0.5"
            placeholder="EDIT MEETING TITLE..."
          />
        </div>

        <button
          onClick={handleCopy}
          className={`px-6 py-3.5 text-xs font-satoshi font-bold tracking-[0.15em] uppercase flex items-center gap-2 transition-all duration-200 border border-[#111111] ${
            copied
              ? 'bg-[#111111] text-[#ffffff]'
              : 'bg-[#111111] text-[#ffffff] hover:bg-[#1e1e1e]'
          }`}
        >
          {copied ? <Check className="w-4 h-4 text-[#ffffff]" /> : <Copy className="w-4 h-4 text-[#ffffff]" />}
          <span>{copied ? 'SUMMARY COPIED!' : 'COPY MEETING SUMMARY →'}</span>
        </button>
      </div>

      {/* Editorial Card Layout */}
      <div className="mt-8 bg-[#f2f2f2] border border-[#1e1e1e]/10 p-6 md:p-8 font-satoshi">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Metadata */}
          <div>
            <div className="text-xs font-bold text-[#838282] uppercase tracking-wider mb-1">
              MEETING DATE & REFERENCE TIME
            </div>
            <div className="font-clash font-bold text-2xl text-[#111111]">
              {selectedDate}
            </div>
            <div className="font-clash font-bold text-xl text-[#838282] mt-1">
              {selectedTimeUtc} UTC
            </div>

            <div className="mt-6 text-xs text-[#838282]">
              Copying sends a clean formatted plaintext summary directly to your clipboard for easy pasting into Slack, Teams, Email, or Calendar invites.
            </div>
          </div>

          {/* Right Participant Times List */}
          <div className="border-t md:border-t-0 md:border-l border-[#1e1e1e]/10 pt-6 md:pt-0 md:pl-8">
            <div className="text-xs font-bold text-[#838282] uppercase tracking-wider mb-4">
              CONVERTED LOCAL TIMES FOR ALL PARTICIPANTS
            </div>

            <div className="space-y-3">
              {participants.map((p) => {
                const local = getParticipantLocalTime(selectedDate, selectedTimeUtc, p);

                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-2 border-b border-[#1e1e1e]/10 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-clash font-bold text-[#111111] uppercase">
                        {p.countryName || p.cityName}
                      </span>
                      <span className="text-xs text-[#838282]">({p.name})</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono font-bold text-[#111111]">
                      <span>{local.formattedTime12}</span>
                      {local.dateStatus !== 'SAME DAY' && (
                        <span className="text-[10px] font-satoshi font-bold tracking-wider px-1.5 py-0.5 bg-[#111111] text-[#ffffff] uppercase">
                          {local.dateStatus}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
