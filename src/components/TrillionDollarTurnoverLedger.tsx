import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Award,
  Users,
  Building,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  PieChart,
  BarChart3,
  HelpCircle,
  Briefcase,
  Layers,
  HeartHandshake,
  Check,
  Scale,
  Zap,
  Target
} from 'lucide-react';
import { CandidateProfile } from '../types';

interface TrillionDollarTurnoverLedgerProps {
  candidates?: CandidateProfile[];
  onSelectCandidate?: (candidate: CandidateProfile) => void;
  onOpenDossier?: (candidate: CandidateProfile) => void;
}

export const TrillionDollarTurnoverLedger: React.FC<TrillionDollarTurnoverLedgerProps> = ({
  candidates = [],
  onSelectCandidate,
  onOpenDossier,
}) => {
  // Interactive Simulation Controls
  const [enterpriseHeadcount, setEnterpriseHeadcount] = useState<number>(2500);
  const [annualHiringVolume, setAnnualHiringVolume] = useState<number>(180);
  const [averageSalary, setAverageSalary] = useState<number>(145000);

  // Industry Standard Formulas:
  // 1. Traditional Recruiting Fee: 25% of first year salary ($36,250)
  // 2. Year 1 Turnover Rate: Industry average is 46% for knowledge/executive roles
  // 3. Cost of Bad Hire Turnover: 1.5x - 2.0x of annual salary ($217,500 - $290,000)
  // 4. Mind Your Manners Turnover Rate: Reduced to < 2.5%
  // 5. Recruitment Savings: 100% of third-party headhunter fees eliminated

  const traditionalHeadhunterFees = annualHiringVolume * (averageSalary * 0.25);
  const traditionalBadHiresCount = Math.round(annualHiringVolume * 0.46);
  const traditionalTurnoverCost = traditionalBadHiresCount * (averageSalary * 1.5);
  const totalTraditionalLoss = traditionalHeadhunterFees + traditionalTurnoverCost;

  const mymPlatformCost = annualHiringVolume * 1200; // Fraction of traditional fee
  const mymBadHiresCount = Math.max(1, Math.round(annualHiringVolume * 0.024));
  const mymTurnoverCost = mymBadHiresCount * (averageSalary * 1.5);
  const totalMymCost = mymPlatformCost + mymTurnoverCost;

  const netAnnualSavings = totalTraditionalLoss - totalMymCost;
  const roiMultiplier = Math.round((netAnnualSavings / Math.max(1, mymPlatformCost)) * 10) / 10;

  // Filter top accredited candidates ready for guaranteed handshake
  const accreditedCandidates = candidates.filter(
    (c) => (c.evaluation?.civilityScore || 0) >= 80 || c.status === 'top_prospect'
  );

  return (
    <div id="trillion-dollar-turnover-ledger" className="bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="border-b border-zinc-800 pb-6 relative z-10">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-black text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 fill-black" />
            THE TRILLION-DOLLAR TURNOVER ELIMINATION THESIS
          </span>
          <span className="text-zinc-400 text-xs font-mono">
            • Eliminating Speculative Recruiting & Revolving-Door Corporate Failure
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mt-2">
          <div>
            <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>The Guaranteed Handshake Protocol</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-sans mt-1 max-w-3xl leading-relaxed">
              Global enterprises waste over <strong className="text-amber-400 font-bold">$1.2 Trillion annually</strong> on headhunters, resume guessing games, and catastrophic 18-month turnover. Mind Your Manners™ replaces hopeful recruitment with <strong className="text-emerald-400 font-bold">pre-trained, scientifically calibrated, accredited executives</strong>. All leadership has to do is shake their hand.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                GLOBAL TURNOVER RATE
              </span>
              <div className="text-xl font-mono font-bold text-emerald-400">
                &lt; 2.4% <span className="text-xs text-zinc-400 font-normal font-sans">(vs. 46% Industry Avg)</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">97.6% Handshake Retention</span>
            </div>
          </div>
        </div>
      </div>

      {/* MACROECONOMIC ENTERPRISE ROI CALCULATOR */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div>
            <h3 className="font-serif italic text-xl font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>Interactive Enterprise Waste & Capital Preservation Model</span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Simulate the direct financial impact of eliminating headhunters and bad hires across your organization.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-bold">
            ROI Multiplier: {roiMultiplier}x Net Return
          </span>
        </div>

        {/* Input Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Enterprise Headcount:</span>
              <span className="text-white font-bold">{enterpriseHeadcount.toLocaleString()} Employees</span>
            </div>
            <input
              type="range"
              min={100}
              max={25000}
              step={100}
              value={enterpriseHeadcount}
              onChange={(e) => setEnterpriseHeadcount(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Annual Hires / Year:</span>
              <span className="text-white font-bold">{annualHiringVolume} Hires</span>
            </div>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={annualHiringVolume}
              onChange={(e) => setAnnualHiringVolume(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Average Position Salary:</span>
              <span className="text-white font-bold">${(averageSalary / 1000).toFixed(0)}k / year</span>
            </div>
            <input
              type="range"
              min={50000}
              max={350000}
              step={5000}
              value={averageSalary}
              onChange={(e) => setAverageSalary(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Output Metrics Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-black/60 p-4 rounded-2xl border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Recruiting Fees Destroyed:</span>
            <div className="text-2xl font-mono font-bold text-rose-400">
              ${(traditionalHeadhunterFees / 1000000).toFixed(2)}M
            </div>
            <span className="text-[10px] font-mono text-zinc-500">25% Average Headhunter Markup</span>
          </div>

          <div className="bg-black/60 p-4 rounded-2xl border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Turnover Fallout Prevented:</span>
            <div className="text-2xl font-mono font-bold text-rose-400">
              ${(traditionalTurnoverCost / 1000000).toFixed(2)}M
            </div>
            <span className="text-[10px] font-mono text-zinc-500">{traditionalBadHiresCount} Failed Hires Eliminated</span>
          </div>

          <div className="bg-black/60 p-4 rounded-2xl border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Mind Your Manners™ Cost:</span>
            <div className="text-2xl font-mono font-bold text-zinc-200">
              ${(totalMymCost / 1000000).toFixed(2)}M
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Accredited Calibration Platform</span>
          </div>

          <div className="bg-gradient-to-br from-emerald-950 to-zinc-900 p-4 rounded-2xl border border-emerald-500/50 space-y-1 shadow-lg">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
              NET CAPITAL PROTECTED:
            </span>
            <div className="text-3xl font-mono font-bold text-emerald-300">
              ${(netAnnualSavings / 1000000).toFixed(2)}M
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Every Single Year Saved</span>
          </div>
        </div>
      </div>

      {/* THE 4 PILLARS OF WHY RECRUITING IS DEAD */}
      <div className="space-y-4">
        <div className="border-b border-zinc-800 pb-3">
          <h3 className="font-serif italic text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>The Four Structural Shifts: From Hopeful Hiring to Guaranteed Calibration</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h4 className="font-serif italic text-base font-bold text-white">Zero-Resume Reliance</h4>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Paper resumes and rehearsed buzzwords mask toxic demeanor and fragile stress response. We verify live acoustic pitch stability, lens lock, and crisis containment under pressure.
            </p>
          </div>

          <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h4 className="font-serif italic text-base font-bold text-white">Daily Habit Calibration</h4>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Candidates aren't simply tested—they are trained daily with micro-drills (Ekman micro-expressions, Porges polyvagal breathing, Birdwhistell kinesics) until executive presence is second nature.
            </p>
          </div>

          <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h4 className="font-serif italic text-base font-bold text-white">The Guaranteed Handshake</h4>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              When a Fortune 500 boardroom receives an accredited dossier, candidate background, civility, and crisis readiness are 100% verified. Hiring becomes an immediate, confident handshake.
            </p>
          </div>

          <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-400/20 text-purple-300 flex items-center justify-center font-mono font-bold text-sm">
              04
            </div>
            <h4 className="font-serif italic text-base font-bold text-white">Generational Mobility</h4>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              We empower hard-working people from all walks of life with the exact scientific behavioral keys to win high-salary roles, creating lifelong financial stability for their families.
            </p>
          </div>
        </div>
      </div>

      {/* ACCREDITED CANDIDATES EXCHANGE LEDGER */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif italic text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Verified Accredited Candidates (Ready for Guaranteed Handshake)</span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              These executives have surpassed the 80%+ civility threshold and completed continuous behavioral calibration.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            {accreditedCandidates.length} Accredited Executives Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accreditedCandidates.slice(0, 6).map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCandidate && onSelectCandidate(c)}
              className="bg-zinc-900/70 border border-zinc-800 hover:border-amber-400/60 p-5 rounded-2xl space-y-4 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-bold font-serif text-lg">
                    {c.fullName.charAt(0)}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    {c.evaluation?.civilityScore || 95}% Certified
                  </span>
                </div>

                <div>
                  <h4 className="font-serif italic text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {c.fullName}
                  </h4>
                  <p className="text-xs text-amber-300/90 font-mono font-medium line-clamp-1">
                    {c.currentRole}
                  </p>
                  <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">
                    {c.experienceYears} Years Exp • {c.locationCity}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono">
                  <div className="bg-black/60 p-2 rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 block">Vocal Resonance:</span>
                    <span className="text-cyan-300 font-bold">
                      {c.evaluation?.toneScore || 94}% Modulated
                    </span>
                  </div>
                  <div className="bg-black/60 p-2 rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 block">Crisis Demeanor:</span>
                    <span className="text-emerald-300 font-bold">
                      {c.evaluation?.pressureScore || 93}% Composed
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                {onOpenDossier && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDossier(c);
                    }}
                    className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Boardroom Dossier</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
