import React from 'react';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

export const EXECUTIVE_VOICE_LINE = "Are you tired of the grind? Fire, hire, then fire again? Then let us hire your standards.";

export function AudioVoiceBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-50/90 via-stone-50 to-orange-50/80 border border-amber-200/90 p-5 sm:p-6 my-4 relative overflow-hidden shadow-sm rounded-2xl">
      {/* Background visual glow effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 blur-3xl pointer-events-none rounded-full" />
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
        
        {/* Main Quote & Motto Section */}
        <div className="space-y-2.5 max-w-4xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono px-2.5 py-0.5 uppercase tracking-wider font-bold flex items-center gap-1.5 rounded-full shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>Executive Motto</span>
            </span>
          </div>

          {/* Main Motto Sentence */}
          <h2 className="font-serif italic text-lg sm:text-xl md:text-2xl text-stone-900 font-semibold leading-snug">
            "{EXECUTIVE_VOICE_LINE}"
          </h2>

          {/* T.H.I.S. System Highlight */}
          <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs font-mono text-stone-700">
            <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 border border-stone-200 rounded-xl shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-amber-900 font-bold">T.H.I.S. System:</span>
              <span className="text-stone-800 font-sans">Train, Hire, Impress, Sustain</span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">Score all testing to the truest grade.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

