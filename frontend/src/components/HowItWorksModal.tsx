import React from 'react';
import { X, CheckCircle2, Sparkles } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#ffffff] border border-[#111111] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#838282] hover:text-[#111111] hover:bg-[#f2f2f2] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 border-b border-[#1e1e1e]/10 pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#111111] text-[#ffffff] text-[10px] font-satoshi font-bold tracking-[0.2em] uppercase mb-2">
            <Sparkles className="w-3 h-3" />
            <span>BEGINNER FRIENDLY GUIDE</span>
          </div>
          <h2 className="font-clash font-bold text-2xl sm:text-3xl text-[#111111] uppercase tracking-wide">
            HOW TIMESYNC WORKS (4 EASY STEPS)
          </h2>
        </div>

        {/* Guide Content in Plain Beginner Language */}
        <div className="space-y-6 text-sm font-satoshi text-[#111111]">
          
          {/* Step 1 */}
          <div className="flex gap-4 items-start bg-[#f2f2f2] p-4 border border-[#1e1e1e]/10">
            <div className="w-8 h-8 rounded-none bg-[#111111] text-[#ffffff] font-clash font-bold text-sm flex items-center justify-center shrink-0">
              01
            </div>
            <div>
              <h3 className="font-clash font-bold text-lg text-[#111111] uppercase tracking-wide">
                PICK A MEETING DATE
              </h3>
              <p className="text-xs text-[#838282] leading-relaxed mt-1">
                Select the day you want to meet. Time zone differences and daylight savings are calculated for you automatically.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start bg-[#f2f2f2] p-4 border border-[#1e1e1e]/10">
            <div className="w-8 h-8 rounded-none bg-[#111111] text-[#ffffff] font-clash font-bold text-sm flex items-center justify-center shrink-0">
              02
            </div>
            <div>
              <h3 className="font-clash font-bold text-lg text-[#111111] uppercase tracking-wide">
                ADD PEOPLE & THEIR WORKING HOURS
              </h3>
              <p className="text-xs text-[#838282] leading-relaxed mt-1">
                Add team members from around the world. Select their city and choose when they are available to work (e.g. 09:00 to 18:00).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 items-start bg-[#f2f2f2] p-4 border border-[#1e1e1e]/10">
            <div className="w-8 h-8 rounded-none bg-[#111111] text-[#ffffff] font-clash font-bold text-sm flex items-center justify-center shrink-0">
              03
            </div>
            <div>
              <h3 className="font-clash font-bold text-lg text-[#111111] uppercase tracking-wide">
                SEE WHEN EVERYONE IS FREE
              </h3>
              <p className="text-xs text-[#838282] leading-relaxed mt-1">
                The app automatically highlights times when everyone is awake and working. Look for the black bars on the 24-hour timeline!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 items-start bg-[#f2f2f2] p-4 border border-[#1e1e1e]/10">
            <div className="w-8 h-8 rounded-none bg-[#111111] text-[#ffffff] font-clash font-bold text-sm flex items-center justify-center shrink-0">
              04
            </div>
            <div>
              <h3 className="font-clash font-bold text-lg text-[#111111] uppercase tracking-wide">
                PICK A TIME & COPY THE SUMMARY
              </h3>
              <p className="text-xs text-[#838282] leading-relaxed mt-1">
                Click any suggested time to see everyone's local clock time (with ☀️ Day, 🌅 Evening, 🌙 Night indicators), then copy the summary with 1 click!
              </p>
            </div>
          </div>

        </div>

        {/* Footer Button */}
        <div className="mt-8 pt-4 border-t border-[#1e1e1e]/10 text-right">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#111111] text-[#ffffff] text-xs font-satoshi font-bold tracking-wider uppercase hover:bg-[#1e1e1e] transition-colors inline-flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>GOT IT, GO TO PLANNER</span>
          </button>
        </div>

      </div>
    </div>
  );
};
