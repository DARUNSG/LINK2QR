import React from 'react';
import { Clock, Eye } from 'lucide-react';

export const PillShowcase: React.FC = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#f2f2f2] border-t border-[#1e1e1e]/10 flex flex-col items-center">
      <div className="max-w-md w-full text-center mb-8">
        <span className="text-xs font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase block mb-1">
          PILL SHOWCASE
        </span>
        <h3 className="font-clash font-bold text-2xl text-[#111111] uppercase tracking-tight">
          CHRONO DYNAMICS
        </h3>
      </div>

      {/* High-Aspect Vertical Pill Container: 500px height, rounded-full (9999px), overflow-hidden */}
      <div className="relative w-full max-w-[320px] h-[500px] rounded-[9999px] overflow-hidden border border-[#1e1e1e]/20 bg-[#1e1e1e] group cursor-pointer shadow-xl">
        
        {/* Background Visual Graphic with Smooth Scale Transition on Hover */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-15 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]" />

        {/* Abstract Concentric Clock Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]">
          <div className="w-64 h-64 rounded-full border border-[#ffffff]/20 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-dashed border-[#ffffff]/40 flex items-center justify-center animate-[spin_40s_linear_infinite]">
              <div className="w-32 h-32 rounded-full border border-[#ffffff]/60 flex items-center justify-center">
                <Clock className="w-10 h-10 text-[#ffffff]/80 stroke-[1.5]" />
              </div>
            </div>
          </div>
        </div>

        {/* Centered Circular Overlay (Appears only on Hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#111111]/70 backdrop-blur-xs">
          <div className="w-44 h-44 rounded-full border border-[#ffffff]/40 flex flex-col items-center justify-center p-4 text-center transform scale-90 group-hover:scale-100 transition-transform duration-500">
            <Eye className="w-6 h-6 text-[#ffffff] mb-2" />
            <span className="font-clash font-bold text-sm text-[#ffffff] uppercase tracking-wider block">
              EXPLORE OVERLAP
            </span>
            <span className="font-satoshi text-[10px] text-[#b6b5b5] mt-1 uppercase">
              24-HOUR RADAR
            </span>
          </div>
        </div>

        {/* Bottom Static Label */}
        <div className="absolute bottom-10 left-0 right-0 text-center text-xs font-satoshi font-bold tracking-[0.2em] text-[#b6b5b5] uppercase pointer-events-none group-hover:opacity-0 transition-opacity">
          HOVER TO INSPECT
        </div>
      </div>
    </section>
  );
};
