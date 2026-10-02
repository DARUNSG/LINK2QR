import React, { useState, useEffect } from 'react';

interface LiveAnalogClockProps {
  size?: number; // size in px, default 36 (w-9 h-9)
}

export const LiveAnalogClock: React.FC<LiveAnalogClockProps> = ({ size = 36 }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [secondAngle, setSecondAngle] = useState<number>(0);

  useEffect(() => {
    let animId: number;
    const updateClock = () => {
      const now = new Date();
      setTime(now);
      const ms = now.getMilliseconds();
      const secs = now.getSeconds();
      setSecondAngle(((secs + ms / 1000) / 60) * 360);
      animId = requestAnimationFrame(updateClock);
    };

    animId = requestAnimationFrame(updateClock);
    return () => cancelAnimationFrame(animId);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Angles in degrees
  const minuteAngle = (minutes + seconds / 60) * 6; // 360 / 60 = 6 deg per min
  const hourAngle = ((hours % 12) + minutes / 60) * 30; // 360 / 12 = 30 deg per hr

  return (
    <div
      className="relative flex items-center justify-center bg-[#111111] border border-[#1e1e1e] rounded-full group-hover:bg-[#f2f2f2] group-hover:border-[#111111] transition-colors duration-200 select-none overflow-hidden"
      style={{ width: `${size}px`, height: `${size}px` }}
      title={`Live Local Time: ${time.toLocaleTimeString()}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className="w-full h-full"
      >
        {/* Outer Circular Clock Ring */}
        <circle
          cx="20"
          cy="20"
          r="16.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="text-[#f2f2f2] group-hover:text-[#111111] transition-colors"
        />

        {/* 12 Hour Ticks inside the circle representing every hour */}
        {[...Array(12)].map((_, i) => {
          const angle = i * 30; // 360 / 12 = 30 deg per hour
          const isCardinal = i % 3 === 0;
          return (
            <line
              key={i}
              x1="20"
              y1="5.5"
              x2="20"
              y2={isCardinal ? "8" : "7"}
              stroke="currentColor"
              strokeWidth={isCardinal ? "1.5" : "1"}
              className="text-[#f2f2f2] group-hover:text-[#111111]"
              style={{
                transformOrigin: '20px 20px',
                transform: `rotate(${angle}deg)`,
              }}
            />
          );
        })}

        {/* Hour Hand */}
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="11"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-[#f2f2f2] group-hover:text-[#111111] transition-transform duration-300"
          style={{
            transformOrigin: '20px 20px',
            transform: `rotate(${hourAngle}deg)`,
          }}
        />

        {/* Minute Hand */}
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="7.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="text-[#f2f2f2] group-hover:text-[#111111] transition-transform duration-300"
          style={{
            transformOrigin: '20px 20px',
            transform: `rotate(${minuteAngle}deg)`,
          }}
        />

        {/* Sky Blue Smooth Seconds Hand */}
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="6"
          stroke="#38bdf8"
          strokeWidth="1.25"
          strokeLinecap="round"
          style={{
            transformOrigin: '20px 20px',
            transform: `rotate(${secondAngle}deg)`,
          }}
        />

        {/* Center Pin Dot */}
        <circle
          cx="20"
          cy="20"
          r="1.75"
          fill="currentColor"
          className="text-[#f2f2f2] group-hover:text-[#111111]"
        />
      </svg>
    </div>
  );
};
