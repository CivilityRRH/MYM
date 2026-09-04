import React, { useState, useEffect } from 'react';
import { HiringLikelihoodPrediction, HiringLikelihoodAreaImprovement } from '../types';
import {
  TrendingUp,
  Target,
  Sparkles,
  Award,
  Building2,
  Briefcase,
  Sliders,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Play,
  RotateCcw,
  Clock,
  BookOpen,
  Send,
  Share2,
  Check
} from 'lucide-react';

interface CandidateHiringPredictorProps {
  candidateName?: string;
  candidateRole?: string;
  initialThisScores?: {
    tone: number;
    ethics: number;
    pressure: number;
    drive: number;
  };
  initialDrillsCompleted?: number;
  initialHoursInvested?: number;
}

const POPULAR_COMPANIES = [
  { name: 'Google / Alphabet', field: 'Technology & AI', vibe: 'High-velocity innovation, psychological safety, and articulate cross-functional consensus.' },
  { name: 'Mayo Clinic', field: 'Healthcare & Clinical Ops', vibe: 'Absolute ethical composure, zero-defect patient civility, and crisis de-escalation.' },
  { name: 'JPMorgan Chase & Co.', field: 'Finance & Risk Management', vibe: 'Steadfast compliance integrity, executive tone under market volatility, and precision.' },
  { name: 'Apple', field: 'Product Design & Engineering', vibe: 'Meticulous attention to detail, respectful discretion, and collaborative craft.' },
  { name: 'Stripe', field: 'Fintech & Infrastructure', vibe: 'High-leverage written clarity, extreme problem ownership, and calm operational focus.' },
  { name: 'McKinsey & Company', field: 'Strategic Consulting', vibe: 'Polished diplomatic presence, executive rapport under tight deadlines, and structured thinking.' },
  { name: 'Lockheed Martin', field: 'Aerospace & Defense', vibe: 'Zero-tolerance safety compliance, mission-critical dependability, and protocol adherence.' },
  { name: 'Cleveland Clinic', field: 'Healthcare & Patient Trust', vibe: 'Empathetic communication, unwavering patient dignity, and high-pressure team coordination.' },
];

const POPULAR_FIELDS = [
  'Technology & AI Engineering',
  'Healthcare & Clinical Operations',
  'Finance & Risk Management',
  'Strategic Management Consulting',
  'Aerospace & Mission-Critical Defense',
  'Executive Operations & Leadership',
  'Legal, Ethics & Compliance',
  'Customer Trust & High-Touch Success',
  'Energy & Sustainable Infrastructure'
];

export const CandidateHiringPredictor: React.FC<CandidateHiringPredictorProps> = ({
  candidateName = 'Candidate',
  candidateRole = 'Lead Professional Specialist',
  initialThisScores = { tone: 88, ethics: 92, pressure: 86, drive: 90 },
  initialDrillsCompleted = 6,
  initialHoursInvested = 8
}) => {
  // Target Selection State
  const [targetCompany, setTargetCompany] = useState<string>('Google / Alphabet');
  const [customCompanyInput, setCustomCompanyInput] = useState<string>('');
  const [targetField, setTargetField] = useState<string>('Technology & AI Engineering');
  const [targetRole, setTargetRole] = useState<string>(candidateRole || 'Lead Professional Specialist');

  // Work Put In with T.H.I.S. System (Interactive Sliders)
  const [toneScore, setToneScore] = useState<number>(initialThisScores.tone || 88);
  const [ethicsScore, setEthicsScore] = useState<number>(initialThisScores.ethics || 92);
  const [pressureScore, setPressureScore] = useState<number>(initialThisScores.pressure || 86);
  const [driveScore, setDriveScore] = useState<number>(initialThisScores.drive || 90);
  const [drillsCompleted, setDrillsCompleted] = useState<number>(initialDrillsCompleted || 6);
  const [hoursInvested, setHoursInvested] = useState<number>(initialHoursInvested || 8);

  // Prediction State
  const [prediction, setPrediction] = useState<HiringLikelihoodPrediction | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [practiceResponse, setPracticeResponse] = useState<string>('');
  const [isEvaluatingPractice, setIsEvaluatingPractice] = useState<boolean>(false);
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const calculatePrediction = async (customComp?: string) => {
    setIsCalculating(true);
    const effectiveCompany = customComp || (customCompanyInput.trim() ? customCompanyInput.trim() : targetCompany);

    try {
      const res = await fetch('/api/calculate-hiring-likelihood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          targetCompany: effectiveCompany,
          targetField,
          targetRole,
          thisScores: {
            tone: toneScore,
            ethics: ethicsScore,
            pressure: pressureScore,
            drive: driveScore
          },
          drillsCompleted,
          hoursInvested
        })
      });

      const data = await res.json();
      setPrediction(data);
      setPracticeFeedback(null);
    } catch (err) {
      console.error('Error calculating hiring likelihood:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    calculatePrediction();
  }, []);

  const handleEvaluatePracticeScenario = async () => {
    if (!practiceResponse.trim()) {
      alert('Please type or record your response to the company calibration scenario first.');
      return;
    }

    setIsEvaluatingPractice(true);
    try {
      const res = await fetch('/api/evaluate-single-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionPrompt: prediction?.recommendedPracticeScenario?.scenarioPrompt || 'Company Culture Scenario',
          responseText: practiceResponse,
          responseType: 'scenario',
          roleTitle: `${targetRole} at ${targetCompany}`
        })
      });

      const evalData = await res.json();
      const newScore = evalData.score || 94;

      setPracticeFeedback(
        `Calibration Result: ${evalData.exactGrade || `${newScore}%`}. ${evalData.whatNeedsImprovementToReach100 || 'Demonstrated outstanding composure.'} Your hiring probability gained +3%!`
      );

      // Boost scores from practice
      setToneScore((prev) => Math.min(99, prev + 2));
      setPressureScore((prev) => Math.min(99, prev + 3));
      setDrillsCompleted((prev) => prev + 1);
      setHoursInvested((prev) => prev + 1);

      if (prediction) {
        setPrediction({
          ...prediction,
          currentStatusScore: Math.min(99, prediction.currentStatusScore + 2),
          currentLikelihoodPercent: Math.min(99, prediction.currentLikelihoodPercent + 3),
          cultureAlignmentScore: Math.min(99, prediction.cultureAlignmentScore + 2)
        });
      }
    } catch (err) {
      console.error('Practice evaluation error:', err);
      alert('Error evaluating practice response.');
    } finally {
      setIsEvaluatingPractice(false);
    }
  };

  const handleShareResults = () => {
    const text = `T.H.I.S. System Hiring Match: ${prediction?.currentLikelihoodPercent || 88}% Current Likelihood (Potential: ${prediction?.potentialUpsidePercent || 96}%) for ${targetCompany} in ${targetField}!`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-emerald-500/30 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>T.H.I.S. System Predictive Intelligence</span>
            </div>
            <h2 className="font-serif italic text-2xl text-white">Target Company & Industry Hiring Horizon</h2>
            <p className="text-xs text-white/70 max-w-2xl font-sans mt-1">
              Estimate your current hiring likelihood, projected upside ceiling, and specific areas for improvement based on the verified work you have put into our T.H.I.S. (Tone, Honesty, Impress under pressure, Sustain) system.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => calculatePrediction()}
              disabled={isCalculating}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
              <span>{isCalculating ? 'Recalculating...' : 'Recalculate Estimate'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareResults}
              className="p-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer"
              title="Copy match summary"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-white/70" />}
            </button>
          </div>
        </div>
      </div>

      {/* Target Company & Field Selection Controls */}
      <div className="bg-[#141414] border border-white/10 p-5 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-white/60 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Select Target Employer or Industry Field</span>
        </h3>

        {/* Preset Company Pills */}
        <div className="flex flex-wrap gap-2">
          {POPULAR_COMPANIES.map((comp) => (
            <button
              key={comp.name}
              type="button"
              onClick={() => {
                setTargetCompany(comp.name);
                setCustomCompanyInput('');
                setTargetField(comp.field);
                calculatePrediction(comp.name);
              }}
              className={`px-3 py-1.5 text-xs font-mono transition-all border cursor-pointer ${
                targetCompany === comp.name && !customCompanyInput
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold shadow-sm'
                  : 'bg-[#0A0A0A] text-white/70 border-white/10 hover:border-white/30'
              }`}
            >
              {comp.name}
            </button>
          ))}
        </div>

        {/* Custom Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/10">
          <div>
            <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">
              Or Custom Target Company:
            </label>
            <input
              type="text"
              value={customCompanyInput}
              onChange={(e) => setCustomCompanyInput(e.target.value)}
              placeholder="e.g. Tesla, Netflix, Local Health System..."
              className="w-full p-2.5 bg-[#0A0A0A] border border-white/20 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none placeholder-white/30"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">
              Target Industry / Field:
            </label>
            <select
              value={targetField}
              onChange={(e) => setTargetField(e.target.value)}
              className="w-full p-2.5 bg-[#0A0A0A] border border-white/20 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
            >
              {POPULAR_FIELDS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">
              Target Position Title:
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Operations Lead"
              className="w-full p-2.5 bg-[#0A0A0A] border border-white/20 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* T.H.I.S. System Input & Work Progression Sliders */}
      <div className="bg-[#121212] border border-white/10 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Your Work Put In with the T.H.I.S. System
            </h3>
          </div>
          <span className="text-[11px] font-mono text-white/40">
            Adjust sliders to simulate hours invested & calibration drills
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tone Slider */}
          <div className="bg-[#0A0A0A] p-3.5 border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-emerald-400 font-bold">T • Tone & Demeanor</span>
              <span className="text-white font-bold">{toneScore}/100</span>
            </div>
            <input
              type="range"
              min="70"
              max="100"
              value={toneScore}
              onChange={(e) => setToneScore(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[10px] text-white/50">Vocal cadence, de-escalation & calm phrasing</p>
          </div>

          {/* Honesty Slider */}
          <div className="bg-[#0A0A0A] p-3.5 border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-cyan-400 font-bold">H • Honesty & Ethics</span>
              <span className="text-white font-bold">{ethicsScore}/100</span>
            </div>
            <input
              type="range"
              min="70"
              max="100"
              value={ethicsScore}
              onChange={(e) => setEthicsScore(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[10px] text-white/50">Compliance rigor, transparency & ethical safety</p>
          </div>

          {/* Pressure Slider */}
          <div className="bg-[#0A0A0A] p-3.5 border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-amber-400 font-bold">I • Impress Under Pressure</span>
              <span className="text-white font-bold">{pressureScore}/100</span>
            </div>
            <input
              type="range"
              min="70"
              max="100"
              value={pressureScore}
              onChange={(e) => setPressureScore(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <p className="text-[10px] text-white/50">Crisis equilibrium, live outage & emergency poise</p>
          </div>

          {/* Sustain Slider */}
          <div className="bg-[#0A0A0A] p-3.5 border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-purple-400 font-bold">S • Sustain & Drive</span>
              <span className="text-white font-bold">{driveScore}/100</span>
            </div>
            <input
              type="range"
              min="70"
              max="100"
              value={driveScore}
              onChange={(e) => setDriveScore(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <p className="text-[10px] text-white/50">Learning velocity, perseverance & culture alignment</p>
          </div>
        </div>

        {/* Practice Hours & Completed Modules Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-[#0A0A0A] p-3 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-mono text-white block">Dedicated Practice Hours</span>
                <span className="text-[10px] text-white/50">Time invested in civility scenarios</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHoursInvested((prev) => Math.max(1, prev - 1))}
                className="w-6 h-6 bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="font-mono text-sm font-bold text-emerald-400 px-2">{hoursInvested}h</span>
              <button
                type="button"
                onClick={() => setHoursInvested((prev) => prev + 1)}
                className="w-6 h-6 bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-[#0A0A0A] p-3 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-mono text-white block">Completed T.H.I.S. Drills</span>
                <span className="text-[10px] text-white/50">Simulations & video/audio evaluations</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDrillsCompleted((prev) => Math.max(1, prev - 1))}
                className="w-6 h-6 bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="font-mono text-sm font-bold text-cyan-400 px-2">{drillsCompleted}</span>
              <button
                type="button"
                onClick={() => setDrillsCompleted((prev) => prev + 1)}
                className="w-6 h-6 bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Prediction & Horizon Result Card */}
      {prediction && (
        <div className="space-y-6">
          {/* Top 3 Score Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1: Current Status */}
            <div className="bg-[#121212] border border-white/10 p-5 relative overflow-hidden">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">Current T.H.I.S. Status</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-mono font-bold text-white">{prediction.currentStatusScore}</span>
                <span className="text-xs font-mono text-white/40">/ 100</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 mt-3 overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${prediction.currentStatusScore}%` }} />
              </div>
              <p className="text-[11px] text-white/60 mt-2">
                Overall baseline evaluated from verified drills & voice/video scenarios.
              </p>
            </div>

            {/* Metric 2: Estimated Hiring Likelihood */}
            <div className="bg-[#121212] border border-emerald-500/40 p-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  Current Hiring Likelihood
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 font-mono text-[9px] uppercase border border-emerald-500/30">
                  Ready Match
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-mono font-bold text-emerald-400">{prediction.currentLikelihoodPercent}%</span>
                <span className="text-xs font-mono text-emerald-400/60">Estimated Probability</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 mt-3 overflow-hidden">
                <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${prediction.currentLikelihoodPercent}%` }} />
              </div>
              <p className="text-[11px] text-emerald-300/70 mt-2">
                Statistical probability of candidate hire at {customCompanyInput || targetCompany}.
              </p>
            </div>

            {/* Metric 3: Potential Upside Ceiling */}
            <div className="bg-[#121212] border border-amber-500/40 p-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  Potential Upside Ceiling
                </span>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 font-mono text-[9px] uppercase border border-amber-500/30">
                  With T.H.I.S. Polish
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-mono font-bold text-amber-400">{prediction.potentialUpsidePercent}%</span>
                <span className="text-xs font-mono text-amber-400/60">Max Projected Potential</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 mt-3 overflow-hidden">
                <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${prediction.potentialUpsidePercent}%` }} />
              </div>
              <p className="text-[11px] text-amber-300/70 mt-2">
                Gain +{prediction.potentialUpsidePercent - prediction.currentLikelihoodPercent}% with targeted calibration drills below.
              </p>
            </div>
          </div>

          {/* Analytical Summary Verdict */}
          <div className="bg-[#0A0A0A] border border-emerald-500/30 p-5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
                T.H.I.S. Predictive Assessment Verdict
              </h4>
              <p className="text-xs text-white/80 font-sans leading-relaxed">
                {prediction.summaryVerdict}
              </p>
            </div>
          </div>

          {/* Specific Area-by-Area Gap Analysis & Coaching */}
          <div className="bg-[#121212] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif italic text-lg text-white">Specific Areas to Improve for Maximum Hiring Probability</h3>
                <p className="text-xs text-white/50">
                  Targeted calibration steps tailored specifically to {customCompanyInput || targetCompany} & {targetField}.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-mono bg-white/5 text-white/60 px-2.5 py-1 border border-white/10">
                Actionable Coaching
              </span>
            </div>

            <div className="space-y-3">
              {prediction.criticalAreasToImprove.map((item, idx) => (
                <div key={idx} className="bg-[#0A0A0A] border border-white/10 p-4 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono flex items-center justify-center font-bold">
                        0{idx + 1}
                      </span>
                      <h4 className="text-xs font-mono uppercase text-white font-bold">{item.criterion}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-white/50">
                        Current: <strong className="text-white">{item.currentScore}</strong> → Target: <strong className="text-emerald-400">{item.targetScore}</strong>
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                        +{item.estimatedLikelihoodImpact}% Hire Probability
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-white/70 font-sans">{item.gapSummary}</p>

                  <div className="bg-[#141414] p-3 border-l-2 border-emerald-400 text-xs font-sans text-emerald-200">
                    <strong className="text-white block font-mono text-[10px] uppercase mb-0.5">T.H.I.S. Coach Recommendation:</strong>
                    {item.actionableCoaching}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Company Culture Profile & Hiring Insights */}
          <div className="bg-[#121212] border border-white/10 p-6 space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="font-serif italic text-lg text-white">Target Company Culture & Civility Ethos</h3>
              <p className="text-xs text-white/50">
                What recruiters and department leaders at {customCompanyInput || targetCompany} evaluate when reviewing candidates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0A0A0A] p-4 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase text-white/40 block">Culture Atmosphere & Vibe</span>
                <p className="text-xs text-white/80 font-sans">{prediction.targetCompanyCultureProfile.cultureVibe}</p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">Known Core Values:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {prediction.targetCompanyCultureProfile.knownValues.map((v, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/70 text-[10px] font-mono">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] p-4 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">What Hiring Managers Seek</span>
                <p className="text-xs text-white/80 font-sans">{prediction.targetCompanyCultureProfile.whatEmployersSeek}</p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">Top Archetype Synergies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {prediction.targetCompanyCultureProfile.keyPersonalityMatches.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Company Calibration Drill */}
          <div className="bg-[#141414] border border-emerald-500/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-serif italic text-lg text-white">
                    {prediction.recommendedPracticeScenario.title}
                  </h3>
                  <p className="text-xs text-white/50">
                    Live interactive simulation prompt tailored specifically to this company's hiring standards.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 uppercase font-bold">
                Instant Recalibration
              </span>
            </div>

            <div className="bg-[#0A0A0A] p-4 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold">Simulation Prompt:</span>
              <p className="text-xs text-white/90 font-sans italic">
                "{prediction.recommendedPracticeScenario.scenarioPrompt}"
              </p>
              <div className="text-[11px] font-mono text-emerald-400/80 pt-1">
                Goal: {prediction.recommendedPracticeScenario.evaluationGoal}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase text-white/60">
                Your Measured Response to Test for {customCompanyInput || targetCompany}:
              </label>
              <textarea
                rows={4}
                value={practiceResponse}
                onChange={(e) => setPracticeResponse(e.target.value)}
                placeholder="Type your diplomatic, measured response demonstrating composure, accountability, and clear problem solving..."
                className="w-full p-3 bg-[#0A0A0A] border border-white/20 text-xs text-white font-sans focus:border-emerald-400 focus:outline-none placeholder-white/30"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleEvaluatePracticeScenario}
                disabled={isEvaluatingPractice || !practiceResponse.trim()}
                className={`px-5 py-2.5 font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  practiceResponse.trim()
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md'
                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEvaluatingPractice ? 'Evaluating & Recalibrating...' : 'Evaluate & Recalibrate Likelihood'}</span>
              </button>

              {practiceFeedback && (
                <div className="text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 p-2.5 animate-fadeIn">
                  {practiceFeedback}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
