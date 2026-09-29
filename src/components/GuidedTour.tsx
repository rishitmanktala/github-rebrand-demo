import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Map } from 'lucide-react';
import { useAppStore, TOUR_STEPS } from '../store';

// ─── Spotlight geometry helpers ──────────────────────────────────────────────

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 12; // spotlight padding in px

function getTargetRect(selector: string | null): Rect | null {
  if (!selector) return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  };
}

// ─── Callout bubble ──────────────────────────────────────────────────────────

interface CalloutProps {
  rect: Rect | null;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  title: string;
  body: string;
  stepIdx: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

function Callout({ rect, placement, title, body, stepIdx, totalSteps, onNext, onPrev, onSkip }: CalloutProps) {
  const progress = ((stepIdx + 1) / totalSteps) * 100;

  // Compute callout position from target rect
  const style: React.CSSProperties = {};
  const CALLOUT_W = 360;
  const CALLOUT_GAP = 16;

  if (!rect || placement === 'center') {
    style.position = 'fixed';
    style.top = '50%';
    style.left = '50%';
    style.transform = 'translate(-50%, -50%)';
    style.width = CALLOUT_W;
  } else if (placement === 'bottom') {
    style.position = 'fixed';
    style.top = rect.top + rect.height + CALLOUT_GAP;
    style.left = Math.min(rect.left, window.innerWidth - CALLOUT_W - 16);
    style.width = CALLOUT_W;
  } else if (placement === 'top') {
    style.position = 'fixed';
    style.top = rect.top - CALLOUT_GAP - 220; // approx callout height
    style.left = Math.min(rect.left, window.innerWidth - CALLOUT_W - 16);
    style.width = CALLOUT_W;
  } else if (placement === 'right') {
    style.position = 'fixed';
    style.top = rect.top;
    style.left = rect.left + rect.width + CALLOUT_GAP;
    style.width = CALLOUT_W;
  } else if (placement === 'left') {
    style.position = 'fixed';
    style.top = rect.top;
    style.left = Math.max(8, rect.left - CALLOUT_W - CALLOUT_GAP);
    style.width = CALLOUT_W;
  }

  // Clamp top so it never goes offscreen
  if (style.top !== undefined && typeof style.top === 'number') {
    style.top = Math.max(8, Math.min(style.top as number, window.innerHeight - 260));
  }

  return (
    <motion.div
      key={stepIdx}
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={style}
      className="z-[10000] bg-paper-warm border-2 border-ink shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] font-people"
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-4 pb-2 border-b-2 border-ink">
        <div className="flex-1 pr-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
            Step {stepIdx + 1} of {totalSteps}
          </div>
          <h3 className="font-display font-black text-base uppercase tracking-tight text-ink leading-tight">
            {title}
          </h3>
        </div>
        <button
          onClick={onSkip}
          className="text-gray-400 hover:text-ink transition p-0.5 mt-0.5 flex-shrink-0"
          aria-label="Close tour"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-3 text-sm text-ink/80 leading-relaxed">
        {body}
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-3">
        <div className="w-full h-1.5 bg-gray-200 border border-ink/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-ship-green"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between px-5 pb-4">
        <button
          onClick={onPrev}
          disabled={stepIdx === 0}
          className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wide text-ink/60 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={14} />
          <span>Back</span>
        </button>

        <button
          onClick={onSkip}
          className="text-xs text-gray-400 hover:text-ink transition underline"
        >
          Skip tour
        </button>

        <button
          onClick={onNext}
          className="flex items-center space-x-1.5 bg-ink text-paper-warm px-4 py-1.5 text-xs font-bold uppercase tracking-wide border-2 border-ink shadow-[3px_3px_0px_0px_rgba(10,10,10,0.4)] hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,0.4)] transition"
        >
          <span>{stepIdx === totalSteps - 1 ? 'Finish' : 'Next'}</span>
          {stepIdx < totalSteps - 1 && <ChevronRight size={14} />}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Step map drawer ─────────────────────────────────────────────────────────

function StepMap({ currentStep, onJump, onClose }: { currentStep: number; onJump: (i: number) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed top-1/2 left-4 -translate-y-1/2 z-[10001] bg-paper-warm border-2 border-ink shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] w-56 font-people"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-ink bg-ink text-paper-warm">
        <span className="font-display font-black uppercase text-xs tracking-wide">Tour Map</span>
        <button onClick={onClose} className="text-paper-warm/60 hover:text-paper-warm"><X size={14} /></button>
      </div>
      <div className="py-2">
        {TOUR_STEPS.map((step, i) => (
          <button
            key={step.id}
            onClick={() => onJump(i)}
            className={`w-full text-left px-4 py-1.5 text-xs flex items-center space-x-2 transition ${
              i === currentStep
                ? 'bg-highlight-yellow font-black text-ink'
                : i < currentStep
                  ? 'text-gray-400 line-through hover:text-ink hover:bg-gray-100'
                  : 'text-ink font-semibold hover:bg-gray-100'
            }`}
          >
            <span className={`w-4 h-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-[9px] font-black ${
              i < currentStep ? 'bg-ship-green border-ship-green text-white' : i === currentStep ? 'border-ink bg-highlight-yellow' : 'border-gray-300 bg-white'
            }`}>{i < currentStep ? '✓' : i + 1}</span>
            <span className="truncate">{step.title.replace(/^[^\s]+\s/, '')}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── SVG spotlight overlay ────────────────────────────────────────────────────

function SpotlightSVG({ rect }: { rect: Rect | null }) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!rect) {
    return (
      <svg className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 9998 }}>
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#tour-mask)" />
      </svg>
    );
  }

  return (
    <svg className="fixed inset-0 pointer-events-none" width={vw} height={vh} style={{ zIndex: 9998 }}>
      <defs>
        <mask id="tour-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect
            x={rect.left} y={rect.top}
            width={rect.width} height={rect.height}
            rx={6}
            fill="black"
          />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#tour-mask)" />
      {/* Spotlight border ring */}
      <rect
        x={rect.left} y={rect.top}
        width={rect.width} height={rect.height}
        rx={6}
        fill="none"
        stroke="#FFF9A3"
        strokeWidth={2.5}
        opacity={0.9}
      />
    </svg>
  );
}

// ─── Main GuidedTour orchestrator ─────────────────────────────────────────────

export default function GuidedTour() {
  const navigate = useNavigate();
  const {
    tourActive, tourStep,
    nextTourStep, prevTourStep, endTour, jumpTourStep,
    setLens,
  } = useAppStore();

  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const prevStepRef = useRef<number>(-1);

  const step = TOUR_STEPS[tourStep];

  // When step changes: navigate, switch lens, then measure target
  useEffect(() => {
    if (!tourActive || !step) return;

    setReady(false);

    // Apply lens switch first
    if (step.mountAction === 'switch-to-studio') setLens('studio');
    if (step.mountAction === 'switch-to-classic') setLens('classic');

    // Navigate if route changed
    if (step.route && prevStepRef.current !== tourStep) {
      navigate(step.route);
    }
    prevStepRef.current = tourStep;

    // Wait for DOM settle then measure target
    const t = setTimeout(() => {
      setTargetRect(getTargetRect(step.target));
      setReady(true);
    }, 450);
    return () => clearTimeout(t);
  }, [tourActive, tourStep, step, navigate, setLens]);

  // Scroll highlighted element into view
  useEffect(() => {
    if (!step?.target) return;
    const el = document.querySelector(step.target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [tourStep, ready]);

  // Keyboard: → / Space = next, ← = back, Esc = close, M = map
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!tourActive) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextTourStep(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevTourStep(); }
    if (e.key === 'Escape') endTour();
    if (e.key.toLowerCase() === 'm') setMapOpen(v => !v);
  }, [tourActive, nextTourStep, prevTourStep, endTour]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!tourActive || !step) return null;

  return (
    <>
      {/* Dimming + spotlight SVG */}
      <AnimatePresence>
        {ready && (
          <motion.div key="spotlight" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SpotlightSVG rect={targetRect} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Callout bubble */}
      <AnimatePresence mode="wait">
        {ready && (
          <Callout
            key={step.id}
            rect={targetRect}
            placement={step.placement}
            title={step.title}
            body={step.body}
            stepIdx={tourStep}
            totalSteps={TOUR_STEPS.length}
            onNext={nextTourStep}
            onPrev={prevTourStep}
            onSkip={endTour}
          />
        )}
      </AnimatePresence>

      {/* Map button (floating) */}
      <button
        onClick={() => setMapOpen(v => !v)}
        title="Tour map (M)"
        className="fixed bottom-20 left-4 z-[10002] bg-ink text-paper-warm border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] p-2 hover:bg-gray-800 transition"
      >
        <Map size={16} />
      </button>

      {/* Step map drawer */}
      <AnimatePresence>
        {mapOpen && (
          <StepMap
            currentStep={tourStep}
            onJump={(i) => { jumpTourStep(i); setMapOpen(false); }}
            onClose={() => setMapOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Keyboard hint bar */}
      {ready && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[10002] flex items-center space-x-3 bg-ink/80 text-paper-warm/60 text-[10px] font-mono px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm pointer-events-none">
          <span><kbd className="text-white">←</kbd><kbd className="text-white mx-1">→</kbd> navigate</span>
          <span>·</span>
          <span><kbd className="text-white">M</kbd> map</span>
          <span>·</span>
          <span><kbd className="text-white">Esc</kbd> exit</span>
        </div>
      )}
    </>
  );
}
