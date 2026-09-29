import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Palette, Type, Copy, Check, Compass } from 'lucide-react';

const COLOR_SWATCHES = [
  { name: 'Canvas', hex: '#0D1117', bg: 'bg-[#0D1117]' },
  { name: 'Paper', hex: '#F0F6FC', bg: 'bg-[#F0F6FC]' },
  { name: 'Paper Warm', hex: '#EDECE9', bg: 'bg-[#EDECE9]' },
  { name: 'Ink', hex: '#0A0A0A', bg: 'bg-[#0A0A0A]' },
  { name: 'Ship Green', hex: '#2EA043', bg: 'bg-[#2EA043]' },
  { name: 'Merge Purple', hex: '#A371F7', bg: 'bg-[#A371F7]' },
  { name: 'Review Amber', hex: '#D29922', bg: 'bg-[#D29922]' },
  { name: 'AI Blue', hex: '#58A6FF', bg: 'bg-[#58A6FF]' },
  { name: 'Highlight Yellow', hex: '#FFF9A3', bg: 'bg-[#FFF9A3]' },
  { name: 'Diff Red', hex: '#F85149', bg: 'bg-[#F85149]' },
];

const GTM_STEPS = [
  {
    num: 1,
    title: 'Protect the Core',
    summary: 'Ship the Classic promise first. Prove nothing is breaking.',
    detail: 'Preserve terminal fidelity, dense keyboards, and sub-100ms interactions for maintainers.'
  },
  {
    num: 2,
    title: 'Product Truth Over Hype',
    summary: 'Launch Studio as a live opt-in feature, not an ad campaign.',
    detail: 'Zero vaporware. Maintain dual-lens parity with instantaneous Alt+M toggle across all pages.'
  },
  {
    num: 3,
    title: 'Open Source Advocates',
    summary: 'Seed through maintainers, live README badges, and shareable build cards.',
    detail: 'Empower project creators with living portfolio cards and interactive visual diff intents.'
  }
];

export default function BrandPage() {
  const { lens, setLens, addToast } = useAppStore();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(2);

  const isClassic = lens === 'classic';

  const handleCopyColor = (swatch: typeof COLOR_SWATCHES[0]) => {
    navigator.clipboard.writeText(swatch.hex);
    setCopiedHex(swatch.hex);
    addToast(`Copied ${swatch.hex} (${swatch.name}) to clipboard!`, 'success');
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isClassic 
        ? 'font-classic text-paper bg-canvas' 
        : 'font-people text-ink bg-paper-warm studio-texture'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Sticky Anchor Navigation Bar per interactive-elements.md:36 */}
        <nav className={`sticky top-4 z-30 p-2.5 mb-12 flex flex-wrap items-center justify-center gap-3 text-xs font-bold uppercase transition-all ${
          isClassic
            ? 'bg-[#161b22]/90 backdrop-blur border border-gray-700 text-gray-300 shadow-md rounded-md'
            : 'bg-white/95 backdrop-blur border-2 border-ink text-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
        }`}>
          <a href="#why" className={`px-2 py-1 rounded transition ${isClassic ? 'hover:text-blue-400' : 'hover:text-ship-green hover:underline'}`}>Why Reposition</a>
          <span className={isClassic ? 'text-gray-600' : 'text-gray-300'}>/</span>
          <a href="#audience" className={`px-2 py-1 rounded transition ${isClassic ? 'hover:text-blue-400' : 'hover:text-ship-green hover:underline'}`}>Two Rings</a>
          <span className={isClassic ? 'text-gray-600' : 'text-gray-300'}>/</span>
          <a href="#colors" className={`px-2 py-1 rounded transition ${isClassic ? 'hover:text-blue-400' : 'hover:text-ship-green hover:underline'}`}>Colour System</a>
          <span className={isClassic ? 'text-gray-600' : 'text-gray-300'}>/</span>
          <a href="#typography" className={`px-2 py-1 rounded transition ${isClassic ? 'hover:text-blue-400' : 'hover:text-ship-green hover:underline'}`}>Typography</a>
          <span className={isClassic ? 'text-gray-600' : 'text-gray-300'}>/</span>
          <a href="#gtm" className={`px-2 py-1 rounded transition ${isClassic ? 'hover:text-blue-400' : 'hover:text-ship-green hover:underline'}`}>GTM Stepper</a>
        </nav>

        <header className="mb-24 flex flex-col items-center text-center">
          <img src="/brand/logo.png" className="w-32 h-32 rounded-full mb-8" alt="GitHub Logo" />
          <h1 className={`text-6xl md:text-7xl font-display font-black uppercase tracking-tighter mb-4 ${isClassic ? 'text-white' : 'text-ink'}`}>
            Where We Build Together.
          </h1>
          <p className={`text-xl md:text-2xl font-light max-w-2xl ${isClassic ? 'text-gray-400' : 'text-gray-600'}`}>
            Evolution, not erasure. The GitHub brand system v2.0.
          </p>
        </header>

        <section id="why" className="mb-32">
          <h2 className={`text-4xl font-display font-black uppercase tracking-tight mb-8 pb-4 ${
            isClassic ? 'border-b border-gray-700 text-white' : 'border-b-4 border-ink text-ink'
          }`}>
            Why Reposition?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`p-8 ${
              isClassic 
                ? 'bg-[#161b22] border border-gray-700 rounded-md text-gray-200' 
                : 'bg-white border-2 border-ink text-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
            }`}>
              <h3 className={`text-2xl font-black font-display uppercase mb-4 ${isClassic ? 'text-white' : 'text-ink'}`}>The Reality Gap</h3>
              <p className={isClassic ? 'text-gray-400' : 'text-gray-600'}>The brand still markets a static "code storage locker" while daily use is an active, social workshop.</p>
            </div>
            <div className={`p-8 ${
              isClassic 
                ? 'bg-[#161b22] border border-gray-700 rounded-md text-gray-200' 
                : 'bg-white border-2 border-ink text-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
            }`}>
              <h3 className={`text-2xl font-black font-display uppercase mb-4 ${isClassic ? 'text-white' : 'text-ink'}`}>The Growth Ceiling</h3>
              <p className={isClassic ? 'text-gray-400' : 'text-gray-600'}>The terminal-fluent base is near saturation. The next wave is PMs, designers, and AI-assisted creators.</p>
            </div>
            <div className={`p-8 ${
              isClassic 
                ? 'bg-[#161b22] border border-gray-700 rounded-md text-gray-200' 
                : 'bg-white border-2 border-ink text-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
            }`}>
              <h3 className={`text-2xl font-black font-display uppercase mb-4 ${isClassic ? 'text-white' : 'text-ink'}`}>The Backlash Trap</h3>
              <p className={isClassic ? 'text-gray-400' : 'text-gray-600'}>Modernise recklessly and alienate the maintainers who built trust. Do nothing and get bypassed.</p>
            </div>
          </div>
        </section>

        <section id="audience" className="mb-32">
          <h2 className={`text-4xl font-display font-black uppercase tracking-tight mb-8 pb-4 ${
            isClassic ? 'border-b border-gray-700 text-white' : 'border-b-4 border-ink text-ink'
          }`}>
            The Audience: Two Rings
          </h2>
          <div className={`flex flex-col md:flex-row items-center gap-16 p-12 ${
            isClassic 
              ? 'bg-[#161b22] border border-gray-700 rounded-md' 
              : 'bg-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
          }`}>
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Outer Ring - Clicking activates Studio Lens */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setLens('studio');
                  addToast('Switched to Studio Lens (The Expanding Edge)', 'info');
                }}
                className={`absolute inset-0 border-8 border-dashed rounded-full animate-[spin_20s_linear_infinite] hover:border-ship-green transition-colors cursor-pointer group ${
                  isClassic ? 'border-gray-600' : 'border-gray-300'
                }`}
                title="Click outer ring: Switch to Studio Lens"
              >
              </div>

              {/* Inner Ring - Clicking activates Classic Lens */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setLens('classic');
                  addToast('Switched to Classic Lens (The Spiritual Core)', 'info');
                }}
                className={`absolute inset-16 rounded-full flex items-center justify-center transition-colors cursor-pointer z-10 shadow-md ${
                  isClassic
                    ? 'border-4 border-blue-500 bg-canvas text-paper hover:bg-[#1f2937]'
                    : 'border-8 border-ink bg-gray-100 hover:bg-ink hover:text-white'
                }`}
                title="Click inner ring: Switch to Classic Lens"
              >
                <span className="font-bold uppercase tracking-widest text-center select-none text-xs">
                  The<br/>Spiritual<br/>Core
                </span>
              </div>
              
              <div className={`absolute -top-12 text-center w-full font-bold uppercase tracking-tight text-xs ${
                isClassic ? 'text-gray-400' : 'text-gray-500'
              }`}>
                The Expanding Edge (Click Outer Ring)
              </div>
            </div>
            
            <div className="flex-1 space-y-8">
              <div 
                onClick={() => {
                  setLens('classic');
                  addToast('Switched to Classic Lens (The Spiritual Core)', 'info');
                }}
                className={`p-4 rounded border-2 cursor-pointer transition ${
                  isClassic 
                    ? 'border-blue-500 bg-blue-950/20' 
                    : 'border-transparent hover:border-ink hover:bg-gray-50'
                }`}
              >
                <h3 className="text-2xl font-black font-display uppercase mb-2 flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${isClassic ? 'bg-blue-400' : 'bg-ink'}`}></div> 
                  <span className={isClassic ? 'text-white' : 'text-ink'}>The Spiritual Core</span>
                </h3>
                <p className={isClassic ? 'text-gray-400' : 'text-gray-600'}>
                  Professional engineers and open-source maintainers who demand terminal fidelity, density, and speed. They get <strong>Classic</strong>.
                </p>
              </div>
              <div 
                onClick={() => {
                  setLens('studio');
                  addToast('Switched to Studio Lens (The Expanding Edge)', 'info');
                }}
                className={`p-4 rounded border-2 cursor-pointer transition ${
                  !isClassic 
                    ? 'border-ink bg-highlight-yellow/20' 
                    : 'border-transparent hover:border-gray-600 hover:bg-gray-800/40'
                }`}
              >
                <h3 className="text-2xl font-black font-display uppercase mb-2 flex items-center gap-2">
                  <div className="w-4 h-4 border-4 border-dashed border-gray-400 rounded-full"></div> 
                  <span className={isClassic ? 'text-white' : 'text-ink'}>The Expanding Edge</span>
                </h3>
                <p className={isClassic ? 'text-gray-400' : 'text-gray-600'}>
                  PMs reviewing PRs, designers joining discussions, students, "vibe coders". Millions of new builders. They get <strong>Studio</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="colors" className="mb-32">
          <div className={`flex justify-between items-end pb-4 mb-8 ${
            isClassic ? 'border-b border-gray-700 text-white' : 'border-b-4 border-ink text-ink'
          }`}>
            <h2 className="text-4xl font-display font-black uppercase tracking-tight flex items-center gap-4">
              <Palette size={32} /> Colour System
            </h2>
            <span className={`text-xs font-bold uppercase tracking-wider ${isClassic ? 'text-gray-400' : 'text-gray-500'}`}>
              Click swatch to copy hex code
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {COLOR_SWATCHES.map((swatch) => (
              <div 
                key={swatch.hex}
                onClick={() => handleCopyColor(swatch)}
                className={`cursor-pointer transition-all relative group overflow-hidden ${
                  isClassic 
                    ? 'border border-gray-700 bg-[#161b22] text-gray-200 rounded hover:border-blue-500' 
                    : 'border-2 border-ink bg-white text-ink hover:shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:-translate-y-0.5'
                }`}
              >
                <div className={`h-24 ${swatch.bg} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    {copiedHex === swatch.hex ? (
                      <Check size={20} className="text-white drop-shadow" />
                    ) : (
                      <Copy size={18} className="text-white drop-shadow" />
                    )}
                  </div>
                </div>
                <div className="p-2.5 font-bold uppercase text-xs flex justify-between items-center">
                  <div>
                    <div className={isClassic ? 'text-white' : 'text-ink'}>{swatch.name}</div>
                    <span className={`block font-code font-normal text-[11px] ${isClassic ? 'text-gray-400' : 'text-gray-500'}`}>{swatch.hex}</span>
                  </div>
                  {copiedHex === swatch.hex && (
                    <span className="text-[10px] text-ship-green font-bold">Copied!</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="typography" className="mb-32">
          <h2 className={`text-4xl font-display font-black uppercase tracking-tight mb-8 pb-4 flex items-center gap-4 ${
            isClassic ? 'border-b border-gray-700 text-white' : 'border-b-4 border-ink text-ink'
          }`}>
            <Type size={32} /> Typography
          </h2>
          <div className="space-y-12">
             <div className={`p-8 ${
               isClassic 
                 ? 'bg-[#161b22] border border-gray-700 rounded-md text-gray-200' 
                 : 'bg-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
             }`}>
               <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${isClassic ? 'text-gray-400' : 'text-gray-500'}`}>// Display Voice (Inter Tight)</h3>
               <div className={`font-display font-black text-6xl tracking-tighter uppercase leading-none ${isClassic ? 'text-white' : 'text-ink'}`}>The Social<br/>Workshop.</div>
             </div>
             <div className={`p-8 ${
               isClassic 
                 ? 'bg-[#161b22] border border-gray-700 rounded-md text-gray-200' 
                 : 'bg-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
             }`}>
               <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${isClassic ? 'text-gray-400' : 'text-gray-500'}`}>// People Voice (Figtree / Source Sans)</h3>
               <div className={`text-2xl leading-relaxed ${isClassic ? 'text-gray-300' : 'text-ink'}`}>GitHub is where software gets built, together. The people voice is human, plain-language, and warm.</div>
             </div>
             <div className={`p-8 ${
               isClassic 
                 ? 'bg-canvas border border-gray-700 rounded-md text-paper' 
                 : 'bg-canvas border-2 border-ink p-8 text-paper shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
             }`}>
               <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">// Code Voice (JetBrains Mono)</h3>
               <div className="font-code text-xl text-green-400">const isPrecise = true;</div>
             </div>
          </div>
        </section>
        
        <section id="gtm" className="mb-32">
          <div className={`flex justify-between items-end pb-4 mb-8 ${
            isClassic ? 'border-b border-gray-700 text-white' : 'border-b-4 border-ink text-ink'
          }`}>
            <h2 className="text-4xl font-display font-black uppercase tracking-tight">Go-To-Market Stepper</h2>
            <span className={`text-xs font-bold uppercase tracking-wider ${isClassic ? 'text-gray-400' : 'text-gray-500'}`}>
              Click step cards to activate
            </span>
          </div>

          <div data-tour="brand-stepper" className="flex flex-col md:flex-row gap-4">
            {GTM_STEPS.map((step) => {
              const isActive = activeStep === step.num;
              return (
                <div 
                  key={step.num}
                  onClick={() => {
                    setActiveStep(step.num);
                    addToast(`Active GTM Milestone ${step.num}: ${step.title}`, 'info');
                  }}
                  className={`flex-1 p-6 cursor-pointer transition-all ${
                    isClassic
                      ? isActive
                        ? 'bg-blue-950/40 border-2 border-blue-500 text-white rounded-md md:-translate-y-2'
                        : 'bg-[#161b22] border border-gray-700 text-gray-300 rounded-md hover:border-gray-500'
                      : isActive 
                        ? 'bg-highlight-yellow border-2 border-ink text-ink shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] md:-translate-y-3 z-10' 
                        : 'bg-white border-2 border-ink text-ink hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <div className={`text-3xl font-display font-black mb-2 ${
                    isActive 
                      ? isClassic ? 'text-blue-400' : 'text-ink' 
                      : isClassic ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    0{step.num}
                  </div>
                  <h3 className="font-bold uppercase tracking-widest mb-3 text-sm flex items-center justify-between">
                    <span className={isActive && isClassic ? 'text-white' : ''}>{step.title}</span>
                    {isActive && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isClassic ? 'bg-blue-500 text-white' : 'bg-ink text-white'
                      }`}>
                        ACTIVE
                      </span>
                    )}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    isActive 
                      ? isClassic ? 'text-gray-200' : 'font-semibold text-ink' 
                      : isClassic ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {step.summary}
                  </p>
                  <p className={`text-xs ${
                    isActive 
                      ? isClassic ? 'text-gray-400 border-t border-gray-700 pt-2' : 'text-gray-800 font-medium border-t border-ink/20 pt-2' 
                      : isClassic ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {step.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
