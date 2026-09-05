import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Crosshair, 
  Sparkles, 
  Target, 
  Lightbulb, 
  ShieldAlert, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { MicroFlawPrecisionDiagnostic, ToxicHostilityAudit, MicroFlawItem } from '../types.ts';

interface MicroFlawPrecisionCardProps {
  diagnostic?: MicroFlawPrecisionDiagnostic | null;
  toxicAudit?: ToxicHostilityAudit | null;
  title?: string;
}

export const MicroFlawPrecisionCard: React.FC<MicroFlawPrecisionCardProps> = ({
  diagnostic,
  toxicAudit,
  title = 'Breakthrough Flaw Precision Diagnostic'
}) => {
  const isToxic = Boolean(toxicAudit?.isToxic);
  const hasFlaws = Boolean(diagnostic?.hasFlaws && diagnostic.flaws && diagnostic.flaws.length > 0);

  if (!isToxic && !hasFlaws && !diagnostic?.truthTestingSummary) {
    return null;
  }

  return (
    <div id="micro-flaw-precision-card" className="space-y-4 rounded-2xl border border-white/10 bg-[#121214] p-5 sm:p-6 shadow-xl text-zinc-100">
      {/* Toxic Hostility Ad-Hominem Callout Banner */}
      {isToxic && (
        <div className="rounded-xl border border-rose-500/60 bg-rose-950/40 p-4 text-rose-100 space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider font-bold text-rose-300">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
            <span>Civility Breach Audit • Zero-Tolerance Hostile Language Detected</span>
          </div>
          <div className="bg-black/50 border border-rose-500/30 rounded-lg p-3 text-xs font-mono text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-rose-400 font-bold uppercase text-[10px] block">Insult / Slur Flagged:</span>
              <span className="text-white font-bold text-sm">"{toxicAudit?.insultDetected}"</span>
            </div>
            <div className="text-right sm:border-l sm:border-rose-500/30 sm:pl-3">
              <span className="text-rose-400 font-bold uppercase text-[10px] block">Civility Penalty:</span>
              <span className="text-rose-300 font-bold text-xs">-{toxicAudit?.penaltyAppliedPercent ?? 75}% Score Deduction</span>
            </div>
          </div>
          <p className="text-xs font-sans text-rose-100/90 leading-relaxed">
            {toxicAudit?.civilityBreachReason ||
              "Calling a coworker or stakeholder an idiot, moron, or incompetent is a severe breach of workplace civility. Even if delivered with optimal pitch or pace, derogatory language is disqualifying."}
          </p>
        </div>
      )}

      {/* Main Diagnostic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Truth-Testing Engine
              </span>
            </h4>
            <p className="text-xs text-zinc-400">
              Pinpoints exact flaws in what was said—ensuring composure without substance never earns an unearned high score.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {hasFlaws ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
              {diagnostic?.flawCount || diagnostic?.flaws.length} Micro-Flaw{(diagnostic?.flawCount ?? 1) > 1 ? 's' : ''} Named
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Flawless Substance
            </span>
          )}
        </div>
      </div>

      {/* Truth Testing Summary */}
      {diagnostic?.truthTestingSummary && (
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300 leading-relaxed font-sans">
          <span className="font-mono text-amber-400 font-bold uppercase text-[10px] tracking-wider block mb-1">
            Precision Substance Finding:
          </span>
          {diagnostic.truthTestingSummary}
        </div>
      )}

      {/* Flaw List with Positive, Constructive Coaching */}
      {hasFlaws && diagnostic?.flaws && (
        <div className="space-y-3 pt-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
            Constructive Micro-Flaw Breakdown & Exemplar Resolutions:
          </span>

          <div className="space-y-3">
            {diagnostic.flaws.map((flaw: MicroFlawItem, idx: number) => {
              const isCrit = flaw.severity === 'critical';
              const isMod = flaw.severity === 'moderate';

              return (
                <div
                  key={flaw.flawId || idx}
                  className={`rounded-xl border p-4 space-y-3 transition-all ${
                    isCrit
                      ? 'border-rose-500/40 bg-rose-950/20 text-rose-100'
                      : isMod
                      ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
                      : 'border-cyan-500/30 bg-cyan-950/20 text-cyan-100'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                          isCrit
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : isMod
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        }`}
                      >
                        {flaw.severity.toUpperCase()} • {flaw.category}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {flaw.issueNamed}
                      </span>
                    </div>

                    {flaw.identifiedExcerpt && (
                      <span className="text-[11px] font-mono text-zinc-400 italic">
                        Excerpt: "{flaw.identifiedExcerpt}"
                      </span>
                    )}
                  </div>

                  {/* Why it fails the scenario */}
                  <div className="text-xs font-sans text-zinc-300 space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-bold text-[10px] uppercase font-mono mt-0.5 shrink-0">
                        Operational Risk:
                      </span>
                      <p className="leading-relaxed">{flaw.whyItFailsScenario}</p>
                    </div>
                  </div>

                  {/* Positive Growth Coaching */}
                  <div className="bg-black/50 border border-white/10 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Positive Growth Coaching:</span>
                    </div>
                    <p className="text-xs font-sans text-zinc-200 leading-relaxed">
                      {flaw.positiveGrowthCoaching}
                    </p>

                    {/* Model Exemplar Alternative */}
                    {flaw.exemplarCorrection && (
                      <div className="pt-2 border-t border-white/10 mt-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>What Should Have Been Said Instead:</span>
                        </div>
                        <p className="text-xs font-serif italic text-emerald-200/90 leading-relaxed">
                          "{flaw.exemplarCorrection}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
