import React from 'react';
import { VocalScoringResult } from '../types';
import { AuthoritativeDecisivenessCard } from './AuthoritativeDecisivenessCard';
import { ToneDecisivenessCalibrationCard } from './ToneDecisivenessCalibrationCard';
import { CueContributionMapCard } from './CueContributionMapCard';
import { MicroFlawPrecisionCard } from './MicroFlawPrecisionCard';
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
  ShieldAlert,
  Target,
  FileCheck,
  Search,
  ListChecks,
  Briefcase,
  Scale,
  Brain,
  HeartHandshake
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

  const adequacy = result.jobAdequacyAudit;
  const positiveLight = result.positiveLightAudit;
  const doingRight = result.doingItTheRightWayAudit;
  const genuineness = result.genuinenessDiagnostic;
  const isDereliction = adequacy?.verdict?.toLowerCase().includes('dereliction') ||
    genuineness?.classification === 'callous_apathy' ||
    result.exactGrade?.toLowerCase().includes('dereliction');

  return (
    <div
      id="vocal-score-card"
      className={`mt-4 p-5 sm:p-6 border transition-all space-y-5 rounded-3xl backdrop-blur-xl shadow-2xl ${
        isDereliction
          ? 'bg-zinc-950 border-rose-500/60 text-zinc-100'
          : isPassing
          ? 'bg-zinc-900/95 border-emerald-500/40 text-zinc-100'
          : 'bg-zinc-900/95 border-amber-500/40 text-zinc-100'
      }`}
    >
      {/* Zero-Tolerance Dereliction Alert Banner */}
      {isDereliction && (
        <div className="bg-rose-950/90 border-2 border-rose-500 p-4 sm:p-5 rounded-2xl space-y-2.5 text-rose-100 shadow-2xl">
          <div className="flex items-center gap-2.5 font-mono text-sm uppercase tracking-wider font-bold text-rose-300">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
            <span>Critical Audit Verdict: Dereliction of Duty & Callous Dismissal</span>
          </div>
          <p className="text-xs font-sans text-rose-100/90 leading-relaxed">
            <strong>Incident Command Integrity Rule:</strong> Refusal of responsibility, dismissiveness, or hanging up during an emergency report triggers an immediate critical failure. Regardless of steady vocal decibels or absence of vocal trembling, deflecting duty is disqualifying.
          </p>
          {adequacy?.taskExecutionAnalysis && (
            <div className="bg-black/60 border border-rose-500/40 p-3 rounded-xl text-xs font-mono text-rose-200">
              <span className="text-rose-400 font-bold uppercase block text-[10px] mb-1">Audit Finding:</span>
              {adequacy.taskExecutionAnalysis}
            </div>
          )}
        </div>
      )}

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

      {/* EXECUTIVE TRUTH-TESTING PILLARS & GENUINENESS DIAGNOSTICS */}
      {(adequacy || positiveLight || doingRight || genuineness) && (
        <div className="bg-gradient-to-br from-zinc-950 via-black to-zinc-950 border border-purple-500/40 p-4 sm:p-6 rounded-2xl space-y-5 shadow-2xl font-sans">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              <div>
                <h5 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-purple-300 font-bold">
                  Truth-Testing Audit & Behavioral Diagnostics
                </h5>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Reality-Check Pillars • Genuine Motivation vs Rehearsed Tone vs Callous Apathy
                </span>
              </div>
            </div>
            {genuineness && (
              <span
                className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                  genuineness.classification === 'genuine_masterclass'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                    : genuineness.classification === 'nervous_sincerity'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : genuineness.classification === 'calculated_acting'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                }`}
              >
                {genuineness.classificationLabel || genuineness.classification.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          {/* 3 Core Truth Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Pillar 1: Job Adequacy */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              adequacy?.score && adequacy.score < 60
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : adequacy?.score && adequacy.score >= 80
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
            }`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-purple-400" /> 1. Job Adequacy
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {adequacy?.score !== undefined ? `${adequacy.score}%` : 'N/A'}
                </span>
              </div>
              <div className="text-xs font-semibold text-white">
                {adequacy?.verdict || 'Standard Job Execution'}
              </div>
              <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                {adequacy?.taskExecutionAnalysis || 'Evaluated against operational role requirements.'}
              </p>
            </div>

            {/* Pillar 2: Positive Light */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              positiveLight?.score && positiveLight.score < 60
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : positiveLight?.score && positiveLight.score >= 80
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
            }`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-cyan-400" /> 2. Positive Light
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {positiveLight?.score !== undefined ? `${positiveLight.score}%` : 'N/A'}
                </span>
              </div>
              <div className="text-xs font-semibold text-white">
                {positiveLight?.verdict || 'Constructive Demeanor'}
              </div>
              <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                {positiveLight?.culturalImpactAnalysis || 'Assessed candidate demeanor, empathy, and psychological safety under pressure.'}
              </p>
            </div>

            {/* Pillar 3: Doing It The Right Way */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              doingRight?.score && doingRight.score < 60
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : doingRight?.score && doingRight.score >= 80
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
            }`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 3. Doing It The Right Way
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {doingRight?.score !== undefined ? `${doingRight.score}%` : 'N/A'}
                </span>
              </div>
              <div className="text-xs font-semibold text-white">
                {doingRight?.verdict || 'Methodical Standard'}
              </div>
              <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                {doingRight?.proceduralCorrectnessAnalysis || 'Audit of step-by-step containment rigor and procedural compliance.'}
              </p>
            </div>
          </div>

          {/* Genuineness Diagnostic Matrix (Tone Steadiness vs Real Care vs Apathy) */}
          {genuineness && (
            <div className="bg-black/80 border border-purple-500/30 p-4 rounded-xl space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono font-bold text-purple-300 uppercase flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  Genuineness & Acoustic Motivation Diagnostic
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Calculated Genuineness: <strong className="text-white">{genuineness.score}%</strong>
                </span>
              </div>

              {/* Acoustic & Vocal Correlation Explanation */}
              <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-xl space-y-1.5 text-xs">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                  Acoustic Cadence & Vocal Decibel Correlation:
                </span>
                <p className="text-zinc-200 leading-relaxed font-sans">
                  {genuineness.acousticVocalCorrelation}
                </p>
              </div>

              {/* Developmental Guidance */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl space-y-1 text-xs">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                  Developmental Coaching & Candidate Potential Plan:
                </span>
                <p className="text-zinc-200 leading-relaxed font-sans">
                  {genuineness.trainingGuidance}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BREAKTHROUGH MICRO-FLAW PRECISION & CIVILITY AUDIT */}
      {(result.microFlawPrecisionDiagnostic || result.toxicHostilityAudit) && (
        <MicroFlawPrecisionCard
          diagnostic={result.microFlawPrecisionDiagnostic}
          toxicAudit={result.toxicHostilityAudit}
          title="Vocal Scenario Micro-Flaw Precision Diagnostic"
        />
      )}

      {/* AUTHORITATIVE DECISIVENESS & COMMAND AUDIT */}
      {result.authoritativeDecisivenessAudit && (
        <AuthoritativeDecisivenessCard
          audit={result.authoritativeDecisivenessAudit}
          calibration={result.toneDecisivenessCalibration}
          roleTitle={result.targetPosition || 'Vocal Auditory Standard'}
        />
      )}

      {/* TONE & DECISIVENESS CALIBRATION BENCHMARK */}
      {result.toneDecisivenessCalibration && (
        <ToneDecisivenessCalibrationCard
          calibration={result.toneDecisivenessCalibration}
          roleTitle={result.targetPosition || 'Vocal Auditory Standard'}
        />
      )}

      {/* CUE CONTRIBUTION MAP */}
      {result.cueContributionMap && result.cueContributionMap.length > 0 && (
        <CueContributionMapCard
          cueMap={result.cueContributionMap}
          title="Vocal Acoustic Cue Contribution Matrix"
          jobAdequacyScore={result.jobAdequacyAudit?.score}
          culturalFitScore={result.positiveLightAudit?.score}
          proceduralRigorScore={result.doingItTheRightWayAudit?.score}
        />
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
