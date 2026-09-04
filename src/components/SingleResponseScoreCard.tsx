import React from 'react';
import { SingleResponseEvaluationResult } from '../types';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Target, Award, ArrowUpRight, Zap, HelpCircle, Check, Compass } from 'lucide-react';

interface SingleResponseScoreCardProps {
  result: SingleResponseEvaluationResult;
  questionLabel?: string;
  isEvaluating?: boolean;
  onReEvaluate?: () => void;
}

export const SingleResponseScoreCard: React.FC<SingleResponseScoreCardProps> = ({
  result,
  questionLabel,
  isEvaluating = false,
  onReEvaluate,
}) => {
  const scoreNum = Math.round((result.score || 0) * 10) / 10;
  const isPassing = scoreNum >= 80 || result.isPassing;
  const isHigh = scoreNum >= 90;

  return (
    <div className={`mt-3 p-5 border transition-all space-y-4 animate-fadeIn rounded-3xl backdrop-blur-xl ${
      isPassing
        ? 'bg-zinc-900/95 border-emerald-500/40 text-zinc-100'
        : 'bg-zinc-900/95 border-amber-500/40 text-zinc-100'
    }`}>
      {/* Top Header & Score Badge (1% precision) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 border font-bold flex items-center gap-1 rounded-full ${
              isPassing
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
            }`}>
              {isPassing ? <Check className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-amber-300" />}
              {isPassing ? '80%+ PASSING SCORE • LADDER READY' : 'BENCHMARK EVALUATION (80% TARGET)'}
            </span>
            {questionLabel && <span className="text-[10px] font-mono text-zinc-400">• {questionLabel}</span>}
          </div>
          <h5 className="font-serif italic text-base font-bold text-zinc-100 mt-1">
            {result.exactGrade || `${scoreNum}% - Response Evaluation`}
          </h5>
          <p className="text-[11px] font-mono text-emerald-300/80 mt-0.5 flex items-center gap-1">
            <Award className="w-3 h-3 shrink-0" />
            <span>{result.ladderStatus || (isPassing ? 'Climbing the Certification Ladder' : 'Apply Hints Below to Reach 80%+')}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className={`text-2xl font-mono font-bold ${
              isHigh ? 'text-emerald-400' : isPassing ? 'text-emerald-300' : 'text-amber-300'
            }`}>
              {scoreNum}%
            </div>
            <div className="text-[9px] font-mono uppercase text-zinc-500">Evaluated Score</div>
          </div>

          {onReEvaluate && (
            <button
              type="button"
              onClick={onReEvaluate}
              disabled={isEvaluating}
              className="text-[10px] font-mono uppercase px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 transition-all cursor-pointer flex items-center gap-1 rounded-full"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>{isEvaluating ? 'Evaluating...' : 'Re-Evaluate'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Word-by-Word & Substance Analysis */}
      {result.wordAnalysis && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] bg-black/80 p-3.5 border border-zinc-800 rounded-2xl">
          <div>
            <span className="text-zinc-500 block text-[9px] uppercase">Word Count</span>
            <span className="text-zinc-100 font-bold">{result.wordAnalysis.wordCount} Words</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[9px] uppercase">Tone & Composure</span>
            <span className="text-emerald-300 font-medium">{result.wordAnalysis.tonePacing || 'Measured'}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[9px] uppercase">Syntax (Informational)</span>
            <span className="text-zinc-400 font-medium">{result.wordAnalysis.grammarPrecision || 'Substance Prioritized'}</span>
          </div>

          {(result.wordAnalysis?.strongKeywordsUsed || []).length > 0 && (
            <div className="sm:col-span-3 pt-2 border-t border-zinc-800">
              <span className="text-zinc-500 block text-[9px] uppercase mb-1">Strong Civility & Professional Terms:</span>
              <div className="flex flex-wrap gap-1.5">
                {(result.wordAnalysis?.strongKeywordsUsed || []).map((kw, i) => (
                  <span key={i} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2.5 py-0.5 text-[10px] rounded-full">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(result.wordAnalysis?.weakOrRiskWords || []).length > 0 && (
            <div className="sm:col-span-3 pt-1">
              <span className="text-zinc-500 block text-[9px] uppercase mb-1">Words Flagged for Softening:</span>
              <div className="flex flex-wrap gap-1.5">
                {(result.wordAnalysis?.weakOrRiskWords || []).map((kw, i) => (
                  <span key={i} className="bg-amber-400/10 border border-amber-400/30 text-amber-300 px-2.5 py-0.5 text-[10px] rounded-full">
                    ⚠ {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CRITICAL FEATURE: "What Should Have Been Done Here Instead?" / Exemplar Answer */}
      {result.whatShouldHaveBeenDoneInstead && (
        <div className="p-4 bg-black/90 border border-emerald-500/40 space-y-2 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-300 font-mono text-xs uppercase font-bold tracking-wider">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>What Should Have Been Done Here Instead? (Model Gold Standard Answer)</span>
          </div>
          <p className="font-sans text-xs text-zinc-200 leading-relaxed bg-zinc-950 p-3.5 border border-emerald-500/30 italic rounded-xl">
            "{result.whatShouldHaveBeenDoneInstead}"
          </p>
        </div>
      )}

      {/* Position Tuning Hint */}
      {result.positionTuningHint && (
        <div className="p-3 bg-black/90 border border-cyan-500/30 flex items-start gap-2.5 rounded-2xl">
          <Compass className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="font-sans text-xs text-cyan-200/90 leading-normal">
            <span className="font-mono text-[10px] uppercase text-cyan-400 block font-bold">Position Tuning Advice:</span>
            {result.positionTuningHint}
          </div>
        </div>
      )}

      {/* "What Needs Improved To Reach 100% Perfection" Box */}
      <div className="p-4 bg-black/90 border border-amber-400/30 space-y-1.5 rounded-2xl">
        <div className="flex items-center gap-2 text-amber-300 font-mono text-xs uppercase font-bold tracking-wider">
          <Lightbulb className="w-4 h-4 text-amber-300 shrink-0" />
          <span>How to Teach the Training & Reach 100% Perfection</span>
        </div>
        <p className="font-sans text-xs text-zinc-200 leading-relaxed">
          {result.whatNeedsImprovementToReach100}
        </p>
      </div>

      {/* Action Steps to Master This Module */}
      {(result.coachingTipsForPerfection || []).length > 0 && (
        <div className="space-y-1.5 font-sans text-xs">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
            Action Steps to Climb Higher on the Ladder:
          </span>
          <ul className="space-y-1 text-white/80">
            {(result.coachingTipsForPerfection || []).map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

