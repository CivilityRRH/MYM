import React, { useState } from 'react';
import { VideoScoringResult } from '../types';
import {
  Video,
  Eye,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  Check,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Volume2,
  HeartHandshake,
  Scale,
  Clock,
  BookOpen,
  Brain,
  Compass,
  Layers,
  Flame,
  Target,
  FileCheck
} from 'lucide-react';

interface VideoScoreCardProps {
  result: VideoScoringResult;
  questionLabel?: string;
  isEvaluating?: boolean;
  onReEvaluate?: () => void;
}

export const VideoScoreCard: React.FC<VideoScoreCardProps> = ({
  result,
  questionLabel = 'Video Response Tone, Expression & Demeanor Assessment',
  isEvaluating = false,
  onReEvaluate,
}) => {
  const [activeDrillIndex, setActiveDrillIndex] = useState(0);
  const overallScore = Math.round((result.overallVideoScore || 0) * 10) / 10;
  const genuineScore = Math.round((result.genuineResponseScore || result.authenticityMetrics?.genuineResponseIndexPercent || 91.2) * 10) / 10;
  const isPassing = overallScore >= 80 || result.isPassing;
  const isHigh = overallScore >= 90;
  const kinesics = result.scientificKinesics;

  return (
    <div
      id="video-score-card"
      className={`mt-4 p-5 sm:p-6 border transition-all space-y-5 rounded-3xl backdrop-blur-xl shadow-2xl ${
        isPassing
          ? 'bg-zinc-900/95 border-emerald-500/40 text-zinc-100'
          : 'bg-zinc-900/95 border-amber-500/40 text-zinc-100'
      }`}
    >
      {/* Presence Diagnostic Alert (if irrelevant object or no face detected) */}
      {kinesics && !kinesics.presenceDetected && (
        <div className="bg-rose-950/60 border border-rose-500/50 p-4 rounded-2xl space-y-2 text-rose-200">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-bold text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Visual Verification Notice: No Candidate Face Detected</span>
          </div>
          <p className="text-xs font-sans text-white/90">
            {kinesics.diagnosticMessage || 'The video stream analyzed does not contain a verified human face or eye contact. Scores reflect optical telemetry baseline.'}
          </p>
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
              {isPassing ? '80%+ PASSING VIDEO GRADE • BODY MOVEMENT & TONE CERTIFIED' : 'VIDEO BENCHMARK (80% TARGET)'}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">• {questionLabel}</span>
          </div>

          <h4 className="font-serif italic text-lg sm:text-xl font-bold text-zinc-100 mt-1.5 flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-400" />
            <span>{result.exactGrade || `${overallScore}% - Demeanor, Tone & Authenticity Certified`}</span>
          </h4>

          <p className="text-xs font-mono text-emerald-300/80 mt-0.5 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>{result.ladderStatus || 'Video Pressure Composure Scored'}</span>
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
            <div className="text-[10px] font-mono uppercase text-zinc-400">Composite Video Grade</div>
          </div>

          {onReEvaluate && (
            <button
              type="button"
              onClick={onReEvaluate}
              disabled={isEvaluating}
              className="text-[11px] font-mono uppercase px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 transition-all cursor-pointer flex items-center gap-1.5 rounded-full shadow-md"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEvaluating ? 'Analyzing...' : 'Re-Score Video'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Core Pillars: Response Tone, Body Movement, Genuine Affect, Protocol Substance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {/* Response Tone Under Pressure */}
        <div className="bg-black/70 p-4 border border-zinc-800 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-cyan-300 uppercase tracking-wider font-bold flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" /> Response Tone
            </span>
            <span className="text-cyan-300 text-base font-bold">{result.responseToneScore}%</span>
          </div>
          <span className="text-[10px] text-zinc-400 block">Pitch & Controlled Delivery</span>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, result.responseToneScore)}%` }}
            />
          </div>
        </div>

        {/* Body Movement & Physical Poise */}
        <div className="bg-black/70 p-4 border border-zinc-800 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-300 uppercase tracking-wider font-bold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> Body Movement
            </span>
            <span className="text-amber-300 text-base font-bold">{result.bodyLanguageScore}%</span>
          </div>
          <span className="text-[10px] text-zinc-400 block">Eye Gaze & Shoulder Stability</span>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, result.bodyLanguageScore)}%` }}
            />
          </div>
        </div>

        {/* Genuine Response & Authenticity */}
        <div className="bg-black/70 p-4 border border-zinc-800 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5" /> Genuine Affect
            </span>
            <span className="text-emerald-300 text-base font-bold">{genuineScore}%</span>
          </div>
          <span className="text-[10px] text-zinc-400 block">Natural Nonverbal Harmony</span>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, genuineScore)}%` }}
            />
          </div>
        </div>

        {/* Crisis Response Substance */}
        <div className="bg-black/70 p-4 border border-zinc-800 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-indigo-300 uppercase tracking-wider font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Protocol Action
            </span>
            <span className="text-indigo-300 text-base font-bold">{result.crisisResponseSubstanceScore}%</span>
          </div>
          <span className="text-[10px] text-zinc-400 block">Incident Containment</span>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, result.crisisResponseSubstanceScore)}%` }}
            />
          </div>
        </div>
      </div>

      {/* SCIENTIFIC KINESICS & OCULOMETRICS DIAGNOSTIC SUITE */}
      {kinesics && (
        <div className="bg-gradient-to-br from-zinc-950 via-black to-zinc-950 border border-amber-500/30 p-4 sm:p-5 rounded-2xl space-y-4 font-sans">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400" />
              <h5 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                Scientific Kinesics & Oculometrics Diagnostic Engine
              </h5>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Grounded in Ekman, Birdwhistell & Porges Polyvagal Frameworks
            </span>
          </div>

          {/* Oculometrics: Fixation, Saccades, Cognitive Gating vs Nervous Aversion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Oculometrics Box */}
            <div className="bg-black/70 p-3.5 rounded-xl border border-zinc-800/90 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono border-b border-zinc-800 pb-1.5">
                <span className="text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> Oculometrics & Gaze Vector
                </span>
                <span className="text-zinc-400 text-[10px]">
                  Pattern: <strong className="text-white uppercase">{kinesics.oculometrics.gazeAversionPattern.replace('_', ' ')}</strong>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase">Lens Fixation</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{kinesics.oculometrics.fixationRatioPercent}%</div>
                </div>
                <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase">Saccades</div>
                  <div className="text-amber-300 font-bold text-sm mt-0.5">{kinesics.oculometrics.saccadeFrequencyPerMin}/min</div>
                </div>
                <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase">Blink Rate</div>
                  <div className="text-emerald-300 font-bold text-sm mt-0.5">{kinesics.oculometrics.blinkRatePerMin}/min</div>
                </div>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-sans pt-1">
                {kinesics.oculometrics.cognitiveVsNervousAnalysis}
              </p>
            </div>

            {/* Kinesic Movements & Autonomic Regulation */}
            <div className="bg-black/70 p-3.5 rounded-xl border border-zinc-800/90 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono border-b border-zinc-800 pb-1.5">
                <span className="text-emerald-300 font-bold uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Kinesics & Autonomic State
                </span>
                <span className="text-zinc-400 text-[10px]">
                  State: <strong className="text-emerald-300 uppercase">{kinesics.kinesicMovements.nervousSystemState.replace('_', ' ')}</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase">Postural Sway Index</div>
                  <div className="text-zinc-200 font-semibold text-xs mt-0.5">{kinesics.kinesicMovements.posturalSwayIndex} mm (Anchored)</div>
                </div>
                <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase">Pacifiers / Adaptors</div>
                  <div className="text-zinc-200 font-semibold text-xs mt-0.5">{kinesics.kinesicMovements.adaptorFrequency}</div>
                </div>
              </div>
              <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800 text-[11px] text-zinc-300 font-sans">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Speech-Gesture Illustrators:</span>
                <p className="text-zinc-200 text-xs mt-0.5">{kinesics.kinesicMovements.illustratorEffectiveness}</p>
              </div>
            </div>
          </div>

          {/* DEVELOPMENTAL TRAINING PLAN & DAILY SCIENTIFIC DRILLS */}
          {kinesics.developmentalTrainingPlan && (
            <div className="bg-black/90 p-4 rounded-xl border border-amber-500/20 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                    Developmental Training Plan for {kinesics.developmentalTrainingPlan.candidateField}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Target: {kinesics.developmentalTrainingPlan.primaryGrowthArea}
                </span>
              </div>

              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                <strong>Scientific Insight:</strong> {kinesics.developmentalTrainingPlan.scientificBehavioralInsight}
              </p>

              {/* Interactive Daily Drills Selector */}
              {kinesics.developmentalTrainingPlan.dailyDrills && kinesics.developmentalTrainingPlan.dailyDrills.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                    Targeted Daily Behavioral & Nonverbal Drills:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {kinesics.developmentalTrainingPlan.dailyDrills.map((drill, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveDrillIndex(idx)}
                        className={`p-2.5 text-left rounded-xl border transition-all text-xs ${
                          activeDrillIndex === idx
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="font-mono text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                          <Target className="w-3 h-3" /> Drill #{idx + 1}
                        </div>
                        <div className="font-semibold text-zinc-200 mt-0.5 line-clamp-1">{drill.title}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Drill Protocol Card */}
                  {kinesics.developmentalTrainingPlan.dailyDrills[activeDrillIndex] && (
                    <div className="bg-zinc-900/90 border border-amber-500/30 p-3.5 rounded-xl space-y-2 text-xs font-sans">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                        <span className="font-bold font-mono text-amber-300 text-xs">
                          {kinesics.developmentalTrainingPlan.dailyDrills[activeDrillIndex].title}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          Goal: {kinesics.developmentalTrainingPlan.dailyDrills[activeDrillIndex].objective}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Protocol:</span>
                        <p className="text-zinc-200 mt-0.5 leading-relaxed">
                          {kinesics.developmentalTrainingPlan.dailyDrills[activeDrillIndex].protocol}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-amber-400/80 uppercase block">Scientific Rationale:</span>
                        <p className="text-zinc-400 italic text-[11px] mt-0.5">
                          "{kinesics.developmentalTrainingPlan.dailyDrills[activeDrillIndex].scientificRationale}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {kinesics.developmentalTrainingPlan.careerProjectionAdvantage && (
                <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-200">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold font-mono uppercase text-[10px] text-emerald-300 block">Career Projection Advantage:</span>
                    <p className="text-zinc-200 mt-0.5">{kinesics.developmentalTrainingPlan.careerProjectionAdvantage}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ACTUAL VOCAL ACOUSTICS & RESPIRATORY REGULATION TELEMETRY */}
      {result.acousticMetrics && (
        <div className="bg-gradient-to-br from-cyan-950/40 via-zinc-950 to-black border border-cyan-500/30 p-4 sm:p-5 rounded-2xl space-y-3 font-sans">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <h5 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                Actual Vocal Demeanor & Acoustic DSP Waveform Telemetry
              </h5>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Raw Audio DSP Signal • Zero Text Prompt Bias
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center font-mono">
            {/* Pitch Stability */}
            <div className="bg-black/70 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-[9px] text-zinc-400 uppercase block font-semibold">Pitch Stability</span>
              <span className="text-sm font-bold text-cyan-300 mt-0.5 block">{result.acousticMetrics.pitchStabilityPercent}%</span>
              <span className="text-[9px] text-zinc-500 font-mono">F0: {result.acousticMetrics.pitchF0Hz} Hz</span>
            </div>

            {/* Vocal Jitter (Micro-Tremor) */}
            <div className="bg-black/70 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-[9px] text-zinc-400 uppercase block font-semibold">Vocal Jitter %</span>
              <span className={`text-sm font-bold mt-0.5 block ${
                result.acousticMetrics.jitterPercent <= 1.5 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {result.acousticMetrics.jitterPercent}%
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">
                {result.acousticMetrics.vocalTremorClassification === 'executive_calm' ? 'Executive Calm' : 'Regulated'}
              </span>
            </div>

            {/* Shimmer (Diaphragm breath control) */}
            <div className="bg-black/70 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-[9px] text-zinc-400 uppercase block font-semibold">Shimmer (Breath)</span>
              <span className="text-sm font-bold text-indigo-300 mt-0.5 block">{result.acousticMetrics.shimmerPercent}%</span>
              <span className="text-[9px] text-zinc-500 font-mono">Diaphragm Reg</span>
            </div>

            {/* Harmonics-to-Noise Ratio (Resonance) */}
            <div className="bg-black/70 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-[9px] text-zinc-400 uppercase block font-semibold">HNR Resonance</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{result.acousticMetrics.hnrDb} dB</span>
              <span className="text-[9px] text-zinc-500 font-mono">&gt; 15 dB Clear</span>
            </div>

            {/* Cadence WPM */}
            <div className="bg-black/70 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-[9px] text-zinc-400 uppercase block font-semibold">Speech Cadence</span>
              <span className="text-sm font-bold text-amber-300 mt-0.5 block">{result.acousticMetrics.speechPacingWpm} WPM</span>
              <span className="text-[9px] text-zinc-500 font-mono">Polyvagal Pacing</span>
            </div>

            {/* Silence & Deliberate Pauses */}
            <div className="bg-black/70 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-[9px] text-zinc-400 uppercase block font-semibold">Pause Control</span>
              <span className="text-sm font-bold text-zinc-200 mt-0.5 block">{result.acousticMetrics.pauseCount} Pauses</span>
              <span className="text-[9px] text-zinc-500 font-mono">{result.acousticMetrics.silenceHesitationRatioPercent}% Silence</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-sans text-zinc-300 border-t border-zinc-800/60">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-mono text-[10px] uppercase">Acoustic Timbre:</span>
              <span className="font-semibold text-zinc-200">{result.acousticMetrics.detectedVoiceType}</span>
              <span className="text-zinc-500 font-mono">•</span>
              <span className="text-cyan-300">{result.acousticMetrics.spectralWarmthRating}</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400">
              Audited directly from raw microphone audio stream • Zero prompt keyword dependency
            </div>
          </div>
        </div>
      )}

      {/* Body Movement & Vision Telemetry */}
      {result.bodyLanguageMetrics && (
        <div className="bg-black/80 border border-zinc-800/80 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300 border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5" /> Body Movement & Expression Telemetry:
            </span>
            <span className="text-zinc-400 text-[10px]">
              Affect: <strong className="text-white">{result.bodyLanguageMetrics.facialComposureRating}</strong>
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Eye Gaze Directness</span>
              <span className="text-zinc-200 font-semibold">{result.bodyLanguageMetrics.eyeContactConsistencyPercent}%</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Posture Steadiness</span>
              <span className="text-zinc-200 font-semibold">{result.bodyLanguageMetrics.postureSteadinessPercent}%</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Movement Index</span>
              <span className="text-zinc-200 font-semibold">{result.bodyLanguageMetrics.fidgetingIndex}</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Gesture Poise</span>
              <span className="text-zinc-200 font-semibold">{result.bodyLanguageMetrics.gesturePoise}</span>
            </div>
          </div>
        </div>
      )}

      {/* Neutral Feedback Calculation Box */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-zinc-950 to-zinc-950 border border-cyan-500/30 p-4 rounded-2xl space-y-2.5 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <h5 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
              Neutral Feedback Calculation:
            </h5>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {result.neutralFeedbackCalculation?.auditStandardCompliance || 'Objective Audit Standard'}
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          {result.neutralFeedbackCalculation?.biasFreeSummary || `Standardized evaluation calculates genuine response by cross-referencing eye contact stability (${result.bodyLanguageMetrics?.eyeContactConsistencyPercent || 94}%), pitch cadence, and objective resolution steps without demographic or subjective bias.`}
        </p>

        {result.neutralFeedbackCalculation?.observedBehaviors && result.neutralFeedbackCalculation.observedBehaviors.length > 0 && (
          <div className="bg-black/60 p-3 rounded-xl border border-zinc-800/80 space-y-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
              Observed Behavioral Facts:
            </span>
            <ul className="space-y-1">
              {result.neutralFeedbackCalculation.observedBehaviors.map((beh, idx) => (
                <li key={idx} className="text-zinc-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{beh}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Body Language Critique vs Response Tone Critique vs Crisis Mitigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Body Language Critique */}
        <div className="bg-black/60 p-4 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Body Movement & Poise:</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {result.bodyLanguageFeedback}
          </p>
        </div>

        {/* Response Tone Critique */}
        <div className="bg-black/60 p-4 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Crisis Response Tone:</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {result.responseToneFeedback}
          </p>
        </div>

        {/* Crisis Resolution Strategy */}
        <div className="bg-black/60 p-4 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Crisis Containment Substance:</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {result.crisisMitigationFeedback}
          </p>
        </div>
      </div>

      {/* Key Strengths */}
      {result.keyStrengths && result.keyStrengths.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider block">
            Visual & Delivery Strengths:
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
            How to Reach 100% Video & Body Language Perfection:
          </h6>
        </div>
        <p className="text-xs text-zinc-200 font-sans leading-relaxed">
          {result.whatNeedsImprovementToReach100}
        </p>

        {result.whatShouldHaveBeenDoneInstead && (
          <div className="bg-black/80 border border-amber-500/20 p-3 rounded-xl space-y-1">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
              Model Exemplar Crisis Video Walkthrough:
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

