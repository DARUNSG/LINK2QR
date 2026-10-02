import React, { useState, useEffect } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { DateTime } from 'luxon';

export const DigitalHeroTimer: React.FC = () => {
  const [time, setTime] = useState(DateTime.now());
  const [isStopwatch, setIsStopwatch] = useState(false);
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Live Clock Ticker (updates every 100ms for smooth live digital time ticking)
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(DateTime.now());
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch interval if user toggles to stopwatch mode
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isStopwatch && isRunning) {
      interval = setInterval(() => {
        setStopwatchMs((prev) => prev + 10);
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStopwatch, isRunning]);

  // Format Clock Time (12-hour format)
  const hours = time.toFormat('hh');
  const minutes = time.toFormat('mm');
  const seconds = time.toFormat('ss');
  const ampm = time.toFormat('a');

  // Format Stopwatch Time
  const swMinutes = String(Math.floor((stopwatchMs / 60000) % 60)).padStart(2, '0');
  const swSeconds = String(Math.floor((stopwatchMs / 1000) % 60)).padStart(2, '0');
  const swMillis = String(Math.floor((stopwatchMs % 1000) / 10)).padStart(2, '0');

  return (
    <div className="mt-4 mb-4 flex flex-col items-center select-none">
      {/* Clean Brutalist Digital Box */}
      <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#111111] text-[#f2f2f2] border border-[#1e1e1e] shadow-lg rounded-none transition-all">
        
        {/* Digital Time Numbers Display */}
        {!isStopwatch ? (
          <div className="flex items-center gap-2 font-mono font-bold tracking-widest text-2xl sm:text-3xl tabular-nums text-[#ffffff]">
            <span>{hours}</span>
            <span className="animate-pulse text-[#b6b5b5]">:</span>
            <span>{minutes}</span>
            <span className="animate-pulse text-[#b6b5b5]">:</span>
            <span className="text-emerald-400">{seconds}</span>
            <span className="text-xs font-satoshi font-bold text-[#b6b5b5] ml-1 uppercase">{ampm}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 font-mono font-bold tracking-widest text-2xl sm:text-3xl tabular-nums text-emerald-400">
            <span>{swMinutes}</span>
            <span>:</span>
            <span>{swSeconds}</span>
            <span className="text-lg text-[#b6b5b5]">.{swMillis}</span>
          </div>
        )}

        {/* Stopwatch Controls & Mode Toggle */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#ffffff]/15">
          {isStopwatch && (
            <div className="flex items-center gap-1 mr-1">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className="p-1 hover:bg-[#ffffff]/10 text-[#ffffff] transition-colors"
                title={isRunning ? "Pause" : "Start"}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={() => { setIsRunning(false); setStopwatchMs(0); }}
                className="p-1 hover:bg-[#ffffff]/10 text-[#b6b5b5] transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Toggle Button Mode */}
          <button
            type="button"
            onClick={() => {
              setIsStopwatch(!isStopwatch);
              if (!isStopwatch) setIsRunning(true);
            }}
            className="text-[10px] font-satoshi font-bold tracking-wider px-2.5 py-1 bg-[#ffffff]/10 hover:bg-[#ffffff]/20 text-[#ffffff] uppercase border border-[#ffffff]/20 transition-colors cursor-pointer"
          >
            {isStopwatch ? 'CLOCK' : 'STOPWATCH'}
          </button>
        </div>

      </div>

      {/* Date & UTC Sub-note */}
      <span className="mt-2 text-[10px] font-mono tracking-widest text-[#838282] uppercase">
        {time.toFormat('EEEE, MMMM dd, yyyy')} • UTC {time.toUTC().toFormat('HH:mm:ss')}
      </span>
    </div>
  );
};
