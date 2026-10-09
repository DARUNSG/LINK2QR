import React, { useState } from 'react';
import { QrCode, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onScrollToGenerator: () => void;
  onScrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToGenerator, onScrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0F]/90 backdrop-blur-md border-b border-[#DBEAFE]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onScrollToSection('home');
            }}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DBEAFE] rounded-lg p-1"
            aria-label="Link2QR Homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] flex items-center justify-center text-[#0B0B0F] shadow-sm group-hover:scale-105 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#DBEAFE]">
                Link<span className="text-[#EDE9FE]">2</span>QR
              </span>
              <span className="text-[10px] tracking-widest text-[#5D4037] font-semibold uppercase -mt-1">
                Fast & Clean
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <button
              onClick={() => onScrollToSection('home')}
              className="text-sm font-medium text-[#EDE9FE] hover:text-[#DBEAFE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DBEAFE] rounded px-2 py-1 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onScrollToSection('how-it-works')}
              className="text-sm font-medium text-[#EDE9FE] hover:text-[#DBEAFE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DBEAFE] rounded px-2 py-1 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => onScrollToSection('features')}
              className="text-sm font-medium text-[#EDE9FE] hover:text-[#DBEAFE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DBEAFE] rounded px-2 py-1 cursor-pointer"
            >
              Features
            </button>
          </nav>

          {/* Primary Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onScrollToGenerator}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#DBEAFE] text-[#0B0B0F] hover:bg-[#EDE9FE] active:scale-95 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DBEAFE] cursor-pointer"
            >
              <span>Create QR</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#EDE9FE] hover:text-[#DBEAFE] border border-[#DBEAFE]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DBEAFE]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0B0F] border-b border-[#DBEAFE]/15 px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              onScrollToSection('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-[#EDE9FE] hover:bg-[#DBEAFE]/10 hover:text-[#DBEAFE]"
          >
            Home
          </button>
          <button
            onClick={() => {
              onScrollToSection('how-it-works');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-[#EDE9FE] hover:bg-[#DBEAFE]/10 hover:text-[#DBEAFE]"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              onScrollToSection('features');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-[#EDE9FE] hover:bg-[#DBEAFE]/10 hover:text-[#DBEAFE]"
          >
            Features
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                onScrollToGenerator();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-[#DBEAFE] text-[#0B0B0F] hover:bg-[#EDE9FE]"
            >
              <span>Create QR</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
