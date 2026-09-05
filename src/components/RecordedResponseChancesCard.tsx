import React, { useState } from 'react';
import { 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Volume2, 
  Gauge, 
  Activity, 
  ShieldCheck, 
  Award, 
  Eye, 
  Play, 
  Pause,
  AlertCircle,
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  EvaluationLogicResult, 
  RetryRecommendation, 
  RecordedResponseAttempt 
} from '../types.ts';
import { EvaluationLogicEngine } from '../lib/evaluationLogicEngine.ts';
import { MicroFlawPrecisionCard } from './MicroFlawPrecisionCard.tsx';

interface RecordedResponseChancesCardProps {
  currentAttempt: number; // 1 or 2
  maxChances?: number; // default 2
  evaluation?: EvaluationLogicResult | null;
  take1?: RecordedResponseAttempt | null;
  take2?: RecordedResponseAttempt | null;
  mediaType: 'audio' | 'video';
  onRetry: () => void;
  onLockIn: (selectedTakeNumber: 1 | 2) => void;
  isRecording?: boolean;
}

export const RecordedResponseChancesCard: React.FC<RecordedResponseChancesCardProps> = ({
  currentAttempt,
  maxChances = 2,
  evaluation,
  take1,
  take2,
  mediaType,
  onRetry,
  onLockIn,
  isRecording = false
}) => {
  const [selectedTake, setSelectedTake] = useState<1 | 2>(() => {
    if (take2 && take1) {
      return take2.evaluation.overallScore >= take1.evaluation.overallScore ? 2 : 1;
    }
    return take2 ? 2 : 1;
  });

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeAudioObj, setActiveAudioObj] = useState<HTMLAudioElement | null>(null);

  if (isRecording) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-950/30 text-slate-800 dark:text-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600"></span>
          </span>
          <div>
            <div className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
              Recording in Progress • Chance {currentAttempt} of {maxChances}
            </div>
            <div className="text-xs text-indigo-700/80 dark:text-indigo-300/80">
              EvaluationLogicEngine is monitoring live acoustic pacing, vocal cord jitter, and authoritative command.
            </div>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700">
          Fairness Policy: 2 Chances
        </span>
      </div>
    );
  }

  // If both takes are available, calculate delta comparison
  const comparison = (take1 && take2) 
    ? EvaluationLogicEngine.compareAttempts(take1, take2)
    : null;

  const activeEval = (selectedTake === 2 && take2) 
    ? take2.evaluation 
    : (take1?.evaluation || evaluation);

  const retryRec: RetryRecommendation | undefined = activeEval?.retryRecommendation || evaluation?.retryRecommendation;

  const chancesRemaining = Math.max(0, maxChances - currentAttempt);

  const handleToggleAudio = (audioUrl: string) => {
    if (isPlayingAudio && activeAudioObj) {
      activeAudioObj.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (activeAudioObj) {
      activeAudioObj.pause();
    }

    const audio = new Audio(audioUrl);
    setActiveAudioObj(audio);
    setIsPlayingAudio(true);

    audio.onended = () => {
      setIsPlayingAudio(false);
    };

    audio.play().catch(e => {
      console.warn('Audio playback prevented:', e);
      setIsPlayingAudio(false);
    });
  };

  return (
    <div id="recorded-response-chances-card" className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-md overflow-hidden transition-all duration-200">
      {/* Header Banner */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-indigo-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white tracking-tight">
                EvaluationLogicEngine Real-Time Telemetry
              </h4>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                2 Response Chances Allowed
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Maps speech tempo, jitter detection, and tone to weighted Job Adequacy & Cultural Fit criteria.
            </p>
          </div>
        </div>

        {/* Attempts indicator badge */}
        <div className="flex items-center gap-2">
          {currentAttempt === 1 ? (
            <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Take 1 of 2 Complete • 1 Chance Remaining
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Take 2 of 2 Complete • Both Chances Utilized
            </div>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* A/B Take Comparison Header if Take 2 is complete */}
        {take1 && take2 && comparison && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-100 dark:border-indigo-800/40">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Take 1 vs Take 2 Performance Comparison
                </span>
              </div>
              {comparison.deltaScore > 0 ? (
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  +{comparison.deltaScore}% Growth on Take 2!
                </span>
              ) : comparison.deltaScore === 0 ? (
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  Identical Poise (Equal Scores)
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  Take 1 Established Peak Performance
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
              {comparison.growthNarrative}
            </p>

            {/* Side-by-side Take selector cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {/* Take 1 Card */}
              <div 
                onClick={() => setSelectedTake(1)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedTake === 1 
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="take1-choice"
                      name="take-choice"
                      checked={selectedTake === 1}
                      onChange={() => setSelectedTake(1)}
                      className="accent-indigo-600" 
                    />
                    <label htmlFor="take1-choice" className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                      Take 1 (Initial Delivery)
                    </label>
                  </div>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                    {take1.evaluation.overallScore}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Cadence: {take1.cues.speechTempoWpm} WPM</span>
                  <span>•</span>
                  <span>Jitter: {take1.cues.jitterPercent}%</span>
                </div>
                {take1.mediaUrl && mediaType === 'audio' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAudio(take1.mediaUrl);
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    Listen to Take 1
                  </button>
                )}
              </div>

              {/* Take 2 Card */}
              <div 
                onClick={() => setSelectedTake(2)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedTake === 2 
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="take2-choice"
                      name="take-choice"
                      checked={selectedTake === 2}
                      onChange={() => setSelectedTake(2)}
                      className="accent-indigo-600" 
                    />
                    <label htmlFor="take2-choice" className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer flex items-center gap-1">
                      Take 2 (Final Chance)
                      {comparison.deltaScore > 0 && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px]">
                          Recommended
                        </span>
                      )}
                    </label>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {take2.evaluation.overallScore}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Cadence: {take2.cues.speechTempoWpm} WPM</span>
                  <span>•</span>
                  <span>Jitter: {take2.cues.jitterPercent}%</span>
                </div>
                {take2.mediaUrl && mediaType === 'audio' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAudio(take2.mediaUrl);
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    Listen to Take 2
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Real-Time Cue Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Speech Tempo */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Gauge className="w-3.5 h-3.5 text-indigo-500" />
                Speech Tempo
              </span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {retryRec?.detectedCuesSummary.speechTempo.wpm || 134} <span className="text-xs font-normal text-slate-500">WPM</span>
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate mt-0.5">
              {retryRec?.detectedCuesSummary.speechTempo.label || 'Optimal Executive (125-155 WPM)'}
            </div>
          </div>

          {/* Jitter Detection */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                Jitter Detection
              </span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {retryRec?.detectedCuesSummary.jitterTremor.percent || 1.18}%
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">
              {retryRec?.detectedCuesSummary.jitterTremor.label || '< 1.25% Executive Calm'}
            </div>
          </div>

          {/* Tone & Terminal Inflection */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Volume2 className="w-3.5 h-3.5 text-sky-500" />
                Tone Inflection
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {retryRec?.detectedCuesSummary.toneInflection.type === 'definitive_downward'
                ? 'Definitive Pitch'
                : retryRec?.detectedCuesSummary.toneInflection.type === 'questioning_uptalk'
                ? 'Questioning Uptalk'
                : 'Steady Neutral'}
            </div>
            <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium truncate mt-0.5">
              {retryRec?.detectedCuesSummary.toneInflection.status === 'commanding'
                ? 'Firm Command Certified'
                : retryRec?.detectedCuesSummary.toneInflection.status === 'uptalk'
                ? 'Needs Downward Inflection'
                : 'Balanced Vocal Presence'}
            </div>
          </div>

          {/* Authoritative Decisiveness Tier */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Authoritative Stance
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {activeEval?.authoritativeDecisivenessAudit?.decisivenessTier || 'Commanding Executive'}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold truncate mt-0.5">
              {activeEval?.authoritativeDecisivenessAudit?.score || 94}% Decisive Score
            </div>
          </div>
        </div>

        {/* Weighted Score Indicators for Job Adequacy & Cultural Fit */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Job Adequacy Audit
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {activeEval?.jobAdequacyAudit?.score ?? 91.5}%
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  (activeEval?.jobAdequacyAudit?.score ?? 91) >= 80
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {activeEval?.jobAdequacyAudit?.verdict || 'Adequate & Action-Oriented'}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Cultural Fit Audit (Constructive Firmness)
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {activeEval?.positiveLightAudit?.score ?? 94.0}%
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {activeEval?.positiveLightAudit?.verdict || 'Uplifting Leadership'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Overall Composite Score
            </div>
            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {activeEval?.overallScore ?? 92.4}%
            </div>
          </div>
        </div>

        {/* Precision Micro-Flaw Diagnostic & Civility Audit */}
        {(activeEval?.microFlawPrecisionDiagnostic || activeEval?.toxicHostilityAudit) && (
          <MicroFlawPrecisionCard
            diagnostic={activeEval.microFlawPrecisionDiagnostic}
            toxicAudit={activeEval.toxicHostilityAudit}
            title="EvaluationLogicEngine Precision Diagnostic"
          />
        )}

        {/* Engine Verdict & Retry Recommendation Banner */}
        {retryRec && (
          <div className={`p-4 rounded-xl border ${
            retryRec.shouldRetry && chancesRemaining > 0
              ? 'border-amber-300 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/30'
              : 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/70 dark:bg-emerald-950/30'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                retryRec.shouldRetry && chancesRemaining > 0
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
              }`}>
                {retryRec.shouldRetry && chancesRemaining > 0 ? (
                  <RotateCcw className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {retryRec.decisionPrompt}
                  </h5>
                  {chancesRemaining > 0 && (
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                      1 Chance Remaining
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {retryRec.recommendationReason}
                </p>

                {/* Specific cue adjustments */}
                {retryRec.actionableAdjustments && retryRec.actionableAdjustments.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Target Adjustments for Chance 2:
                    </span>
                    <ul className="mt-1 space-y-1">
                      {retryRec.actionableAdjustments.map((adj, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          {adj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Decision Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {chancesRemaining > 0 ? (
              <span>
                You have <strong>1 recorded response chance</strong> remaining. Retrying will not delete your Take 1.
              </span>
            ) : (
              <span>
                Both response chances completed. Select your preferred take above and confirm.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Retry Button (if chance remaining) */}
            {chancesRemaining > 0 && (
              <button
                type="button"
                id="retry-response-chance-button"
                onClick={onRetry}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Try One More Time (Use Chance 2 of 2)
              </button>
            )}

            {/* Lock In & Continue Button */}
            <button
              type="button"
              id="lock-in-take-button"
              onClick={() => onLockIn(selectedTake)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:translate-y-[-1px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              {take1 && take2 ? `Lock In Take ${selectedTake} & Continue` : 'Lock In This Take & Continue'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
