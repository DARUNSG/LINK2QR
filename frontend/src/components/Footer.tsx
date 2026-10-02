import React from 'react';
import { Clock, Globe, Mail, Shield, ArrowUpRight, Phone, Send } from 'lucide-react';

interface FooterProps {
  onOpenHowItWorks: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHowItWorks }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#1e1e1e] text-[#f6f6f6] border-t border-white/5 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-white/30 flex items-center justify-center bg-white text-[#1e1e1e]">
                <Clock className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="font-clash font-bold text-lg text-[#f6f6f6] tracking-tight uppercase">
                TIMESYNC PLANNER
              </span>
            </div>

            <p className="font-satoshi text-xs text-[#f6f6f6]/60 leading-relaxed max-w-xs">
              “Find a time that works across the world.”
              Sophisticated, luxury-brutalist editorial meeting overlap engine.
            </p>

            <div className="text-[10px] font-mono text-[#f6f6f6]/40 uppercase pt-2">
              BUILD 2026.09 • IANA TIMEZONE DATABASE
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-clash font-bold text-xs uppercase tracking-[0.2em] text-[#f6f6f6] mb-4">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs font-satoshi text-[#f6f6f6]/60">
              <li>
                <button
                  onClick={() => scrollToSection('planner')}
                  className="hover:text-[#f6f6f6] transition-colors"
                >
                  Planner Section
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('timezones-grid')}
                  className="hover:text-[#f6f6f6] transition-colors"
                >
                  Time Zones Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenHowItWorks}
                  className="hover:text-[#f6f6f6] transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-[#f6f6f6] transition-colors inline-flex items-center gap-1"
                >
                  <span>Back to Top</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div>
            <h4 className="font-clash font-bold text-xs uppercase tracking-[0.2em] text-[#f6f6f6] mb-4">
              INFORMATION
            </h4>
            <ul className="space-y-2.5 text-xs font-satoshi text-[#f6f6f6]/60">
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 opacity-60" />
                <span>IANA Database Standard</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 opacity-60" />
                <span>DST Dynamic Adjustment</span>
              </li>
              <li>
                <span>No Hardcoded Calculation</span>
              </li>
              <li>
                <span>Editorial Minimalist Aesthetics</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support Information */}
          <div className="space-y-4">
            <h4 className="font-clash font-bold text-xs uppercase tracking-[0.2em] text-[#f6f6f6] mb-3">
              CONTACT INFORMATION
            </h4>
            <p className="text-xs font-satoshi text-[#f6f6f6]/60 leading-relaxed">
              Have questions or feedback about global meeting scheduling? Reach out directly:
            </p>
            
            <div className="space-y-3 pt-1 text-xs font-satoshi">
              {/* Email Address Link with Login/Mailto trigger */}
              <a
                href="mailto:darundarun6767@gmail.com?subject=Inquiry%20from%20TimeSync%20Meeting%20Planner"
                className="flex items-center gap-3 text-[#f6f6f6]/80 hover:text-emerald-400 transition-colors group"
                title="Click to log into your email app and send mail"
              >
                <div className="p-2 border border-white/20 group-hover:border-emerald-400 group-hover:bg-emerald-500/10 transition-colors shrink-0">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-mono text-[#f6f6f6]/40 uppercase block">EMAIL ADDRESS</span>
                  <span className="font-mono text-xs text-white underline decoration-white/30 underline-offset-4 group-hover:decoration-emerald-400 truncate block">
                    darundarun6767@gmail.com
                  </span>
                </div>
              </a>

              {/* Contact Phone Number Link */}
              <a
                href="tel:+918838256709"
                className="flex items-center gap-3 text-[#f6f6f6]/80 hover:text-emerald-400 transition-colors group"
                title="Click to call or message"
              >
                <div className="p-2 border border-white/20 group-hover:border-emerald-400 group-hover:bg-emerald-500/10 transition-colors shrink-0">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#f6f6f6]/40 uppercase block">CONTACT NUMBER</span>
                  <span className="font-mono text-xs text-white tracking-wider block">
                    +91 8838256709
                  </span>
                </div>
              </a>
            </div>

            {/* Quick Gmail Web Compose Link */}
            <div className="pt-2">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=darundarun6767@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#111111] hover:bg-emerald-600 text-white border border-white/20 hover:border-emerald-400 text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 rounded shadow-md group"
                title="Log in to Gmail and send email directly"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white transition-colors" />
                <span>LOG IN & MAIL ME</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Rights Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-satoshi text-[#f6f6f6]/40 uppercase">
          <span>© 2026 TIMESYNC MEETING PLANNER. ALL RIGHTS RESERVED.</span>
          <span>EDITORIAL LUXURY BRUTALISM SYSTEM</span>
        </div>

      </div>
    </footer>
  );
};
