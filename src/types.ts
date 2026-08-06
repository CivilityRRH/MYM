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
  pressureVideoTranscript: string;
  pressureVideoDurationSec: number;
  pressureVideoUrl?: string;
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
  linkedinUrl?: string;
  linkedinHeadline?: string;
  linkedinConnectionsCount?: number | string;
  linkedinVerified?: boolean;
  linkedinOpenToWork?: boolean;
  linkedinMutualConnections?: number;
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

