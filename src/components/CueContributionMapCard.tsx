import React, { useState } from 'react';
import { CueContributionItem } from '../types';
import {
  Activity,
  Layers,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CueContributionMapCardProps {
  cueMap?: CueContributionItem[];
  title?: string;
  jobAdequacyScore?: number;
  culturalFitScore?: number;
  proceduralRigorScore?: number;
}

export const CueContributionMapCard: React.FC<CueContributionMapCardProps> = ({
  cueMap = [],
  title = 'Acoustic & Optical Cue Contribution Matrix',
  jobAdequacyScore,
  culturalFitScore,
  proceduralRigorScore
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!cueMap || cueMap.length === 0) return null;

  const categories = [
    { id: 'all', label: 'All Cues' },
    { id: 'Acoustic / Vocal', label: 'Acoustic & Vocal' },
    { id: 'Kinesic / Physical', label: 'Kinesic & Vision' },
    { id: 'Semantic / Command', label: 'Semantic & Command' }
  ];

  const filteredCues = selectedCategory === 'all'
    ? cueMap
    : cueMap.filter(c => c.category === selectedCategory);

  const displayedCues = isExpanded ? filteredCues : filteredCues.slice(0, 6);

  const formatImpact = (val: number) => {
    if (val > 0) return `+${val} pts`;
    if (val < 0) return `${val} pts`;
    return '0 pts';
  };

  const getImpactColor = (val: number) => {
    if (val > 0) return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    if (val < 0) return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
    return 'text-zinc-400 bg-zinc-900 border-zinc-800';
  };

  return (
    <div className="bg-gradient-to-br from-zinc-950 via-black to-zinc-950 border border-cyan-500/30 p-5 sm:p-6 rounded-2xl space-y-4 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
              {title}
            </h5>
            <span className="text-[10px] text-zinc-400 font-mono">
              Scientific Telemetry • Weighted Job Adequacy & Cultural Fit Contribution
            </span>
          </div>
        </div>

        {/* Aggregate Pillar Scores if provided */}
        {(jobAdequacyScore !== undefined || culturalFitScore !== undefined || proceduralRigorScore !== undefined) && (
          <div className="flex items-center gap-2 font-mono text-[11px]">
            {jobAdequacyScore !== undefined && (
              <span className="bg-purple-950/40 border border-purple-500/40 px-2 py-0.5 rounded-md text-purple-300">
                Adequacy: <strong>{jobAdequacyScore}%</strong>
              </span>
            )}
            {culturalFitScore !== undefined && (
              <span className="bg-emerald-950/40 border border-emerald-500/40 px-2 py-0.5 rounded-md text-emerald-300">
                Fit: <strong>{culturalFitScore}%</strong>
              </span>
            )}
            {proceduralRigorScore !== undefined && (
              <span className="bg-cyan-950/40 border border-cyan-500/40 px-2 py-0.5 rounded-md text-cyan-300">
                Rigor: <strong>{proceduralRigorScore}%</strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-[10px] font-mono px-2.5 py-1 rounded-lg transition-all ${
              selectedCategory === cat.id
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 font-bold'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cues Table / Cards */}
      <div className="space-y-2.5">
        {displayedCues.map((cue, idx) => (
          <div
            key={idx}
            className="bg-black/70 border border-zinc-800 hover:border-zinc-700 p-3.5 rounded-xl space-y-2 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white">
                  {cue.cueName}
                </span>
                <span className="text-[10px] font-mono text-cyan-300/80 bg-cyan-950/30 border border-cyan-500/20 px-2 py-0.5 rounded">
                  {cue.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                  Value: <strong className="text-white">{cue.measuredValue}</strong>
                </span>
              </div>
            </div>

            {/* Impact Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60 flex items-center justify-between">
                <span className="text-zinc-400 text-[10px] uppercase">Job Adequacy Impact:</span>
                <span className={`px-2 py-0.5 rounded font-bold border ${getImpactColor(cue.impactOnAdequacy)}`}>
                  {formatImpact(cue.impactOnAdequacy)}
                </span>
              </div>
              <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60 flex items-center justify-between">
                <span className="text-zinc-400 text-[10px] uppercase">Cultural Fit Impact:</span>
                <span className={`px-2 py-0.5 rounded font-bold border ${getImpactColor(cue.impactOnCulturalFit)}`}>
                  {formatImpact(cue.impactOnCulturalFit)}
                </span>
              </div>
            </div>

            {/* Scientific Rationale */}
            <p className="text-[11px] text-zinc-300 leading-relaxed font-sans pl-1 border-l-2 border-cyan-500/40">
              {cue.rationale}
            </p>
          </div>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {filteredCues.length > 6 && (
        <div className="flex justify-center pt-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 py-1 px-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-950/50 transition-all"
          >
            {isExpanded ? (
              <>
                Show Fewer Cues <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Show All {filteredCues.length} Cues <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
