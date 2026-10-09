import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QrGenerator } from './components/QrGenerator';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('https://example.com');

  const scrollToGenerator = () => {
    const el = document.getElementById('generator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Focus input field for immediate typing
      const inputEl = document.getElementById('qr-url-input');
      if (inputEl) {
        inputEl.focus();
      }
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#EDE9FE] font-sans flex flex-col selection:bg-[#DBEAFE] selection:text-[#0B0B0F]">
      
      {/* 1. Navbar */}
      <Navbar
        onScrollToGenerator={scrollToGenerator}
        onScrollToSection={scrollToSection}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onStart={scrollToGenerator}
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
          onGenerate={scrollToGenerator}
        />

        {/* 3. Interactive QR Code Generator Studio */}
        <QrGenerator
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
        />

        {/* 4. How It Works (Alternating pastel cards) */}
        <HowItWorks />

        {/* 5. Features Section */}
        <Features />
      </main>

      {/* 7. Footer */}
      <Footer onScrollToSection={scrollToSection} />

    </div>
  );
};

export default App;
