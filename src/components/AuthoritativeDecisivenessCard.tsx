import React from 'react';
import { AuthoritativeDecisivenessAudit, ToneDecisivenessCalibrationResult } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  TrendingDown,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Terminal,
  Activity,
  HeartHandshake,
  Scale,
  Sliders
} from 'lucide-react';

interface AuthoritativeDecisivenessCardProps {
  audit?: AuthoritativeDecisivenessAudit;
  calibration?: ToneDecisivenessCalibrationResult;
  roleTitle?: string;
}

export const AuthoritativeDecisivenessCard: React.FC<AuthoritativeDecisivenessCardProps> = ({
  audit,
  calibration,
  roleTitle = 'Target Role'
}) => {
  if (!audit) return null;

  const isAuthoritative = audit.isAuthoritativeFirm;
  const isDereliction = audit.decisivenessTier === 'Detached / Derelict';
  const isHesitant = audit.decisivenessTier === 'Hesitant / Passive';

  const getBadgeStyle = () => {
    switch (audit.decisivenessTier) {
      case 'Commanding Executive':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'Firm Professional':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'Developing Authority':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50';
      case 'Hesitant / Passive':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'Detached / Derelict':
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
    }
  };

  return (
    <div className="bg-gradient-to-br from-zinc-950 via-black to-zinc-950 border border-purple-500/40 p-5 sm:p-6 rounded-2xl space-y-4 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
              Authoritative Decisiveness & Command Audit
            </h5>
            <span className="text-[10px] text-zinc-400 font-mono">
              Scientific DSP & Lexical Action Engine • Speech Tempo • Jitter • Terminal Inflection
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${getBadgeStyle()}`}>
            {audit.decisivenessTier}
          </span>
          <span className="text-xs font-mono font-bold text-white bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
            {audit.score}% Command
          </span>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Command Score */}
        <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
            Command Assessment
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-mono font-bold text-white">
              {audit.score}%
            </span>
            <span className={`text-[10px] font-mono font-semibold ${isAuthoritative ? 'text-emerald-400' : isDereliction ? 'text-rose-400' : 'text-amber-400'}`}>
              {isAuthoritative ? 'High Adequacy' : isDereliction ? 'Dereliction' : 'Standard'}
            </span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAuthoritative ? 'bg-purple-400' : isDereliction ? 'bg-rose-500' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, audit.score)}%` }}
            />
          </div>
        </div>

        {/* Cadence Analysis */}
        <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
            Cadence & Pacing
          </span>
          <p className="text-[11px] text-zinc-200 line-clamp-2 pt-0.5 leading-snug">
            {audit.tempoCadenceAnalysis}
          </p>
        </div>

        {/* Jitter & Resonance */}
        <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
            Vocal Perturbation & Resonance
          </span>
          <p className="text-[11px] text-zinc-200 line-clamp-2 pt-0.5 leading-snug">
            {audit.jitterResonanceAnalysis}
          </p>
        </div>
      </div>

      {/* Terminal Inflection Trajectory */}
      <div className="bg-zinc-900/70 border border-zinc-800 p-3 rounded-xl flex items-start gap-2.5 text-xs">
        <Volume2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider block">
            Acoustic Terminal Inflection Trajectory
          </span>
          <p className="text-zinc-200 font-sans leading-normal">
            {audit.terminalInflectionAnalysis}
          </p>
        </div>
      </div>

      {/* Command Verbs Detected */}
      {audit.commandVerbsDetected && audit.commandVerbsDetected.length > 0 && (
        <div className="bg-purple-950/20 border border-purple-500/30 p-3.5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              Decisive Command Verbs & Protocols Identified ({audit.commandVerbsDetected.length})
            </span>
            <span className="text-[10px] text-zinc-400">Lexical Operational Verification</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {audit.commandVerbsDetected.map((cue, idx) => (
              <span
                key={idx}
                className="bg-black/80 border border-purple-500/40 text-purple-200 text-[11px] font-mono px-2.5 py-0.5 rounded-md flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-purple-400" />
                "{cue}"
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tone Calibration & Anti-Warmth Bias Parity Benchmark */}
      {(calibration || audit.calibrationSummary) && (
        <div className="bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-purple-950/30 border border-emerald-500/30 p-3.5 rounded-xl space-y-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-1.5 font-mono text-[11px] font-bold">
            <span className="text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              Tone Decisiveness Calibration Benchmark:
            </span>
            <span className="bg-emerald-900/40 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px]">
              {calibration?.calibratedLeadershipClassification || audit.calibratedLeadershipLabel || 'Leadership-Adequate (Firm Command)'}
            </span>
          </div>

          <p className="text-zinc-200 leading-relaxed font-sans text-[11px]">
            {calibration?.antiWarmthBiasRationale || audit.calibrationSummary}
          </p>

          {calibration?.biasMitigationApplied && (
            <div className="pt-1.5 border-t border-emerald-500/20 flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-300">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                Anti-Warmth Parity Adjustment:
              </span>
              <span className="bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-300 font-bold">
                +{calibration.jobAdequacyCalibrationOffset} pts Job Adequacy
              </span>
              <span className="text-zinc-400">
                ({calibration.calibrationRatio.toFixed(2)}x Decisive/Diplomatic Ratio)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Leadership Stance Summary */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-xl space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4 text-purple-400" />
          <span>Leadership Stance & Cultural Impact:</span>
        </div>
        <p className="text-zinc-200 leading-relaxed font-sans">
          {audit.leadershipStanceSummary}
        </p>
      </div>

      {/* Zero-Tolerance Dereliction Status Banner */}
      <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
        isDereliction
          ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
          : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
      }`}>
        {isDereliction ? (
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-0.5">
          <span className="font-mono font-bold uppercase tracking-wider text-[11px]">
            {isDereliction ? 'Zero-Tolerance Dereliction Flagged' : 'Zero-Tolerance Audit Passed • Duty Accepted'}
          </span>
          <p className="text-[11px] opacity-90 font-sans leading-normal">
            {isDereliction
              ? 'Candidate exhibited refusal of emergency duty, dismissive detachment, or abrupt refusal to take ownership. Coded as critical failure.'
              : `Candidate accepted operational responsibility for ${roleTitle}. Tone exhibits genuine ownership, disciplined accountability, and psychological reassurance.`}
          </p>
        </div>
      </div>
    </div>
  );
};
