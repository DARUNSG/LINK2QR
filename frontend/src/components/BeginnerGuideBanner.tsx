import React from 'react';
import { Calendar, Users, Clock, Sparkles, HelpCircle, Zap } from 'lucide-react';

interface BeginnerGuideBannerProps {
  onLoadDemo: () => void;
  onOpenHowItWorks: () => void;
}

export const BeginnerGuideBanner: React.FC<BeginnerGuideBannerProps> = ({
  onLoadDemo,
  onOpenHowItWorks,
}) => {
  return (
    <div className="w-full bg-[#ffffff] border-2 border-[#111111] p-6 mb-10 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e1e1e]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#111111] text-[#ffffff] text-[10px] font-satoshi font-bold tracking-[0.2em] uppercase mb-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>BEGINNER QUICK START</span>
          </div>
          <h3 className="font-clash font-bold text-xl sm:text-2xl text-[#111111] uppercase tracking-wide">
            3 EASY STEPS TO FIND A GLOBAL MEETING TIME
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onLoadDemo}
            className="px-4 py-2 bg-[#111111] text-[#ffffff] text-xs font-satoshi font-bold tracking-wider uppercase hover:bg-[#1e1e1e] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>TRY SAMPLE MEETING</span>
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="px-4 py-2 bg-[#f2f2f2] border border-[#111111] text-[#111111] text-xs font-satoshi font-bold tracking-wider uppercase hover:bg-[#ffffff] transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FULL GUIDE</span>
          </button>
        </div>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        
        {/* Step 1 */}
        <div className="p-4 bg-[#f2f2f2] border border-[#1e1e1e]/10 flex items-start gap-3">
          <div className="p-2 bg-[#111111] text-[#ffffff] shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-satoshi font-bold tracking-widest text-[#838282] uppercase">
              STEP 1
            </div>
            <h4 className="font-clash font-bold text-sm text-[#111111] uppercase tracking-wide">
              CHOOSE MEETING DATE
            </h4>
            <p className="text-xs text-[#838282] mt-0.5">
              Select the day you want to meet. Offsets & daylight savings adjust automatically.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-4 bg-[#f2f2f2] border border-[#1e1e1e]/10 flex items-start gap-3">
          <div className="p-2 bg-[#111111] text-[#ffffff] shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-satoshi font-bold tracking-widest text-[#838282] uppercase">
              STEP 2
            </div>
            <h4 className="font-clash font-bold text-sm text-[#111111] uppercase tracking-wide">
              ADD TEAM & WORK HOURS
            </h4>
            <p className="text-xs text-[#838282] mt-0.5">
              Add participants, choose their city, and set when they are available to work.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-4 bg-[#f2f2f2] border border-[#1e1e1e]/10 flex items-start gap-3">
          <div className="p-2 bg-[#111111] text-[#ffffff] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-satoshi font-bold tracking-widest text-[#838282] uppercase">
              STEP 3
            </div>
            <h4 className="font-clash font-bold text-sm text-[#111111] uppercase tracking-wide">
              PICK OVERLAP & COPY
            </h4>
            <p className="text-xs text-[#838282] mt-0.5">
              Click any black bar on the timeline to see everyone's clock, then copy details!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
