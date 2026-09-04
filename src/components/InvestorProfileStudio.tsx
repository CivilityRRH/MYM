import React, { useState, useEffect } from 'react';
import { SavedCandidateProfile, JobRequirement, CandidateEvaluation, VideoScoringResult, VocalScoringResult, ArchetypeProjection } from '../types';
import {
  Sparkles,
  PlusCircle,
  FolderOpen,
  Save,
  Trash2,
  CheckCircle2,
  Award,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Check,
  Star
} from 'lucide-react';

interface InvestorProfileStudioProps {
  currentProfile: {
    name: string;
    email: string;
    city: string;
    selectedJob: JobRequirement;
    ethicsAnswers: Record<string, string>;
    etiquetteAnswers: Record<string, string>;
    mannersAnswers: Record<string, string>;
    archetypeAnswers: Record<string, string>;
    archetypeProjection: ArchetypeProjection | null;
    toneAudioTranscript: string;
    toneAudioUrl: string | null;
    vocalEvaluationResult: VocalScoringResult | null;
    pressureVideoTranscript: string;
    pressureVideoUrl: string | null;
    videoEvaluationResult: VideoScoringResult | null;
    evaluationResult: CandidateEvaluation | null;
  };
  onLoadProfile: (profile: SavedCandidateProfile) => void;
  onResetToGroundZero: () => void;
  onSaveCurrentProfile: (label?: string) => void;
  onOpenDossier: () => void;
}

const STORAGE_KEY = 'this_saved_investor_profiles_v1';

export const InvestorProfileStudio: React.FC<InvestorProfileStudioProps> = ({
  currentProfile,
  onLoadProfile,
  onResetToGroundZero,
  onSaveCurrentProfile,
  onOpenDossier,
}) => {
  const [savedProfiles, setSavedProfiles] = useState<SavedCandidateProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'presets' | 'saved' | 'create'>('presets');
  const [saveLabel, setSaveLabel] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // VIP Investor Presets
  const investorPresets: SavedCandidateProfile[] = [
    {
      id: 'preset-alexandra-vance',
      name: 'Alexandra Vance',
      email: 'a.vance@risk-governance.org',
      city: 'Austin, TX',
      roleName: 'VP of Global Operational Risk & Incident Command',
      minExperienceYears: 12,
      expectedSalary: '$195,000 / yr',
      createdAt: '2026-03-01T12:00:00.000Z',
      isInvestorPreset: true,
      notes: '⭐ Flagship Executive Demo: 96.4% Civility Composite, 97.4% Lens Lock, Crisis Masterclass.',
      ethicsAnswers: {
        '0': 'When facing project deadlines versus regulatory compliance, compliance is non-negotiable. I establish immediate executive transparency and log audit trails.',
        '1': 'I led the ISO 27001 and SOX compliance audit over 8 enterprise systems, identifying 3 high-risk gaps and neutralizing them before regulatory submission.'
      },
      etiquetteAnswers: {
        '0': 'I present audit discrepancies with objective metrics, root-cause analyses, and actionable remediation steps without personal blame.',
        '1': 'I mandate strict least-privilege RBAC controls and conduct bi-weekly access governance reviews with engineering directors.'
      },
      mannersAnswers: {
        '0': 'I receive critical scrutiny by validating stakeholder concerns, separating emotion from facts, and delivering data-driven revisions within 24 hours.',
        '1': 'When an operational misstep occurs, I take full personal ownership on the incident bridge and publish an immediate post-mortem.'
      },
      archetypeAnswers: {
        'Work Leadership Style': 'Decisive Commander with high emotional composure',
        'Conflict Vector': 'De-escalating through objective data and mutual accountability',
        'Crisis Temperament': 'Calm, steady, and laser-focused on rapid containment',
        'Ethical Stance': 'Uncompromising adherence to truth and regulatory governance',
        'Innovation & Drive': 'Continuous system hardening and organizational maturity'
      },
      archetypeProjection: {
        title: 'The Sovereign Crisis Commander',
        primaryCategory: 'Crisis Resilient Leader',
        summary: 'Exceptional executive presence under catastrophic pressure. Combines rigorous compliance adherence with diplomatic team stabilization.',
        dimensions: {
          resilience: 98,
          ethicsIntegrity: 99,
          diplomaticTact: 96,
          highPressureComposure: 97,
          innovationDrive: 94
        },
        keyBehavioralTraits: ['Crisis De-escalation', 'Lens-Lock Eye Contact', 'Decisive Accountability', 'Regulatory Precision'],
        optimalWorkEnvironment: 'High-stakes executive risk oversight and distributed incident command.',
        questionsAnswers: {
          'Leadership Style': 'Decisive Commander with high emotional composure',
          'Crisis Response': 'Rapid containment with objective transparency'
        },
        generatedAt: '2026-03-01T12:00:00.000Z'
      },
      toneAudioTranscript: 'In my role as VP of Operational Risk, I define ethics through uncompromising accountability, regulatory compliance, and transparent truthfulness. I will shine over other candidates by combining deep technical execution with proven calm executive composure that de-escalates high-stakes friction and consistently delivers verifiable ROI.',
      vocalEvaluationResult: {
        overallVocalScore: 95.8,
        pitchModulationScore: 96.2,
        emotionalComposureScore: 98.4,
        cadencePacingScore: 94.5,
        verbalSubstanceScore: 97.0,
        exactGrade: '95.8% - Exemplary Executive Composure & Tone Clarity',
        isPassing: true,
        ladderStatus: '80%+ PASSING VOCAL GRADE • EXECUTIVE POISE CERTIFIED',
        targetPosition: 'VP of Global Operational Risk',
        positionQuestion: 'Leadership and crisis de-escalation tone assessment',
        acousticMetrics: {
          pitchStabilityPercent: 96.8,
          decibelSteadiness: 'Optimal Dynamic Range (58 - 68 dB)',
          speechPacingWpm: 142,
          silenceHesitationRatioPercent: 4.2,
          inflectionWarmthRating: 'Measured Executive & Reassuring'
        },
        vocalToneFeedback: 'Exceptional pitch stability and vocal resonance under questioning.',
        verbalResponseFeedback: 'Structured, articulate, and anchored in concrete accountability frameworks.',
        whatNeedsImprovementToReach100: 'Maintain slight pause pacing during numerical breakdowns.',
        whatShouldHaveBeenDoneInstead: 'Candidate already demonstrates tier-1 boardroom cadence.',
        exemplarVocalDelivery: 'Demonstrates authoritative yet approachable vocal tonality.',
        keyStrengths: ['Pristine Pitch Modulation', 'High Diplomatic Resonance', 'Flawless Articulation'],
        coachingTipsForPerfection: ['Continue current diaphragmatic breathing patterns.'],
        evaluatedAt: '2026-03-01T12:00:00.000Z'
      },
      pressureVideoTranscript: 'As VP of Operational Risk and Incident Commander, I am executing immediate operational containment. Step 1: Isolate the impacted environment within 120 seconds. Step 2: Convene the emergency bridge and establish forensic audit timestamps. Step 3: Deliver verified stakeholder status briefings every 15 minutes with complete transparency and zero blame.',
      videoEvaluationResult: {
        overallVideoScore: 96.4,
        bodyLanguageScore: 97.0,
        responseToneScore: 96.2,
        crisisResponseSubstanceScore: 96.0,
        genuineResponseScore: 97.2,
        exactGrade: '96.4% - Masterclass Demeanor & Lens Lock',
        isPassing: true,
        ladderStatus: '80%+ PASSING VIDEO GRADE • BODY MOVEMENT & TONE CERTIFIED',
        scientificKinesics: {
          presenceDetected: true,
          presenceConfidencePercent: 98.5,
          diagnosticMessage: 'Verified Human Subject • High Optical Confidence',
          oculometrics: {
            fixationRatioPercent: 97.4,
            saccadeFrequencyPerMin: 12,
            gazeAversionPattern: 'direct_anchored',
            cognitiveVsNervousAnalysis: 'Cognitive Gaze Anchoring: Subject maintains direct ocular contact without nervous avoidance.',
            blinkRatePerMin: 14,
            blinkStressClassification: 'normal_relaxed'
          },
          kinesicMovements: {
            posturalSwayIndex: 3.2,
            adaptorFrequency: 'Minimal / Grounded',
            illustratorEffectiveness: 'High Speech-Gesture Synchrony',
            nervousSystemState: 'regulated_ventral',
            shoulderTensionScore: 12
          },
          developmentalTrainingPlan: {
            candidateField: 'Executive Risk Governance',
            primaryGrowthArea: 'Micro-Cadence Optimization',
            scientificBehavioralInsight: 'Demonstrates high ventral-vagal stability with zero physical pacifying artifacts.',
            dailyDrills: [
              {
                title: 'Lens Lock Sustained Fixation',
                objective: 'Maintain 95%+ optical focus during multi-part crisis scenarios',
                protocol: '30-second unbroken camera gaze intervals',
                scientificRationale: 'Reinforces perceived authority and authentic truthfulness.'
              }
            ],
            careerProjectionAdvantage: 'High probability of immediate executive appointment.'
          }
        },
        bodyLanguageMetrics: {
          eyeContactConsistencyPercent: 97.4,
          postureSteadinessPercent: 96.8,
          facialComposureRating: 'Relaxed Executive Composure',
          fidgetingIndex: 'Minimal / Composed',
          gesturePoise: 'Controlled & Purposeful',
          shoulderTensionRating: 'Relaxed & Level',
          microExpressionStatus: 'Congruent & Open'
        },
        authenticityMetrics: {
          genuineResponseIndexPercent: 97.2,
          affectCongruenceRating: 'High Verbal-Emotional Harmony',
          spontaneityLevel: 'Natural, Spontaneous & Thoughtful',
          vocalWarmthSteadiness: 'Consistent Unforced Pitch Resonance',
          facialAuthenticityAudit: 'Absence of masked anxiety or forced pleasantness'
        },
        bodyLanguageFeedback: 'Superb physical presence. Upright shoulder alignment and steady ocular fixation.',
        responseToneFeedback: 'Commanding and composed without vocal strain.',
        crisisMitigationFeedback: 'Structured 3-step isolation, bridge, and briefing containment protocol.',
        whatNeedsImprovementToReach100: 'Incorporate minor hand gestures to emphasize containment milestones.',
        whatShouldHaveBeenDoneInstead: 'Candidate executed optimal crisis briefing.',
        exemplarCrisisResponse: 'Isolate affected nodes -> Establish audit timestamp -> Deliver 15-minute briefings.',
        keyStrengths: ['97.4% Lens Lock', 'Zero Defensive Micro-Expressions', 'Rapid 3-Step Containment'],
        coachingTipsForPerfection: ['Maintain steady pacing across long briefing intervals.'],
        evaluatedAt: '2026-03-01T12:00:00.000Z'
      },
      evaluationResult: {
        civilityScore: 96.4,
        toneScore: 96.2,
        ethicsScore: 98.0,
        pressureScore: 97.0,
        driveScore: 94.5,
        overallSummary: 'Alexandra Vance exemplifies gold-standard executive poise, unwavering ethical accountability, and pristine crisis communication.',
        toneEvaluation: 'Warm, modulated tone with optimal cadence (142 WPM) and negligible vocal jitter.',
        pressureEvaluation: 'Maintained 97.4% eye contact and upright posture with zero signs of distress or agitation.',
        ethicsEvaluation: 'Flawless commitment to transparency and compliance integrity under high-stakes audit timelines.',
        driveEvaluation: 'Proactive leadership and continuous system hardening.',
        keyStrengths: [
          'Masterclass Crisis Containment Protocol',
          '97.4% Direct Lens Lock & Eye Contact',
          'Zero-blame Executive Communication',
          'Deep Regulatory Governance Background'
        ],
        potentialRisks: [],
        recommendationTier: 'Top Prospect',
        evaluatedAt: '2026-03-01T12:00:00.000Z'
      }
    },
    {
      id: 'preset-marcus-thorne',
      name: 'Marcus Thorne',
      email: 'm.thorne@systems-defense.io',
      city: 'New York, NY',
      roleName: 'Chief Incident Response Engineer & Disaster Architect',
      minExperienceYears: 15,
      expectedSalary: '$225,000 / yr',
      createdAt: '2026-03-01T14:30:00.000Z',
      isInvestorPreset: true,
      notes: '⚡ Deep Technical Crisis Commander: 94.8% Civility, High-Precision Disaster Recovery.',
      ethicsAnswers: {
        '0': 'I maintain a strict zero-compromise stance on security ethics, ensuring all disaster scenarios prioritize user privacy and data integrity.',
        '1': 'During a major cloud service disruption, I mandated transparent incident public status updates within 8 minutes of detection.'
      },
      etiquetteAnswers: {
        '0': 'I document architecture findings using standardized RFC templates with reproducible proof-of-concept tests.',
        '1': 'I enforce multi-signature hardware keys for all emergency production failovers.'
      },
      mannersAnswers: {
        '0': 'I treat incident post-mortems as learning ecosystems, eliminating blame to encourage proactive vulnerability reporting.',
        '1': 'I openly share recovery timeline estimates with confidence intervals and clear assumptions.'
      },
      archetypeAnswers: {
        'Work Leadership Style': 'Architectural Guardian & High-Speed Incident Triage',
        'Conflict Vector': 'Methodical verification and consensus-building',
        'Crisis Temperament': 'Engineered calm with systematic elimination of failure points',
        'Ethical Stance': 'Total transparency and cryptographic data verification',
        'Innovation & Drive': 'Building resilient self-healing cloud architectures'
      },
      archetypeProjection: {
        title: 'The Resilient Systems Architect',
        primaryCategory: 'Executive Strategist',
        summary: 'Tenacious, methodical, and unflappable under catastrophic distributed systems failures.',
        dimensions: {
          resilience: 97,
          ethicsIntegrity: 95,
          diplomaticTact: 93,
          highPressureComposure: 98,
          innovationDrive: 96
        },
        keyBehavioralTraits: ['Systems Disaster Recovery', 'Objective Root Cause Analysis', 'High-Trust Leadership', 'Zero Panic Response'],
        optimalWorkEnvironment: 'Mission-critical distributed systems and 24/7 disaster recovery architectures.',
        questionsAnswers: {
          'Leadership Style': 'Architectural Guardian & High-Speed Incident Triage'
        },
        generatedAt: '2026-03-01T14:30:00.000Z'
      },
      toneAudioTranscript: 'As Chief Incident Engineer, I treat high-pressure escalations with disciplined execution and radical candor. I build high-trust engineering cultures where every team member is empowered to halt production for safety.',
      vocalEvaluationResult: {
        overallVocalScore: 94.5,
        pitchModulationScore: 93.8,
        emotionalComposureScore: 96.8,
        cadencePacingScore: 94.0,
        verbalSubstanceScore: 95.5,
        exactGrade: '94.5% - High Technical Precision & Composure',
        isPassing: true,
        ladderStatus: '80%+ PASSING VOCAL GRADE • CERTIFIED',
        targetPosition: 'Chief Incident Response Engineer',
        positionQuestion: 'Crisis containment and technical leadership voice assessment',
        acousticMetrics: {
          pitchStabilityPercent: 95.4,
          decibelSteadiness: 'Stable & Controlled (55 - 66 dB)',
          speechPacingWpm: 138,
          silenceHesitationRatioPercent: 5.1,
          inflectionWarmthRating: 'Measured Executive'
        },
        vocalToneFeedback: 'Deep, steady vocal modulation with zero pitch agitation.',
        verbalResponseFeedback: 'Clear, concise, and focused on safety culture and radical candor.',
        whatNeedsImprovementToReach100: 'Add slight inflection variance to highlight critical steps.',
        whatShouldHaveBeenDoneInstead: 'Delivery is sound and authoritative.',
        exemplarVocalDelivery: 'Precise technical articulation.',
        keyStrengths: ['Steady Pitch Control', 'Zero Vocal Tremors', 'Decisive Cadence'],
        coachingTipsForPerfection: ['Continue blameless communication style.'],
        evaluatedAt: '2026-03-01T14:30:00.000Z'
      },
      pressureVideoTranscript: 'Incident triage initiated. We are isolating the primary database replica and redirecting read traffic to the hot-standby region. Key stakeholders will receive immutable log updates every 10 minutes.',
      videoEvaluationResult: {
        overallVideoScore: 94.8,
        bodyLanguageScore: 95.5,
        responseToneScore: 94.5,
        crisisResponseSubstanceScore: 94.4,
        genuineResponseScore: 95.5,
        exactGrade: '94.8% - Steadfast Technical Authority',
        isPassing: true,
        ladderStatus: '80%+ PASSING VIDEO GRADE • CERTIFIED',
        scientificKinesics: {
          presenceDetected: true,
          presenceConfidencePercent: 97.8,
          diagnosticMessage: 'Verified Human Subject • High Optical Confidence',
          oculometrics: {
            fixationRatioPercent: 96.1,
            saccadeFrequencyPerMin: 14,
            gazeAversionPattern: 'direct_anchored',
            cognitiveVsNervousAnalysis: 'Direct visual lock on camera sensor.',
            blinkRatePerMin: 15,
            blinkStressClassification: 'normal_relaxed'
          },
          kinesicMovements: {
            posturalSwayIndex: 4.5,
            adaptorFrequency: 'Minimal / Grounded',
            illustratorEffectiveness: 'High Speech-Gesture Synchrony',
            nervousSystemState: 'regulated_ventral',
            shoulderTensionScore: 16
          },
          developmentalTrainingPlan: {
            candidateField: 'Systems Engineering',
            primaryGrowthArea: 'Non-Technical Executive Translation',
            scientificBehavioralInsight: 'Demonstrates deep cognitive control and steady posture under triage.',
            dailyDrills: [],
            careerProjectionAdvantage: 'Exemplary disaster recovery leader.'
          }
        },
        bodyLanguageMetrics: {
          eyeContactConsistencyPercent: 96.1,
          postureSteadinessPercent: 95.5,
          facialComposureRating: 'Relaxed Executive Composure',
          fidgetingIndex: 'Minimal / Composed',
          gesturePoise: 'Controlled & Purposeful'
        },
        authenticityMetrics: {
          genuineResponseIndexPercent: 95.5,
          affectCongruenceRating: 'High Verbal-Emotional Harmony',
          spontaneityLevel: 'Natural, Spontaneous & Thoughtful',
          vocalWarmthSteadiness: 'Consistent Unforced Pitch Resonance',
          facialAuthenticityAudit: 'Absence of masked anxiety'
        },
        bodyLanguageFeedback: 'Solid ocular lock (96.1%) and calm head posture.',
        responseToneFeedback: 'Authoritative, calm, and direct.',
        crisisMitigationFeedback: 'Immediate replica isolation and hot-standby redirect.',
        whatNeedsImprovementToReach100: 'Pair technical terminology with executive impact notes.',
        whatShouldHaveBeenDoneInstead: 'Solid execution.',
        exemplarCrisisResponse: 'Isolate replica -> Redirect traffic -> 10-minute immutable updates.',
        keyStrengths: ['96.1% Lens Lock', 'High Technical Authority'],
        coachingTipsForPerfection: ['Bridge engineering terms for non-technical stakeholders.'],
        evaluatedAt: '2026-03-01T14:30:00.000Z'
      },
      evaluationResult: {
        civilityScore: 94.8,
        toneScore: 94.5,
        ethicsScore: 96.0,
        pressureScore: 95.5,
        driveScore: 93.2,
        overallSummary: 'Marcus Thorne brings elite technical authority with exemplary collaborative manners and crisis containment prowess.',
        toneEvaluation: 'Deep, steady vocal modulation with zero pitch agitation.',
        pressureEvaluation: 'Controlled kinesics and steady eye fixation.',
        ethicsEvaluation: 'High marks for blameless engineering culture and immutable status disclosure.',
        driveEvaluation: 'Continuous resilience engineering and failover testing.',
        keyStrengths: [
          'Blameless Post-Mortem Leadership',
          '96.1% Lens Lock',
          'Distributed Systems Disaster Mastery'
        ],
        potentialRisks: [],
        recommendationTier: 'Top Prospect',
        evaluatedAt: '2026-03-01T14:30:00.000Z'
      }
    },
    {
      id: 'preset-elena-rostova',
      name: 'Dr. Elena Rostova',
      email: 'e.rostova@governance-institute.edu',
      city: 'San Francisco, CA',
      roleName: 'Global Ethics & AI Governance Director',
      minExperienceYears: 9,
      expectedSalary: '$210,000 / yr',
      createdAt: '2026-03-01T16:00:00.000Z',
      isInvestorPreset: true,
      notes: '💎 Supreme Regulatory & Ethical Integrity: 98.2% Civility, Certified Global Compliance Leader.',
      ethicsAnswers: {
        '0': 'Ethics is the fundamental prerequisite of all organizational longevity. I align corporate conduct with global algorithmic transparency and human dignity.',
        '1': 'I established the first comprehensive AI ethical oversight board across 14 international divisions, auditing 120+ model deployments.'
      },
      etiquetteAnswers: {
        '0': 'I bridge cross-functional divides through structured consensus frameworks and transparent stakeholder matrices.',
        '1': 'I ensure all regulatory disclosures are published with verifiable mathematical evidence and plain-language summaries.'
      },
      mannersAnswers: {
        '0': 'I address conflicting viewpoints with deep active listening, unconditional professional respect, and principled diplomacy.',
        '1': 'I champion psychological safety as the bedrock of honest ethical reporting.'
      },
      archetypeAnswers: {
        'Work Leadership Style': 'Diplomatic Statesperson & Ethical Pillar',
        'Conflict Vector': 'Principled mediation and systemic alignment',
        'Crisis Temperament': 'Serene, resolute, and unwavering in truth',
        'Ethical Stance': 'Global human rights, algorithmic fairness, and fiduciary integrity',
        'Innovation & Drive': 'Pioneering ethical AI standards for global industry'
      },
      archetypeProjection: {
        title: 'The Diplomatic Statesperson',
        primaryCategory: 'Ethical Sentinel',
        summary: 'Elite diplomatic prowess paired with unmatched ethical governance and intellectual rigor.',
        dimensions: {
          resilience: 96,
          ethicsIntegrity: 100,
          diplomaticTact: 99,
          highPressureComposure: 98,
          innovationDrive: 97
        },
        keyBehavioralTraits: ['Global AI Governance', 'Principled Diplomacy', 'Consensus Architect', 'Regulatory Mastery'],
        optimalWorkEnvironment: 'Global enterprise governance, regulatory councils, and ethical AI oversight.',
        questionsAnswers: {
          'Ethical Stance': 'Global human rights and fiduciary integrity'
        },
        generatedAt: '2026-03-01T16:00:00.000Z'
      },
      toneAudioTranscript: 'Organizational integrity is not a marketing strategy; it is our fundamental fiduciary and moral duty. I cultivate teams where truth is rewarded and ethical courage is celebrated.',
      vocalEvaluationResult: {
        overallVocalScore: 98.0,
        pitchModulationScore: 98.5,
        emotionalComposureScore: 99.0,
        cadencePacingScore: 97.5,
        verbalSubstanceScore: 99.2,
        exactGrade: '98.0% - Masterclass Diplomatic Articulation',
        isPassing: true,
        ladderStatus: '80%+ PASSING VOCAL GRADE • EXEMPLARY',
        targetPosition: 'Global Ethics & AI Governance Director',
        positionQuestion: 'Ethical culture and global governance audio assessment',
        acousticMetrics: {
          pitchStabilityPercent: 98.8,
          decibelSteadiness: 'Warm & Perfectly Resonant (58 - 69 dB)',
          speechPacingWpm: 135,
          silenceHesitationRatioPercent: 3.5,
          inflectionWarmthRating: 'Warm & Diplomatic'
        },
        vocalToneFeedback: 'Warm, resonant, and exceptionally articulate.',
        verbalResponseFeedback: 'Unrivaled philosophical depth and practical governance execution.',
        whatNeedsImprovementToReach100: 'Operates at performance ceiling.',
        whatShouldHaveBeenDoneInstead: 'Benchmark standard for ethical leaders.',
        exemplarVocalDelivery: 'Masterclass in diplomatic pacing.',
        keyStrengths: ['98.8% Pitch Stability', 'Empathetic Resonance', 'Supreme Articulation'],
        coachingTipsForPerfection: ['Continue current speaking style.'],
        evaluatedAt: '2026-03-01T16:00:00.000Z'
      },
      pressureVideoTranscript: 'When confronted with regulatory ambiguity or conflicting priorities, I mandate immediate audit logging, independent ethics council review, and total board disclosure.',
      videoEvaluationResult: {
        overallVideoScore: 98.2,
        bodyLanguageScore: 98.6,
        responseToneScore: 98.0,
        crisisResponseSubstanceScore: 98.0,
        genuineResponseScore: 99.0,
        exactGrade: '98.2% - Supreme Presence & Authenticity',
        isPassing: true,
        ladderStatus: '80%+ PASSING VIDEO GRADE • EXEMPLARY',
        scientificKinesics: {
          presenceDetected: true,
          presenceConfidencePercent: 99.2,
          diagnosticMessage: 'Verified Human Subject • Optimal Biometric Signal',
          oculometrics: {
            fixationRatioPercent: 98.6,
            saccadeFrequencyPerMin: 11,
            gazeAversionPattern: 'direct_anchored',
            cognitiveVsNervousAnalysis: 'Flawless optical engagement.',
            blinkRatePerMin: 12,
            blinkStressClassification: 'normal_relaxed'
          },
          kinesicMovements: {
            posturalSwayIndex: 2.1,
            adaptorFrequency: 'Minimal / Grounded',
            illustratorEffectiveness: 'High Speech-Gesture Synchrony',
            nervousSystemState: 'regulated_ventral',
            shoulderTensionScore: 8
          },
          developmentalTrainingPlan: {
            candidateField: 'Global Governance',
            primaryGrowthArea: 'Benchmark Mentor',
            scientificBehavioralInsight: 'Exhibits optimal polyvagal calmness and authoritative symmetry.',
            dailyDrills: [],
            careerProjectionAdvantage: 'Highest tier global board readiness.'
          }
        },
        bodyLanguageMetrics: {
          eyeContactConsistencyPercent: 98.6,
          postureSteadinessPercent: 98.0,
          facialComposureRating: 'Relaxed Executive Composure',
          fidgetingIndex: 'Minimal / Composed',
          gesturePoise: 'Controlled & Purposeful'
        },
        authenticityMetrics: {
          genuineResponseIndexPercent: 99.0,
          affectCongruenceRating: 'High Verbal-Emotional Harmony',
          spontaneityLevel: 'Natural, Spontaneous & Thoughtful',
          vocalWarmthSteadiness: 'Consistent Unforced Pitch Resonance',
          facialAuthenticityAudit: 'Pristine authentic Duchenne micro-cues'
        },
        bodyLanguageFeedback: '98.6% direct lens lock with serene, centered posture.',
        responseToneFeedback: 'Pristine cadence and clarity.',
        crisisMitigationFeedback: 'Audit logging and independent council disclosure.',
        whatNeedsImprovementToReach100: 'None. Benchmark candidate.',
        whatShouldHaveBeenDoneInstead: 'Exemplary.',
        exemplarCrisisResponse: 'Audit log -> Council review -> Board disclosure.',
        keyStrengths: ['98.6% Lens Lock', 'Supreme Regulatory Poise'],
        coachingTipsForPerfection: ['Candidate operates at benchmark ceiling.'],
        evaluatedAt: '2026-03-01T16:00:00.000Z'
      },
      evaluationResult: {
        civilityScore: 98.2,
        toneScore: 98.0,
        ethicsScore: 99.0,
        pressureScore: 98.5,
        driveScore: 97.3,
        overallSummary: 'Dr. Elena Rostova delivers a flawless demonstration of ethical governance, diplomatic poise, and supreme executive authority.',
        toneEvaluation: 'Warm, resonant, and exceptionally articulate.',
        pressureEvaluation: '98.6% gaze directness with sublime composure.',
        ethicsEvaluation: 'Unrivaled ethical clarity and global governance mastery.',
        driveEvaluation: 'Pioneering global industry standards.',
        keyStrengths: [
          'Global Governance & Ethics Leadership',
          '98.6% Lens Lock & Ocular Fixation',
          'Flawless Diplomatic Etiquette'
        ],
        potentialRisks: [],
        recommendationTier: 'Top Prospect',
        evaluatedAt: '2026-03-01T16:00:00.000Z'
      }
    }
  ];

  // Load saved profiles from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedProfiles(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read saved profiles:', e);
    }
  }, []);

  const handleSaveToLocalStorage = () => {
    const profileToSave: SavedCandidateProfile = {
      id: `profile-custom-${Date.now()}`,
      name: currentProfile.name || 'Custom Candidate Profile',
      email: currentProfile.email || 'investor.demo@mindyourmanners.work',
      city: currentProfile.city || 'Austin, TX',
      roleName: currentProfile.selectedJob?.roleName || 'Executive Role',
      minExperienceYears: currentProfile.selectedJob?.minExperienceYears || 5,
      expectedSalary: '$180,000 / yr',
      createdAt: new Date().toISOString(),
      isInvestorPreset: false,
      notes: saveLabel.trim() || `Saved Profile: ${currentProfile.name || 'Custom Candidate'}`,
      ethicsAnswers: currentProfile.ethicsAnswers,
      etiquetteAnswers: currentProfile.etiquetteAnswers,
      mannersAnswers: currentProfile.mannersAnswers,
      archetypeAnswers: currentProfile.archetypeAnswers,
      archetypeProjection: currentProfile.archetypeProjection,
      toneAudioTranscript: currentProfile.toneAudioTranscript,
      toneAudioUrl: currentProfile.toneAudioUrl,
      vocalEvaluationResult: currentProfile.vocalEvaluationResult,
      pressureVideoTranscript: currentProfile.pressureVideoTranscript,
      pressureVideoUrl: currentProfile.pressureVideoUrl,
      videoEvaluationResult: currentProfile.videoEvaluationResult,
      evaluationResult: currentProfile.evaluationResult,
      customPosition: currentProfile.selectedJob
    };

    const updated不易 = [profileToSave, ...savedProfiles.filter(p => p.id !== profileToSave.id)];
    setSavedProfiles(updated不易);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated不易));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }

    if (onSaveCurrentProfile) {
      onSaveCurrentProfile(saveLabel);
    }

    setSaveLabel('');
    setNotificationMsg('✅ Profile successfully saved to your workspace library!');
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedProfiles.filter(p => p.id !== id);
    setSavedProfiles(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div id="investor-profile-studio" className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-amber-500/40 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Star className="w-3 h-3 fill-black" />
              INVESTOR DEMO STUDIO & GROUND-ZERO PROFILE BUILDER
            </span>
            <span className="text-zinc-400 text-[11px] font-mono">
              • Real-time Biometrics, Kinesics & Dossier Engine
            </span>
          </div>

          <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Executive Candidate Profile Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1 max-w-2xl leading-relaxed">
            Switch between verified executive demo profiles, build a personalized candidate profile from ground zero, or save custom candidate tests into your workspace.
          </p>
        </div>

        {/* Quick Ground-Zero & Dossier Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            type="button"
            onClick={onResetToGroundZero}
            className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>✨ Build from Ground Zero (Blank Slate)</span>
          </button>

          {currentProfile.evaluationResult && (
            <button
              type="button"
              onClick={onOpenDossier}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>View Executive Boardroom Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-amber-400 text-black font-bold shadow-md'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Executive Demo Presets ({investorPresets.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-amber-400 text-black font-bold shadow-md'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Saved Workspace Profiles ({savedProfiles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'create'
              ? 'bg-amber-400 text-black font-bold shadow-md'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Current Assessment</span>
        </button>
      </div>

      {/* TAB 1: INVESTOR EXECUTIVE PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Select an executive profile to instantly load certified video kinesics, acoustic voice, and ethics scores:
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> All 3 Presets 100% Certified Passing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {investorPresets.map((preset) => {
              const isSelected = currentProfile.name === preset.name;
              return (
                <div
                  key={preset.id}
                  onClick={() => onLoadProfile(preset)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-zinc-900/90 border-amber-400 ring-2 ring-amber-400/30 shadow-xl'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-bold font-serif text-lg shadow-md">
                        {preset.name.charAt(0)}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          {preset.evaluationResult?.civilityScore || 95}% Civility
                        </span>
                        <div className="text-[10px] font-mono text-zinc-400 mt-1">{preset.expectedSalary}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-serif italic text-lg font-bold text-white flex items-center gap-1.5">
                        <span>{preset.name}</span>
                        {isSelected && <span className="text-[10px] font-mono not-italic px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded">ACTIVE</span>}
                      </h4>
                      <p className="text-xs text-amber-300/90 font-mono font-medium line-clamp-1">
                        {preset.roleName}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {preset.city}</span>
                        <span>•</span>
                        <span>{preset.minExperienceYears} yrs exp</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-2 border-t border-zinc-800/80 pt-2">
                      {preset.notes}
                    </p>

                    {/* Key Metrics Pill Row */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-black/60 p-2 rounded-lg border border-zinc-800 text-[10px] font-mono">
                        <span className="text-zinc-400 block">Eye Contact:</span>
                        <span className="text-emerald-300 font-bold">
                          {preset.videoEvaluationResult?.bodyLanguageMetrics?.eyeContactConsistencyPercent || 97}% Lens Lock
                        </span>
                      </div>
                      <div className="bg-black/60 p-2 rounded-lg border border-zinc-800 text-[10px] font-mono">
                        <span className="text-zinc-400 block">Vocal Poise:</span>
                        <span className="text-cyan-300 font-bold">
                          {preset.vocalEvaluationResult?.overallVocalScore || 96}% Clear
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadProfile(preset);
                    }}
                    className={`w-full py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-black shadow'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Loaded in Portal' : 'Load Executive Profile'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SAVED WORKSPACE PROFILES */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedProfiles.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-3">
              <FolderOpen className="w-10 h-10 text-zinc-500 mx-auto" />
              <div className="text-sm font-mono text-zinc-300 font-bold">No Custom Saved Profiles in Workspace Yet</div>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Complete a test recording or custom assessment, then click "Save Current Assessment" to store customized candidate benchmarks.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Active Candidate Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProfiles.map((p) => {
                const isSelected = currentProfile.name === p.name;
                return (
                  <div
                    key={p.id}
                    onClick={() => onLoadProfile(p)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-zinc-900 border-emerald-400 ring-2 ring-emerald-400/20'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono text-zinc-400">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteProfile(p.id, e)}
                          title="Delete saved profile"
                          className="p-1 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <h4 className="font-serif italic text-base font-bold text-white">{p.name}</h4>
                        <p className="text-xs text-amber-300 font-mono line-clamp-1">{p.roleName}</p>
                        <p className="text-[11px] text-zinc-400 font-sans mt-0.5 line-clamp-1">{p.notes}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Score: {p.evaluationResult?.civilityScore || p.videoEvaluationResult?.overallVideoScore || 90}%
                        </span>
                        {p.city && (
                          <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {p.city}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoadProfile(p);
                      }}
                      className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Load into Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVE CURRENT CANDIDATE ASSESSMENT */}
      {activeTab === 'create' && (
        <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-300">
            <Save className="w-4 h-4" />
            <h4 className="font-serif italic text-base font-bold text-white">Save Current Candidate to Workspace Library</h4>
          </div>

          <p className="text-xs text-zinc-300 font-sans leading-relaxed">
            Preserve all current answers, voice acoustics, video biometrics, transcripts, and custom role parameters under a dedicated profile record.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Candidate Name:</label>
              <div className="p-2.5 bg-black/70 border border-zinc-700 rounded-lg text-xs font-mono text-white">
                {currentProfile.name || 'Anonymous Candidate'}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Role / Position:</label>
              <div className="p-2.5 bg-black/70 border border-zinc-700 rounded-lg text-xs font-mono text-amber-300">
                {currentProfile.selectedJob?.roleName || 'Executive Role'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Custom Notes / Assessment Tag:</label>
            <input
              type="text"
              value={saveLabel}
              onChange={(e) => setSaveLabel(e.target.value)}
              placeholder="e.g. Investor Live Demo Candidate - Tested on 4K Webcam"
              className="w-full p-2.5 bg-black/70 border border-zinc-700 rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveToLocalStorage}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save to Workspace Library</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
