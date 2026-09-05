import React from 'react';
import { ToneDecisivenessCalibrationResult } from '../types';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Award,
  Sliders,
  Flame,
  ArrowRight,
  Compass,
  Volume2
} from 'lucide-react';

interface ToneDecisivenessCalibrationCardProps {
  calibration?: ToneDecisivenessCalibrationResult;
  roleTitle?: string;
}

export const ToneDecisivenessCalibrationCard: React.FC<ToneDecisivenessCalibrationCardProps> = ({
  calibration,
  roleTitle = 'Target Role'
}) => {
  if (!calibration) return null;

  const {
    neutralDiplomaticBenchmark,
    authoritativeDecisiveBenchmark,
    calibrationRatio,
    biasMitigationApplied,
    biasType,
    jobAdequacyCalibrationOffset,
    culturalFitCalibrationOffset,
    calibratedToneLabel,
    calibratedLeadershipClassification,
    correctiveInterventions,
    antiWarmthBiasRationale,
    benchmarkingComparisonNarrative
  } = calibration;

  const isLeadershipAdequate = calibratedLeadershipClassification.includes('Leadership-Adequate') ||
    calibratedLeadershipClassification.includes('Commanding Executive') ||
    calibratedLeadershipClassification.includes('Firm & Corrective');

  return (
    <div
      id="tone-decisiveness-calibration-card"
      className="bg-gradient-to-br from-zinc-950 via-black to-zinc-950 border border-emerald-500/40 p-5 sm:p-6 rounded-2xl space-y-4 shadow-2xl font-sans"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-2">
              Tone & Decisiveness Calibration Engine
              {biasMitigationApplied && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold normal-case tracking-normal">
                  Anti-Warmth Bias Protected
                </span>
              )}
            </h5>
            <span className="text-[10px] text-zinc-400 font-mono">
              Empirical Benchmarking: Neutral/Diplomatic vs Authoritative/Decisive Tone Parity
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-700 text-zinc-200">
            {calibrationRatio.toFixed(2)}x Parity Ratio
          </span>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
              isLeadershipAdequate
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800'
            }`}
          >
            {isLeadershipAdequate ? '✓ Leadership-Adequate' : 'Calibrated Standard'}
          </span>
        </div>
      </div>

      {/* Leadership Classification Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-purple-950/40 border border-emerald-500/30 p-4 rounded-xl space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            Calibrated Leadership Classification:
          </span>
          <span className="text-xs font-mono font-bold text-emerald-200 bg-emerald-900/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
            {calibratedLeadershipClassification}
          </span>
        </div>

        <p className="text-xs text-zinc-200 leading-relaxed font-sans">
          {antiWarmthBiasRationale}
        </p>

        {biasMitigationApplied && (
          <div className="pt-2 border-t border-emerald-500/20 flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-300">
            <span className="flex items-center gap-1 text-emerald-400">
              <Sliders className="w-3 h-3" />
              Parity Equalization Offsets:
            </span>
            <span className="bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-300 font-bold">
              Job Adequacy: +{jobAdequacyCalibrationOffset} pts
            </span>
            {culturalFitCalibrationOffset > 0 && (
              <span className="bg-black/60 px-2 py-0.5 rounded border border-purple-500/30 text-purple-300 font-bold">
                Cultural Boundary Fit: +{culturalFitCalibrationOffset} pts
              </span>
            )}
            <span className="text-[10px] text-zinc-400 italic">
              Bias Type: {biasType === 'warmth_overindexing' || biasType === 'corrective_underappreciation' ? 'Warmth-Penalty Neutralized' : 'Calibrated Mastery'}
            </span>
          </div>
        )}
      </div>

      {/* Dual-Benchmark Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Authoritative / Decisive Benchmark */}
        <div className="bg-black/60 border border-purple-500/30 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              Authoritative / Decisive Profile
            </span>
            <span className="text-xs font-mono font-bold text-purple-200 bg-purple-950/60 border border-purple-500/40 px-2 py-0.5 rounded">
              {authoritativeDecisiveBenchmark.score}%
            </span>
          </div>

          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500"
              style={{ width: `${Math.min(100, authoritativeDecisiveBenchmark.score)}%` }}
            />
          </div>

          <p className="text-[11px] text-zinc-300 leading-normal">
            {authoritativeDecisiveBenchmark.characteristicSummary}
          </p>

          {/* Markers */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              Decisive Markers Detected ({authoritativeDecisiveBenchmark.markersDetected.length})
            </span>
            <div className="flex flex-wrap gap-1">
              {authoritativeDecisiveBenchmark.markersDetected.length > 0 ? (
                authoritativeDecisiveBenchmark.markersDetected.map((marker, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-950/40 border border-purple-500/30 text-purple-200 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-purple-400" />
                    "{marker}"
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-zinc-400 italic">No overt command verbs detected</span>
              )}
            </div>
          </div>

          {/* Acoustic Footprint */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-lg flex items-start gap-2 text-[11px]">
            <Volume2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <span className="text-zinc-300 font-sans">{authoritativeDecisiveBenchmark.acousticFootprint}</span>
          </div>
        </div>

        {/* Neutral / Diplomatic Benchmark */}
        <div className="bg-black/60 border border-cyan-500/30 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Neutral / Diplomatic Profile
            </span>
            <span className="text-xs font-mono font-bold text-cyan-200 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded">
              {neutralDiplomaticBenchmark.score}%
            </span>
          </div>

          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.min(100, neutralDiplomaticBenchmark.score)}%` }}
            />
          </div>

          <p className="text-[11px] text-zinc-300 leading-normal">
            {neutralDiplomaticBenchmark.characteristicSummary}
          </p>

          {/* Markers */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              Diplomatic Markers Detected ({neutralDiplomaticBenchmark.markersDetected.length})
            </span>
            <div className="flex flex-wrap gap-1">
              {neutralDiplomaticBenchmark.markersDetected.length > 0 ? (
                neutralDiplomaticBenchmark.markersDetected.map((marker, idx) => (
                  <span
                    key={idx}
                    className="bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400" />
                    "{marker}"
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-zinc-400 italic">No diplomatic hedging markers detected</span>
              )}
            </div>
          </div>

          {/* Acoustic Footprint */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-lg flex items-start gap-2 text-[11px]">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span className="text-zinc-300 font-sans">{neutralDiplomaticBenchmark.acousticFootprint}</span>
          </div>
        </div>
      </div>

      {/* Corrective Interventions Detected */}
      {correctiveInterventions && correctiveInterventions.length > 0 && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Corrective Interventions & Boundary Directives ({correctiveInterventions.length})
            </span>
            <span className="text-[10px] text-zinc-400">Classified as Leadership-Adequate</span>
          </div>

          <div className="space-y-2">
            {correctiveInterventions.map((item, idx) => (
              <div
                key={idx}
                className="bg-black/70 border border-emerald-500/20 p-3 rounded-lg space-y-1.5 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="font-mono text-emerald-300 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    {item.typeLabel || item.interventionType}
                  </span>
                  <span className="bg-emerald-900/40 text-emerald-200 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
                    +{item.leadershipAdequacyWeight} pts Leadership-Adequate
                  </span>
                </div>

                <div className="text-zinc-200 font-mono text-[11px] bg-zinc-900/80 px-2.5 py-1.5 rounded border border-zinc-800">
                  "{item.excerpt}"
                </div>

                <p className="text-[11px] text-zinc-300 leading-normal font-sans">
                  {item.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benchmarking Comparison Narrative */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl space-y-1.5 text-xs">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
          Benchmarking Forensic Synthesis:
        </span>
        <p className="text-zinc-200 leading-relaxed font-sans">
          {benchmarkingComparisonNarrative}
        </p>
      </div>
    </div>
  );
};
