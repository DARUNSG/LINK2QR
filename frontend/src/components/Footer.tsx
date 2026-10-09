import React from 'react';
import { QrCode, ArrowUp } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection }) => {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B0B0F] border-t border-[#DBEAFE]/15 text-[#EDE9FE] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#DBEAFE]/10">
          
          {/* Brand & Description (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] flex items-center justify-center text-[#0B0B0F] shadow-sm">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#DBEAFE]">
                Link<span className="text-[#EDE9FE]">2</span>QR
              </span>
            </div>

            <p className="text-sm text-[#EDE9FE]/80 max-w-sm leading-relaxed">
              Simple, high-speed, client-side QR code generator. Convert any web link into customizable, scannable PNG codes without signups or tracking.
            </p>

            {/* Subtle decorative color chip representation */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5D4037]">
                Color Harmony:
              </span>
              <span className="w-3 h-3 rounded-full bg-[#DBEAFE]" title="#DBEAFE" />
              <span className="w-3 h-3 rounded-full bg-[#EDE9FE]" title="#EDE9FE" />
              <span className="w-3 h-3 rounded-full bg-[#FCE7F3]" title="#FCE7F3" />
              <span className="w-3 h-3 rounded-full bg-[#5D4037]" title="#5D4037" />
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DBEAFE]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onScrollToSection('home')}
                  className="text-[#EDE9FE]/75 hover:text-[#DBEAFE] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onScrollToSection('how-it-works')}
                  className="text-[#EDE9FE]/75 hover:text-[#DBEAFE] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onScrollToSection('features')}
                  className="text-[#EDE9FE]/75 hover:text-[#DBEAFE] transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
            </ul>
          </div>

          {/* Utilities & Controls (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DBEAFE]">
              Tools & Formats
            </h4>
            <ul className="space-y-2 text-sm text-[#EDE9FE]/75">
              <li>High-Resolution PNG</li>
              <li>Client-Side Canvas Engine</li>
              <li>Contrast Analysis</li>
              <li>Dynamic Dimension Presets</li>
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleScrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EDE9FE]/10 hover:bg-[#EDE9FE]/20 text-[#DBEAFE] transition-all cursor-pointer"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar with copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EDE9FE]/60 gap-4">
          <p>© {currentYear} Link2QR. All rights reserved. Free and open client utility.</p>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5D4037]" />
            <span className="text-[#EDE9FE]/70">Strict Privacy Guarantee • No Server Uploads</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
