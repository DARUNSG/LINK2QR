import {
  Zap,
  Download,
  Palette
} from 'lucide-react';

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgHex: string; // Alternate between #DBEAFE, #EDE9FE, #FCE7F3
}

export const Features: React.FC = () => {
  const features: FeatureItem[] = [
    {
      title: 'Instant QR generation',
      description: 'Zero lag. Generates scannable QR matrices in milliseconds right in your browser.',
      icon: <Zap className="w-6 h-6 text-[#0B0B0F]" />,
      bgHex: '#DBEAFE',
    },
    {
      title: 'High-quality PNG download',
      description: 'Export crisp, scalable PNG files optimized for print documents, stickers, and digital displays.',
      icon: <Download className="w-6 h-6 text-[#0B0B0F]" />,
      bgHex: '#EDE9FE',
    },
    {
      title: 'Custom colors and sizes',
      description: 'Adjust foreground and background shades, pick export dimensions, and preview in real time.',
      icon: <Palette className="w-6 h-6 text-[#0B0B0F]" />,
      bgHex: '#FCE7F3',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative border-t border-[#DBEAFE]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#FCE7F3] block mb-2">
            Built For Speed & Clarity
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#DBEAFE] tracking-tight">
            Key Features
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#EDE9FE]">
            Everything you need to produce professional, readable QR codes with zero friction.
          </p>
        </div>

        {/* Feature Cards Grid (Pastel surfaces with dark text) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-8 shadow-xl flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
              style={{ backgroundColor: feature.bgHex }}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0B0B0F]/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-extrabold text-[#0B0B0F] tracking-tight mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-[#0B0B0F]/85 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Accent details in #5D4037 */}
              <div className="mt-6 pt-4 border-t border-[#0B0B0F]/15 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#5D4037] uppercase tracking-wider">
                  0{idx + 1} // Feature
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#5D4037]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
