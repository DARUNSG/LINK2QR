import React, { useState, useEffect } from 'react';
import { Globe, Compass, Sun, Sunset, Moon, Sparkles } from 'lucide-react';
import { DayPhaseIcon, getDayPhaseInfo } from './DayPhaseIcon';

export const AsymmetricalShowcase: React.FC = () => {
  const [currentLocalTimeStr, setCurrentLocalTimeStr] = useState<string>('12:00');
  const [overridePhase, setOverridePhase] = useState<'DAYTIME' | 'EVENING' | 'NIGHT' | null>(null);
  const [smoothSecondAngle, setSmoothSecondAngle] = useState<number>(0);
  const [minuteAngle, setMinuteAngle] = useState<number>(0);
  const [hourAngle, setHourAngle] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentLocalTimeStr(`${h}:${m}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 60FPS Continuous Smooth Sweeping Clock Hands (Hour, Minute, & Second Rods)
  useEffect(() => {
    let animId: number;
    const updateSmoothHands = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const secs = now.getSeconds();
      const mins = now.getMinutes();
      const hrs = now.getHours();

      const sAngle = ((secs + ms / 1000) / 60) * 360;
      const mAngle = (mins + secs / 60) * 6;
      const hAngle = ((hrs % 12) + mins / 60) * 30;

      setSmoothSecondAngle(sAngle);
      setMinuteAngle(mAngle);
      setHourAngle(hAngle);

      animId = requestAnimationFrame(updateSmoothHands);
    };

    animId = requestAnimationFrame(updateSmoothHands);
    return () => cancelAnimationFrame(animId);
  }, []);

  const realPhaseInfo = getDayPhaseInfo(currentLocalTimeStr);
  const activePhase = overridePhase || realPhaseInfo.phase;

  // Cycle phase on click for preview capability
  const cyclePhase = () => {
    if (activePhase === 'DAYTIME') setOverridePhase('EVENING');
    else if (activePhase === 'EVENING') setOverridePhase('NIGHT');
    else setOverridePhase('DAYTIME');
  };

  return (
    <section id="timezones-grid" className="w-full py-20 px-6 bg-[#f2f2f2] border-t border-[#1e1e1e]/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="text-xs font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase mb-2">
            GEOMETRIC TIME MECHANICS
          </div>
          <h2 className="font-clash font-bold text-3xl sm:text-4xl text-[#111111] uppercase tracking-wide">
            THE ARCHITECTURE OF TIME ZONES
          </h2>
        </div>

        {/* 12-Column Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* 1. Large 8-Column Rectangular Card */}
          <div className="md:col-span-8 bg-[#ffffff] border border-[#1e1e1e]/15 p-8 flex flex-col justify-between group overflow-hidden editorial-media-card">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase">
                  CARD 01 / 8-COL RECTANGLE
                </span>
                <Globe className="w-5 h-5 text-[#111111]" />
              </div>
              <h3 className="font-clash font-bold text-2xl text-[#111111] uppercase tracking-wide mb-2">
                GLOBAL TIME MATRIX
              </h3>
              <p className="font-satoshi text-xs text-[#838282] max-w-lg mb-6">
                Visualizing synchronized timeline coordinates across 24 standard IANA offset bands.
              </p>
            </div>

            {/* Abstract Monochromatic Visual */}
            <div className="w-full h-56 bg-[#f2f2f2] border border-[#1e1e1e]/10 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
              
              {/* Geometric Clock Matrix Bars */}
              <div className="relative z-10 w-full px-8 flex items-end justify-between gap-1 h-32">
                {[40, 65, 30, 85, 95, 50, 75, 45, 90, 60, 80, 55, 70, 85, 40, 95, 60, 75, 50, 80, 65, 90, 45, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
                    <div
                      className="w-full bg-[#111111] group-hover/bar:bg-[#838282] transition-all duration-300"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[8px] font-mono text-[#838282] hidden lg:block">
                      {String(i).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Vertical 4-Column Pill-Shaped Card */}
          <div className="md:col-span-4 bg-[#1e1e1e] text-[#ffffff] border border-[#1e1e1e] p-8 rounded-[9999px] flex flex-col items-center justify-between text-center group overflow-hidden editorial-media-card min-h-[420px]">
            <div className="pt-6">
              <span className="text-[10px] font-satoshi font-bold tracking-[0.2em] text-[#b6b5b5] uppercase block mb-2">
                CARD 02 / 4-COL PILL
              </span>
              <h3 className="font-clash font-bold text-2xl text-[#ffffff] uppercase tracking-wide">
                UTC ROTATOR
              </h3>
            </div>

            {/* Abstract Rotator Graphic */}
            <div className="w-36 h-36 rounded-full border-2 border-dashed border-[#ffffff]/30 flex items-center justify-center relative group-hover:rotate-90 transition-transform duration-700">
              <div className="w-24 h-24 rounded-full border border-[#ffffff]/60 flex items-center justify-center">
                <Compass className="w-10 h-10 text-[#ffffff]" />
              </div>
            </div>

            <div className="pb-6">
              <span className="font-mono text-xs text-[#b6b5b5] block">
                OFFSET RANGE: -12.0 TO +14.0
              </span>
            </div>
          </div>

          {/* 3. Circular 5-Column Aspect-Square Element (DYNAMIC DUAL SOLAR & LUNAR CIRCLE DIAL) */}
          <div
            onClick={cyclePhase}
            className={`md:col-span-5 border p-8 rounded-full aspect-square flex flex-col items-center justify-center text-center group overflow-hidden editorial-media-card shadow-md cursor-pointer transition-all duration-700 relative ${
              activePhase === 'DAYTIME'
                ? 'bg-[#ffffff] border-[#1e1e1e]/15 text-[#111111]'
                : activePhase === 'EVENING'
                ? 'bg-[#fff8f0] border-orange-200 text-[#111111]'
                : 'bg-[#111625] border-indigo-900 text-[#ffffff]'
            }`}
            title="Click to toggle between Sun ☀️, Sunset 🌅, and Moon 🌙 preview phases"
          >
            <h3 className="font-clash font-bold text-2xl uppercase tracking-wide mb-0.5">
              24-HOUR SOLAR DIAL
            </h3>

            {/* 1,440 Minutes in a Day Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 border border-sky-400/30 rounded-full my-1">
              <span className="font-mono font-bold text-xs text-sky-400 tracking-wider">
                ⏱️ 1,440 MINUTES / DAY
              </span>
            </div>

            {/* Geometric Dynamic Circle showing Sun, Sunset, or Moon */}
            <div className="w-44 h-44 rounded-full border flex items-center justify-center relative my-3 transition-all duration-700 shadow-inner overflow-hidden">
              <div className="absolute inset-2 rounded-full border border-dashed animate-[spin_60s_linear_infinite] opacity-60" />

              {/* 1. Hour Rod (Short, Bold) */}
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center z-10"
                style={{ transform: `rotate(${hourAngle}deg)` }}
              >
                <div className="w-[3.5px] h-[48px] bg-amber-400 shadow-[0_0_8px_#f59e0b] absolute top-[40px] rounded-full" />
              </div>

              {/* 2. Minute Rod (Medium, Semi-transparent White) */}
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center z-15"
                style={{ transform: `rotate(${minuteAngle}deg)` }}
              >
                <div className="w-[2.5px] h-[62px] bg-slate-200 shadow-[0_0_8px_rgba(255,255,255,0.7)] absolute top-[26px] rounded-full" />
              </div>

              {/* 3. Sky Blue Smooth Sweeping Seconds Rod (60FPS non tik-tik) */}
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center z-20"
                style={{ transform: `rotate(${smoothSecondAngle}deg)` }}
              >
                {/* Sky Blue Seconds Rod pointing upward from center */}
                <div className="w-[2px] h-[74px] bg-sky-400 shadow-[0_0_12px_#38bdf8] absolute top-3 rounded-full" />
                {/* Center Pivot Cap */}
                <div className="w-3.5 h-3.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8] border-2 border-white z-30" />
              </div>

              {/* DAYTIME PHASE (06:00 - 17:00): SUN ☀️ */}
              {activePhase === 'DAYTIME' && (
                <div className="flex flex-col items-center justify-center text-amber-500 animate-fadeIn">
                  <div className="p-2 bg-amber-50 rounded-full border border-amber-200 shadow-sm mb-0.5 animate-pulse">
                    <Sun className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="font-satoshi font-bold text-xs text-[#111111] block mt-0.5 tracking-wider">
                    SUN ☀️ DAYTIME
                  </span>
                  <span className="font-mono text-[9px] font-bold text-sky-500 uppercase tracking-wider block mt-0.5">
                    1,440 MINS / DAY
                  </span>
                  <span className="font-mono text-[8px] text-[#838282] uppercase tracking-wider block">
                    06:00 — 17:00 LOCAL
                  </span>
                </div>
              )}

              {/* EVENING PHASE (17:00 - 21:00): SUNSET 🌅 */}
              {activePhase === 'EVENING' && (
                <div className="flex flex-col items-center justify-center text-orange-500 animate-fadeIn">
                  <div className="p-2 bg-orange-100 rounded-full border border-orange-300 shadow-sm mb-0.5 animate-pulse">
                    <Sunset className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="font-satoshi font-bold text-xs text-[#111111] block mt-0.5 tracking-wider">
                    SUNSET 🌅 EVENING
                  </span>
                  <span className="font-mono text-[9px] font-bold text-sky-500 uppercase tracking-wider block mt-0.5">
                    1,440 MINS / DAY
                  </span>
                  <span className="font-mono text-[8px] text-orange-700 uppercase tracking-wider block">
                    17:00 — 21:00 LOCAL
                  </span>
                </div>
              )}

              {/* NIGHT PHASE (21:00 - 06:00): MOON 🌙 */}
              {activePhase === 'NIGHT' && (
                <div className="flex flex-col items-center justify-center text-indigo-300 animate-fadeIn">
                  <div className="p-2 bg-indigo-950 rounded-full border border-indigo-700 shadow-sm mb-0.5 animate-pulse">
                    <Moon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3 text-indigo-300" />
                    <span className="font-satoshi font-bold text-xs text-[#ffffff] block tracking-wider">
                      MOON 🌙 NIGHT
                    </span>
                  </div>
                  <span className="font-mono text-[9px] font-bold text-sky-300 uppercase tracking-wider block mt-0.5">
                    1,440 MINS / DAY
                  </span>
                  <span className="font-mono text-[8px] text-indigo-200 uppercase tracking-wider block">
                    21:00 — 06:00 LOCAL
                  </span>
                </div>
              )}
            </div>

            <p className={`font-satoshi text-xs max-w-xs ${activePhase === 'NIGHT' ? 'text-indigo-200/80' : 'text-[#838282]'}`}>
              {activePhase === 'DAYTIME' && 'Daytime phase active: Sun is above the horizon.'}
              {activePhase === 'EVENING' && 'Evening phase active: Sunset twilight transition.'}
              {activePhase === 'NIGHT' && 'Nighttime phase active: Moon & night sky.'}
            </p>

            <span className="text-[9px] font-mono opacity-50 uppercase mt-2">
              (CLICK CIRCLE TO TOGGLE PREVIEW)
            </span>
          </div>

          {/* 4. Wide 7-Column Rectangle (SUN & SHIFT HORIZON WITH LIVE PHASE INDICATOR) */}
          <div className="md:col-span-7 bg-[#ffffff] border border-[#1e1e1e]/15 p-8 flex flex-col justify-between group overflow-hidden editorial-media-card">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase">
                  CARD 04 / 7-COL RECTANGLE
                </span>
                
                {/* Real-time Solar Phase Icons (Sun, Sunset, Moon) */}
                <div className="flex items-center gap-3 px-3 py-1 bg-[#f2f2f2] border border-[#1e1e1e]/15">
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 ${realPhaseInfo.phase === 'DAYTIME' ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300' : 'opacity-40'}`}>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[9px] uppercase">DAY</span>
                  </div>

                  <div className={`flex items-center gap-1 px-1.5 py-0.5 ${realPhaseInfo.phase === 'EVENING' ? 'bg-orange-100 text-orange-800 font-bold border border-orange-300' : 'opacity-40'}`}>
                    <Sunset className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-[9px] uppercase">SUNSET</span>
                  </div>

                  <div className={`flex items-center gap-1 px-1.5 py-0.5 ${realPhaseInfo.phase === 'NIGHT' ? 'bg-indigo-900 text-white font-bold' : 'opacity-40'}`}>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[9px] uppercase">NIGHT</span>
                  </div>
                </div>
              </div>

              <h3 className="font-clash font-bold text-2xl text-[#111111] uppercase tracking-wide mb-2">
                SUN & SHIFT HORIZON
              </h3>
              <p className="font-satoshi text-xs text-[#838282] mb-6">
                Dynamic Solar Tracker: Shows Sun (Daytime 06-17h), Sunset (Evening 17-21h), or Moon (Night 21-06h) based on local time coordinates.
              </p>
            </div>

            {/* Interactive Solar Phase Graphic Container */}
            <div className="w-full bg-[#111111] p-6 text-[#ffffff] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <DayPhaseIcon time24Str={currentLocalTimeStr} size={20} showLabel={true} className="text-amber-400 font-clash" />
                  <span className="text-xs font-mono opacity-60">| CURRENT LOCAL: {currentLocalTimeStr}</span>
                </div>
                <span className="font-clash font-bold text-3xl block mt-1">09:00 — 18:00</span>
                <span className="font-satoshi text-xs text-[#bfbfbf] uppercase tracking-wider">STANDARD WORK HORIZON</span>
              </div>

              <div className="flex items-center gap-2 relative z-10 self-start sm:self-auto">
                <div className="px-3 py-1.5 bg-[#ffffff]/10 border border-[#ffffff]/20 text-xs font-mono font-bold">
                  {realPhaseInfo.phase === 'DAYTIME' && '☀️ 06:00 - 17:00 (DAY)'}
                  {realPhaseInfo.phase === 'EVENING' && '🌅 17:00 - 21:00 (SUNSET)'}
                  {realPhaseInfo.phase === 'NIGHT' && '🌙 21:00 - 06:00 (NIGHT)'}
                </div>
              </div>

              <div className="w-28 h-28 rounded-full border-4 border-[#ffffff]/10 absolute -right-6 -bottom-6 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
