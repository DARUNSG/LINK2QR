import React, { useEffect, useRef } from 'react';
import { clamp01, smoothstep } from '../utils/math';

interface TextWindowProps {
  title: string;
  subtitle?: string;
  startSp: number;
  endSp: number;
  isAct6?: boolean;
}

const TextBlock: React.FC<TextWindowProps & { blockRef: React.RefObject<HTMLDivElement | null> }> = ({
  title,
  subtitle,
  blockRef,
}) => {
  const titleLetters = title.split('');
  const subLetters = subtitle ? subtitle.split('') : [];

  return (
    <div
      ref={blockRef}
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-4"
      style={{ opacity: 0, visibility: 'hidden', willChange: 'opacity, transform, filter' }}
    >
      <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase mb-4 text-[#f2f3f5] drop-shadow-[0_0_20px_rgba(224,32,43,0.4)]">
        {titleLetters.map((char, i) => (
          <span
            key={i}
            className="letter-span inline-block transition-none"
            style={{ willChange: 'transform, opacity, filter', backfaceVisibility: 'hidden' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
      {subtitle && (
        <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-widest text-[#9a8a8d] uppercase">
          {subLetters.map((char, i) => (
            <span
              key={i}
              className="sub-letter-span inline-block transition-none"
              style={{ willChange: 'transform, opacity, filter', backfaceVisibility: 'hidden' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>
      )}
    </div>
  );
};

export const DOMOverlay: React.FC = () => {
  const b1Ref = useRef<HTMLDivElement>(null);
  const b2Ref = useRef<HTMLDivElement>(null);
  const b3Ref = useRef<HTMLDivElement>(null);
  const b4Ref = useRef<HTMLDivElement>(null);
  const b5Ref = useRef<HTMLDivElement>(null);
  const b6Ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let animId: number;

    const animateDOM = () => {
      animId = requestAnimationFrame(animateDOM);
      if (!window.__SCROLL_STATE) return;

      const { sp, p } = window.__SCROLL_STATE;

      // Define windows on sp axis (Acts 1-5) and real p (Act 6)
      const windows = [
        { ref: b1Ref, start: 0.00, end: 0.16, useP: false },
        { ref: b2Ref, start: 0.18, end: 0.34, useP: false },
        { ref: b3Ref, start: 0.36, end: 0.52, useP: false },
        { ref: b4Ref, start: 0.54, end: 0.70, useP: false },
        { ref: b5Ref, start: 0.72, end: 0.85, useP: false },
        { ref: b6Ref, start: 0.86, end: 1.00, useP: true },
      ];

      windows.forEach(({ ref, start, end, useP }) => {
        const elem = ref.current;
        if (!elem) return;

        const val = useP ? p : sp;
        // Fade in first 35%, hold mid 30%, fade out last 35%
        const fadeInEnd = start + (end - start) * 0.35;
        const fadeOutStart = start + (end - start) * 0.65;

        const inProgress = smoothstep(start, fadeInEnd, val);
        const outProgress = 1 - smoothstep(fadeOutStart, end, val);
        const opacity = Math.min(inProgress, outProgress);

        if (opacity < 0.01) {
          elem.style.opacity = '0';
          elem.style.visibility = 'hidden';
          return;
        }

        elem.style.visibility = 'visible';
        elem.style.opacity = opacity.toFixed(3);

        // Letter-level staggered blur & translate animations
        const letterSpans = elem.querySelectorAll<HTMLSpanElement>('.letter-span, .sub-letter-span');
        const count = letterSpans.length;

        if (count === 0) return;

        // Front-to-back arrival (inProgress), Back-to-front leaving (outProgress)
        letterSpans.forEach((span, idx) => {
          let letterAlpha = 1;
          let blurPx = 0;
          let translateY = 0;

          if (val < fadeOutStart) {
            // Arrival: front-to-back (index 0 to N-1)
            const delay = (idx / count) * 0.4;
            const normIn = clamp01((inProgress - delay) / 0.6);
            letterAlpha = normIn;
            blurPx = (1 - normIn) * 16;
            translateY = (1 - normIn) * 30;
          } else {
            // Leaving: back-to-front (index N-1 down to 0)
            const reverseIdx = count - 1 - idx;
            const delay = (reverseIdx / count) * 0.4;
            const normOut = clamp01((outProgress - delay) / 0.6);
            letterAlpha = normOut;
            blurPx = (1 - normOut) * 16;
            translateY = -(1 - normOut) * 30;
          }

          span.style.opacity = letterAlpha.toFixed(3);
          span.style.filter = blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px)` : 'none';
          span.style.transform = `translateY(${translateY.toFixed(1)}px)`;
        });
      });

      // Interactive Replay Button on Act 6
      if (buttonRef.current) {
        if (p > 0.90) {
          buttonRef.current.style.opacity = '1';
          buttonRef.current.style.pointerEvents = 'auto';
        } else {
          buttonRef.current.style.opacity = '0';
          buttonRef.current.style.pointerEvents = 'none';
        }
      }
    };

    animId = requestAnimationFrame(animateDOM);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden font-sans">
      <TextBlock blockRef={b1Ref} title="BRAND NEW DAY" subtitle="STEP THROUGH" startSp={0.0} endSp={0.16} />
      <TextBlock blockRef={b2Ref} title="WORK SMARTER" subtitle="STEP THROUGH" startSp={0.18} endSp={0.34} />
      <TextBlock blockRef={b3Ref} title="STEP THROUGH" subtitle="WORK SMARTER" startSp={0.36} endSp={0.52} />
      <TextBlock blockRef={b4Ref} title="WORK SMARTER" subtitle="BRAND NEW DAY" startSp={0.54} endSp={0.70} />
      <TextBlock blockRef={b5Ref} title="STEP THROUGH" subtitle="WORK SMARTER" startSp={0.72} endSp={0.85} />
      <TextBlock blockRef={b6Ref} title="BRAND NEW DAY" subtitle="WORK SMARTER" startSp={0.86} endSp={1.0} isAct6 />

      {/* Act 6 Replay Button */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <button
          ref={buttonRef}
          onClick={handleReplay}
          className="opacity-0 transition-opacity duration-500 px-8 py-3 bg-[#e0202b] text-[#f2f3f5] font-bold text-sm tracking-widest uppercase rounded-full shadow-[0_0_30px_rgba(224,32,43,0.6)] hover:bg-[#ff5d64] hover:scale-105 active:scale-95 transition-all cursor-pointer pointer-events-none"
        >
          REPLAY FILM
        </button>
      </div>

      {/* Top right dev indicator for act gates & sp */}
      <div className="absolute top-4 right-4 text-xs font-mono text-[#75666a] opacity-40 hover:opacity-100 transition-opacity pointer-events-auto">
        <span id="dev-act-info">BRAND NEW DAY</span>
      </div>
    </div>
  );
};
