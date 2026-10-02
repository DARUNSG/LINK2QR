import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ChevronUp, Info, X, ShieldCheck, Clock, Layers, LucideIcon } from 'lucide-react';

interface PhilosophyDetailPoint {
  title: string;
  desc: string;
}

interface PhilosophyItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  actionText: string;
  icon: LucideIcon;
  details: {
    heading: string;
    subtitle: string;
    highlight: string;
    points: PhilosophyDetailPoint[];
  };
}

/* Proximity Interactive Quote Component (Echo 3D tilt like first page) */
const InteractivePhilosophyQuote: React.FC = () => {
  const quoteRef = useRef<HTMLDivElement>(null);

  const targetRef = useRef({ x: 0, y: 0, tiltX: 0, tiltY: 0, proximity: 0, isHovered: false });
  const currentRef = useRef({ x: 0, y: 0, tiltX: 0, tiltY: 0, proximity: 0, isHovered: false });

  const [transformState, setTransformState] = useState({
    x: 0,
    y: 0,
    tiltX: 0,
    tiltY: 0,
    proximity: 0,
    isHovered: false,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!quoteRef.current) return;

      const rect = quoteRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 500; // 500px proximity activation radius

      const proximity = Math.max(0, 1 - distance / maxDistance);

      const isHovered =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (proximity > 0) {
        const moveX = (deltaX / (maxDistance / 2)) * 26;
        const moveY = (deltaY / (maxDistance / 2)) * 18;
        const tiltY = (deltaX / (maxDistance / 2)) * 10;
        const tiltX = -(deltaY / (maxDistance / 2)) * 10;

        targetRef.current = {
          x: moveX,
          y: moveY,
          tiltX,
          tiltY,
          proximity,
          isHovered,
        };
      } else {
        targetRef.current = { x: 0, y: 0, tiltX: 0, tiltY: 0, proximity: 0, isHovered: false };
      }
    };

    const handleMouseLeave = () => {
      targetRef.current = { x: 0, y: 0, tiltX: 0, tiltY: 0, proximity: 0, isHovered: false };
    };

    let animId: number;
    const lerp = (start: number, end: number, speed: number) => start + (end - start) * speed;

    const physicsLoop = () => {
      const cur = currentRef.current;
      const tar = targetRef.current;

      cur.x = lerp(cur.x, tar.x, 0.08);
      cur.y = lerp(cur.y, tar.y, 0.08);
      cur.tiltX = lerp(cur.tiltX, tar.tiltX, 0.08);
      cur.tiltY = lerp(cur.tiltY, tar.tiltY, 0.08);
      cur.proximity = lerp(cur.proximity, tar.proximity, 0.08);
      cur.isHovered = tar.isHovered;

      setTransformState({
        x: cur.x,
        y: cur.y,
        tiltX: cur.tiltX,
        tiltY: cur.tiltY,
        proximity: cur.proximity,
        isHovered: cur.isHovered,
      });

      animId = requestAnimationFrame(physicsLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    animId = requestAnimationFrame(physicsLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  const echoX1 = transformState.x * 0.15;
  const echoY1 = transformState.y * 0.15 + transformState.proximity * 4;
  const echoX2 = transformState.x * 0.3;
  const echoY2 = transformState.y * 0.3 + transformState.proximity * 8;

  return (
    <div
      ref={quoteRef}
      className="max-w-4xl mx-auto mb-20 relative [perspective:1000px] cursor-pointer py-6"
    >
      {/* Main Proximity Interactive Blockquote Container */}
      <div
        style={{
          transform: `translate3d(${transformState.x}px, ${transformState.y}px, 0px) rotateX(${transformState.tiltX}deg) rotateY(${transformState.tiltY}deg) scale(${
            1 + transformState.proximity * 0.04
          })`,
          textShadow:
            transformState.proximity > 0.05
              ? `${echoX1}px ${echoY1}px 0px rgba(30, 30, 30, ${0.12 * transformState.proximity}), ${echoX2}px ${echoY2}px 0px rgba(30, 30, 30, ${0.06 * transformState.proximity})`
              : 'none',
          willChange: 'transform, text-shadow',
        }}
        className="transition-shadow duration-300 select-none"
      >
        <blockquote className="font-clash font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#111111] tracking-tight leading-[1.1]">
          “Good meetings happen when{' '}
          <span
            className={`font-editorial-italic font-normal underline underline-offset-8 transition-all duration-300 ${
              transformState.proximity > 0.3
                ? 'text-sky-500 decoration-sky-400 [text-shadow:0_0_15px_rgba(56,189,248,0.5)] scale-105 inline-block'
                : 'text-[#111111] decoration-[#1e1e1e]/30'
            }`}
          >
            everyone's
          </span>{' '}
          time is considered.”
        </blockquote>

        <div className="mt-6 text-xs font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-[#838282]/40 inline-block"></span>
          <span>THE EDITORIAL TIME PHILOSOPHY</span>
          <span className="w-8 h-[1px] bg-[#838282]/40 inline-block"></span>
        </div>
      </div>
    </div>
  );
};

export const PhilosophySection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeModalCard, setActiveModalCard] = useState<PhilosophyItem | null>(null);

  const items: PhilosophyItem[] = [
    {
      id: '01',
      tag: '01 / ACCURACY',
      title: 'SEE THE DIFFERENCE',
      description:
        'Compare local times instantly across multiple countries without mental math or timezone confusion. Daylight saving changes and offsets adjust dynamically.',
      actionText: 'LOCAL TIME MATRIX',
      icon: Clock,
      details: {
        heading: 'GLOBAL TIMEZONE DATABASE & LIVE MATRIX ENGINE',
        subtitle: 'Compare local times side-by-side with zero manual math or DST errors.',
        highlight: '400+ Cities Synchronized Live',
        points: [
          {
            title: 'Real-Time Clock Synchronization',
            desc: 'Every participant’s local time updates live every second, reflecting exact current hours, minutes, and seconds across all continents.',
          },
          {
            title: 'Automated DST Shift Protection',
            desc: 'Automatically applies Daylight Saving Time changes and seasonal offsets so scheduling across countries is always 100% accurate.',
          },
          {
            title: 'Unified Cross-Border Grid',
            desc: 'View attendee times in a clean, parallel matrix that instantly resolves time differences between North America, Europe, Asia, and Australasia.',
          },
        ],
      },
    },
    {
      id: '02',
      tag: '02 / HARMONY',
      title: 'FIND THE OVERLAP',
      description:
        'Identify shared working hours automatically. Protect team members from early morning or late-night burnout by visualizing true working windows.',
      actionText: 'OVERLAP CALCULATION',
      icon: ShieldCheck,
      details: {
        heading: 'SHARED WORKING HOUR & BURNOUT GUARD ALGORITHM',
        subtitle: 'Discover golden meeting windows while respecting global work-life balance.',
        highlight: 'Smart Overlap Ranking',
        points: [
          {
            title: 'Automated Overlap Sweet Spot',
            desc: 'Identifies shared working hours automatically and ranks time slots from ideal overlap to non-traditional hours.',
          },
          {
            title: 'Health & Fatigue Safeguard',
            desc: 'Flags early morning (<8 AM) and late night (>9 PM) hours with color-coded alerts to protect team members from scheduling fatigue.',
          },
          {
            title: 'Custom Working Windows',
            desc: 'Supports independent working schedules for each attendee, allowing flexible 8-hour, 9-hour, or custom part-time windows.',
          },
        ],
      },
    },
    {
      id: '03',
      tag: '03 / ALIGNMENT',
      title: 'MEET WITH CLARITY',
      description:
        'Choose a time everyone can understand and copy clean meeting summaries straight into calendar invites or team chats with explicit day indicators.',
      actionText: 'SUMMARY GENERATION',
      icon: Layers,
      details: {
        heading: 'SINGLE-CLICK CALENDAR & TEAM COMMUNICATION SUMMARIES',
        subtitle: 'Generate clear, unambiguous meeting invites with explicit date boundary labels.',
        highlight: 'Explicit Date Shift Tagging',
        points: [
          {
            title: '1-Click Clipboard Export',
            desc: 'Generates clean markdown and plain text summaries ready to copy directly into Google Calendar, Outlook, Slack, or Email.',
          },
          {
            title: 'Explicit Date Shift Badges',
            desc: 'Clearly labels midnight crossings with (+1 Day) or (-1 Day) tags so no attendee shows up on the wrong date.',
          },
          {
            title: 'Universal Compatibility',
            desc: 'Formats local times clearly for every participant, ensuring everyone receives their precise local meeting time in invites.',
          },
        ],
      },
    },
  ];

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openModal = (item: PhilosophyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveModalCard(item);
  };

  return (
    <section className="relative w-full py-24 px-6 bg-[#f2f2f2] border-t border-[#1e1e1e]/10 overflow-hidden">
      {/* Centered Vertical Hairline Divider */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#1e1e1e]/10 pointer-events-none hidden md:block" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        {/* Proximity Interactive Editorial Quote (Echo 3D Tilt like hero page) */}
        <InteractivePhilosophyQuote />

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left items-start">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={(e) => toggleExpand(item.id, e)}
                className={`bg-[#ffffff] p-8 border flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group cursor-pointer relative z-10 hover:z-20 ${
                  isExpanded
                    ? 'border-[#111111] shadow-2xl ring-2 ring-[#111111]/10 bg-[#ffffff]'
                    : 'border-[#1e1e1e]/15 hover:border-[#111111] hover:scale-[1.04] hover:-translate-y-2 hover:shadow-2xl'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[10px] font-satoshi font-bold tracking-[0.2em] text-[#838282] group-hover:text-[#111111] uppercase transition-colors">
                      {item.tag}
                    </div>
                    <Icon className="w-4 h-4 text-[#838282] group-hover:text-[#111111] transition-colors" />
                  </div>

                  <h3 className="font-clash font-bold text-2xl text-[#111111] uppercase tracking-wide mb-3 [word-spacing:0.2em]">
                    {item.title}
                  </h3>
                  <p className="font-satoshi text-sm text-[#838282] group-hover:text-[#111111] transition-colors leading-relaxed">
                    {item.description}
                  </p>

                  {/* Inline Expanded Explanatory Detail Box */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-[#1e1e1e]/15 animate-fadeIn space-y-4">
                      <div className="bg-[#111111] text-[#f2f2f2] p-4 rounded-xl shadow-inner">
                        <div className="flex items-center gap-2 text-[10px] font-satoshi font-bold tracking-[0.18em] text-emerald-400 uppercase mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>EXPLANATION & SYSTEM DETAILS</span>
                        </div>
                        <h4 className="font-clash font-bold text-xs uppercase text-[#ffffff] mb-1">
                          {item.details.heading}
                        </h4>
                        <p className="font-satoshi text-xs text-[#b6b5b5] leading-relaxed">
                          {item.details.subtitle}
                        </p>
                      </div>

                      {/* Detailed Bullet Points */}
                      <div className="space-y-3 pt-2">
                        {item.details.points.map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-satoshi font-bold text-xs text-[#111111] block">
                                {pt.title}
                              </span>
                              <span className="font-satoshi text-xs text-[#666666] leading-relaxed block mt-0.5">
                                {pt.desc}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Full Specs Trigger Button */}
                      <button
                        type="button"
                        onClick={(e) => openModal(item, e)}
                        className="w-full mt-4 py-2.5 px-4 bg-[#f2f2f2] hover:bg-[#111111] text-[#111111] hover:text-[#ffffff] border border-[#1e1e1e]/20 rounded-lg font-satoshi text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>VIEW FULL PHILOSOPHY SPECS</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div
                  onClick={(e) => toggleExpand(item.id, e)}
                  className="mt-8 pt-4 border-t border-[#1e1e1e]/10 text-xs font-mono font-bold text-[#111111] flex items-center justify-between hover:text-emerald-700 transition-colors"
                >
                  <span>{isExpanded ? 'CLOSE EXPLANATION' : item.actionText}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 transition-transform duration-300" />
                  ) : (
                    <span className="text-base group-hover:translate-x-2 transition-transform duration-300">
                      →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Specification Modal Dialog */}
      {activeModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-sm animate-fadeIn text-left">
          <div className="bg-[#ffffff] border-2 border-[#111111] max-w-2xl w-full p-6 sm:p-8 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#1e1e1e]/15 pb-5 mb-6">
              <div>
                <span className="text-[10px] font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase block mb-1">
                  PHILOSOPHY DEEP DIVE — {activeModalCard.tag}
                </span>
                <h3 className="font-clash font-bold text-3xl text-[#111111] uppercase tracking-wide">
                  {activeModalCard.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalCard(null)}
                className="p-2 text-[#838282] hover:text-[#111111] hover:bg-[#f2f2f2] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Highlight Banner */}
            <div className="mb-6 p-4 bg-[#111111] text-[#ffffff] rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-satoshi font-bold tracking-[0.2em] text-emerald-400 uppercase block mb-1">
                  CORE SYSTEM CONCEPT
                </span>
                <span className="font-clash font-bold text-base block">
                  {activeModalCard.details.heading}
                </span>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full shrink-0">
                {activeModalCard.details.highlight}
              </span>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              <p className="font-satoshi text-base text-[#444444] leading-relaxed">
                {activeModalCard.details.subtitle}
              </p>

              <div className="space-y-4">
                <h4 className="font-satoshi font-bold text-xs tracking-[0.15em] uppercase text-[#838282]">
                  SYSTEM EXPLANATION & BENEFITS
                </h4>
                {activeModalCard.details.points.map((pt, idx) => (
                  <div key={idx} className="p-4 bg-[#f8f8f8] border border-[#1e1e1e]/10 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-satoshi font-bold text-sm text-[#111111] mb-1">
                        {pt.title}
                      </h5>
                      <p className="font-satoshi text-xs text-[#666666] leading-relaxed">
                        {pt.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-6 border-t border-[#1e1e1e]/15 flex items-center justify-between">
              <span className="text-xs font-satoshi text-[#838282]">
                TIMESYNC EDITORIAL TIME PHILOSOPHY
              </span>
              <button
                onClick={() => setActiveModalCard(null)}
                className="px-6 py-2.5 bg-[#111111] text-[#ffffff] font-satoshi text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#1e1e1e] transition-colors cursor-pointer"
              >
                CLOSE EXPLANATION
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
