import React, { useState, useMemo } from 'react';
import {
  Brain,
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  Target,
  Activity,
  HeartHandshake,
  CheckCircle2,
  Zap,
  Clock,
  DollarSign,
  Users,
  Compass,
  Layers,
  Flame,
  ArrowRight,
  HelpCircle,
  BarChart2,
  Smile,
  Mic,
  Video,
  Scale,
  Calendar,
  BookOpen,
  Check
} from 'lucide-react';
import {
  CandidateEvaluation,
  VocalScoringResult,
  VideoScoringResult,
  ArchetypeProjection
} from '../types';
import {
  UNIFIED_SCIENTIFIC_PILLARS,
  synthesizeScientificGrowthTrajectory,
  UnifiedScientificGrowthReport
} from '../lib/scientificFramework';

interface HumanOptimizationMatrixProps {
  candidateName?: string;
  targetRole?: string;
  expectedSalary?: string;
  evaluationResult?: CandidateEvaluation | null;
  vocalResult?: VocalScoringResult | null;
  videoResult?: VideoScoringResult | null;
  archetypeProjection?: ArchetypeProjection | null;
  onOpenPracticeChamber?: () => void;
  onOpenDossier?: () => void;
}

export const HumanOptimizationMatrix: React.FC<HumanOptimizationMatrixProps> = ({
  candidateName = 'Executive Candidate',
  targetRole = 'Target Executive Leadership Position',
  expectedSalary = '$185,000 / yr',
  evaluationResult,
  vocalResult,
  videoResult,
  archetypeProjection,
  onOpenPracticeChamber,
  onOpenDossier,
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('polyvagal-acoustic');
  const [activeDrillCategory, setActiveDrillCategory] = useState<'all' | 'polyvagal-acoustic' | 'facs-affect' | 'kinesic-speech-gesture' | 'crisis-containment-deescalation'>('all');
  const [completedDrillIds, setCompletedDrillIds] = useState<string[]>(['drill-polyvagal-acoustic', 'day-1']);
  const [selectedRoadmapDay, setSelectedRoadmapDay] = useState<number>(1);

  const civilityComposite = evaluationResult?.civilityScore || 94.2;
  const isCertified = civilityComposite >= 80;

  // Synthesize dynamic unified report from scientific framework
  const growthReport: UnifiedScientificGrowthReport = useMemo(() => {
    return synthesizeScientificGrowthTrajectory({
      candidateName,
      targetRole,
      expectedSalary,
      civilityScore: civilityComposite,
      pitchStabilityPercent: vocalResult?.pitchModulationScore,
      speechPacingWpm: vocalResult?.cadencePacingScore ? Math.round(110 + vocalResult.cadencePacingScore * 0.3) : 138,
      decibelSteadiness: vocalResult?.emotionalComposureScore ? 'Steady Executive Harmonic Range' : undefined,
      lensLockFixationRatio: videoResult?.bodyLanguageScore || 94.0,
      posturalSwayStability: videoResult?.scientificKinesics?.kinesicMovements?.posturalSwayIndex ? 100 - videoResult.scientificKinesics.kinesicMovements.posturalSwayIndex : 92.5,
      crisisResponseSubstanceScore: videoResult?.crisisResponseSubstanceScore || evaluationResult?.pressureScore || 93.0,
      genuineAffectCongruenceScore: videoResult?.genuineResponseScore || 94.0,
      deescalationKeywordPresence: true
    });
  }, [candidateName, targetRole, expectedSalary, civilityComposite, vocalResult, videoResult, evaluationResult]);

  const activePillar = UNIFIED_SCIENTIFIC_PILLARS.find((p) => p.id === selectedPillarId) || UNIFIED_SCIENTIFIC_PILLARS[0];
  const activeGrowthVector = growthReport.pillarGrowthVectors.find((v) => v.pillarId === selectedPillarId) || growthReport.pillarGrowthVectors[0];

  // Toggle drill completion
  const toggleDrill = (id: string) => {
    setCompletedDrillIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  return (
    <div id="human-optimization-matrix" className="bg-zinc-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Mission & Philosophy */}
      <div className="border-b border-zinc-800 pb-6 relative z-10">
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <HeartHandshake className="w-3.5 h-3.5 fill-black" />
            UNIFIED SCIENTIFIC HUMAN OPTIMIZATION ENGINE
          </span>
          <span className="text-zinc-400 text-xs font-mono">
            • Converting Raw Psychophysiological Diagnostic Data Into Actionable Career Mastery
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mt-2">
          <div>
            <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>The Consolidated Science of Human Elevation</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-sans mt-1.5 max-w-3xl leading-relaxed">
              We unify decades of clinical neuroscience, acoustic phonetics, and kinesics into a <strong className="text-emerald-300 font-semibold">single diagnostic data architecture</strong>. Rather than issuing passive binary pass/fail scores, our system delivers <strong className="text-amber-300 font-semibold">clear, raw diagnosis paired with 7-day micro-conditioning roadmaps</strong> that elevate candidate earning power and secure generational financial stability.
            </p>
          </div>

          {/* Guaranteed Handshake Accreditation Seal */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-500/40 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                GUARANTEED HANDSHAKE STATUS
              </span>
              <div className="text-base font-serif font-bold text-white flex items-center gap-1.5">
                <span>{isCertified ? 'Accredited & Calibrated' : 'Calibrating in Progress'}</span>
                {isCertified && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {isCertified ? 'Turn-Key Placement • Ready for Immediate Handshake' : 'Progressing through 7-Day Calibration Ladder'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Trajectory & Generational Impact Calculator Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-zinc-950 border border-emerald-500/30 p-5 sm:p-6 rounded-2xl relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Target Position</span>
          <h4 className="font-serif italic text-lg font-bold text-white truncate">{targetRole}</h4>
          <span className="text-xs font-mono text-emerald-400">{expectedSalary}</span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Civility Composite Index</span>
          <div className="text-2xl font-mono font-bold text-emerald-300">
            {civilityComposite}% <span className="text-xs text-zinc-400 font-sans font-normal">(Passing: 80%+)</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400/90">Top 4% Global Benchmark</span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Generational Wealth Delta</span>
          <div className="text-2xl font-mono font-bold text-amber-300">
            {growthReport.generationalWealthDeltaAnnual}
          </div>
          <span className="text-[10px] font-mono text-zinc-400">Projected Lifetime Trajectory</span>
        </div>

        <div className="flex flex-col gap-2">
          {onOpenDossier && (
            <button
              type="button"
              onClick={onOpenDossier}
              className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certified Boardroom Dossier</span>
            </button>
          )}
          {onOpenPracticeChamber && (
            <button
              type="button"
              onClick={onOpenPracticeChamber}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase tracking-wider rounded-xl border border-zinc-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Live Practice Chamber</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: UNIFIED SCIENTIFIC PILLAR NAVIGATOR (DEEP DATA STRUCTURE) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif italic text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span>The Unified Scientific Data Framework & Diagnostic Breakdown</span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Select a foundational research pillar to inspect its physiological mechanism, biometric thresholds, and dynamic growth vectors.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {UNIFIED_SCIENTIFIC_PILLARS.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedPillarId === pillar.id
                    ? 'bg-cyan-500 text-black font-bold shadow'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {pillar.leadScientist.split(' ')[1] || pillar.pillarName}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Pillar Diagnostic Detail Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                {activePillar.academicInstitution} • {activePillar.leadScientist}
              </span>
              <h4 className="font-serif italic text-2xl font-bold text-white mt-1">
                {activePillar.pillarName}
              </h4>
              <p className="text-xs text-zinc-400 font-mono italic mt-0.5">
                Seminal Foundation: {activePillar.seminalPublication}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black/60 px-4 py-2.5 rounded-2xl border border-zinc-800 shrink-0">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Current Calibration:</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {activeGrowthVector.currentObservedValue}%
                </span>
              </div>
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                {activeGrowthVector.calibrationTier}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Physiological Mechanism & Raw Reality */}
            <div className="space-y-4">
              <div className="bg-black/50 p-4 rounded-2xl border border-zinc-800 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold block flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Physiological & Autonomic Mechanism:
                </span>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  {activePillar.corePhysiologicalMechanism}
                </p>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">
                  Raw Diagnostic Reality (Honest Assessment):
                </span>
                <p className="text-xs text-amber-100/90 font-sans leading-relaxed">
                  {activeGrowthVector.rawDiagnosticReality}
                </p>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold block">
                  Empowering High-Leverage Growth Pathway:
                </span>
                <p className="text-xs text-emerald-100/90 font-sans leading-relaxed">
                  {activeGrowthVector.empoweringGrowthLever}
                </p>
              </div>
            </div>

            {/* Right: Daily Micro-Drill & Boardroom ROI */}
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    Targeted Daily Micro-Habit (2-5 Min/Day):
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">{activeGrowthVector.drillDuration}</span>
                </div>
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                  <p className="text-xs text-white font-medium">
                    {activeGrowthVector.dailyMicroHabit}
                  </p>
                </div>

                <span className="text-[10px] font-mono uppercase text-zinc-400 block pt-1">
                  Drill Execution Protocol:
                </span>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  {activeGrowthVector.drillProtocol}
                </p>

                <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                    Gold-Standard Benchmark Exemplar:
                  </span>
                  <p className="text-xs font-serif italic text-emerald-200 leading-relaxed">
                    {activeGrowthVector.goldStandardExemplar}
                  </p>
                </div>
              </div>

              <div className="bg-black/60 p-4 rounded-2xl border border-zinc-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                  Enterprise Boardroom Risk Mitigated & Compensation Impact:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                    <span className="text-zinc-500 block text-[9px] uppercase">Enterprise Protection</span>
                    <span className="text-zinc-300">{activePillar.executiveBoardroomImpact.enterpriseRiskMitigated}</span>
                  </div>
                  <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                    <span className="text-zinc-500 block text-[9px] uppercase">Salary Advantage</span>
                    <span className="text-amber-300 font-semibold">{activePillar.executiveBoardroomImpact.compensationTrajectoryAdvantage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 7-DAY NEUROLOGICAL CONDITIONING ROADMAP */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif italic text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>7-Day Neurological Conditioning Roadmap: From Baseline to Guaranteed Handshake</span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Structured daily protocols that build permanent neuromuscular memory for high-stakes executive presence.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            {completedDrillIds.filter((d) => d.startsWith('day-')).length} of 7 Days Mastered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
          {growthReport.sevenDayConditioningRoadmap.map((item) => {
            const isDayCompleted = completedDrillIds.includes(`day-${item.dayNumber}`);
            const isSelected = selectedRoadmapDay === item.dayNumber;
            return (
              <div
                key={item.dayNumber}
                onClick={() => setSelectedRoadmapDay(item.dayNumber)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400 ring-1 ring-amber-400/40'
                    : isDayCompleted
                    ? 'bg-zinc-900/90 border-emerald-500/50'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    isDayCompleted ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    Day {item.dayNumber}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDrill(`day-${item.dayNumber}`);
                    }}
                    className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                      isDayCompleted
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'border-zinc-700 text-zinc-500 hover:text-white'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>

                <h5 className="font-serif italic text-xs font-bold text-white line-clamp-2">
                  {item.focusPillar.split('(')[0]}
                </h5>

                <span className={`text-[9px] font-mono block ${isDayCompleted ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {isDayCompleted ? '✓ Calibrated' : 'Pending Routine'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Roadmap Day Expanded Focus */}
        {(() => {
          const activeDay = growthReport.sevenDayConditioningRoadmap.find((d) => d.dayNumber === selectedRoadmapDay) || growthReport.sevenDayConditioningRoadmap[0];
          const isDone = completedDrillIds.includes(`day-${activeDay.dayNumber}`);
          return (
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                  Day {activeDay.dayNumber} Conditioning Focus: {activeDay.focusPillar}
                </span>
                <p className="text-xs text-zinc-200 font-sans leading-relaxed">
                  <strong className="text-white">Actionable Routine:</strong> {activeDay.actionableRoutine}
                </p>
                <p className="text-xs text-emerald-300 font-mono">
                  <strong>Neurological Outcome:</strong> {activeDay.expectedNeurologicalOutcome}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleDrill(`day-${activeDay.dayNumber}`)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                  isDone
                    ? 'bg-emerald-500 text-black border border-emerald-400 shadow'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                }`}
              >
                {isDone ? '✓ Day Completed' : 'Mark Day Complete'}
              </button>
            </div>
          );
        })()}
      </div>

      {/* SECTION 3: BOARDROOM HANDSHAKE ACCREDITATION MILESTONES */}
      <div className="space-y-4">
        <div className="border-b border-zinc-800 pb-3">
          <h3 className="font-serif italic text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Guaranteed Handshake Verification Milestones</span>
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            The four non-negotiable biometric and behavioral thresholds required for guaranteed turn-key placement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {growthReport.boardroomHandshakeMilestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border space-y-2 flex flex-col justify-between ${
                m.isAchieved
                  ? 'bg-zinc-900/90 border-emerald-500/50 shadow-md'
                  : 'bg-zinc-900/50 border-zinc-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                    Milestone 0{idx + 1}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    m.isAchieved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {m.isAchieved ? 'VERIFIED' : 'CALIBRATING'}
                  </span>
                </div>
                <h4 className="font-serif italic text-sm font-bold text-white">
                  {m.milestoneName}
                </h4>
              </div>

              <p className="text-[11px] text-zinc-400 font-mono leading-relaxed border-t border-zinc-800/80 pt-2">
                {m.verificationMarker}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Summary Callout */}
      <div className="p-5 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
          <span>
            <strong>The Mind Your Manners™ Synthesis Engine:</strong> Unified data structures power objective truth, actionable neuro-conditioning, and guaranteed executive placement.
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-emerald-400 font-bold uppercase tracking-wider block">
            Zero Guessing • Zero Turnover
          </span>
          <span className="text-[10px] text-zinc-500">Accredited Career Elevation</span>
        </div>
      </div>
    </div>
  );
};
