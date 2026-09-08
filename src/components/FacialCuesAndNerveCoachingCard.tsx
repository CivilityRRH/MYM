import React, { useState } from 'react';
import { FacialComposureAndExperientialVeracity } from '../types';
import {
  HeartPulse,
  Brain,
  ShieldCheck,
  Target,
  Sparkles,
  CheckCircle2,
  Wind,
  Compass,
  Eye,
  Activity,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

interface FacialCuesAndNerveCoachingCardProps {
  data: FacialComposureAndExperientialVeracity;
  theme?: 'dark' | 'light';
  title?: string;
}

export const FacialCuesAndNerveCoachingCard: React.FC<FacialCuesAndNerveCoachingCardProps> = ({
  data,
  theme = 'dark',
  title = 'Authenticity & Regulation Coaching'
}) => {
  const [showScienceDetails, setShowScienceDetails] = useState(false);
  const [activeDrillIndex, setActiveDrillIndex] = useState(0);

  const nerves = data.nerveAndAnxietyCalibration;
  const grounding = data.experientialGroundingAudit;

  const isLight = theme === 'light';

  const getStageFrightBadge = (tier: string) => {
    switch (tier) {
      case 'Optimal Calm & Regulated':
        return {
          bg: isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          label: 'Optimal Autonomic Composure'
        };
      case 'Nervous Sincerity / Productive Energy':
        return {
          bg: isLight ? 'bg-blue-50 text-blue-800 border-blue-300' : 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          label: 'Nervous Sincerity (High Conscientiousness)'
        };
      case 'Moderate Stage Fright / Needs Somatic Pacing':
        return {
          bg: isLight ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          label: 'Stage Fright Observed • Somatic Pacing Recommended'
        };
      default:
        return {
          bg: isLight ? 'bg-purple-50 text-purple-800 border-purple-300' : 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          label: 'Somatic Recovery Protocol Active'
        };
    }
  };

  const getGroundingBadge = (tier: string) => {
    switch (tier) {
      case 'Deep Lived Operational Mastery':
        return {
          bg: isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          label: 'Verified Lived Mastery (No Embellishment)'
        };
      case 'Substantive Authentic Background':
        return {
          bg: isLight ? 'bg-cyan-50 text-cyan-800 border-cyan-300' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          label: 'Substantive Operational Track Record'
        };
      case 'Emerging Experiential Foundation':
        return {
          bg: isLight ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          label: 'Emerging Track Record • Grounding Recommended'
        };
      default:
        return {
          bg: isLight ? 'bg-zinc-100 text-zinc-800 border-zinc-300' : 'bg-zinc-800 text-zinc-300 border-zinc-700',
          label: 'Needs Operational Detail Anchoring'
        };
    }
  };

  const stageBadge = getStageFrightBadge(nerves.stageFrightIndex);
  const groundBadge = getGroundingBadge(grounding.experientialDepthTier);

  return (
    <div
      id="facial-cues-and-nerve-coaching-card"
      className={`border rounded-2xl p-4 sm:p-6 transition-all shadow-xl font-sans ${
        isLight
          ? 'bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/30 border-amber-200 text-zinc-900'
          : 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border-amber-500/30 text-zinc-100'
      }`}
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4 mb-5 border-amber-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-serif italic font-bold tracking-tight">
                {title}
              </h4>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                Science-Backed Behavioral Calibration
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              Facial Action Coding System (FACS) • Autonomic Nerve Calming • Experiential Reality Monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowScienceDetails(!showScienceDetails)}
            className={`px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>{showScienceDetails ? 'Hide Scientific Rationale' : 'View Scientific Rationale'}</span>
            {showScienceDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Scientific Framework Modal / Drawer (Collapsible) */}
      {showScienceDetails && (
        <div className={`mb-5 p-4 rounded-xl border text-xs leading-relaxed space-y-2.5 ${
          isLight ? 'bg-amber-50/60 border-amber-200 text-zinc-800' : 'bg-black/60 border-amber-500/20 text-zinc-300'
        }`}>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
            <Brain className="w-4 h-4 text-amber-500" />
            <span>Neuropsychological Framework &amp; Ethical Directives:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className={`p-3 rounded-lg border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
              <strong className="text-amber-600 dark:text-amber-300 block mb-1">
                1. The Othello Error Safeguard (Paul Ekman, 1985)
              </strong>
              <p className="text-zinc-600 dark:text-zinc-400">
                Conventional interviewers falsely assume nervous tremors indicate deception or inability. Science proves autonomic agitation (pupil dilation, elevated vocal jitter) reflects deep conscientiousness and emotional investment. We pinpoint physical anxiety loci solely to provide empowering somatic calming protocols.
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
              <strong className="text-amber-600 dark:text-amber-300 block mb-1">
                2. Autobiographical Reality Monitoring (Johnson &amp; Raye; Vrij)
              </strong>
              <p className="text-zinc-600 dark:text-zinc-400">
                To prevent superficial resume inflation, science examines episodic detail density and affective-verbal synchrony. Genuine experience spontaneously produces operational constraints, tool chains, and micro-expressions that naturally precede speech without rehearsed latency.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* COLUMN 1: Autonomic Regulation & Stage-Fright Calibration */}
        <div className={`p-4 sm:p-5 rounded-xl border space-y-4 ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/80 border-zinc-800'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-500" />
              <div>
                <h5 className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-900 dark:text-zinc-100">
                  1. Autonomic Regulation &amp; Stage-Fright Coaching
                </h5>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Pinpointing Anxiety Loci &amp; Calming Reflexes
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {nerves.autonomicSteadinessScore}%
              </span>
              <span className="text-[9px] font-mono text-zinc-400 block">Steadiness Index</span>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border inline-block ${stageBadge.bg}`}>
              {stageBadge.label}
            </span>
          </div>

          {/* Summary */}
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
            {nerves.stageFrightSummary}
          </p>

          {/* Identified Physical Tension Points */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
              Observed Somatic &amp; Tension Loci:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {nerves.detectedTensionPoints.map((point, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-200 text-zinc-700'
                      : 'bg-black/60 border-zinc-800 text-zinc-300'
                  }`}
                >
                  • {point}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Neuro-Somatic Calming Protocols */}
          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Targeted Nerve Calming Protocols ({nerves.targetedNerveCalmingProtocols.length}):
              </span>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                {nerves.targetedNerveCalmingProtocols.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveDrillIndex(i)}
                    className={`w-5 h-5 rounded flex items-center justify-center font-bold cursor-pointer transition-all ${
                      activeDrillIndex === i
                        ? 'bg-emerald-600 text-white'
                        : isLight
                        ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {nerves.targetedNerveCalmingProtocols[activeDrillIndex] && (
              <div className={`p-3 rounded-xl border space-y-2 text-xs transition-all ${
                isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-950/20 border-emerald-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <strong className="text-emerald-900 dark:text-emerald-300 font-serif italic text-sm">
                    {nerves.targetedNerveCalmingProtocols[activeDrillIndex].technique}
                  </strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    Target: {nerves.targetedNerveCalmingProtocols[activeDrillIndex].targetArea}
                  </span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div>
                    <span className="font-mono text-[9px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
                      Exercise Protocol:
                    </span>
                    <p className="text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed">
                      {nerves.targetedNerveCalmingProtocols[activeDrillIndex].protocol}
                    </p>
                  </div>

                  <div className="pt-1">
                    <span className="font-mono text-[9px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
                      Neuroscience Rationale:
                    </span>
                    <p className="text-zinc-600 dark:text-zinc-400 font-sans italic leading-relaxed">
                      {nerves.targetedNerveCalmingProtocols[activeDrillIndex].neuroScienceRationale}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: Experiential Grounding & Reality Audit */}
        <div className={`p-4 sm:p-5 rounded-xl border space-y-4 ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/80 border-zinc-800'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              <div>
                <h5 className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-900 dark:text-zinc-100">
                  2. Experiential Grounding &amp; Operational Reality Audit
                </h5>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Authentic Track Record • Eliminates Resume Embellishment
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-mono font-bold text-cyan-600 dark:text-cyan-400">
                {grounding.groundingScore}%
              </span>
              <span className="text-[9px] font-mono text-zinc-400 block">Grounding Index</span>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border inline-block ${groundBadge.bg}`}>
              {groundBadge.label}
            </span>
          </div>

          {/* Metrics Trio */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
            <div className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-cyan-50/50 border-cyan-200 text-cyan-950' : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
            }`}>
              <span className="text-zinc-500 dark:text-zinc-400 block text-[9px] uppercase">
                Autobiographical Detail Density:
              </span>
              <strong className="text-sm font-bold block mt-0.5">
                {grounding.autobiographicalDetailDensity}%
              </strong>
              <span className="text-[8px] text-zinc-400">Granular constraints vs abstract buzzwords</span>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-purple-50/50 border-purple-200 text-purple-950' : 'bg-purple-950/20 border-purple-500/30 text-purple-200'
            }`}>
              <span className="text-zinc-500 dark:text-zinc-400 block text-[9px] uppercase">
                Affective-Verbal Synchrony:
              </span>
              <strong className="text-sm font-bold block mt-0.5">
                {grounding.affectiveVerbalSynchronyPercent}%
              </strong>
              <span className="text-[8px] text-zinc-400">Micro-expressions align with spoken recall</span>
            </div>
          </div>

          {/* Cognitive Retrieval Congruence Analysis */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
              Cognitive Retrieval Gaze &amp; Memory Congruence:
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
              {grounding.cognitiveRetrievalCongruence}
            </p>
          </div>

          {/* Verified Empirical Proof Markers */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-mono uppercase font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Operational Proof Points:
            </span>
            <ul className="space-y-1 text-[11px] text-zinc-700 dark:text-zinc-300 font-sans">
              {grounding.verifiedExperienceMarkers.map((marker, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-cyan-500 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{marker}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Depth Enhancement Guidance */}
          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
            isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-amber-950/20 border-amber-500/30'
          }`}>
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase block flex items-center gap-1">
              <Award className="w-3 h-3" /> Career Advancement &amp; Grounding Tip:
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed text-[11px]">
              {grounding.depthEnhancementGuidance}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
