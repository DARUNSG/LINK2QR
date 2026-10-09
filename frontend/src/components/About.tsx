import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutProps {
  onScrollToGenerator: () => void;
}

export const About: React.FC<AboutProps> = ({ onScrollToGenerator }) => {
  return (
    <section id="about" className="py-20 md:py-28 relative border-t border-[#DBEAFE]/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#0B0B0F] border-2 border-[#DBEAFE]/30 rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Subtle decorative pastel aura */}
          <div
            className="absolute top-0 right-0 w-72 h-72 bg-[#FCE7F3]/5 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-[#FCE7F3]">
              About Link2QR
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#DBEAFE] tracking-tight">
              Designed for Privacy, Precision, and Speed.
            </h2>

            <p className="text-base sm:text-lg text-[#EDE9FE] leading-relaxed">
              Link2QR is an independent, lightweight web application built to eliminate bloated QR utilities, intrusive paywalls, and expiring links. By rendering barcodes directly inside modern browser runtimes with high error correction, your data stays entirely on your device while generating production-ready matrices.
            </p>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 text-sm text-[#EDE9FE]">
                <CheckCircle2 className="w-5 h-5 text-[#DBEAFE] shrink-0" />
                <span>Zero server logs or link storage</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#EDE9FE]">
                <CheckCircle2 className="w-5 h-5 text-[#DBEAFE] shrink-0" />
                <span>Permanent, direct-destination encodes</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#EDE9FE]">
                <CheckCircle2 className="w-5 h-5 text-[#DBEAFE] shrink-0" />
                <span>Instant SVG & PNG rasterization</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#EDE9FE]">
                <CheckCircle2 className="w-5 h-5 text-[#DBEAFE] shrink-0" />
                <span>Accessible across all modern mobile browsers</span>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-[#DBEAFE]/15">
              <button
                type="button"
                onClick={onScrollToGenerator}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#DBEAFE] text-[#0B0B0F] hover:bg-[#EDE9FE] transition-all cursor-pointer shadow-md"
              >
                <span>Try the Generator</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-[#EDE9FE]/70">
                <ShieldCheck className="w-4 h-4 text-[#5D4037]" />
                <span>Open & browser-native utility</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
