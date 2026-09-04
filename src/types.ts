export type UserRole = 'business' | 'candidate';

export type AuthMode = 'corporate' | 'candidate' | 'universal' | 'guest';

export interface AuthUser {
  email: string;
  role: AuthMode;
  name: string;
  organization?: string;
  plan?: 'Starter' | 'Growth' | 'Enterprise';
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  videoStorageGb: number;
  candidateLimitPerMonth: number;
  jobPostingsLimit: number;
  features: string[];
  recommended?: boolean;
}

export interface CustomQuestions {
  ethics: string[];
  etiquette: string[];
  manners: string[];
  toneScenario: string;
  pressureScenario: string;
  motivationScenario: string;
}

export interface JobRequirement {
  id: string;
  title: string;
  roleName: string;
  ageRange: string;
  minExperienceYears: number;
  skills: string[];
  uniqueExceptionsCriteria: string; // e.g. "Equivalent self-taught military/open-source experience accepted in lieu of CS degree"
  radiusMiles: number;
  offerRelocationCost: boolean;
  relocationBudgetAmount: number;
  locationCity: string;
  customQuestions: CustomQuestions;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export interface SingleResponseEvaluationResult {
  score: number; // 0.0 - 100.0 (e.g. 94.6%)
  exactGrade: string; // e.g. "94.6% - High Diplomatic Precision"
  isPassing: boolean; // true if score >= 80
  ladderStatus: string; // e.g. "80%+ Passing Threshold • Climbing the Certification Ladder"
  wordAnalysis: {
    wordCount: number;
    strongKeywordsUsed: string[];
    weakOrRiskWords: string[];
    tonePacing: string;
    grammarPrecision: string; // Informational syntax check (de-emphasized)
  };
  whatNeedsImprovementToReach100: string; // Actionable coaching explanation on what needs to be improved to reach 100%
  whatShouldHaveBeenDoneInstead: string; // Model Gold Standard response & what should have been done instead to tune for the role
  positionTuningHint: string; // Specific advice to align response with the target position
  keyStrengths: string[];
  coachingTipsForPerfection: string[];
  evaluatedAt?: string;
}

export interface VocalScoringResult {
  spokenAudioSummary?: string; // What was spoken in the voice recording as analyzed by audio AI
  overallVocalScore: number; // 0.0 - 100.0
  pitchModulationScore: number; // 0.0 - 100.0 (tone variance, inflections, absence of robotic or aggressive pitch spikes)
  emotionalComposureScore: number; // 0.0 - 100.0 (warmth, decibel steadiness, lack of tremors/irritation)
  cadencePacingScore: number; // 0.0 - 100.0 (speech rate, hesitation gaps, articulation clarity)
  verbalSubstanceScore: number; // 0.0 - 100.0 (diplomatic de-escalation, conflict resolution keywords)
  exactGrade: string;
  isPassing: boolean;
  ladderStatus: string;
  targetPosition?: string;
  positionQuestion?: string;
  trueToFactAnalysis?: {
    factualSubstanceScore: number; // e.g. 94.2
    roleAlignmentScore: number; // e.g. 96.0
    truthfulnessRating: string; // e.g. "Highly Factual & Grounded in Practical Execution"
    evidenceAssessment: string; // Overview of factual depth and concrete evidence provided
    pinpointedImprovements: Array<{
      area: string;
      observation: string;
      recommendation: string;
    }>;
    calculatedStrengths: Array<{
      strength: string;
      evidence: string;
    }>;
  };
  acousticMetrics: {
    pitchStabilityPercent: number;
    decibelSteadiness: string; // e.g. "Optimal Dynamic Range (54 - 68 dB)"
    speechPacingWpm: number; // Words per minute
    silenceHesitationRatioPercent: number;
    inflectionWarmthRating: string; // e.g. "Warm & Diplomatic", "Measured Executive"
  };
  vocalToneFeedback: string; // Evaluation of vocal tone, pitch & delivery
  verbalResponseFeedback: string; // Evaluation of what was said in response
  whatNeedsImprovementToReach100: string;
  whatShouldHaveBeenDoneInstead: string;
  exemplarVocalDelivery: string;
  keyStrengths: string[];
  coachingTipsForPerfection: string[];
  evaluatedAt: string;
}

export interface VideoScoringResult {
  overallVideoScore: number; // 0.0 - 100.0
  bodyLanguageScore: number; // 0.0 - 100.0 (eye contact, posture, calm facial expressions, zero fidgeting)
  responseToneScore: number; // 0.0 - 100.0 (voice tone under crisis pressure, vocal projection)
  crisisResponseSubstanceScore: number; // 0.0 - 100.0 (emergency protocol execution, clear decision-making)
  genuineResponseScore?: number; // 0.0 - 100.0 (authenticity, natural affect, absence of forced masking)
  exactGrade: string;
  isPassing: boolean;
  ladderStatus: string;
  scenarioTitle?: string;
  scenarioPrompt?: string;
  scientificKinesics?: {
    presenceDetected: boolean; // Whether a real human candidate face/head was detected in the frame
    presenceConfidencePercent: number; // 0 - 100% confidence of human subject presence
    diagnosticMessage?: string; // e.g. "Human Subject Verified" or "No Candidate Face Detected in Frame"
    oculometrics: {
      fixationRatioPercent: number; // % of time gaze is anchored on lens/listener
      saccadeFrequencyPerMin: number; // Rapid gaze shifts/min
      gazeAversionPattern: 'direct_anchored' | 'cognitive_gating_lateral' | 'nervous_downward_avoidance' | 'hyper_vigilant_scanning' | 'no_face_detected';
      cognitiveVsNervousAnalysis: string; // Scientific differentiation between cognitive load and nervous avoidance
      blinkRatePerMin: number; // Normal: 15-20; Stress: 45+
      blinkStressClassification: 'normal_relaxed' | 'mild_alertness' | 'elevated_sympathetic_stress';
    };
    kinesicMovements: {
      posturalSwayIndex: number; // 0 - 100 (torso stability vs oscillation)
      adaptorFrequency: string; // 'Minimal / Grounded' | 'Mild Self-Soothing Adaptors' | 'Frequent Nervous Pacifiers'
      illustratorEffectiveness: string; // 'High Speech-Gesture Synchrony' | 'Suppressed Movement' | 'Rigid Tonic Freeze'
      nervousSystemState: 'regulated_ventral' | 'sympathetic_arousal' | 'dorsal_freeze' | 'unverified';
      shoulderTensionScore: number; // 0 (relaxed) to 100 (elevated/tense)
    };
    developmentalTrainingPlan: {
      candidateField: string;
      primaryGrowthArea: string;
      scientificBehavioralInsight: string;
      dailyDrills: Array<{
        title: string;
        objective: string;
        protocol: string;
        scientificRationale: string;
      }>;
      careerProjectionAdvantage: string;
    };
  };
  bodyLanguageMetrics: {
    eyeContactConsistencyPercent: number;
    postureSteadinessPercent: number;
    facialComposureRating: string; // e.g. "Relaxed Executive Composure", "Zero Defensive Micro-Expressions"
    fidgetingIndex: string; // e.g. "Minimal / Composed", "Steady Hand Control"
    gesturePoise: string; // e.g. "Controlled & Purposeful", "Reassuring Anchor"
    shoulderTensionRating?: string; // e.g. "Relaxed & Level", "Minimal Micro-Tension"
    microExpressionStatus?: string; // e.g. "Congruent & Open", "Authentic Duchenne Micro-Cues"
  };
  authenticityMetrics?: {
    genuineResponseIndexPercent: number; // 0 - 100%
    affectCongruenceRating: string; // e.g. "High Verbal-Emotional Harmony"
    spontaneityLevel: string; // e.g. "Natural, Spontaneous & Thoughtful"
    vocalWarmthSteadiness: string; // e.g. "Consistent Unforced Pitch Resonance"
    facialAuthenticityAudit: string; // e.g. "Absence of masked anxiety or forced pleasantness"
  };
  acousticMetrics?: {
    pitchF0Hz: number;
    pitchStabilityPercent: number;
    speechPacingWpm: number;
    jitterPercent: number; // Pitch perturbation (< 1.5% is executive calm)
    shimmerPercent: number; // Amplitude perturbation (< 3.8% is steady breath control)
    hnrDb: number; // Harmonics-to-Noise ratio in dB (> 15 dB is clear resonant tone)
    averageDb: number;
    peakDb: number;
    silenceHesitationRatioPercent: number;
    pauseCount: number;
    detectedVoiceType: string;
    spectralWarmthRating: string;
    vocalTremorClassification: 'executive_calm' | 'regulated_alert' | 'sympathetic_tremor';
    waveformEnvelope?: number[];
  };
  neutralFeedbackCalculation?: {
    objectiveCriteriaScore: number; // 0 - 100%
    biasFreeSummary: string; // Neutral, data-grounded assessment
    observedBehaviors: string[]; // Observable facts only (e.g., "Maintained direct eye contact for 94% of playback duration")
    neutralConstructiveGuidance: string; // Constructive guidance framed objectively
    auditStandardCompliance: string; // e.g. "Certified Neutral Evaluation Standard"
  };
  timelineMarkers?: Array<{
    timestampSec: number;
    timeFormatted: string; // e.g. "0:08"
    markerType: 'tone' | 'body_movement' | 'expression' | 'authenticity' | 'protocol';
    label: string;
    score: number;
    observation: string;
  }>;
  bodyLanguageFeedback: string; // In-depth analysis of physical poise & body language
  responseToneFeedback: string; // In-depth analysis of vocal delivery & tone in video
  crisisMitigationFeedback: string; // In-depth analysis of crisis containment strategy
  whatNeedsImprovementToReach100: string;
  whatShouldHaveBeenDoneInstead: string;
  exemplarCrisisResponse: string;
  keyStrengths: string[];
  coachingTipsForPerfection: string[];
  evaluatedAt: string;
}

export interface TrueCallingEvaluationResult {
  overallCallingScore: number; // 0.0 - 100.0
  callingSummary: string; // Deep narrative calculation of their inner self and calling
  passionHighestPointAnalysis: {
    currentZenithScore: number; // 0-100
    isAtPeak: boolean;
    howToFuelToHighestPoint: string;
    acceleratorConditions: string[];
  };
  innerSelfAttributes: {
    compassionGravityScore: number; // 0-100
    authenticConvictionScore: number; // 0-100
    resilientIntegrityScore: number; // 0-100
    visionaryPalaceScore: number; // 0-100
    unshakablePurposeScore: number; // 0-100
  };
  lifesPalaceArchitecture: {
    foundationLifeEndeavors: string;
    compassionFuelDescription: string;
    truestPotentialManifesto: string;
  };
  unseenCallingOpportunities: Array<{
    title: string;
    reasoning: string;
    whyPreviouslyUnseen: string;
    actionableFirstStep: string;
  }>;
  keyStrengths: string[];
  candidateReflectivePitch: string;
  evaluatedAt: string;
}

export interface CandidateEvaluation {
  civilityScore: number; // 0-100
  toneScore: number;     // 0-100
  ethicsScore: number;   // 0-100
  pressureScore: number; // 0-100
  driveScore: number;    // 0-100
  overallSummary: string;
  toneEvaluation: string;
  pressureEvaluation: string;
  ethicsEvaluation: string;
  driveEvaluation: string;
  keyStrengths: string[];
  potentialRisks: string[];
  recommendationTier: 'Top Prospect' | 'Strong Fit' | 'Needs Review' | 'Not Recommended';
  vocalEvaluation?: VocalScoringResult;
  videoEvaluation?: VideoScoringResult;
  trueCallingEvaluation?: TrueCallingEvaluationResult;
  evaluatedAt: string;
}

export interface CandidateSubmission {
  jobId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateCity?: string;
  bgCheckConsented?: boolean;
  bgCheckSignedAt?: string;
  bgCheckSsnLast4?: string;
  ethicsAnswers: Record<string, string>;
  etiquetteAnswers: Record<string, string>;
  mannersAnswers: Record<string, string>;
  toneAudioTranscript: string;
  toneAudioDurationSec: number;
  toneAudioUrl?: string;
  vocalEvaluation?: VocalScoringResult;
  pressureVideoTranscript: string;
  pressureVideoDurationSec: number;
  pressureVideoUrl?: string;
  videoEvaluation?: VideoScoringResult;
  callingVideoPrompt?: string;
  callingVideoTranscript?: string;
  callingVideoDurationSec?: number;
  callingVideoUrl?: string;
  trueCallingEvaluation?: TrueCallingEvaluationResult;
  motivationVideoTranscript: string;
  motivationVideoDurationSec: number;
  motivationVideoUrl?: string;
  submittedAt: string;
}

export interface CandidateResume {
  fileName: string;
  fileSize: number;
  parsedText?: string;
  summaryHighlights?: string[];
  uploadedAt: string;
}

export interface ArchetypeProjection {
  title: string; // e.g., "The Strategic Crisis Diplomat"
  primaryCategory: 'Executive Strategist' | 'Crisis Resilient Leader' | 'Ethical Sentinel' | 'Adaptive Catalyst' | 'Pragmatic Operator';
  summary: string;
  dimensions: {
    resilience: number;
    ethicsIntegrity: number;
    diplomaticTact: number;
    highPressureComposure: number;
    innovationDrive: number;
  };
  keyBehavioralTraits: string[];
  optimalWorkEnvironment: string;
  questionsAnswers: Record<string, string>;
  generatedAt: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  locationCity: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  geohash?: string; // Standard geohash e.g. "9q8yyk8"
  age: number;
  experienceYears: number;
  skills: string[];
  distanceFromCompanyMiles: number;
  willingToRelocate: boolean;
  bgCheckConsented?: boolean;
  bgCheckSignedAt?: string;
  bgCheckSsnLast4?: string;
  currentCompany: string;
  currentRole: string;
  isCompetitorProspect: boolean;
  competitorNotes?: string;
  matchesUniqueExceptions?: boolean;
  exceptionMatchReason?: string;
  submission?: CandidateSubmission;
  evaluation?: CandidateEvaluation;
  resume?: CandidateResume;
  archetypeProjection?: ArchetypeProjection;
  trueCallingEvaluation?: TrueCallingEvaluationResult;
  linkedinUrl?: string;
  linkedinHeadline?: string;
  linkedinConnectionsCount?: number | string;
  linkedinVerified?: boolean;
  linkedinOpenToWork?: boolean;
  linkedinMutualConnections?: number;
  linkedinImportedAt?: string;
  linkedinResumeData?: {
    summary?: string;
    experiences?: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    certifications?: string[];
    skills?: string[];
    rawParsedResumeText?: string;
    importedAt?: string;
  };
  status: 'applied' | 'screening' | 'top_prospect' | 'hired' | 'declined';
}

export interface LinkedInAuthAccount {
  id?: string;
  uid?: string;
  connected: boolean;
  linkedInName: string;
  linkedInEmail: string;
  linkedInHeadline: string;
  linkedInProfileUrl: string;
  accessTokenExpiry: string;
  recruiterSeatActive: boolean;
  openToWorkNetworkEnabled: boolean;
  connectedAt: string;
}

export interface LinkedInScoutQuery {
  id: string;
  roleQuery: string;
  locationQuery: string;
  skillsQuery: string[];
  filterMode: string;
  linkedInVerifiedOnly: boolean;
  resultsCount: number;
  searchedBy: string;
  timestamp: string;
}

export interface TalentRadarSignal {
  id: string;
  platform: 'LinkedIn' | 'Industry News / Gossip' | 'Search Pings' | 'Competitor Watch';
  candidateName: string;
  currentCompany: string;
  roleTitle: string;
  signalDescription: string;
  switchLikelihood: number; // percentage
  timestamp: string;
  suggestedAction: string;
}

export interface EmployeeScorecardEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  evaluationDate: string; // e.g. "2026-08-01" or "Q2 2026 Refresher"
  assessmentType: 'Baseline Hire' | 'Q1 Review' | 'Q2 Review' | 'Q3 Review' | 'Q4 Review' | 'Annual Refresher' | 'Crisis Retraining';
  civilityScore: number;
  toneScore: number;
  ethicsScore: number;
  pressureScore: number;
  driveScore: number;
  overallScore: number;
  deltaImprovementPercent: number; // e.g. +12%
  managerNotes: string;
  keyImprovements: string[];
  focusAreasForNextQuarter: string[];
  completedModulesCount: number;
  status: 'verified' | 'pending_review';
}

export interface EmployeeJourneyRecord {
  id: string; // matches employee profile / candidate profile ID
  employeeName: string;
  email: string;
  role: string;
  department: string;
  hireDate: string;
  certificationLevel: 'Civility Practitioner' | 'Senior Ethics Certified' | 'Executive Crisis Master' | 'Master Ambassador';
  overallCurrentScore: number;
  scorecardHistory: EmployeeScorecardEntry[];
  assignedRefresherModules: string[];
  lastAssessedAt: string;
}

export interface TrainingSessionRecord {
  id: string;
  companyId?: string;
  companyName: string;
  scenarioTitle: string;
  scenarioType: 'tone' | 'crisis' | 'ethics' | 'etiquette';
  prompt: string;
  candidateName: string;
  transcript: string;
  score: number;
  feedback: string;
  audioBlobUrl?: string;
  videoBlobUrl?: string;
  timestamp: string;
}

export interface CrisisScenarioRecord {
  id: string;
  companyId?: string;
  title: string;
  prompt: string;
  category: string;
  createdAt: string;
}

export interface FeedComment {
  id: string;
  authorName: string;
  authorRole?: string;
  text: string;
  timestamp: string;
}

export interface HiringLikelihoodAreaImprovement {
  criterion: 'Tone & Demeanor' | 'Honesty & Ethics' | 'Impress Under Pressure' | 'Sustain & Drive' | 'Field Nuance';
  currentScore: number;
  targetScore: number;
  gapSummary: string;
  actionableCoaching: string;
  estimatedLikelihoodImpact: number; // e.g. 8 for +8%
}

export interface HiringLikelihoodPrediction {
  id: string;
  targetCompany: string;
  targetField: string;
  targetRole: string;
  currentStatusScore: number; // 0-100
  currentLikelihoodPercent: number; // 0-100
  potentialUpsidePercent: number; // 0-100 (e.g. 96)
  cultureAlignmentScore: number; // 0-100
  thisSystemBreakdown: {
    toneScore: number;
    honestyScore: number;
    impressUnderPressureScore: number;
    sustainMotivationScore: number;
    completedDrillsCount: number;
    hoursInvested: number;
  };
  criticalAreasToImprove: HiringLikelihoodAreaImprovement[];
  targetCompanyCultureProfile: {
    knownValues: string[];
    cultureVibe: string;
    keyPersonalityMatches: string[];
    whatEmployersSeek: string;
  };
  recommendedPracticeScenario: {
    title: string;
    scenarioPrompt: string;
    evaluationGoal: string;
  };
  summaryVerdict: string;
  calculatedAt: string;
}

export interface PositiveArchetypeProfile {
  id: string;
  archetypeName: string; // e.g. "The Diplomatic Anchor", "The Resilient Pioneer", "The Empathic Catalyst"
  positiveTagline: string;
  rarityLevel: string; // e.g. "Distinctive Strength Profile • Top 8% Character Rarity"
  coreStrengths: string[];
  positiveWorkProcess: string; // How their mind and process uniquely creates value
  characterAssets: {
    diplomaticGrace: number;
    ethicalAnchor: number;
    pressureEquilibrium: number;
    collaborativeEmpathy: number;
    strategicVision: number;
    adaptiveResilience: number;
  };
  optimalCompanyEnvironments: string[];
  whyEmployersNeedThisArchetype: string; // Symmetrical employer lens: what friction this archetype prevents/resolves
  candidateInterviewPitch: string; // How candidate can proudly articulate their distinct character asset in interviews
  positiveBadges: string[];
  generatedAt: string;
}

export interface CompanyJobAd {
  id: string;
  companyName: string;
  companyLogoUrl?: string;
  title: string;
  department: string;
  locationCity: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-Site';
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  commissionRate: number; // e.g. 12% of first-year salary
  commissionModel: 'percentage' | 'flat_fee';
  flatCommissionAmount?: number;
  targetArchetypes: string[]; // e.g. ["The Diplomatic Anchor", "The Resilient Pioneer"]
  requiredMinCivilityScore: number; // e.g. 85
  description: string;
  keyResponsibilities: string[];
  ethicsMandate: string;
  adPricingType: 'free_with_commission'; // $0.00 upfront to publish
  status: 'active' | 'paused' | 'filled' | 'archived';
  metrics: {
    impressions: number;
    views: number;
    applicantsCount: number;
    shortlistedCount: number;
    hiredCandidateId?: string;
    hiredCandidateName?: string;
    hiredDate?: string;
    agreedHireSalary?: number;
    commissionAmountBilled?: number;
    commissionPaymentStatus?: 'unbilled' | 'pending_escrow' | 'invoiced' | 'paid';
  };
  createdAt: string;
}

export interface AdApplication {
  id: string;
  adId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateLocation: string;
  candidateCivilityScore: number;
  candidateArchetype: string;
  candidateResumeHighlights?: string[];
  status: 'submitted' | 'under_review' | 'shortlisted' | 'offer_extended' | 'hired' | 'rejected';
  appliedAt: string;
  offerAcceptedAt?: string;
  finalHiringSalary?: number;
  calculatedCommission?: number;
}

export interface CommissionInvoiceRecord {
  id: string;
  adId: string;
  companyName: string;
  candidateName: string;
  candidateEmail?: string;
  roleTitle: string;
  agreedSalary: number;
  commissionPercentage: number;
  totalCommission: number;
  savingsVsAgency: number; // e.g. 25% agency fee ($35k) vs 12% ($16.8k) = $18.2k saved
  invoiceDate: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'waived_enterprise';
  invoiceNumber: string;
  paymentMethod?: string;
}

export interface RecentHireFeedItem {
  id: string;
  candidateId?: string;
  candidateName: string;
  candidateRole: string;
  previousCompany?: string;
  locationCity?: string;
  linkedinUrl?: string;
  linkedinPhotoUrl?: string;
  hiredDate: string;
  civilityScore?: number;
  hiredForJobTitle: string;
  scoutedBy: string;
  keyStrengthBadge?: string;
  likesCount: number;
  likedByUsers?: string[];
  comments: FeedComment[];
  announcementText: string;
  timestamp: string;
}

export interface SavedCandidateProfile {
  id: string;
  name: string;
  email: string;
  city: string;
  roleName: string;
  minExperienceYears: number;
  expectedSalary?: string;
  createdAt: string;
  isInvestorPreset?: boolean;
  notes?: string;
  ethicsAnswers: Record<string, string>;
  etiquetteAnswers: Record<string, string>;
  mannersAnswers: Record<string, string>;
  archetypeAnswers: Record<string, string>;
  archetypeProjection?: ArchetypeProjection | null;
  toneAudioTranscript?: string;
  toneAudioUrl?: string | null;
  vocalEvaluationResult?: VocalScoringResult | null;
  pressureVideoTranscript?: string;
  pressureVideoUrl?: string | null;
  videoEvaluationResult?: VideoScoringResult | null;
  callingVideoTranscript?: string;
  callingVideoUrl?: string | null;
  callingVideoDurationSec?: number;
  trueCallingEvaluation?: TrueCallingEvaluationResult | null;
  evaluationResult?: CandidateEvaluation | null;
  customPosition?: JobRequirement;
}

export {
  type ScientificPillarDefinition,
  type CandidatePerformanceInputs,
  type ActionablePillarGrowthVector,
  type UnifiedScientificGrowthReport
} from './lib/scientificFramework';
