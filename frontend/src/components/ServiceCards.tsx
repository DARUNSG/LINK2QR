import React, { useState } from 'react';
import { Globe, Clock, Layers, ArrowRight, ChevronUp, ChevronDown, CheckCircle2, X, Sparkles, Info, LucideIcon } from 'lucide-react';

interface FeaturePoint {
  title: string;
  desc: string;
}

interface FeatureDetails {
  heading: string;
  subtitle: string;
  tag: string;
  highlight: string;
  points: FeaturePoint[];
}

interface CardItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  details: FeatureDetails;
}

export const ServiceCards: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeModalCard, setActiveModalCard] = useState<CardItem | null>(null);

  const cards: CardItem[] = [
    {
      id: '01',
      title: 'GLOBAL TEAMS',
      description: 'Plan meetings across multiple countries seamlessly with accurate IANA timezone database support.',
      icon: Globe,
      details: {
        heading: 'MULTI-COUNTRY TIMEZONE ENGINE',
        subtitle: 'Eliminate manual timezone conversion across global operations.',
        tag: 'DATABASE SUPPORT',
        highlight: '400+ World Cities Supported',
        points: [
          {
            title: 'IANA Database Precision',
            desc: 'Automatically adjusts for Daylight Saving Time (DST) transitions, regional offsets, and international date lines without manual calculation.',
          },
          {
            title: 'Cross-Border Harmony',
            desc: 'Supports remote teams, contractors, and multi-national enterprise clients across PST, EST, GMT, CET, IST, JST, and AEDT seamlessly.',
          },
          {
            title: 'Zero Math Errors',
            desc: 'Handles complex fractional timezone offsets (+5:30 IST, +9:30 ACST, +4:30 AFT) flawlessly with real-time updates.',
          },
        ],
      },
    },
    {
      id: '02',
      title: 'FLEXIBLE HOURS',
      description: "Customize everyone's availability and working hours independently down to individual preferences.",
      icon: Clock,
      details: {
        heading: 'INDIVIDUAL AVAILABILITY & OVERLAP CALCULATOR',
        subtitle: 'Respect work-life balance while discovering true overlapping availability.',
        tag: 'AVAILABILITY ENGINE',
        highlight: 'Granular Working Windows',
        points: [
          {
            title: 'Custom Working Schedules',
            desc: 'Set custom start and end hours (e.g., 09:00 - 18:00 or 08:00 - 16:00) tailored to each team member’s local routine.',
          },
          {
            title: 'Burnout Protection Alerts',
            desc: 'Visual indicators flag early morning (<8 AM) or late evening (>9 PM) meeting slots to protect personal time.',
          },
          {
            title: 'Real-Time Overlap Detection',
            desc: 'Calculates shared working hours instantly, highlighting optimal meeting slots that work for all attendees simultaneously.',
          },
        ],
      },
    },
    {
      id: '03',
      title: 'CLEAR CONVERSION',
      description: 'See every local time instantly with clear indicators for next-day and previous-day date shifts.',
      icon: Layers,
      details: {
        heading: 'INSTANT LOCAL TIME MATRIX & DATE SHIFTS',
        subtitle: 'Crystal clear meeting invites with explicit date boundary indicators.',
        tag: 'CONVERSION MATRIX',
        highlight: 'Date Shift Awareness (+1d / -1d)',
        points: [
          {
            title: 'Date Shift Detection',
            desc: 'Clearly tags times that cross midnight with (+1 Day) or (-1 Day) badges so attendees never miss meetings on alternate dates.',
          },
          {
            title: '1-Click Calendar Export',
            desc: 'Generate clean text summaries ready to paste directly into Google Calendar, Microsoft Outlook, Slack, or Email.',
          },
          {
            title: 'Color-Coded Timeline Matrix',
            desc: 'Green for working hours, yellow for extended hours, and dark red for sleeping hours provide immediate visual clarity.',
          },
        ],
      },
    },
  ];

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId(prev => (prev === id ? null : id));
  };

  const openModal = (card: CardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveModalCard(card);
  };

  return (
    <section className="w-full py-20 px-6 bg-[#f2f2f2] border-t border-[#1e1e1e]/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase block mb-2">
            CORE CAPABILITIES
          </span>
          <h2 className="font-clash font-bold text-3xl sm:text-4xl text-[#111111] uppercase tracking-tight">
            BESPOKE OVERLAP ENGINE
          </h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {cards.map((card) => {
            const Icon = card.icon;
            const isExpanded = expandedId === card.id;

            return (
              <div
                key={card.id}
                onClick={(e) => toggleExpand(card.id, e)}
                className={`border bg-[#ffffff] p-8 flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group cursor-pointer relative z-10 hover:z-20 ${
                  isExpanded
                    ? 'border-[#111111] shadow-2xl ring-2 ring-[#111111]/10 bg-[#ffffff]'
                    : 'border-[#1e1e1e]/15 hover:border-[#111111] hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl'
                }`}
              >
                <div>
                  {/* Icon & ID Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-[64px] h-[64px] bg-[#111111] text-[#ffffff] border border-[#111111] flex items-center justify-center transition-transform duration-300 group-hover:rotate-[12deg] shadow-md">
                      <Icon className="w-7 h-7 stroke-[1.75]" />
                    </div>
                    <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#838282] bg-[#f2f2f2] px-3 py-1 rounded-full border border-[#1e1e1e]/10">
                      #{card.id}
                    </span>
                  </div>

                  <span className="text-[10px] font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase block mb-2">
                    FEATURE {card.id}
                  </span>

                  <h3 className="font-clash font-bold text-2xl text-[#111111] uppercase tracking-tight mb-3">
                    {card.title}
                  </h3>

                  <p className="font-satoshi text-sm text-[#838282] leading-relaxed">
                    {card.description}
                  </p>

                  {/* Inline Expanded Detail Section */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-[#1e1e1e]/15 animate-fadeIn space-y-4">
                      <div className="bg-[#111111] text-[#f2f2f2] p-4 rounded-xl shadow-inner">
                        <div className="flex items-center gap-2 text-[10px] font-satoshi font-bold tracking-[0.18em] text-emerald-400 uppercase mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{card.details.tag}</span>
                        </div>
                        <h4 className="font-clash font-bold text-sm uppercase text-[#ffffff] mb-1">
                          {card.details.heading}
                        </h4>
                        <p className="font-satoshi text-xs text-[#b6b5b5] leading-relaxed">
                          {card.details.subtitle}
                        </p>
                      </div>

                      {/* Detailed Bullet Points */}
                      <div className="space-y-3 pt-2">
                        {card.details.points.map((pt, idx) => (
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

                      {/* Full Specs Modal Trigger Button */}
                      <button
                        type="button"
                        onClick={(e) => openModal(card, e)}
                        className="w-full mt-4 py-2.5 px-4 bg-[#f2f2f2] hover:bg-[#111111] text-[#111111] hover:text-[#ffffff] border border-[#1e1e1e]/20 rounded-lg font-satoshi text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>VIEW FULL SPECS & DETAILS</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Learn More Action Footer */}
                <div 
                  onClick={(e) => toggleExpand(card.id, e)}
                  className="mt-8 pt-4 border-t border-[#1e1e1e]/10 flex items-center justify-between text-xs font-satoshi font-bold text-[#111111] uppercase tracking-wider hover:text-emerald-700 transition-colors"
                >
                  <span>{isExpanded ? 'SHOW LESS' : 'LEARN MORE'}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 transition-transform duration-300" />
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Specification Modal Overlay */}
      {activeModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#ffffff] border-2 border-[#111111] max-w-2xl w-full p-6 sm:p-8 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#1e1e1e]/15 pb-5 mb-6">
              <div>
                <span className="text-[10px] font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase block mb-1">
                  FEATURE SPECIFICATION #{activeModalCard.id}
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

            {/* Modal Subtitle Badge */}
            <div className="mb-6 p-4 bg-[#111111] text-[#ffffff] rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-satoshi font-bold tracking-[0.2em] text-emerald-400 uppercase block mb-1">
                  {activeModalCard.details.tag}
                </span>
                <span className="font-clash font-bold text-lg block">
                  {activeModalCard.details.heading}
                </span>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full shrink-0">
                {activeModalCard.details.highlight}
              </span>
            </div>

            {/* Modal Detailed Breakdown */}
            <div className="space-y-6">
              <p className="font-satoshi text-base text-[#444444] leading-relaxed">
                {activeModalCard.details.subtitle}
              </p>

              <div className="space-y-4">
                <h4 className="font-satoshi font-bold text-xs tracking-[0.15em] uppercase text-[#838282]">
                  KEY SYSTEM CAPABILITIES
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
                TIMESYNC BESPOKE ENGINE v2.0
              </span>
              <button
                onClick={() => setActiveModalCard(null)}
                className="px-6 py-2.5 bg-[#111111] text-[#ffffff] font-satoshi text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#1e1e1e] transition-colors cursor-pointer"
              >
                GOT IT, CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
