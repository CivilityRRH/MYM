import React from 'react';
import { ArchetypeProjection } from '../types';
import { ShieldCheck, Compass, Zap, Scale, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

interface ArchetypeProjectionCardProps {
  archetype: ArchetypeProjection;
  compact?: boolean;
}

export const ArchetypeProjectionCard: React.FC<ArchetypeProjectionCardProps> = ({ archetype, compact = false }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Executive Strategist':
        return <Compass className="w-5 h-5 text-amber-400" />;
      case 'Crisis Resilient Leader':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Ethical Sentinel':
        return <Scale className="w-5 h-5 text-cyan-400" />;
      case 'Adaptive Catalyst':
        return <Zap className="w-5 h-5 text-purple-400" />;
      case 'Pragmatic Operator':
        return <Cpu className="w-5 h-5 text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Executive Strategist':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Crisis Resilient Leader':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Ethical Sentinel':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Adaptive Catalyst':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Pragmatic Operator':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  const dimensionsList = [
    { label: 'Resilience & Grit', value: archetype.dimensions.resilience, color: 'bg-emerald-500' },
    { label: 'Ethics & Integrity', value: archetype.dimensions.ethicsIntegrity, color: 'bg-cyan-500' },
    { label: 'Diplomatic Tact', value: archetype.dimensions.diplomaticTact, color: 'bg-amber-500' },
    { label: 'High-Pressure Composure', value: archetype.dimensions.highPressureComposure, color: 'bg-purple-500' },
    { label: 'Innovation Drive', value: archetype.dimensions.innovationDrive, color: 'bg-blue-500' },
  ];

  if (compact) {
    return (
      <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(archetype.primaryCategory)}
            <span className="font-semibold text-neutral-100 text-sm">{archetype.title}</span>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getCategoryBadgeColor(archetype.primaryCategory)} font-mono`}>
            {archetype.primaryCategory}
          </span>
        </div>
        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{archetype.summary}</p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {dimensionsList.slice(0, 4).map((dim, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>{dim.label}</span>
                <span className="font-mono text-neutral-200">{dim.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className={`h-full ${dim.color} rounded-full`} style={{ width: `${dim.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/80 shadow-2xl relative overflow-hidden space-y-6">
      {/* Decorative subtle backdrop ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
              {getCategoryIcon(archetype.primaryCategory)}
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-neutral-100">{archetype.title}</h3>
              <p className="text-xs text-neutral-400">Unique Applicant Behavioral Archetype Projection</p>
            </div>
          </div>
        </div>
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${getCategoryBadgeColor(archetype.primaryCategory)}`}>
            <Sparkles className="w-3.5 h-3.5" />
            {archetype.primaryCategory}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/60">
        <p className="text-sm text-neutral-300 leading-relaxed italic">
          "{archetype.summary}"
        </p>
      </div>

      {/* Dimensional Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Archetype Trait Dimensions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensionsList.map((dim, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/40 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300 font-medium">{dim.label}</span>
                <span className="font-mono text-neutral-100 font-bold">{dim.value}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${dim.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${dim.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Behavioral Traits & Optimal Environment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/40 space-y-2.5">
          <h4 className="text-xs font-mono text-amber-400/90 uppercase tracking-wider">Key Behavioral Attributes</h4>
          <ul className="space-y-1.5">
            {archetype.keyBehavioralTraits.map((trait, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{trait}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/40 space-y-2">
          <h4 className="text-xs font-mono text-cyan-400/90 uppercase tracking-wider">Optimal Team Environment</h4>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {archetype.optimalWorkEnvironment}
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500 border-t border-neutral-800/60">
            <span>Projection Verified</span>
            <span>{new Date(archetype.generatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
