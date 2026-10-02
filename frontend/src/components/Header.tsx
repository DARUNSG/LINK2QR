import React from 'react';
import { LiveAnalogClock } from './LiveAnalogClock';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  onOpenHowItWorks: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenHowItWorks }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 h-[80px] w-full bg-[#f2f2f2]/90 backdrop-blur-[12px] border-b border-[#1e1e1e]/10 transition-all duration-300 animate-opening-header relative overflow-hidden">
      {/* Opening Light Sweep Beam */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#111111]/40 to-transparent -translate-x-full animate-[shimmerPass_2.5s_ease-in-out_infinite]" />
      
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        
        {/* Brand Title */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <LiveAnalogClock size={40} />
          <div>
            <span className="font-clash font-bold text-xl sm:text-2xl text-[#111111] tracking-tight block leading-none">
              TIMESYNC
            </span>
            <span className="font-satoshi font-bold text-xs tracking-[0.2em] text-[#838282] uppercase block mt-1">
              MEETING PLANNER
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-satoshi font-bold tracking-[0.15em] uppercase text-[#111111]">
          <button
            onClick={() => scrollToSection('planner')}
            className="hover:text-[#838282] transition-colors duration-[120ms] py-2"
          >
            PLANNER
          </button>
          <span className="text-[#b6b5b5] font-light">|</span>
          <button
            onClick={onOpenHowItWorks}
            className="hover:text-[#838282] transition-colors duration-[120ms] py-2"
          >
            HOW IT WORKS
          </button>
          <span className="text-[#b6b5b5] font-light">|</span>
          <button
            onClick={() => scrollToSection('timezones-grid')}
            className="hover:text-[#838282] transition-colors duration-[120ms] py-2"
          >
            TIME ZONES
          </button>
        </nav>

        {/* Pill Button CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollToSection('planner')}
            className="px-6 py-2.5 rounded-full border border-[#1e1e1e] text-xs font-satoshi font-bold tracking-[0.12em] uppercase text-[#1e1e1e] bg-transparent hover:bg-[#1e1e1e] hover:text-[#ffffff] transition-all duration-[120ms] shadow-sm"
          >
            PLAN A MEETING
          </button>
        </div>

      </div>
    </header>
  );
};
