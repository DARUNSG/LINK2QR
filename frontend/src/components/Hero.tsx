import { ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  inputUrl: string;
  setInputUrl: (val: string) => void;
  onGenerate: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart, inputUrl, setInputUrl, onGenerate }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Subtle pastel geometric decorative shapes */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#DBEAFE]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-10 -right-20 w-80 h-80 rounded-full border border-[#FCE7F3]/10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -left-16 w-56 h-56 rounded-full border border-[#EDE9FE]/10 pointer-events-none"
        aria-hidden="true"
      />
      

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Subtle Tag / Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE9FE]/10 border border-[#DBEAFE]/20 text-[#DBEAFE] text-xs sm:text-sm font-semibold mb-6">
          <Zap className="w-4 h-4 text-[#DBEAFE]" />
          <span>Professional QR Generator</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#5D4037]" />
          <span className="text-[#EDE9FE]">100% Free</span>
        </div>

        {/* Mandatory Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#DBEAFE] tracking-tight leading-[1.1] mb-6">
          Turn Any Link Into a <br className="hidden sm:inline" />
          <span className="relative inline-block mt-1 sm:mt-0">
            QR Code.
            {/* Subtle decorative warm brown underline */}
            <span
              className="absolute left-0 -bottom-2 w-full h-1 bg-[#5D4037] rounded-full"
              aria-hidden="true"
            />
          </span>
        </h1>

        {/* Mandatory Supporting text */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[#EDE9FE] font-normal leading-relaxed mb-10">
          Generate, customize, and download high-quality QR codes in seconds. Simple, fast, and free.
        </p>

        {/* Direct Hero Input Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-[#0B0B0F] p-2 sm:p-3 rounded-2xl border-2 border-[#DBEAFE] shadow-2xl flex flex-col sm:flex-row gap-2.5 transition-all focus-within:ring-4 focus-within:ring-[#DBEAFE]/20"
        >
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://example.com"
              aria-label="Enter URL to generate QR code"
              className="w-full bg-[#0B0B0F] text-[#EDE9FE] placeholder:text-[#EDE9FE]/40 text-base sm:text-lg px-4 py-3 sm:py-3.5 rounded-xl border border-transparent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-extrabold text-base bg-[#DBEAFE] text-[#0B0B0F] hover:bg-[#EDE9FE] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Generate QR Code</span>
          </button>
        </form>

        {/* Feature quick badges under hero */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 text-xs sm:text-sm text-[#EDE9FE]/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DBEAFE]" />
            <span>Private & Browser-Based</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FCE7F3]" />
            <span>High-Resolution PNG</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DBEAFE]" />
            <span>Color & Size Controls</span>
          </div>
        </div>


      </div>
    </section>
  );
};
