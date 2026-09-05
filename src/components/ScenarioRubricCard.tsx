import React, { useState } from 'react';
import { ScenarioRubric } from '../types';
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  Layers,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  Flame,
  HelpCircle,
  Clock
} from 'lucide-react';

interface ScenarioRubricCardProps {
  rubric?: ScenarioRubric;
  title?: string;
  defaultExpanded?: boolean;
}

export const ScenarioRubricCard: React.FC<ScenarioRubricCardProps> = ({
  rubric,
  title = 'Executive Evaluation Rubric & Question Framing',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'dimensions' | 'criteria' | 'traps' | 'framework'>('dimensions');

  if (!rubric) {
    return (
      <div className="bg-[#151515] border border-white/10 p-4 font-mono text-xs text-white/60">
        Standard Evaluation Rubric Active: Evaluated across Genuineness, Composure, Adequacy, and Cultural Fit.
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-amber-500/30 overflow-hidden font-sans">
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3.5 bg-[#1a1813] border-b border-amber-500/20 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-[#201d16]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Target className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5">
                True-to-Fact Grounded
              </span>
            </div>
            <div className="text-[11px] text-white/60">
              {rubric.scenarioTitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-400/80">
          <span>{isExpanded ? 'Collapse Rubric' : 'Inspect Scoring Matrix'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* Scenario Context */}
          <div className="bg-[#1a1a1a] border border-white/10 p-3.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
              Assessment Intent & Context
            </span>
            <p className="text-xs text-white/90 leading-relaxed font-sans">
              {rubric.scenarioContext}
            </p>
            {rubric.targetCompetencies && rubric.targetCompetencies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 self-center mr-1">
                  Core Competencies:
                </span>
                {rubric.targetCompetencies.map((comp, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 bg-white/5 text-amber-200 border border-amber-500/20"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap border-b border-white/10 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('dimensions')}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dimensions'
                  ? 'border-amber-400 text-amber-300 font-bold bg-amber-500/10'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Scoring Dimensions ({rubric.evaluationDimensions?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('criteria')}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'criteria'
                  ? 'border-emerald-400 text-emerald-300 font-bold bg-emerald-500/10'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>80% Baseline vs 100% Exemplar</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('traps')}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'traps'
                  ? 'border-rose-400 text-rose-300 font-bold bg-rose-500/10'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Critical Failure Traps</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('framework')}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'framework'
                  ? 'border-blue-400 text-blue-300 font-bold bg-blue-500/10'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Response Architecture</span>
            </button>
          </div>

          {/* TAB 1: Evaluation Dimensions */}
          {activeTab === 'dimensions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rubric.evaluationDimensions?.map((dim, idx) => (
                <div
                  key={idx}
                  className="bg-[#181818] border border-white/10 p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {dim.name}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                      {dim.weightPercent}% Weight
                    </span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {dim.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Passing vs Exemplar Criteria */}
          {activeTab === 'criteria' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 80% Baseline */}
              <div className="bg-[#161b17] border border-emerald-500/30 p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>80%+ Passing Threshold Requirements</span>
                </div>
                <ul className="space-y-2 text-xs text-white/80">
                  {rubric.passingCriteria80?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 100% Exemplar */}
              <div className="bg-[#181a20] border border-blue-500/30 p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>100% Masterclass Exemplar Criteria</span>
                </div>
                <ul className="space-y-2 text-xs text-white/80">
                  {rubric.exemplarCriteria100?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold shrink-0">★</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Critical Failure Traps */}
          {activeTab === 'traps' && (
            <div className="bg-[#1f1416] border border-rose-500/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Zero-Tolerance Traps (Causes Sub-60% Score or Immediate Civility Flag)</span>
              </div>
              <ul className="space-y-2 text-xs text-rose-200/90">
                {rubric.criticalFailureTraps?.map((trap, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-rose-500/10 p-2 border border-rose-500/20">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span className="leading-relaxed">{trap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB 4: Recommended Response Framework */}
          {activeTab === 'framework' && (
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-white/60">
                Recommended Structured Delivery Protocol (30 - 60 Seconds):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {rubric.responseFramework?.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-[#191919] border border-white/10 p-3.5 space-y-2 relative"
                  >
                    <div className="text-xs font-mono font-bold text-amber-300">
                      {step.step}
                    </div>
                    <p className="text-xs text-white/85 leading-relaxed font-sans">
                      {step.action}
                    </p>
                    <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{step.vocalDelivery}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
