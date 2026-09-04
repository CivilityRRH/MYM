import React, { useState } from 'react';
import { PositiveArchetypeProfile } from '../types';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Award,
  Zap,
  Scale,
  Heart,
  Lightbulb,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  Share2,
  RotateCcw,
  UserCheck,
  Building2,
  Sliders
} from 'lucide-react';

interface PositiveArchetypeProfilerProps {
  candidateName?: string;
  targetRole?: string;
  resumeText?: string;
  initialProfile?: PositiveArchetypeProfile | null;
  onSaveProfile?: (profile: PositiveArchetypeProfile) => void;
}

const PRESET_ARCHETYPES: Array<{
  id: string;
  name: string;
  tagline: string;
  rarity: string;
  icon: any;
  color: string;
  borderColor: string;
  bgColor: string;
  strengths: string[];
  processSummary: string;
  employerSynergy: string;
  candidatePitch: string;
  assets: {
    diplomaticGrace: number;
    ethicalAnchor: number;
    pressureEquilibrium: number;
    collaborativeEmpathy: number;
    strategicVision: number;
    adaptiveResilience: number;
  };
  environments: string[];
  badges: string[];
}> = [
  {
    id: 'diplomatic-anchor',
    name: 'The Diplomatic Anchor',
    tagline: 'Radiates calming emotional equilibrium and converts complex organizational tension into unified momentum.',
    rarity: 'Distinctive Asset • Top 6% Character Rarity',
    icon: Compass,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/10',
    strengths: [
      'Effortless De-escalation: Maintains measured vocal cadence and respectful listening during friction',
      'Ethical Steadfastness: Protects corporate integrity and trust without stalling execution velocity',
      'Constructive Empathy: Translates opposing stakeholder viewpoints into collaborative consensus',
      'Perpetual Growth Velocity: Rapidly absorbs new organizational protocols and inspires team elevation'
    ],
    processSummary: 'You approach problems with deep, meditative clarity. Rather than reacting impulsively to deadline pressures or shifting demands, you create a buffer of thoughtful composure that allows teams to identify high-leverage solutions. Your distinct cognitive method blends rigorous structural logic with exceptional interpersonal diplomacy.',
    employerSynergy: 'Where past teams may have suffered from interpersonal friction, rushed communications, or burnout, bringing this candidate into the role introduces a stabilizing force of nature. Their rare diplomatic composure de-escalates stress across the team, preserves psychological safety, and ensures cross-functional alignment.',
    candidatePitch: '"My greatest professional asset is my ability to bring stabilizing diplomatic clarity and unwavering ethical composure to high-velocity environments. Where high-stakes situations often create friction, I systematically translate complexity into calm, actionable consensus."',
    assets: {
      diplomaticGrace: 97,
      ethicalAnchor: 98,
      pressureEquilibrium: 95,
      collaborativeEmpathy: 96,
      strategicVision: 92,
      adaptiveResilience: 94
    },
    environments: [
      'High-impact enterprise divisions navigating organizational change',
      'Cross-functional teams requiring strong diplomatic bridge-building',
      'Mission-critical operations where composure is essential'
    ],
    badges: ['Diplomatic Master Ambassador', 'Crisis Equilibrium Certified', 'Ethical Sentinel', 'Consensus Architect']
  },
  {
    id: 'strategic-harmonizer',
    name: 'The Strategic Harmonizer',
    tagline: 'Synthesizes multifaceted viewpoints into unified, voluntary team consensus with high emotional intelligence.',
    rarity: 'Distinctive Asset • Top 5% Character Rarity',
    icon: Scale,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    bgColor: 'bg-cyan-500/10',
    strengths: [
      'Holistic Synthesis: Sees interconnected dependencies that others overlook',
      'Active Listening Mastery: Validates all viewpoints while steering toward optimal outcomes',
      'Principled Moderation: Keeps discussions grounded in facts and organizational mission',
      'High Psychological Safety: Fosters an environment where team members contribute their best'
    ],
    processSummary: 'Your process is characterized by integrative listening and strategic pattern recognition. You naturally map out human and operational dynamics before proposing a path forward, ensuring that every stakeholder feels heard and committed to the shared objective.',
    employerSynergy: 'Ideal for departments that previously experienced siloed thinking or territorial friction. This profile repairs cross-functional handoffs, bridges engineering and executive perspectives, and elevates collective trust.',
    candidatePitch: '"I specialize in unifying diverse, high-performing teams around complex strategic goals. I excel at identifying shared values across departments and creating high-trust workflows that execute with speed and civility."',
    assets: {
      diplomaticGrace: 96,
      ethicalAnchor: 95,
      pressureEquilibrium: 93,
      collaborativeEmpathy: 98,
      strategicVision: 96,
      adaptiveResilience: 92
    },
    environments: [
      'Matrixed organizations and cross-functional task forces',
      'Strategic transformation and post-merger integration',
      'Product and engineering bridge leadership'
    ],
    badges: ['Consensus Luminary', 'High-EQ Strategist', 'Cross-Functional Bridge', 'Trust Catalyst']
  },
  {
    id: 'resilient-pioneer',
    name: 'The Resilient Pioneer',
    tagline: 'Thrives in unprecedented operational ambiguity, turning complex friction into structured, joyful momentum.',
    rarity: 'Rare High-Impact Catalyst • Top 4% Character Rarity',
    icon: Zap,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-500/10',
    strengths: [
      'Unfazed by Ambiguity: Establishes clear operating frameworks where none existed before',
      'Rapid Breakthrough Velocity: Transforms obstacles into creative opportunities for learning',
      'Infectious Optimism: Energizes teammates during challenging phases with resilient enthusiasm',
      'Tenacious Problem Solving: Persists with graceful determination through complex technical blocks'
    ],
    processSummary: 'You thrive when exploring uncharted territory. Where others see confusion, you see a blank canvas for structured innovation. Your process is iterative, fearless, and deeply grounded in continuous refinement.',
    employerSynergy: 'Replaces past inertia or fear of failure with energetic momentum. Teams that lacked initiative or were paralyzed by change will accelerate rapidly under this candidate\'s positive influence.',
    candidatePitch: '"I excel in ambiguous, zero-to-one challenges where adaptability and creative grit are needed most. I love establishing order out of complexity and lifting team morale while driving toward measurable milestones."',
    assets: {
      diplomaticGrace: 91,
      ethicalAnchor: 94,
      pressureEquilibrium: 97,
      collaborativeEmpathy: 93,
      strategicVision: 95,
      adaptiveResilience: 99
    },
    environments: [
      'High-growth initiatives and innovation labs',
      'Rapid turnaround and restructuring environments',
      'New market expansion and pioneering projects'
    ],
    badges: ['Pioneer Catalyst', 'Grit Master', 'Adaptive Luminary', 'Ambiguity Navigator']
  },
  {
    id: 'systems-luminary',
    name: 'The Systems Luminary',
    tagline: 'Combines meticulous ethical rigor with elegant structural logic to design scalable, enduring operations.',
    rarity: 'Distinctive Specialist • Top 5% Character Rarity',
    icon: Lightbulb,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/10',
    strengths: [
      'Second-Order Thinking: Anticipates long-term implications and edge-case risks accurately',
      'Ethical Architecture: Builds workflows that make compliance and security seamless',
      'Clarity in Complexity: Distills massive data and multi-variable problems into intuitive systems',
      'Refined Mentorship: Elevates team technical standards through generous knowledge sharing'
    ],
    processSummary: 'Your thinking operates like an elegant blueprint. You analyze systems from the foundation up, identifying root causes rather than treating superficial symptoms. You are calm, thorough, and dedicated to enduring excellence.',
    employerSynergy: 'Solves past reliability issues, technical debt, or recurring operational oversights. Introducing this profile provides long-term stability and bulletproof operational discipline.',
    candidatePitch: '"My strength lies in architectural clarity and long-term systems thinking. I build durable, ethical workflows that enable organizations to scale securely without sacrificing speed or team well-being."',
    assets: {
      diplomaticGrace: 92,
      ethicalAnchor: 99,
      pressureEquilibrium: 94,
      collaborativeEmpathy: 91,
      strategicVision: 98,
      adaptiveResilience: 93
    },
    environments: [
      'Mission-critical infrastructure and enterprise systems',
      'Governance, risk, and regulatory architecture',
      'Complex technical and operational scaling'
    ],
    badges: ['Systems Architect', 'Zero-Defect Mindset', 'Ethical Luminary', 'Long-Horizon Strategist']
  },
  {
    id: 'empathic-catalyst',
    name: 'The Empathic Catalyst',
    tagline: 'Champions team psychological safety, elevates morale under pressure, and unlocks latent potential in others.',
    rarity: 'Distinctive Asset • Top 7% Character Rarity',
    icon: Heart,
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    bgColor: 'bg-rose-500/10',
    strengths: [
      'Deep Emotional Intelligence: Senses unspoken team needs and dissolves friction early',
      'Inclusive Leadership: Ensures all contributors are empowered to share innovative ideas',
      'Calm Compassionate Presence: Maintains respect and warmth even in high-stress deliverables',
      'Culture Accelerator: Builds an authentic, collaborative team atmosphere where people thrive'
    ],
    processSummary: 'You recognize that human alignment is the engine of all operational achievement. Your process centers on building deep trust, clarity of purpose, and empathetic support so every team member can perform at their highest level.',
    employerSynergy: 'Heals toxic or high-turnover team histories. Replaces defensiveness and anxiety with an empowering culture of mutual support and shared accountability.',
    candidatePitch: '"I believe the best results come from high-trust, psychologically safe teams. I bring deep emotional intelligence and collaborative energy that empowers everyone around me to do their best work."',
    assets: {
      diplomaticGrace: 98,
      ethicalAnchor: 96,
      pressureEquilibrium: 92,
      collaborativeEmpathy: 99,
      strategicVision: 91,
      adaptiveResilience: 95
    },
    environments: [
      'Healthcare, clinical, and human-centered organizations',
      'High-velocity creative and collaborative teams',
      'People operations, talent development, and culture leadership'
    ],
    badges: ['Empathy Master', 'Culture Champion', 'Psychological Safety Anchor', 'Team Catalyst']
  },
  {
    id: 'pragmatic-guardian',
    name: 'The Pragmatic Guardian',
    tagline: 'Exemplifies steadfast integrity, disciplined execution, and dependable protection of corporate standards.',
    rarity: 'Distinctive Specialist • Top 5% Character Rarity',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/10',
    strengths: [
      'Unwavering Reliability: Always delivers on commitments with meticulous precision',
      'Risk Mitigation: Spots compliance and security vulnerabilities before they escalate',
      'Quiet Leadership: Leads by exemplary personal standard and calm consistency',
      'Process Integrity: Ensures standard operating procedures remain clear and accessible'
    ],
    processSummary: 'You are the bedrock of operational dependability. Your process is disciplined, methodical, and rooted in uncompromising ethical accountability. You take deep pride in getting the details right.',
    employerSynergy: 'Eliminates compliance lapses, audit risks, and operational unpredictability. Teams gain an anchor of trust and flawless execution.',
    candidatePitch: '"I bring unwavering reliability, ethical vigilance, and disciplined execution. Leaders count on me to safeguard critical operations and ensure our commitments are met with zero defects."',
    assets: {
      diplomaticGrace: 93,
      ethicalAnchor: 100,
      pressureEquilibrium: 96,
      collaborativeEmpathy: 90,
      strategicVision: 92,
      adaptiveResilience: 95
    },
    environments: [
      'Financial operations, compliance, and regulatory oversight',
      'Security operations and risk management',
      'High-reliability enterprise services'
    ],
    badges: ['Steadfast Guardian', 'Integrity Champion', 'Zero-Risk Standard', 'Execution Master']
  }
];

export const PositiveArchetypeProfiler: React.FC<PositiveArchetypeProfilerProps> = ({
  candidateName = 'Candidate',
  targetRole = 'Lead Professional Specialist',
  resumeText = '',
  initialProfile = null,
  onSaveProfile
}) => {
  const [profile, setProfile] = useState<PositiveArchetypeProfile | null>(
    initialProfile || {
      id: PRESET_ARCHETYPES[0].id,
      archetypeName: PRESET_ARCHETYPES[0].name,
      positiveTagline: PRESET_ARCHETYPES[0].tagline,
      rarityLevel: PRESET_ARCHETYPES[0].rarity,
      coreStrengths: PRESET_ARCHETYPES[0].strengths,
      positiveWorkProcess: PRESET_ARCHETYPES[0].processSummary,
      characterAssets: PRESET_ARCHETYPES[0].assets,
      optimalCompanyEnvironments: PRESET_ARCHETYPES[0].environments,
      whyEmployersNeedThisArchetype: PRESET_ARCHETYPES[0].employerSynergy,
      candidateInterviewPitch: PRESET_ARCHETYPES[0].candidatePitch,
      positiveBadges: PRESET_ARCHETYPES[0].badges,
      generatedAt: new Date().toISOString()
    }
  );

  // Questionnaire / Diagnostic State (Optional Mode)
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState<boolean>(false);
  const [answers, setAnswers] = useState({
    cognitiveStyle: 'I take a measured, analytical approach to understand the full system before acting.',
    conflictPhilosophy: 'I de-escalate tension with calm objective facts and respect everyone\'s dignity.',
    pressureComposure: 'Under sudden emergencies, I maintain an even vocal tone and prioritize containment.',
    uncommonAsset: 'My uncommon asset is bridging technical complexity with warm, diplomatic rapport.',
    ethicalStance: 'I treat compliance and integrity as non-negotiable foundations for sustainable speed.'
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);
  const [copiedBadge, setCopiedBadge] = useState<boolean>(false);

  const handleSelectPreset = (preset: typeof PRESET_ARCHETYPES[0]) => {
    const newProf: PositiveArchetypeProfile = {
      id: preset.id,
      archetypeName: preset.name,
      positiveTagline: preset.tagline,
      rarityLevel: preset.rarity,
      coreStrengths: preset.strengths,
      positiveWorkProcess: preset.processSummary,
      characterAssets: preset.assets,
      optimalCompanyEnvironments: preset.environments,
      whyEmployersNeedThisArchetype: preset.employerSynergy,
      candidateInterviewPitch: preset.candidatePitch,
      positiveBadges: preset.badges,
      generatedAt: new Date().toISOString()
    };
    setProfile(newProf);
    if (onSaveProfile) onSaveProfile(newProf);
  };

  const handleGenerateCustomProfile = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-positive-archetype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          targetRole,
          answers,
          resumeText
        })
      });

      const data = await res.json();
      setProfile(data);
      if (onSaveProfile) onSaveProfile(data);
      setIsQuestionnaireOpen(false);
    } catch (err) {
      console.error('Error generating positive archetype:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPitch = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.candidateInterviewPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 3000);
  };

  const handleCopyBadge = () => {
    if (!profile) return;
    const text = `T.H.I.S. Certified Positive Archetype: "${profile.archetypeName}" • ${profile.rarityLevel} • Verified Civility Leadership`;
    navigator.clipboard.writeText(text);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#121212] border border-amber-500/30 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Optional Character & Process Profiler</span>
            </div>
            <h2 className="font-serif italic text-2xl text-white">The Positive Character Archetype Blueprint</h2>
            <p className="text-xs text-white/70 max-w-2xl font-sans mt-1">
              Highlight your distinctive character assets, uncommon process, and natural strengths in their highest positive light. Designed to help candidates celebrate their unique approach, while helping companies discover the exact personality that creates organizational harmony.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQuestionnaireOpen(!isQuestionnaireOpen)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isQuestionnaireOpen ? 'Close Questionnaire' : 'Diagnostic Questionnaire'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Positive Archetype Carousel / Selector */}
      <div className="bg-[#141414] border border-white/10 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-white/60 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Explore Certified Positive Character Archetypes</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-400">100% Positive Strength Markers Only</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PRESET_ARCHETYPES.map((preset) => {
            const Icon = preset.icon;
            const isSelected = profile?.archetypeName === preset.name;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? `${preset.bgColor} ${preset.borderColor} text-white shadow-md ring-1 ring-amber-400/50`
                    : 'bg-[#0A0A0A] border-white/10 hover:border-white/30 text-white/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${preset.color}`} />
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-white leading-tight">{preset.name}</h4>
                  <span className="text-[9px] font-mono text-white/40 block mt-1">Verified Fit</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Questionnaire Panel (Optional in-depth discovery) */}
      {isQuestionnaireOpen && (
        <div className="bg-[#121212] border border-amber-500/40 p-6 space-y-5 animate-fadeIn">
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-serif italic text-lg text-white">Diagnostic Character & Process Questionnaire</h3>
            <p className="text-xs text-white/60">
              Answer these positive prompts to tailor an authentic, executive-grade profile highlighting your unique working process.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">
                1. Natural Cognitive & Work Process: How does your mind break down complex, multi-stage challenges?
              </label>
              <textarea
                rows={2}
                value={answers.cognitiveStyle}
                onChange={(e) => setAnswers({ ...answers, cognitiveStyle: e.target.value })}
                className="w-full p-2.5 bg-[#0A0A0A] border border-white/20 text-xs text-white font-sans focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">
                2. Conflict Resolution Philosophy: How do you defuse friction and maintain mutual respect?
              </label>
              <textarea
                rows={2}
                value={answers.conflictPhilosophy}
                onChange={(e) => setAnswers({ ...answers, conflictPhilosophy: e.target.value })}
                className="w-full p-2.5 bg-[#0A0A0A] border border-white/20 text-xs text-white font-sans focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">
                3. High-Pressure Composure: How do you preserve emotional calm during unexpected emergencies?
              </label>
              <textarea
                rows={2}
                value={answers.pressureComposure}
                onChange={(e) => setAnswers({ ...answers, pressureComposure: e.target.value })}
                className="w-full p-2.5 bg-[#0A0A0A] border border-white/20 text-xs text-white font-sans focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">
                4. Distinctive Asset / Uncommon Strength: What makes your character and process unique?
              </label>
              <textarea
                rows={2}
                value={answers.uncommonAsset}
                onChange={(e) => setAnswers({ ...answers, uncommonAsset: e.target.value })}
                className="w-full p-2.5 bg-[#0A0A0A] border border-white/20 text-xs text-white font-sans focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsQuestionnaireOpen(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleGenerateCustomProfile}
              disabled={isGenerating}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Analyzing Character Assets...' : 'Generate Positive Profile'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Profile Showcase Card */}
      {profile && (
        <div className="bg-[#121212] border border-white/10 p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono uppercase font-bold">
                  {profile.rarityLevel}
                </span>
                <span className="text-white/40 text-xs font-mono">• Positive Dimension Profile</span>
              </div>
              <h3 className="font-serif italic text-3xl text-white mt-1">{profile.archetypeName}</h3>
              <p className="text-xs text-white/70 font-sans mt-1 max-w-2xl leading-relaxed">
                {profile.positiveTagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPitch}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/20 text-xs font-mono uppercase flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
                <span>{copiedPitch ? 'Pitch Copied!' : 'Copy Interview Pitch'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyBadge}
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono uppercase flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedBadge ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedBadge ? 'Badge Copied!' : 'Copy Share Badge'}</span>
              </button>
            </div>
          </div>

          {/* Positive Asset Dimensions Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white/60">
              Character & Civility Dimensions (Positive Scale)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Diplomatic Grace', value: profile.characterAssets.diplomaticGrace, color: 'bg-amber-400' },
                { label: 'Ethical Anchor', value: profile.characterAssets.ethicalAnchor, color: 'bg-emerald-400' },
                { label: 'Pressure Equilibrium', value: profile.characterAssets.pressureEquilibrium, color: 'bg-cyan-400' },
                { label: 'Collaborative Empathy', value: profile.characterAssets.collaborativeEmpathy, color: 'bg-rose-400' },
                { label: 'Strategic Vision', value: profile.characterAssets.strategicVision, color: 'bg-purple-400' },
                { label: 'Adaptive Resilience', value: profile.characterAssets.adaptiveResilience, color: 'bg-blue-400' }
              ].map((dim, i) => (
                <div key={i} className="bg-[#0A0A0A] p-3 border border-white/10 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white/70">{dim.label}</span>
                    <span className="text-white font-bold">{dim.value}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 overflow-hidden">
                    <div className={`${dim.color} h-full`} style={{ width: `${dim.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dual Perspective Grid: Candidate Asset vs Employer Symmetrical Synergy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Candidate Perspective */}
            <div className="bg-[#0A0A0A] p-5 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-bold">
                <UserCheck className="w-4 h-4" />
                <span>Your Distinct Work Process (Your Superpower)</span>
              </div>
              <p className="text-xs text-white/80 font-sans leading-relaxed">
                {profile.positiveWorkProcess}
              </p>

              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase text-white/50 block mb-1">
                  How to Pitch Your Process in Interviews:
                </span>
                <div className="bg-[#141414] p-3 border-l-2 border-amber-400 text-xs italic text-amber-200">
                  {profile.candidateInterviewPitch}
                </div>
              </div>
            </div>

            {/* Employer Symmetry Perspective */}
            <div className="bg-[#0A0A0A] p-5 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold">
                <Building2 className="w-4 h-4" />
                <span>Why Companies Seek This Archetype (Team Synergy)</span>
              </div>
              <p className="text-xs text-white/80 font-sans leading-relaxed">
                {profile.whyEmployersNeedThisArchetype}
              </p>

              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase text-white/50 block mb-1">
                  Optimal Workplace Ecosystems:
                </span>
                <ul className="list-disc list-inside space-y-1 text-white/70 text-xs">
                  {profile.optimalCompanyEnvironments.map((env, idx) => (
                    <li key={idx}>{env}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Core Strengths & Badges */}
          <div className="bg-[#0A0A0A] p-5 border border-white/10 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white/60">
              Signature Positive Strengths
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.coreStrengths.map((str, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-sans text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-white/40 mr-1">Verified Badges:</span>
              {profile.positiveBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white/5 border border-white/20 text-white/80 text-[10px] font-mono flex items-center gap-1.5"
                >
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
