import React from 'react';
import { Link2, QrCode, Share2 } from 'lucide-react';

interface Step {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgHex: string; // Alternate between #DBEAFE, #EDE9FE, #FCE7F3
}

export const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      step: '01',
      title: 'Paste Your Link',
      description: 'Enter the URL you want to share.',
      icon: <Link2 className="w-8 h-8 text-[#0B0B0F]" />,
      bgHex: '#DBEAFE', // Primary Light Blue surface
    },
    {
      step: '02',
      title: 'Generate Your QR',
      description: 'Create your QR code instantly.',
      icon: <QrCode className="w-8 h-8 text-[#0B0B0F]" />,
      bgHex: '#EDE9FE', // Soft Lavender surface
    },
    {
      step: '03',
      title: 'Download & Share',
      description: 'Download your QR code and share it anywhere.',
      icon: <Share2 className="w-8 h-8 text-[#0B0B0F]" />,
      bgHex: '#FCE7F3', // Soft Pink surface
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#FCE7F3] block mb-2">
            Effortless Workflow
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#DBEAFE] tracking-tight">
            How It Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#EDE9FE]">
            Three straightforward steps to transform any web destination into an instant, high-quality QR code.
          </p>
        </div>

        {/* 3 Step Cards Grid alternating between #DBEAFE, #EDE9FE, #FCE7F3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-3xl p-8 sm:p-10 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              style={{ backgroundColor: item.bgHex }}
            >
              <div>
                {/* Step header with number and icon */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#0B0B0F]/40">
                    {item.step}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-[#0B0B0F]/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>

                {/* Mandatory Step Title */}
                <h3 className="text-2xl font-extrabold text-[#0B0B0F] tracking-tight mb-3">
                  {item.step} — {item.title}
                </h3>

                {/* Mandatory Step Description */}
                <p className="text-base text-[#0B0B0F]/85 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Decorative detail in warm brown #5D4037 */}
              <div className="mt-8 pt-4 border-t border-[#0B0B0F]/15 flex items-center justify-between">
                <span className="text-xs font-bold text-[#5D4037] tracking-wider uppercase">
                  Step {item.step}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#5D4037]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
