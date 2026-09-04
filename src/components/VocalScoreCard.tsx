import React from 'react';
import { VocalScoringResult } from '../types';
import {
  Mic,
  Volume2,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  Check,
  TrendingUp,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Target,
  FileCheck,
  Search,
  ListChecks,
  Briefcase
} from 'lucide-react';

interface VocalScoreCardProps {
  result: VocalScoringResult;
  questionLabel?: string;
  isEvaluating?: boolean;
  onReEvaluate?: () => void;
}

export const VocalScoreCard: React.FC<VocalScoreCardProps> = ({
  result,
  questionLabel = 'Position Audio Assessment',
  isEvaluating = false,
  onReEvaluate,
}) => {
  const overallScore = Math.round((result.overallVocalScore || 0) * 10) / 10;
  const isPassing = overallScore >= 80 || result.isPassing;
  const isHigh = overallScore >= 90;
  const trueToFact = result.trueToFactAnalysis;

  return (
    <div
      id="vocal-score-card"
      className={`mt-4 p-5 sm:p-6 border transition-all space-y-5 rounded-3xl backdrop-blur-xl shadow-2xl ${
        isPassing
          ? 'bg-zinc-900/95 border-emerald-500/40 text-zinc-100'
          : 'bg-zinc-900/95 border-amber-500/40 text-zinc-100'
      }`}
    >
      {/* Target Position & Active Prompt Badge */}
      {(result.targetPosition || result.positionQuestion) && (
        <div className="bg-black/60 border border-white/10 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-zinc-400">Position Evaluated:</span>
            <span className="text-emerald-300 font-bold">{result.targetPosition || 'Target Position'}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-zinc-400">True-to-Fact Mode:</span>
            <span className="text-cyan-300 font-bold">100% Grounded Telemetry</span>
          </div>
        </div>
      )}

      {/* Top Header & Composite Score */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 border font-bold flex items-center gap-1.5 rounded-full ${
                isPassing
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
              }`}
            >
              {isPassing ? <Check className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-amber-300" />}
              {isPassing ? '80%+ PASSING VOCAL GRADE • TRUE TO FACT CERTIFIED' : 'VOCAL BENCHMARK (80% TARGET)'}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">• {questionLabel}</span>
          </div>

          <h4 className="font-serif italic text-lg sm:text-xl font-bold text-zinc-100 mt-1.5 flex items-center gap-2">
            <Mic className="w-5 h-5 text-emerald-400" />
            <span>{result.exactGrade || `${overallScore}% - True to Fact Vocal Certified`}</span>
          </h4>

          <p className="text-xs font-mono text-emerald-300/80 mt-0.5 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>{result.ladderStatus || 'Vocal Tone & Demeanor Evaluated'}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div
              className={`text-3xl sm:text-4xl font-mono font-bold ${
                isHigh ? 'text-emerald-400' : isPassing ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              {overallScore}%
            </div>
            <div className="text-[10px] font-mono uppercase text-zinc-400">Composite True Score</div>
          </div>

          {onReEvaluate && (
            <button
              type="button"
              onClick={onReEvaluate}
              disabled={isEvaluating}
              className="text-[11px] font-mono uppercase px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 transition-all cursor-pointer flex items-center gap-1.5 rounded-full shadow-md"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEvaluating ? 'Listening...' : 'Re-Score Audio'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4-Pillar Score Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-black/70 p-3.5 border border-zinc-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Pitch Modulation</span>
          <div className="flex items-baseline justify-between">
            <span className="text-emerald-300 text-base font-bold">{result.pitchModulationScore}%</span>
            <span className="text-[9px] text-zinc-500">Frequency Tone</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, result.pitchModulationScore)}%` }}
            />
          </div>
        </div>

        <div className="bg-black/70 p-3.5 border border-zinc-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Emotional Composure</span>
          <div className="flex items-baseline justify-between">
            <span className="text-cyan-300 text-base font-bold">{result.emotionalComposureScore}%</span>
            <span className="text-[9px] text-zinc-500">Decibel Stability</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, result.emotionalComposureScore)}%` }}
            />
          </div>
        </div>

        <div className="bg-black/70 p-3.5 border border-zinc-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Cadence & Pacing</span>
          <div className="flex items-baseline justify-between">
            <span className="text-amber-300 text-base font-bold">{result.cadencePacingScore}%</span>
            <span className="text-[9px] text-zinc-500">{result.acousticMetrics?.speechPacingWpm || 130} WPM</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, result.cadencePacingScore)}%` }}
            />
          </div>
        </div>

        <div className="bg-black/70 p-3.5 border border-zinc-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Spoken Substance</span>
          <div className="flex items-baseline justify-between">
            <span className="text-purple-300 text-base font-bold">{result.verbalSubstanceScore}%</span>
            <span className="text-[9px] text-zinc-500">True to Fact</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-purple-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, result.verbalSubstanceScore)}%` }}
            />
          </div>
        </div>
      </div>

      {/* TRUE TO FACT AUDIT PANEL */}
      {trueToFact && (
        <div className="bg-black/90 border-2 border-emerald-500/40 p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <h5 className="font-mono text-sm font-bold text-emerald-300 uppercase tracking-wider">
                True to Fact Substance & Evidence Audit
              </h5>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                {trueToFact.truthfulnessRating || 'Factually Grounded'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                {trueToFact.roleAlignmentScore}% Role Alignment
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 font-sans leading-relaxed">
            {trueToFact.evidenceAssessment}
          </p>

          {/* Calculated Strengths with Direct Evidence */}
          {trueToFact.calculatedStrengths && trueToFact.calculatedStrengths.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Calculated Strengths (Fact & Telemetry Verified):</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {trueToFact.calculatedStrengths.map((st, sIdx) => (
                  <div key={sIdx} className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl space-y-1">
                    <div className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{st.strength}</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 font-sans leading-normal pl-3">
                      <strong className="text-emerald-300/90 font-mono text-[10px] uppercase">Evidence:</strong> "{st.evidence}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pinpointed Areas Needing Improvement */}
          {trueToFact.pinpointedImprovements && trueToFact.pinpointedImprovements.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Pinpointed Areas Needing Improvement:</span>
              </div>
              <div className="space-y-2">
                {trueToFact.pinpointedImprovements.map((imp, iIdx) => (
                  <div key={iIdx} className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between text-amber-300 font-mono font-bold">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{imp.area}</span>
                      </span>
                      <span className="text-[10px] text-amber-400/80 uppercase">Target Area #{iIdx + 1}</span>
                    </div>
                    <p className="text-zinc-300 text-[11px] font-sans">
                      <strong className="text-zinc-400 font-mono text-[10px] uppercase">Observation:</strong> {imp.observation}
                    </p>
                    <p className="text-amber-200/90 text-[11px] font-sans">
                      <strong className="text-amber-300 font-mono text-[10px] uppercase">Actionable Fix:</strong> {imp.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Acoustic Telemetry Visualizer Bar */}
      {result.acousticMetrics && (
        <div className="bg-black/80 border border-zinc-800/80 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300 border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" /> Acoustic & Auditory Telemetry:
            </span>
            <span className="text-zinc-400 text-[10px]">
              Inflection: <strong className="text-white">{result.acousticMetrics.inflectionWarmthRating}</strong>
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Pitch Stability</span>
              <span className="text-zinc-200 font-semibold">{result.acousticMetrics.pitchStabilityPercent}%</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Decibel Range</span>
              <span className="text-zinc-200 font-semibold">{result.acousticMetrics.decibelSteadiness}</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Speech Rate</span>
              <span className="text-zinc-200 font-semibold">{result.acousticMetrics.speechPacingWpm} Words/Min</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Hesitation Ratio</span>
              <span className="text-zinc-200 font-semibold">{result.acousticMetrics.silenceHesitationRatioPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Spoken Audio Summary */}
      {result.spokenAudioSummary && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-2xl space-y-1 text-left">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>AI Auditory Perception (Direct Voice Recording Analysis):</span>
          </div>
          <p className="text-xs text-zinc-200 font-sans leading-relaxed italic">
            "{result.spokenAudioSummary}"
          </p>
        </div>
      )}

      {/* Vocal Tone Critique vs Spoken Response Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vocal Tone Critique */}
        <div className="bg-black/60 p-4 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Vocal Tone & Inflection Critique:</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {result.vocalToneFeedback}
          </p>
        </div>

        {/* Spoken Response Critique */}
        <div className="bg-black/60 p-4 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Spoken Verbal Strategy & Response:</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {result.verbalResponseFeedback}
          </p>
        </div>
      </div>

      {/* Key Strengths fallback if trueToFact not present */}
      {(!trueToFact || !trueToFact.calculatedStrengths) && result.keyStrengths && result.keyStrengths.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider block">
            Acoustic & Verbal Strengths:
          </span>
          <div className="flex flex-wrap gap-2">
            {result.keyStrengths.map((str, idx) => (
              <span
                key={idx}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 px-3 py-1 text-xs font-sans rounded-xl flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{str}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* How to Reach 100% & Exemplar Delivery */}
      <div className="bg-gradient-to-br from-amber-500/10 via-zinc-950 to-emerald-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <h6 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
            What to Refine to Reach 100% Vocal Perfection:
          </h6>
        </div>
        <p className="text-xs text-zinc-200 font-sans leading-relaxed">
          {result.whatNeedsImprovementToReach100}
        </p>

        {result.whatShouldHaveBeenDoneInstead && (
          <div className="bg-black/80 border border-amber-500/20 p-3 rounded-xl space-y-1">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
              Model True-to-Fact Exemplar Delivery:
            </span>
            <p className="text-xs text-zinc-200 italic font-sans">
              "{result.whatShouldHaveBeenDoneInstead}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
