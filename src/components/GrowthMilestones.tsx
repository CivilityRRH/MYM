import React from 'react';
import { EmployeeJourneyRecord } from '../types';
import { Award, ShieldCheck, Trophy, Zap, CheckCircle2, Star, Target, Sparkles, Lock, TrendingUp } from 'lucide-react';

interface GrowthMilestonesProps {
  employee: EmployeeJourneyRecord;
}

export interface BadgeItem {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export const GrowthMilestones: React.FC<GrowthMilestonesProps> = ({ employee }) => {
  const currentScore = employee.overallCurrentScore || 85;
  const completedModulesCount = employee.scorecardHistory ? employee.scorecardHistory.length : 1;

  // Determine Level Rank Progress
  let nextRank = 'Senior Ethics Certified';
  let targetScore = 90;
  let progressPercent = Math.min(100, Math.round((currentScore / 90) * 100));

  if (currentScore >= 95) {
    nextRank = 'Master Ambassador (Top Tier)';
    targetScore = 100;
    progressPercent = 100;
  } else if (currentScore >= 90) {
    nextRank = 'Executive Crisis Master';
    targetScore = 95;
    progressPercent = Math.min(100, Math.round(((currentScore - 90) / 5) * 100));
  } else if (currentScore >= 80) {
    nextRank = 'Senior Ethics Certified';
    targetScore = 90;
    progressPercent = Math.min(100, Math.round(((currentScore - 80) / 10) * 100));
  } else {
    nextRank = 'Civility Practitioner';
    targetScore = 80;
    progressPercent = Math.min(100, Math.round((currentScore / 80) * 100));
  }

  // Milestones & Training Goal Progress
  const trainingGoals = [
    { title: 'Vocal Tone Moderation & Stress Control', target: '95 Score', current: Math.min(100, currentScore + 2), percent: Math.min(100, currentScore + 2) },
    { title: 'Ethics, Compliance & PII Safety', target: 'Mastery Level', current: 98, percent: 98 },
    { title: 'De-escalation Under Live Outage Pressure', target: 'Certified', current: completedModulesCount >= 2 ? 100 : 65, percent: completedModulesCount >= 2 ? 100 : 65 },
    { title: 'Executive Diplomacy & Team Mentorship', target: 'Advanced', current: Math.min(100, currentScore - 5), percent: Math.min(100, currentScore - 5) },
  ];

  // Unlocked Badges list based on real employee scores & module history
  const badges: BadgeItem[] = [
    {
      id: 'b1',
      title: 'Airtight Composure',
      category: 'Tone & Composure',
      description: 'Sustained a vocal tone score above 90 during live crisis scenario testing.',
      iconName: 'Zap',
      unlocked: currentScore >= 85,
      unlockedDate: '2025-11-10'
    },
    {
      id: 'b2',
      title: 'Ethics Vanguard',
      category: 'Compliance',
      description: 'Achieved 100% compliance on T.H.I.S. protocol and PII data protection modules.',
      iconName: 'ShieldCheck',
      unlocked: true,
      unlockedDate: '2025-08-14'
    },
    {
      id: 'b3',
      title: 'Crisis First Responder',
      category: 'Simulations',
      description: 'Successfully navigated live outage de-escalation high-pressure simulation.',
      iconName: 'Trophy',
      unlocked: completedModulesCount >= 2,
      unlockedDate: completedModulesCount >= 2 ? '2026-03-22' : undefined
    },
    {
      id: 'b4',
      title: 'Master Civility Ambassador',
      category: 'Leadership',
      description: 'Completed 5+ recurring quarterly refresher modules with top tier grades.',
      iconName: 'Star',
      unlocked: completedModulesCount >= 5,
      unlockedDate: completedModulesCount >= 5 ? '2026-06-20' : undefined
    },
    {
      id: 'b5',
      title: 'T.H.I.S. Sustainer',
      category: 'Sustained Excellence',
      description: 'Maintained positive score growth across 3 consecutive quarterly reviews.',
      iconName: 'Sparkles',
      unlocked: currentScore >= 92,
      unlockedDate: currentScore >= 92 ? '2026-07-01' : undefined
    },
    {
      id: 'b6',
      title: 'Flawless Onboarding',
      category: 'Milestone',
      description: 'Scored above 80% on all baseline onboarding ethics questions.',
      iconName: 'CheckCircle2',
      unlocked: true,
      unlockedDate: employee.hireDate || '2025-03-15'
    }
  ];

  return (
    <div className="bg-[#121212] border border-amber-500/30 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 bg-amber-500/10 px-2 py-0.5 border border-amber-500/30">
              Employee View • Personal Trajectory
            </span>
            <span className="text-white/40 text-xs font-mono">• T.H.I.S. Growth Milestone</span>
          </div>
          <h3 className="font-serif italic text-2xl text-white mt-1">Growth Milestones & Skill Progression</h3>
          <p className="text-xs text-white/60 mt-1 font-sans">
            Track your journey toward higher civility certifications, training goals, and unlocked achievement seals.
          </p>
        </div>

        <div className="bg-[#0A0A0A] p-3 border border-amber-500/30 text-right min-w-[160px]">
          <span className="text-[10px] font-mono text-white/40 uppercase block">Current Tier</span>
          <span className="text-sm font-serif italic text-amber-300 font-bold block">{employee.certificationLevel}</span>
          <span className="text-xs font-mono text-emerald-400 font-bold block">{currentScore} Overall Score</span>
        </div>
      </div>

      {/* 1. Certification Level Progress Bar */}
      <div className="bg-[#1A1A1A] border border-white/10 p-5 space-y-3 font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>Next Milestone Rank:</span>
            </span>
            <h4 className="font-serif italic text-lg text-white font-bold">{nextRank}</h4>
          </div>
          <div className="text-right font-mono text-xs text-white/60">
            Target Threshold: <span className="text-amber-300 font-bold">{targetScore} PTS</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-white/60">Milestone Progress</span>
            <span className="text-emerald-400 font-bold">{progressPercent}% Achieved</span>
          </div>
          <div className="w-full bg-[#0A0A0A] border border-white/10 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Visual Progress Bars for Individual Training Goals */}
      <div className="space-y-3">
        <h4 className="font-serif italic text-base text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Training Goal Progress Bars</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trainingGoals.map((goal, idx) => (
            <div key={idx} className="bg-[#0A0A0A] border border-white/10 p-4 space-y-2">
              <div className="flex justify-between items-start text-xs font-sans">
                <span className="font-semibold text-white">{goal.title}</span>
                <span className="font-mono text-amber-300 text-[11px] font-bold shrink-0 ml-2">{goal.percent}%</span>
              </div>
              <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${goal.percent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/40">
                <span>Current Status</span>
                <span>Goal: {goal.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Unlocked Badges & Achievements Gallery */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="font-serif italic text-base text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Unlocked Badges & Achievement Seals ({badges.filter(b => b.unlocked).length} / {badges.length})</span>
          </h4>
          <span className="text-[10px] font-mono text-white/40 uppercase">Earned via T.H.I.S. Testing</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`p-4 border transition-all flex flex-col justify-between space-y-3 ${
                  badge.unlocked
                    ? 'bg-[#181818] border-amber-500/40 text-white shadow-lg'
                    : 'bg-[#0A0A0A] border-white/5 text-white/40 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
                      badge.unlocked
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                        : 'bg-white/5 border-white/10 text-white/30'
                    }`}>
                      {badge.unlocked ? <Sparkles className="w-5 h-5 text-amber-300" /> : <Lock className="w-4 h-4 text-white/30" />}
                    </div>

                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${
                      badge.unlocked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-white/30'
                    }`}>
                      {badge.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest block">{badge.category}</span>
                    <h5 className="font-serif italic text-sm font-bold text-white mt-0.5">{badge.title}</h5>
                    <p className="text-[11px] font-sans text-white/70 mt-1 leading-relaxed">{badge.description}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[9px] font-mono text-white/40">
                  <span>{badge.unlocked ? `Unlocked ${badge.unlockedDate || '2026'}` : 'Complete Refresher to Unlock'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
