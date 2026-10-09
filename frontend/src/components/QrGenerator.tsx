import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sliders,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { QRConfig, QRSize, QR_SIZE_PX, getContrastRatio, isValidHttpUrl } from '../types/qr';

interface QrGeneratorProps {
  inputUrl: string;
  setInputUrl: (val: string) => void;
}

const DEFAULT_CONFIG: QRConfig = {
  fgColor: '#000000',
  bgColor: '#ffffff',
  size: 'medium',
  margin: 2,
};

// Preset colors palette for user selection inside generator
const COLOR_PRESETS = [
  { name: 'Pure Black', hex: '#000000' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Primary Dark', hex: '#0B0B0F' },
  { name: 'Primary Light Blue', hex: '#DBEAFE' },
  { name: 'Soft Lavender', hex: '#EDE9FE' },
  { name: 'Soft Pink', hex: '#FCE7F3' },
  { name: 'Warm Brown', hex: '#5D4037' },
];

export const QrGenerator: React.FC<QrGeneratorProps> = ({ inputUrl, setInputUrl }) => {
  const [encodedUrl, setEncodedUrl] = useState<string>('https://example.com');
  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Contrast check
  const contrast = getContrastRatio(config.fgColor, config.bgColor);
  const isLowContrast = contrast < 3.0;

  // Generate QR code onto canvas
  useEffect(() => {
    let isMounted = true;
    if (!encodedUrl) return;

    setIsGenerating(true);
    const pixelSize = QR_SIZE_PX[config.size];

    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        encodedUrl,
        {
          width: pixelSize,
          margin: config.margin,
          color: {
            dark: config.fgColor,
            light: config.bgColor,
          },
          errorCorrectionLevel: 'M',
        },
        (error) => {
          if (!isMounted) return;
          setIsGenerating(false);
          if (error) {
            console.error('QR rendering error:', error);
            setErrorMessage('Unable to render QR code for this payload.');
          }
        }
      );
    }

    return () => {
      isMounted = false;
    };
  }, [encodedUrl, config]);

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const trimmed = inputUrl.trim();

    if (!trimmed) {
      setErrorMessage('Please enter a URL. The input field cannot be empty.');
      return;
    }

    if (!isValidHttpUrl(trimmed)) {
      setErrorMessage('Please enter a valid HTTP or HTTPS URL (e.g., https://example.com).');
      return;
    }

    setEncodedUrl(trimmed);
    setSuccessNotice('QR Code generated successfully!');
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      
      // Clean filename based on domain or fallback
      let filename = 'link2qr-code';
      try {
        const u = new URL(encodedUrl);
        filename = `qr-${u.hostname.replace(/[^a-z0-9]/gi, '_')}`;
      } catch (_) {
        filename = 'qrcode';
      }

      link.download = `${filename}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download QR code:', err);
      setErrorMessage('Failed to trigger download. Please check browser permissions.');
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(encodedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleResetCustomization = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <section id="generator" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE]/10 border border-[#DBEAFE]/20 text-[#DBEAFE] text-xs font-semibold mb-3">
            <Sliders className="w-3.5 h-3.5 text-[#DBEAFE]" />
            <span>Interactive Generator Studio</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#DBEAFE] tracking-tight">
            Generate & Customize Your QR Code
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#EDE9FE]">
            Type or paste any destination link, tailor colors and dimensions, then download instantly as a high-resolution PNG.
          </p>
        </div>

        {/* Studio Grid: Left Controls / Right Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Controls & Input (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. URL Input Card */}
            <div className="bg-[#0B0B0F] border-2 border-[#DBEAFE] rounded-2xl p-6 sm:p-8 shadow-xl">
              <form onSubmit={handleGenerate} className="space-y-4">
                <label htmlFor="qr-url-input" className="block text-sm font-bold text-[#DBEAFE] uppercase tracking-wider">
                  Target Website URL
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#DBEAFE]/70">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <input
                    id="qr-url-input"
                    type="text"
                    value={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="https://example.com"
                    aria-describedby={errorMessage ? 'url-error' : undefined}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0B0B0F] border border-[#DBEAFE] text-[#EDE9FE] placeholder:text-[#EDE9FE]/40 text-base focus:outline-none focus:ring-2 focus:ring-[#DBEAFE] transition-all"
                  />
                </div>

                {/* Error feedback */}
                {errorMessage && (
                  <div
                    id="url-error"
                    role="alert"
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FCE7F3]/10 border border-[#FCE7F3] text-[#FCE7F3] text-sm animate-in fade-in"
                  >
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-[#FCE7F3]" />
                    <span className="font-medium">{errorMessage}</span>
                  </div>
                )}

                {/* Success feedback */}
                {successNotice && (
                  <div
                    role="status"
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#DBEAFE]/15 border border-[#DBEAFE] text-[#DBEAFE] text-sm animate-in fade-in"
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-[#DBEAFE]" />
                    <span className="font-semibold">{successNotice}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-6 rounded-xl font-extrabold text-sm sm:text-base bg-[#DBEAFE] text-[#0B0B0F] hover:bg-[#EDE9FE] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInputUrl('https://example.com');
                      setEncodedUrl('https://example.com');
                      setErrorMessage(null);
                    }}
                    className="py-3.5 px-5 rounded-xl font-semibold text-sm bg-[#EDE9FE] text-[#0B0B0F] hover:bg-[#DBEAFE] active:scale-[0.98] transition-all cursor-pointer text-center"
                  >
                    Sample URL
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Customization Controls Card */}
            <div className="bg-[#0B0B0F] border border-[#DBEAFE]/30 rounded-2xl p-6 sm:p-8 space-y-7 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-[#DBEAFE]/15 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#DBEAFE]">Customize QR Styling</h3>
                  <p className="text-xs text-[#EDE9FE]/80 mt-0.5">
                    Colors default to black & white for optimal scan reliability.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetCustomization}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#EDE9FE] bg-[#EDE9FE]/10 hover:bg-[#EDE9FE]/20 hover:text-[#DBEAFE] transition-colors border border-[#DBEAFE]/20 cursor-pointer"
                  title="Reset to default black & white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Contrast warning if low */}
              {isLowContrast && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FCE7F3]/10 border border-[#FCE7F3] text-[#FCE7F3] text-xs font-medium"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#FCE7F3]" />
                  <span>
                    Warning: Low contrast ({contrast.toFixed(1)}:1) between foreground and background. Mobile scanners may struggle to decode this QR code.
                  </span>
                </div>
              )}

              {/* Color Customizers: Foreground & Background */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Foreground (Dark bits) */}
                <div className="space-y-3">
                  <label htmlFor="fg-color-picker" className="block text-xs font-bold uppercase tracking-wider text-[#DBEAFE]">
                    QR Foreground Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="fg-color-picker"
                      type="color"
                      value={config.fgColor}
                      onChange={(e) => setConfig({ ...config, fgColor: e.target.value })}
                      className="w-12 h-12 rounded-xl border-2 border-[#DBEAFE] bg-transparent cursor-pointer p-0.5"
                      aria-label="Select QR foreground color"
                    />
                    <div className="font-mono text-sm bg-[#0B0B0F] px-3 py-2 rounded-lg border border-[#DBEAFE]/40 text-[#EDE9FE]">
                      {config.fgColor.toUpperCase()}
                    </div>
                  </div>

                  {/* Preset Swatches */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={`fg-${p.name}`}
                        type="button"
                        onClick={() => setConfig({ ...config, fgColor: p.hex })}
                        title={`Foreground: ${p.name}`}
                        className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 cursor-pointer ${
                          config.fgColor.toLowerCase() === p.hex.toLowerCase()
                            ? 'ring-2 ring-[#DBEAFE] border-white scale-110'
                            : 'border-white/20'
                        }`}
                        style={{ backgroundColor: p.hex }}
                        aria-label={`Set foreground color to ${p.name}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Background (Surrounding card bits) */}
                <div className="space-y-3">
                  <label htmlFor="bg-color-picker" className="block text-xs font-bold uppercase tracking-wider text-[#DBEAFE]">
                    QR Background Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="bg-color-picker"
                      type="color"
                      value={config.bgColor}
                      onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                      className="w-12 h-12 rounded-xl border-2 border-[#DBEAFE] bg-transparent cursor-pointer p-0.5"
                      aria-label="Select QR background color"
                    />
                    <div className="font-mono text-sm bg-[#0B0B0F] px-3 py-2 rounded-lg border border-[#DBEAFE]/40 text-[#EDE9FE]">
                      {config.bgColor.toUpperCase()}
                    </div>
                  </div>

                  {/* Preset Swatches */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={`bg-${p.name}`}
                        type="button"
                        onClick={() => setConfig({ ...config, bgColor: p.hex })}
                        title={`Background: ${p.name}`}
                        className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 cursor-pointer ${
                          config.bgColor.toLowerCase() === p.hex.toLowerCase()
                            ? 'ring-2 ring-[#DBEAFE] border-white scale-110'
                            : 'border-white/20'
                        }`}
                        style={{ backgroundColor: p.hex }}
                        aria-label={`Set background color to ${p.name}`}
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Size Selectors (Small, Medium, Large) */}
              <div className="space-y-3 pt-2">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#DBEAFE]">
                  Export Resolution & Size
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {(['small', 'medium', 'large'] as QRSize[]).map((sz) => {
                    const isSelected = config.size === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setConfig({ ...config, size: sz })}
                        className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#DBEAFE] text-[#0B0B0F] shadow-sm'
                            : 'bg-[#EDE9FE]/10 text-[#EDE9FE] hover:bg-[#EDE9FE]/20 border border-[#DBEAFE]/20'
                        }`}
                      >
                        {sz} ({QR_SIZE_PX[sz]}px)
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: QR Preview Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            
            {/* The QR Preview Surface: mandated #DBEAFE or #EDE9FE clean surface */}
            <div className="bg-[#DBEAFE] rounded-3xl p-6 sm:p-8 text-[#0B0B0F] shadow-2xl border-4 border-[#0B0B0F]/20 flex flex-col items-center">
              
              <div className="w-full flex items-center justify-between pb-4 border-b border-[#0B0B0F]/15 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0B0B0F]/70">
                  Live Preview
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#0B0B0F] text-[#DBEAFE]">
                  {QR_SIZE_PX[config.size]} x {QR_SIZE_PX[config.size]} px
                </span>
              </div>

              {/* The Actual Canvas for QR rendering */}
              <div className="relative p-4 rounded-2xl bg-white shadow-inner flex items-center justify-center max-w-full overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto block rounded-lg shadow-sm"
                  style={{ width: `${Math.min(QR_SIZE_PX[config.size], 300)}px` }}
                  aria-label={`QR Code encoding ${encodedUrl}`}
                />
                {isGenerating && (
                  <div className="absolute inset-0 bg-[#DBEAFE]/70 flex items-center justify-center font-bold text-xs text-[#0B0B0F]">
                    Rendering...
                  </div>
                )}
              </div>

              {/* Encoded URL display beneath QR */}
              <div className="w-full mt-6 bg-[#0B0B0F]/5 rounded-xl p-3 border border-[#0B0B0F]/10">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#0B0B0F]/60 mb-1">
                  <span>Encoded Destination</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="inline-flex items-center gap-1 text-[#0B0B0F] hover:underline cursor-pointer"
                      title="Copy URL"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <a
                      href={encodedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-[#0B0B0F] hover:underline"
                      title="Open URL in new tab"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <p className="font-mono text-xs text-[#0B0B0F] break-all select-all font-medium leading-relaxed">
                  {encodedUrl}
                </p>
              </div>

              {/* Download PNG Button */}
              <button
                type="button"
                onClick={handleDownloadPng}
                className="w-full mt-6 py-4 px-6 rounded-2xl font-extrabold text-base bg-[#0B0B0F] text-[#DBEAFE] hover:bg-[#5D4037] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download PNG</span>
              </button>

              <p className="text-[11px] text-[#0B0B0F]/70 text-center mt-3 font-medium">
                High-resolution file ready for print, social media, and packaging.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
