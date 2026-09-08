/**
 * EvaluationLogicEngine
 * 
 * Master biometrics and behavioral evaluation engine that maps specific audio/video cues
 * (speech tempo, vocal cord jitter, shimmer, acoustic tone, oculometrics, and postural kinesics)
 * to transparent weighted scoring criteria for Job Adequacy, Cultural Fit, and Procedural Rigor.
 * 
 * CRITICAL DIRECTIVE:
 * Accurately recognizes and rewards authoritative, firm, or decisive responses.
 * Authoritative firmness and decisive crisis command (e.g. taking operational command,
 * establishing triage sequences, maintaining steady acoustic resonance with downward terminal cadence)
 * are celebrated as top-tier executive leadership—strictly differentiated from toxic hostility
 * or callous disregard.
 */

import {
  EvaluationCuesInput,
  EvaluationWeightsConfig,
  EvaluationLogicResult,
  AuthoritativeDecisivenessAudit,
  ToneDecisivenessCalibrationResult,
  CueContributionItem,
  RetryRecommendation,
  RecordedResponseAttempt,
  MicroFlawItem,
  MicroFlawPrecisionDiagnostic,
  ToxicHostilityAudit,
  FacialComposureAndExperientialVeracity
} from '../types.ts';
import { EvaluationCalibrationService } from './evaluationCalibrationService.ts';
import { FacialCuesScienceEngine } from './facialCuesScienceEngine.ts';
export { EvaluationCalibrationService, FacialCuesScienceEngine };

export const DEFAULT_EVALUATION_WEIGHTS: EvaluationWeightsConfig = {
  jobAdequacy: {
    proceduralContainment: 0.40,     // 40% substance, protocol containment, and actionable resolution
    operationalDecisiveness: 0.25,   // 25% authoritative operational decisiveness & command
    tempoCadenceExecution: 0.20,     // 20% tempo cadence within optimal polyvagal window
    somaticSteadiness: 0.15,         // 15% kinesic steadiness and ocular fixation
  },
  culturalFit: {
    constructiveLeadershipFirmness: 0.35, // 35% distinguishes firm decisiveness from hostility
    psychologicalSafetyReassurance: 0.25, // 25% team psychological safety & transparency
    moralAccountabilityDutyOfCare: 0.25,  // 25% moral accountability & zero-tolerance for dereliction
    authenticAffectCongruence: 0.15,      // 15% authentic affect & autonomic equilibrium
  },
  proceduralRigor: {
    stepByStepContainment: 0.40,          // 40% concrete sequential triage
    transparentEscalation: 0.30,          // 30% time-boxed stakeholder communication
    ethicalCompliance: 0.30,              // 30% ethical workplace compliance
  }
};

export interface TempoAnalysis {
  wpm: number;
  cadenceClassification: 'Optimal Executive (125-155 WPM)' | 'Measured Deliberate (100-124 WPM)' | 'Rapid Pressure (156-180 WPM)' | 'Frantic Rushed (>180 WPM)' | 'Hesitant Hesitation (<100 WPM)';
  hesitationRatio: number;
  pauseDiscipline: string;
  jobAdequacyDelta: number;
  culturalFitDelta: number;
  rationale: string;
}

export interface JitterAnalysis {
  jitterPercent: number;
  shimmerPercent: number;
  hnrDb: number;
  stabilityClassification: 'Executive Calm (< 1.2% Jitter)' | 'Regulated Alertness (1.2% - 2.2%)' | 'Nervous Sincerity (2.2% - 3.5%)' | 'Acute Sympathetic Tremor (> 3.5%)';
  autonomicState: 'Ventral Vagal Composure' | 'Controlled Sympathetic' | 'Adrenalized Sincerity' | 'Autonomic Dysregulation';
  jobAdequacyDelta: number;
  culturalFitDelta: number;
  rationale: string;
}

export interface ToneAnalysis {
  pitchStabilityPercent: number;
  terminalInflection: 'definitive_downward' | 'questioning_uptalk' | 'steady_neutral' | 'flat_monotone';
  spectralWarmth: string;
  inflectionQuality: string;
  jobAdequacyDelta: number;
  culturalFitDelta: number;
  rationale: string;
}

export interface DecisiveCommandAnalysis {
  decisiveScore: number;
  isAuthoritativeFirm: boolean;
  commandVerbsDetected: string[];
  firmnessClassification: 'commanding_reassuring' | 'respectful_firmness' | 'passive_hesitant' | 'toxic_callousness';
  decisivenessTier: 'Commanding Executive' | 'Firm Professional' | 'Developing Authority' | 'Hesitant / Passive' | 'Detached / Derelict';
  summary: string;
}

export class EvaluationLogicEngine {
  /**
   * Precision Tone & Decisiveness Calibration Service
   */
  public static readonly calibrationService = EvaluationCalibrationService;

  /**
   * Universal evaluation entrypoint that evaluates audio, video, and semantic cues
   * against weighted criteria for Job Adequacy, Cultural Fit, and Procedural Rigor.
   */
  public static evaluate(
    cues: EvaluationCuesInput,
    customWeights: Partial<EvaluationWeightsConfig> = {}
  ): EvaluationLogicResult {
    const weights: EvaluationWeightsConfig = {
      jobAdequacy: { ...DEFAULT_EVALUATION_WEIGHTS.jobAdequacy, ...(customWeights.jobAdequacy || {}) },
      culturalFit: { ...DEFAULT_EVALUATION_WEIGHTS.culturalFit, ...(customWeights.culturalFit || {}) },
      proceduralRigor: { ...DEFAULT_EVALUATION_WEIGHTS.proceduralRigor, ...(customWeights.proceduralRigor || {}) }
    };

    const cleanTranscript = (cues.transcript || '').trim();
    const words = cleanTranscript.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // 1. Check for Zero-Tolerance Dereliction of Duty
    const derelictionCheck = this.checkDereliction(cleanTranscript);
    if (derelictionCheck.isDerelict) {
      return this.generateDerelictionResult(cues, derelictionCheck.matchedTrigger);
    }

    // 1.5. Check for Zero-Tolerance Toxic Hostility, Insults & Ad-Hominem Attacks
    const toxicCheck = this.checkToxicHostility(cleanTranscript);
    if (toxicCheck.isToxic) {
      return this.generateToxicHostilityResult(cues, toxicCheck);
    }

    // 2. Perform Component DSP & Behavioral Analyzers
    const tempoAnalysis = this.analyzeSpeechTempo(
      cues.speechTempoWpm ?? (cues.audioDurationSec && cues.audioDurationSec > 0 ? Math.round((wordCount / (cues.audioDurationSec / 60))) : 134),
      cues.pauseCount ?? 3,
      cues.silenceHesitationRatioPercent ?? 12.0
    );

    const jitterAnalysis = this.analyzeJitterAndTremor(
      cues.jitterPercent ?? 1.15,
      cues.shimmerPercent ?? 2.85,
      cues.hnrDb ?? 18.2
    );

    const toneAnalysis = this.analyzeToneAndInflection(
      cues.pitchStabilityPercent ?? 92.5,
      cues.pitchF0Hz ?? 165,
      cleanTranscript,
      cues.spectralWarmthRating ?? 'Warm & Resonant',
      cues.terminalInflectionPattern
    );

    const kinesicScore = this.analyzeKinesicSomatic(cues);

    const decisiveAnalysis = this.analyzeDecisiveness(
      cleanTranscript,
      tempoAnalysis,
      jitterAnalysis,
      toneAnalysis,
      cues.roleTitle || 'Executive Lead'
    );

    // 2.5 Breakthrough: Precision Scenario Competency & Flaws Analysis
    const scenarioCompetency = this.analyzeScenarioCompetencyAndFlaws(
      cleanTranscript,
      cues.scenarioPrompt || cues.scenarioContext || '',
      cues.roleTitle || 'Executive Lead',
      tempoAnalysis,
      jitterAnalysis,
      toneAnalysis,
      decisiveAnalysis
    );

    // 2.6 Tone & Decisiveness Calibration Benchmark Service
    // Benchmarks 'neutral/diplomatic' tone against 'authoritative/decisive' responses
    // to prevent bias toward 'warm/diplomatic' results, ensuring firm or corrective
    // responses are correctly labeled as 'leadership-adequate' rather than just 'warm'.
    const calibrationResult = EvaluationCalibrationService.calibrate({
      transcript: cleanTranscript,
      cues,
      toneAnalysis,
      tempoAnalysis,
      jitterAnalysis,
      decisiveAnalysis,
      rawJobAdequacy: 75.0,
      rawCulturalFit: 80.0,
      roleTitle: cues.roleTitle
    });

    // 3. Compute Weighted Scores with Truth-Tested Substance Foundation
    // A. Job Adequacy Weighted Score (0-100)
    // 40% substance & procedural containment protocol
    // 25% authoritative operational decisiveness
    // 20% tempo cadence execution
    // 15% somatic steadiness
    const tempoJobScore = Math.min(99, Math.max(25, 72 + tempoAnalysis.jobAdequacyDelta));
    let rawAdequacy = 
      (scenarioCompetency.substanceScore * weights.jobAdequacy.proceduralContainment) +
      (decisiveAnalysis.decisiveScore * weights.jobAdequacy.operationalDecisiveness) +
      (tempoJobScore * weights.jobAdequacy.tempoCadenceExecution) +
      (kinesicScore * weights.jobAdequacy.somaticSteadiness);

    // Apply anti-warmth bias calibration offset to Job Adequacy
    let jobAdequacyScore = Math.min(98.8, Math.max(20.0, Math.round((rawAdequacy + calibrationResult.jobAdequacyCalibrationOffset) * 10) / 10));

    // B. Cultural Fit & Positive Demeanor Weighted Score (0-100)
    // constructiveLeadershipFirmness (35%), psychologicalSafetyReassurance (25%), moralAccountabilityDutyOfCare (25%), authenticAffect (15%)
    let firmnessFactor = decisiveAnalysis.isAuthoritativeFirm ? 92.0 : 74.0;
    if (calibrationResult.correctiveInterventions.length > 0) {
      firmnessFactor = Math.min(96.0, 88.0 + (calibrationResult.correctiveInterventions.length * 1.5));
    } else if (calibrationResult.calibratedLeadershipClassification.includes('Leadership-Adequate')) {
      firmnessFactor = Math.max(firmnessFactor, 84.0);
    }
    if (decisiveAnalysis.firmnessClassification === 'passive_hesitant') firmnessFactor = 62.0;

    // Truth-tested moral accountability & duty of care: evaluated via affirmative ownership tokens rather than mere word count
    const accountabilityTokens = [
      'ownership', 'responsible', 'responsibility', 'accountable', 'accountability',
      'contain', 'isolate', 'resolve', 'step', 'protocol', 'protect', 'safety',
      'support', 'duty', 'care', 'transparent', 'deliver', 'we will', 'i will', 'our team'
    ];
    const lowerClean = cleanTranscript.toLowerCase();
    const verifiedAccountabilityTokens = accountabilityTokens.filter(t => lowerClean.includes(t));
    let moralDutyScore = 62.0;
    if (verifiedAccountabilityTokens.length >= 3) {
      moralDutyScore = 92.0;
    } else if (verifiedAccountabilityTokens.length >= 1) {
      moralDutyScore = 78.0;
    } else if (wordCount < 10) {
      moralDutyScore = 35.0;
    }

    let reassuranceScore = Math.min(99, Math.max(25, 70 + toneAnalysis.culturalFitDelta + (jitterAnalysis.culturalFitDelta * 0.5) + (calibrationResult.biasMitigationApplied ? 2.0 : 0)));
    let authenticAffectScore = jitterAnalysis.stabilityClassification.includes('Nervous Sincerity') 
      ? 86.0 
      : (jitterAnalysis.stabilityClassification.includes('Acute Sympathetic Tremor') ? 60.0 : 88.0);

    let rawCultural = 
      (firmnessFactor * weights.culturalFit.constructiveLeadershipFirmness) +
      (reassuranceScore * weights.culturalFit.psychologicalSafetyReassurance) +
      (moralDutyScore * weights.culturalFit.moralAccountabilityDutyOfCare) +
      (authenticAffectScore * weights.culturalFit.authenticAffectCongruence);

    if (scenarioCompetency.flaws.some(f => f.category === 'Accountability & Blame')) {
      rawCultural -= 20.0;
    }
    if (scenarioCompetency.flaws.some(f => f.category === 'Acoustic-Verbal Dissonance')) {
      rawCultural -= 16.0;
    }

    // Apply anti-warmth bias calibration offset to Cultural Fit
    let culturalFitScore = Math.min(99.0, Math.max(20.0, Math.round((rawCultural + calibrationResult.culturalFitCalibrationOffset) * 10) / 10));

    // C. Procedural Rigor Weighted Score (0-100)
    let proceduralScore = Math.min(99.0, Math.max(20.0, Math.round((
      (scenarioCompetency.substanceScore * 0.45) +
      (jobAdequacyScore * 0.35) +
      (decisiveAnalysis.decisiveScore * 0.20)
    ) * 10) / 10));

    // Overall Composite Score
    let overallScore = Math.min(98.8, Math.max(20.0, Math.round((
      (jobAdequacyScore * 0.45) +
      (culturalFitScore * 0.35) +
      (proceduralScore * 0.20)
    ) * 10) / 10));

    // Tightened Grounding & Guardrails: Low substance, deficient job adequacy, or flaws strictly cap scores
    if (scenarioCompetency.substanceScore < 72.0) {
      overallScore = Math.min(overallScore, 74.0); // Strict gate: cannot pass without >= 72% substance
    }
    if (jobAdequacyScore < 75.0) {
      overallScore = Math.min(overallScore, 76.0); // Strict gate: cannot pass without >= 75% job adequacy
    }
    if (scenarioCompetency.flaws.some(f => f.severity === 'critical')) {
      overallScore = Math.min(overallScore, 24.5); // Immediate failure for critical flaws
    }
    const moderateFlawsCount = scenarioCompetency.flaws.filter(f => f.severity === 'moderate').length;
    if (moderateFlawsCount >= 2) {
      overallScore = Math.min(overallScore, 75.0); // Multiple significant deficiencies cap below 80% passing
    }

    // Strict Passing Requirement: Overall >= 80, Substance >= 72, Job Adequacy >= 75, No Critical Flaws, < 2 Moderate Flaws
    const isPassing = overallScore >= 80.0 && 
                      scenarioCompetency.substanceScore >= 72.0 && 
                      jobAdequacyScore >= 75.0 &&
                      !scenarioCompetency.flaws.some(f => f.severity === 'critical') &&
                      moderateFlawsCount < 2;

    // 4. Generate Cue Contribution Map
    const cueContributionMap = this.generateCueContributionMap(
      tempoAnalysis,
      jitterAnalysis,
      toneAnalysis,
      kinesicScore,
      decisiveAnalysis,
      cues
    );

    // 5. Genuineness Classification
    let genuinenessClassification: 'genuine_masterclass' | 'authoritative_command' | 'nervous_sincerity' | 'calculated_acting' | 'callous_apathy';
    let genuinenessLabel: string;
    let jitterMovementCorrelation: string;
    let trainingGuidance: string;

    if (decisiveAnalysis.isAuthoritativeFirm && isPassing) {
      genuinenessClassification = 'authoritative_command';
      genuinenessLabel = 'Authoritative Command & Decisive Poise';
      jitterMovementCorrelation = `Acoustic jitter measured at ${jitterAnalysis.jitterPercent}% with crisp tempo of ${tempoAnalysis.wpm} WPM and firm downward inflection. Candidate demonstrated authoritative, decisive command without defensive posturing, communicating structured operational leadership.`;
      trainingGuidance = 'Candidate excels in crisis command. Advance to multi-stakeholder board escalation simulations.';
    } else if (jitterAnalysis.stabilityClassification.includes('Nervous Sincerity')) {
      genuinenessClassification = 'nervous_sincerity';
      genuinenessLabel = 'Nervous Sincerity — Authentic & Highly Coachable';
      jitterMovementCorrelation = `Acoustic jitter elevated to ${jitterAnalysis.jitterPercent}%, but verbal content demonstrated total responsibility and genuine team commitment. Physiological nerves do not detract from moral ownership.`;
      trainingGuidance = 'Practice physiological sigh and diaphragmatic grounding before addressing high-stress escalations.';
    } else if (overallScore >= 90.0) {
      genuinenessClassification = 'genuine_masterclass';
      genuinenessLabel = 'Genuine Masterclass Leadership';
      jitterMovementCorrelation = `Balanced acoustic resonance (${jitterAnalysis.hnrDb} dB HNR) and low pitch perturbation (${jitterAnalysis.jitterPercent}%) paired with structured problem-solving.`;
      trainingGuidance = 'Candidate is fully certified for executive representation.';
    } else {
      genuinenessClassification = isPassing ? 'genuine_masterclass' : 'calculated_acting';
      genuinenessLabel = isPassing ? 'Solid Professional Demeanor' : 'Calculated Acting / Superficial Delivery';
      jitterMovementCorrelation = `Cadence clocked at ${tempoAnalysis.wpm} WPM. Delivery reflects baseline compliance.`;
      trainingGuidance = 'Ground responses with specific operational metrics and firmer sequential timelines.';
    }

    // 6. Assemble Authoritative Decisiveness Audit
    const authoritativeDecisivenessAudit: AuthoritativeDecisivenessAudit = {
      score: decisiveAnalysis.decisiveScore,
      decisivenessTier: decisiveAnalysis.decisivenessTier,
      isAuthoritativeFirm: decisiveAnalysis.isAuthoritativeFirm,
      tempoCadenceAnalysis: `Speaking cadence at ${tempoAnalysis.wpm} WPM (${tempoAnalysis.cadenceClassification}). ${tempoAnalysis.pauseDiscipline}`,
      jitterResonanceAnalysis: `Vocal cord jitter at ${jitterAnalysis.jitterPercent}% with ${jitterAnalysis.hnrDb} dB HNR. ${jitterAnalysis.autonomicState} supports steady command.`,
      terminalInflectionAnalysis: toneAnalysis.terminalInflection === 'definitive_downward'
        ? 'Demonstrated firm, downward terminal inflection, signaling definitive closure, confidence, and lack of hesitation.'
        : toneAnalysis.terminalInflection === 'questioning_uptalk'
        ? 'Exhibited slight upward terminal inflection (uptalk), which softens authority. Encourage ending declarative plans on a grounded downward pitch.'
        : 'Neutral, steady pitch trajectory maintained throughout statement.',
      commandVerbsDetected: decisiveAnalysis.commandVerbsDetected,
      leadershipStanceSummary: decisiveAnalysis.summary
    };

    // 7. Key Strengths & Coaching
    const keyStrengths: string[] = [];
    if (decisiveAnalysis.isAuthoritativeFirm) {
      keyStrengths.push('Authoritative, firm crisis command with clear sequential instructions');
    }
    if (tempoAnalysis.wpm >= 120 && tempoAnalysis.wpm <= 160) {
      keyStrengths.push(`Executive speech cadence (${tempoAnalysis.wpm} WPM) within optimal polyvagal delivery window`);
    }
    if (jitterAnalysis.jitterPercent <= 1.5) {
      keyStrengths.push(`Vocal cord micro-tremor under pressure measured at steady ${jitterAnalysis.jitterPercent}% (Executive Calm)`);
    }
    if (cleanTranscript.length > 80) {
      keyStrengths.push('Constructive operational ownership with direct action verbs');
    }
    if (keyStrengths.length === 0) {
      keyStrengths.push('Maintained continuous audio recording presence', 'Respectful baseline tone');
    }

    const targetedCoaching: string[] = [];
    if (scenarioCompetency.diagnostic.hasFlaws) {
      for (const fl of scenarioCompetency.flaws) {
        targetedCoaching.push(`[${fl.category}] ${fl.positiveGrowthCoaching}`);
      }
    }
    if (toneAnalysis.terminalInflection === 'questioning_uptalk') {
      targetedCoaching.push('Replace questioning uptalk with definitive downward inflections to reinforce executive certainty.');
    }
    if (tempoAnalysis.wpm > 165) {
      targetedCoaching.push('Introduce 1.5-second deliberate pauses between triage steps to prevent perception of rushing.');
    }
    if (decisiveAnalysis.commandVerbsDetected.length < 2) {
      targetedCoaching.push('Incorporate explicit command markers (e.g. "I am taking ownership", "Step 1: Isolate", "Step 2: Notify").');
    }
    if (targetedCoaching.length === 0) {
      targetedCoaching.push('Continue conditioning diaphragmatic resonance for high-stakes investor and board presentations.');
    }

    // Compute Retry Recommendation (reflecting if they should try one more time, with 2 recorded response chances allowed)
    const retryRecommendation = EvaluationLogicEngine.detectRetryRecommendation({
      cues,
      tempoAnalysis,
      jitterAnalysis,
      toneAnalysis,
      decisiveAnalysis,
      kinesicScore,
      jobAdequacyScore,
      culturalFitScore,
      proceduralScore,
      overallScore,
      attemptNumber: cues.attemptNumber ?? 1,
      maxChancesAllowed: cues.maxChancesAllowed ?? 2,
      flaws: scenarioCompetency.flaws
    });

    return {
      overallScore,
      isPassing,
      exactGrade: `${overallScore}% - ${
        isPassing
          ? (overallScore >= 90.0
              ? 'Top-Tier Masterclass • Certified Executive Stance'
              : (decisiveAnalysis.isAuthoritativeFirm
                  ? 'Authoritative Command Certified • Professional Standard'
                  : 'Certified Professional Standing • Passing Grade'))
          : (scenarioCompetency.flaws.length > 0
              ? `Below 80% Threshold • ${scenarioCompetency.flaws[0].issueNamed}`
              : 'Below 80% Passing Threshold • Coaching Required')
      }`,
      ladderStatus: isPassing
        ? (decisiveAnalysis.isAuthoritativeFirm ? 'Advanced Leadership Ladder • Decisive Executive Standing' : 'Passing Threshold Met • Standard Leadership Track')
        : (scenarioCompetency.flaws.length > 0
            ? `Remediation Track • Address ${scenarioCompetency.flaws[0].issueNamed}`
            : 'Remediation Track • Review Cue Contribution Matrix'),
      jobAdequacyAudit: {
        score: jobAdequacyScore,
        verdict: (jobAdequacyScore >= 80 && calibrationResult.calibratedLeadershipClassification.includes('Firm & Corrective'))
          ? 'Leadership-Adequate (Firm & Corrective)'
          : (jobAdequacyScore >= 80 && calibrationResult.calibratedLeadershipClassification.includes('Decisive Authority'))
          ? 'Leadership-Adequate (Decisive Authority)'
          : (jobAdequacyScore >= 80 ? 'Adequate & Action-Oriented' : 'Marginal Execution'),
        taskExecutionAnalysis: `Candidate provided ${wordCount} words for ${cues.roleTitle || 'target position'} with ${decisiveAnalysis.commandVerbsDetected.length} decisive command actions and ${calibrationResult.correctiveInterventions.length} verified corrective interventions. Calibration benchmarked tone against diplomatic baseline: validated as ${calibrationResult.calibratedLeadershipClassification}${calibrationResult.biasMitigationApplied ? ` (Anti-Warmth Bias Parity: +${calibrationResult.jobAdequacyCalibrationOffset} pts)` : ''}. Scenario substance scored at ${scenarioCompetency.substanceScore}%. Speech tempo (${tempoAnalysis.wpm} WPM) and acoustic stability supported procedural containment.`,
        protocolCompliancePercent: Math.min(99, Math.round((scenarioCompetency.protocolCompliance) * 10) / 10),
        decisiveCommandScore: decisiveAnalysis.decisiveScore
      },
      positiveLightAudit: {
        score: culturalFitScore,
        verdict: culturalFitScore >= 85 ? 'Uplifting Leadership' : 'Constructive Standard',
        culturalImpactAnalysis: decisiveAnalysis.isAuthoritativeFirm || calibrationResult.correctiveInterventions.length > 0
          ? `Candidate demonstrated firm, corrective leadership (${calibrationResult.calibratedLeadershipClassification}). The Calibration Engine verified that this firm boundary-setting provides vital structural clarity and psychological safety for the team, correctly classifying it as leadership-adequate rather than penalizing for absence of soft diplomatic hedging.`
          : 'Communication maintained constructive professionalism without friction.',
        reassuranceAndToneScore: Math.min(99, Math.round(culturalFitScore * 10) / 10),
        firmnessClassification: decisiveAnalysis.firmnessClassification
      },
      doingItTheRightWayAudit: {
        score: proceduralScore,
        verdict: proceduralScore >= 80 ? 'Exemplary Method' : 'Needs Methodical Guidance',
        proceduralCorrectnessAnalysis: `Executed communication protocol with ${jitterAnalysis.stabilityClassification}. Procedural sequencing scored at ${proceduralScore}%. ${scenarioCompetency.truthTestingSummary}`,
        stepByStepRigorScore: Math.min(99, Math.round((proceduralScore + 0.8) * 10) / 10)
      },
      genuinenessDiagnostic: {
        score: Math.min(99, Math.round((overallScore + 1.0) * 10) / 10),
        classification: genuinenessClassification,
        classificationLabel: genuinenessLabel,
        jitterMovementCorrelation,
        trainingGuidance
      },
      authoritativeDecisivenessAudit: {
        ...authoritativeDecisivenessAudit,
        calibrationSummary: calibrationResult.antiWarmthBiasRationale,
        calibratedLeadershipLabel: calibrationResult.calibratedLeadershipClassification
      },
      toneDecisivenessCalibration: calibrationResult,
      cueContributionMap: [
        {
          cueName: 'Tone & Decisiveness Calibration Benchmark',
          category: 'Semantic / Command',
          measuredValue: `${calibrationResult.calibratedLeadershipClassification} (${calibrationResult.calibrationRatio}x Ratio)`,
          impactOnAdequacy: calibrationResult.jobAdequacyCalibrationOffset,
          impactOnCulturalFit: calibrationResult.culturalFitCalibrationOffset,
          rationale: calibrationResult.antiWarmthBiasRationale
        },
        ...cueContributionMap
      ],
      retryRecommendation,
      microFlawPrecisionDiagnostic: scenarioCompetency.diagnostic,
      toxicHostilityAudit: {
        isToxic: false,
        penaltyAppliedPercent: 0
      },
      pitchModulationScore: Math.min(99.0, Math.max(10.0, Math.round(toneAnalysis.pitchStabilityPercent * 10) / 10)),
      emotionalComposureScore: Math.min(99.0, Math.max(10.0, Math.round(culturalFitScore * 10) / 10)),
      cadencePacingScore: Math.min(99.0, Math.max(10.0, Math.round((tempoAnalysis.jobAdequacyDelta >= 0 ? 94.0 : 82.0 + tempoAnalysis.jobAdequacyDelta) * 10) / 10)),
      verbalSubstanceScore: scenarioCompetency.substanceScore,
      substanceScore: scenarioCompetency.substanceScore,
      flaws: scenarioCompetency.flaws,
      facialComposureAndExperientialVeracity: FacialCuesScienceEngine.synthesize({
        oculometrics: {
          fixationRatioPercent: cues.fixationRatioPercent ?? 82,
          saccadeFrequencyPerMin: cues.saccadeFrequencyPerMin ?? 22,
          gazeAversionPattern: (cues.gazeAversionPattern as any) ?? 'direct_anchored',
          cognitiveVsNervousAnalysis: cues.cognitiveVsNervousAnalysis ?? 'Direct gaze anchored with natural cognitive retrieval intervals.',
          blinkRatePerMin: cues.blinkRatePerMin ?? 22,
          blinkStressClassification: (cues.blinkStressClassification as any) ?? 'mild_alertness'
        },
        kinesicMovements: {
          posturalSwayIndex: cues.posturalSwayIndex ?? (cues.postureSteadinessPercent ? (100 - cues.postureSteadinessPercent) : 18),
          adaptorFrequency: cues.adaptorFrequency ?? 'Minimal / Grounded',
          illustratorEffectiveness: cues.illustratorEffectiveness ?? 'High Speech-Gesture Synchrony',
          nervousSystemState: (cues.nervousSystemState as any) ?? 'regulated_ventral',
          shoulderTensionScore: cues.shoulderTensionScore ?? 28
        }
      }, {
        speechPacingWpm: tempoAnalysis.wpm,
        jitterPercent: jitterAnalysis.jitterPercent,
        shimmerPercent: jitterAnalysis.shimmerPercent,
        hnrDb: jitterAnalysis.hnrDb,
        pitchStabilityPercent: toneAnalysis.pitchStabilityPercent,
        transcript: cleanTranscript,
        scenarioType: (cues.scenarioTitle?.toLowerCase().includes('calling') ? 'true_calling' : 'crisis_incident')
      }),
      keyStrengths,
      targetedCoachingRecommendations: targetedCoaching,
      whatShouldHaveBeenDoneInstead: scenarioCompetency.flaws.length > 0
        ? scenarioCompetency.flaws[0].exemplarCorrection
        : `Model Decisive Response: "I am taking operational command of this incident immediately. Step 1 is isolating the blast radius; Step 2 is activating the incident bridge; Step 3 is establishing 15-minute stakeholder briefings. Let's execute calmly and deliberately."`,
      exemplarCrisisResponse: `Stand tall, speak at 135 WPM with warm diaphragmatic resonance, and conclude every directive on a downward pitch: "I have the bridge. Let us stabilize the system together."`
    };
  }

  /**
   * Evaluates speech tempo, cadence, and pause discipline
   */
  public static analyzeSpeechTempo(wpm: number, pauseCount: number = 3, hesitationRatio: number = 12): TempoAnalysis {
    const clampedWpm = Math.max(40, Math.min(260, Math.round(wpm)));

    if (clampedWpm >= 125 && clampedWpm <= 155) {
      return {
        wpm: clampedWpm,
        cadenceClassification: 'Optimal Executive (125-155 WPM)',
        hesitationRatio,
        pauseDiscipline: 'Controlled rhythmic pacing allows listeners to digest directives without cognitive overload.',
        jobAdequacyDelta: +12.0,
        culturalFitDelta: +8.0,
        rationale: 'Speech pacing resides directly in the polyvagal optimal window, projecting authoritative clarity.'
      };
    } else if (clampedWpm >= 100 && clampedWpm < 125) {
      return {
        wpm: clampedWpm,
        cadenceClassification: 'Measured Deliberate (100-124 WPM)',
        hesitationRatio,
        pauseDiscipline: 'Deliberate cadence emphasizes gravity and cautious execution.',
        jobAdequacyDelta: +6.0,
        culturalFitDelta: +6.0,
        rationale: 'Slightly slower than baseline executive tempo, but conveys thoughtful care.'
      };
    } else if (clampedWpm > 155 && clampedWpm <= 180) {
      return {
        wpm: clampedWpm,
        cadenceClassification: 'Rapid Pressure (156-180 WPM)',
        hesitationRatio,
        pauseDiscipline: 'Pacing accelerated under pressure; ensure micro-pauses are preserved.',
        jobAdequacyDelta: +2.0,
        culturalFitDelta: -2.0,
        rationale: 'High articulatory velocity indicates urgency, but risks sounding pressed if sustained.'
      };
    } else if (clampedWpm > 180) {
      return {
        wpm: clampedWpm,
        cadenceClassification: 'Frantic Rushed (>180 WPM)',
        hesitationRatio,
        pauseDiscipline: 'Run-on sentences without breath pauses increase listener anxiety.',
        jobAdequacyDelta: -10.0,
        culturalFitDelta: -8.0,
        rationale: 'Excessive speed indicates sympathetic autonomic flooding; decelerate to restore executive poise.'
      };
    } else {
      return {
        wpm: clampedWpm,
        cadenceClassification: 'Hesitant Hesitation (<100 WPM)',
        hesitationRatio,
        pauseDiscipline: 'Frequent hesitations and elongated pauses signal uncertainty.',
        jobAdequacyDelta: -14.0,
        culturalFitDelta: -6.0,
        rationale: 'Slow, fractured cadence undermines perceived confidence in crisis decision-making.'
      };
    }
  }

  /**
   * Evaluates vocal cord micro-tremor (jitter), amplitude fluctuation (shimmer), and resonance (HNR)
   */
  public static analyzeJitterAndTremor(
    jitterPercent: number,
    shimmerPercent: number = 2.85,
    hnrDb: number = 18.2
  ): JitterAnalysis {
    const jitter = Math.max(0.1, Math.round(jitterPercent * 100) / 100);

    if (jitter <= 1.25) {
      return {
        jitterPercent: jitter,
        shimmerPercent,
        hnrDb,
        stabilityClassification: 'Executive Calm (< 1.2% Jitter)',
        autonomicState: 'Ventral Vagal Composure',
        jobAdequacyDelta: +10.0,
        culturalFitDelta: +8.0,
        rationale: 'Micro-tremor is minimal, indicating steady diaphragmatic control and physiological calmness.'
      };
    } else if (jitter <= 2.2) {
      return {
        jitterPercent: jitter,
        shimmerPercent,
        hnrDb,
        stabilityClassification: 'Regulated Alertness (1.2% - 2.2%)',
        autonomicState: 'Controlled Sympathetic',
        jobAdequacyDelta: +6.0,
        culturalFitDelta: +6.0,
        rationale: 'Mild vocal cord pitch variation consistent with energetic engagement and acute alertness.'
      };
    } else if (jitter <= 3.5) {
      return {
        jitterPercent: jitter,
        shimmerPercent,
        hnrDb,
        stabilityClassification: 'Nervous Sincerity (2.2% - 3.5%)',
        autonomicState: 'Adrenalized Sincerity',
        jobAdequacyDelta: +2.0,
        culturalFitDelta: +8.0, // High cultural fit: candidate cares deeply
        rationale: 'Auditory micro-tremors reflect authentic adrenaline, paired with genuine sincerity and effort.'
      };
    } else {
      return {
        jitterPercent: jitter,
        shimmerPercent,
        hnrDb,
        stabilityClassification: 'Acute Sympathetic Tremor (> 3.5%)',
        autonomicState: 'Autonomic Dysregulation',
        jobAdequacyDelta: -8.0,
        culturalFitDelta: 0.0,
        rationale: 'Marked vocal tremor indicates autonomic tension; requires breath stabilization drills.'
      };
    }
  }

  /**
   * Evaluates acoustic pitch stability, terminal inflection, and spectral warmth
   */
  public static analyzeToneAndInflection(
    pitchStabilityPercent: number,
    pitchF0Hz: number = 165,
    transcript: string = '',
    spectralWarmth: string = 'Warm & Resonant',
    explicitInflection?: 'definitive_downward' | 'questioning_uptalk' | 'steady_neutral' | 'flat_monotone'
  ): ToneAnalysis {
    let terminalInflection: 'definitive_downward' | 'questioning_uptalk' | 'steady_neutral' | 'flat_monotone' = explicitInflection || 'steady_neutral';

    if (!explicitInflection) {
      const lower = transcript.toLowerCase();
      const hasQuestions = lower.includes('?') || lower.includes('right?') || lower.includes('you know?') || lower.includes('is that okay?');
      const hasDefinitiveStatements = lower.includes('i will') || lower.includes('we will') || lower.includes('step 1') || lower.includes('immediately') || lower.includes('i am taking command');

      if (hasQuestions) {
        terminalInflection = 'questioning_uptalk';
      } else if (hasDefinitiveStatements && pitchStabilityPercent > 85) {
        terminalInflection = 'definitive_downward';
      } else if (pitchStabilityPercent > 94) {
        terminalInflection = 'steady_neutral';
      } else {
        terminalInflection = 'flat_monotone';
      }
    }

    if (terminalInflection === 'definitive_downward') {
      return {
        pitchStabilityPercent,
        terminalInflection,
        spectralWarmth,
        inflectionQuality: 'Firm, grounded terminal cadence conveying conviction and calm authority.',
        jobAdequacyDelta: +12.0,
        culturalFitDelta: +8.0,
        rationale: 'Declarative downward trajectory communicates decisive certainty without harshness.'
      };
    } else if (terminalInflection === 'questioning_uptalk') {
      return {
        pitchStabilityPercent,
        terminalInflection,
        spectralWarmth,
        inflectionQuality: 'Upward terminal inflections (uptalk) that sound as though seeking permission.',
        jobAdequacyDelta: -6.0,
        culturalFitDelta: +2.0,
        rationale: 'Uptalk softens decisive commands; train candidate to anchor statements on downward pitch.'
      };
    } else if (terminalInflection === 'steady_neutral') {
      return {
        pitchStabilityPercent,
        terminalInflection,
        spectralWarmth,
        inflectionQuality: 'Controlled, even pitch modulation across sentences.',
        jobAdequacyDelta: +8.0,
        culturalFitDelta: +6.0,
        rationale: 'Measured vocal composure projects professional stability.'
      };
    } else {
      return {
        pitchStabilityPercent,
        terminalInflection,
        spectralWarmth,
        inflectionQuality: 'Restricted pitch modulation with minimal harmonic inflection.',
        jobAdequacyDelta: 0.0,
        culturalFitDelta: -2.0,
        rationale: 'Flat vocal inflection can be perceived as disengaged; add dynamic pitch variety.'
      };
    }
  }

  /**
   * Evaluates Authoritative Firmness vs Toxic Hostility vs Passive Hesitation
   */
  public static analyzeDecisiveness(
    transcript: string,
    tempo: TempoAnalysis,
    jitter: JitterAnalysis,
    tone: ToneAnalysis,
    roleTitle: string = 'Executive Lead'
  ): DecisiveCommandAnalysis {
    const lower = transcript.toLowerCase();

    // Command Verb Catalog
    const commandVerbList = [
      'take command', 'taking command', 'take ownership', 'taking ownership',
      'isolate', 'isolating', 'contain', 'containing', 'stabilize', 'stabilizing',
      'escalate', 'escalating', 'notify', 'notifying', 'triage', 'triaging',
      'step 1', 'step one', 'step 2', 'step two', 'first step', 'second step',
      'immediate priority', 'immediately', 'protocol', 'incident bridge',
      'war room', 'briefing', 'standby', 'we will', 'i will', 'our plan',
      'align', 'coordinate', 'execute', 'resolve'
    ];

    const detectedVerbs: string[] = [];
    for (const verb of commandVerbList) {
      if (lower.includes(verb) && !detectedVerbs.includes(verb)) {
        detectedVerbs.push(verb);
      }
    }

    // Passive / Uncertain markers
    const passiveMarkers = [
      'maybe', 'i guess', 'not sure', 'i think so', 'hopefully',
      'sort of', 'kind of', 'dunno', 'i suppose'
    ];
    let passiveCount = 0;
    for (const pm of passiveMarkers) {
      if (lower.includes(pm)) passiveCount++;
    }

    // Calibrated baseline: true decisiveness requires proactive command verbs
    let decisiveScore = detectedVerbs.length >= 2 ? 72.0 : (detectedVerbs.length === 1 ? 64.0 : 54.0);
    decisiveScore += Math.min(24, detectedVerbs.length * 4.5);
    decisiveScore -= Math.min(30, passiveCount * 7.0);

    if (tempo.cadenceClassification.includes('Optimal Executive')) decisiveScore += 6.0;
    if (jitter.stabilityClassification.includes('Executive Calm')) decisiveScore += 5.0;
    if (tone.terminalInflection === 'definitive_downward') decisiveScore += 8.0;
    if (tone.terminalInflection === 'questioning_uptalk') decisiveScore -= 10.0;

    decisiveScore = Math.min(99.0, Math.max(20.0, Math.round(decisiveScore * 10) / 10));

    const isAuthoritativeFirm = decisiveScore >= 80.0 && detectedVerbs.length >= 2;

    let decisivenessTier: 'Commanding Executive' | 'Firm Professional' | 'Developing Authority' | 'Hesitant / Passive' | 'Detached / Derelict';
    let firmnessClassification: 'commanding_reassuring' | 'respectful_firmness' | 'passive_hesitant' | 'toxic_callousness';
    let summary: string;

    if (decisiveScore >= 88.0 && detectedVerbs.length >= 3) {
      decisivenessTier = 'Commanding Executive';
      firmnessClassification = 'commanding_reassuring';
      summary = `Candidate projects decisive executive command for ${roleTitle}. Speech cadence (${tempo.wpm} WPM) and downward terminal inflections establish immediate clarity and psychological stability.`;
    } else if (decisiveScore >= 80.0) {
      decisivenessTier = 'Firm Professional';
      firmnessClassification = 'respectful_firmness';
      summary = `Candidate articulates firm, structured decisions with professional poise. Directives are clear, respectful, and action-oriented.`;
    } else if (decisiveScore >= 68.0) {
      decisivenessTier = 'Developing Authority';
      firmnessClassification = 'respectful_firmness';
      summary = `Decisions are directionally sound, but delivery would benefit from more explicit action verbs and firmer terminal cadence.`;
    } else {
      decisivenessTier = 'Hesitant / Passive';
      firmnessClassification = 'passive_hesitant';
      summary = `Response lacks operational command; candidate defers decisive action or employs tentative phrases that dilute authority.`;
    }

    return {
      decisiveScore,
      isAuthoritativeFirm,
      commandVerbsDetected: detectedVerbs,
      firmnessClassification,
      decisivenessTier,
      summary
    };
  }

  /**
   * Analyzes optical kinesic & somatic stability from computer vision
   */
  private static analyzeKinesicSomatic(cues: EvaluationCuesInput): number {
    const fixation = cues.fixationRatioPercent ?? 88.0;
    const sway = cues.posturalSwayIndex ?? 12.0;
    const posture = Math.max(10, Math.min(99, 100 - sway));
    const tension = cues.shoulderTensionScore ?? 22.0;

    let raw = (fixation * 0.45) + (posture * 0.45) + ((100 - tension) * 0.10);
    if ((cues.saccadeFrequencyPerMin ?? 24) > 40) raw -= 6.0;
    return Math.min(99.0, Math.max(25.0, Math.round(raw * 10) / 10));
  }

  /**
   * Generates a transparent itemized map of how each cue contributed to final criteria
   */
  public static generateCueContributionMap(
    tempo: TempoAnalysis,
    jitter: JitterAnalysis,
    tone: ToneAnalysis,
    kinesicScore: number,
    decisive: DecisiveCommandAnalysis,
    cues: EvaluationCuesInput
  ): CueContributionItem[] {
    const map: CueContributionItem[] = [
      {
        cueName: 'Speech Tempo & Cadence',
        category: 'Acoustic / Vocal',
        measuredValue: `${tempo.wpm} WPM (${tempo.cadenceClassification})`,
        impactOnAdequacy: tempo.jobAdequacyDelta,
        impactOnCulturalFit: tempo.culturalFitDelta,
        rationale: tempo.rationale
      },
      {
        cueName: 'Vocal Cord Jitter (Micro-Tremor)',
        category: 'Acoustic / Vocal',
        measuredValue: `${jitter.jitterPercent}% Jitter (${jitter.stabilityClassification})`,
        impactOnAdequacy: jitter.jobAdequacyDelta,
        impactOnCulturalFit: jitter.culturalFitDelta,
        rationale: jitter.rationale
      },
      {
        cueName: 'Terminal Inflection Trajectory',
        category: 'Acoustic / Vocal',
        measuredValue: tone.terminalInflection === 'definitive_downward' ? 'Definitive Downward Inflection' : tone.terminalInflection === 'questioning_uptalk' ? 'Questioning Uptalk' : 'Neutral Cadence',
        impactOnAdequacy: tone.jobAdequacyDelta,
        impactOnCulturalFit: tone.culturalFitDelta,
        rationale: tone.rationale
      },
      {
        cueName: 'Authoritative Command Verbs',
        category: 'Semantic / Command',
        measuredValue: `${decisive.commandVerbsDetected.length} action verbs (${decisive.commandVerbsDetected.slice(0, 3).join(', ') || 'None'})`,
        impactOnAdequacy: decisive.commandVerbsDetected.length >= 2 ? +16 : 0,
        impactOnCulturalFit: decisive.isAuthoritativeFirm ? +12 : 0,
        rationale: decisive.summary
      },
      {
        cueName: 'Kinesic Poise & Lens Fixation',
        category: 'Kinesic / Physical',
        measuredValue: `${cues.fixationRatioPercent ?? 88}% Lens Fixation • ${cues.posturalSwayIndex ?? 12} Sway Index`,
        impactOnAdequacy: kinesicScore >= 80 ? +8 : -4,
        impactOnCulturalFit: kinesicScore >= 80 ? +6 : -2,
        rationale: 'Anchored physical posture and steady eye contact ground vocal directives in visible confidence.'
      }
    ];

    return map;
  }

  /**
   * Detects toxic dereliction of duty, refusal to act, or hostile abandonment
   */
  public static checkDereliction(transcript: string): { isDerelict: boolean; matchedTrigger: string } {
    const lower = transcript.toLowerCase();
    const triggers = [
      "don't want to deal", "dont want to deal",
      "why are you bothering me", "why you bothering me", "bothering me",
      "handle it yourself", "hung up", "hang up", "hung up the phone",
      "not my job", "not my problem", "leave me alone",
      "call someone else", "don't bother me", "dont bother me",
      "whatever", "too early", "not dealing with this", "why call me",
      "go away", "fix it yourself", "figure it out yourself", "shut up",
      "not doing this", "i don't care", "i dont care", "call me in the morning"
    ];

    for (const trig of triggers) {
      if (lower.includes(trig)) {
        return { isDerelict: true, matchedTrigger: trig };
      }
    }
    return { isDerelict: false, matchedTrigger: '' };
  }

  /**
   * Generates strict failing result when dereliction is detected
   */
  private static generateDerelictionResult(cues: EvaluationCuesInput, matchedTrigger: string): EvaluationLogicResult {
    return {
      overallScore: 23.5,
      isPassing: false,
      exactGrade: '23.5% - Immediate Failure • Dereliction of Duty & Callous Dismissal',
      ladderStatus: 'Dereliction / Disqualified • Immediate Civility Remediation Required',
      jobAdequacyAudit: {
        score: 18.0,
        verdict: 'Dereliction / Inadequate Execution',
        taskExecutionAnalysis: `Critical Failure: Candidate refused operational responsibility (trigger detected: "${matchedTrigger}"). Regardless of physiological or vocal stillness, refusing duty constitutes automatic failure.`,
        protocolCompliancePercent: 10.0,
        decisiveCommandScore: 12.0
      },
      positiveLightAudit: {
        score: 20.0,
        verdict: 'Callous / Hostile / Toxic Demeanor',
        culturalImpactAnalysis: 'Candidate exhibited dismissive hostility toward colleagues, severely damaging team psychological safety and violating the fundamental duty of care.',
        reassuranceAndToneScore: 15.0,
        firmnessClassification: 'toxic_callousness'
      },
      doingItTheRightWayAudit: {
        score: 16.0,
        verdict: 'Wrong / Detrimental Approach',
        proceduralCorrectnessAnalysis: 'Candidate abandoned incident response protocol, failed to initiate triage, and severed communication during an emergency.',
        stepByStepRigorScore: 10.0
      },
      genuinenessDiagnostic: {
        score: 22.0,
        classification: 'callous_apathy',
        classificationLabel: 'Callous Apathy & Disregard',
        jitterMovementCorrelation: 'Low physiological perturbation paired with verbal abandonment represents deliberate callous apathy, not executive composure.',
        trainingGuidance: 'Candidate requires mandatory corporate civility, on-call accountability, and crisis ethics retraining.'
      },
      authoritativeDecisivenessAudit: {
        score: 15.0,
        decisivenessTier: 'Detached / Derelict',
        isAuthoritativeFirm: false,
        tempoCadenceAnalysis: 'Vocal delivery reflected detached dismissal rather than professional leadership.',
        jitterResonanceAnalysis: 'Vocal steadiness does not compensate for dereliction of duty.',
        terminalInflectionAnalysis: 'Sharp, dismissive termination.',
        commandVerbsDetected: [],
        leadershipStanceSummary: 'Candidate demonstrated total refusal of operational accountability.'
      },
      cueContributionMap: [
        {
          cueName: 'Dereliction Trigger Detected',
          category: 'Semantic / Command',
          measuredValue: `"${matchedTrigger}"`,
          impactOnAdequacy: -65,
          impactOnCulturalFit: -70,
          rationale: 'Zero-tolerance dereliction rule activated. Refusing duty overrides all acoustic metrics.'
        }
      ],
      keyStrengths: ['Acoustic telemetry successfully captured'],
      targetedCoachingRecommendations: [
        'Adopt 100% operational ownership on emergency escalation calls',
        'Never dismiss or instruct team members to solve critical issues alone',
        'Follow standard incident command communication procedures'
      ],
      whatShouldHaveBeenDoneInstead: 'Candidate must acknowledge the incident immediately, open a bridge, and lead structured triage.',
      exemplarCrisisResponse: 'Model Response: "I am taking ownership of this situation immediately. Let\'s review the telemetry and isolate the impacted systems."',
      retryRecommendation: {
        shouldRetry: true,
        attemptNumber: cues.attemptNumber ?? 1,
        maxChancesAllowed: cues.maxChancesAllowed ?? 2,
        chancesRemaining: Math.max(0, (cues.maxChancesAllowed ?? 2) - (cues.attemptNumber ?? 1)),
        decisionPrompt: '⚠️ Immediate Failure • Dereliction Trigger Detected — Try One More Time (Use Chance 2 of 2)',
        recommendationReason: `Critical refusal of operational duty detected ("${matchedTrigger}"). Every candidate is granted 2 recorded response chances at a time for fair assessment. Use Chance 2 to take full operational accountability and outline concrete triage steps.`,
        detectedCuesSummary: {
          speechTempo: { wpm: 120, status: 'hesitant', label: '120 WPM (Detached / Evasive cadence)' },
          jitterTremor: { percent: 1.2, status: 'alert', label: '1.2% Jitter (Somatic steadiness overridden by verbal abandonment)' },
          toneInflection: { type: 'flat_monotone', status: 'neutral', label: 'Dismissive or callous tone' },
          authoritativeFirmness: { tier: 'Detached / Derelict', score: 15, isFirm: false }
        },
        weightedImpacts: {
          jobAdequacyScore: 18.0,
          culturalFitScore: 20.0,
          proceduralRigorScore: 16.0,
          overallScore: 23.5
        },
        primaryTargetArea: 'Duty of Care & Operational Accountability',
        actionableAdjustments: [
          'State immediate ownership: "I am taking full command of this incident."',
          'Acknowledge stakeholder concern with calm, respectful reassurance.',
          'Formulate explicit triage steps: Isolate, Investigate, and Communicate.'
        ],
        exemplarAdjustmentCue: 'Model Accountability: "I understand the urgency and have opened our incident triage bridge. Let us stabilize this together."'
      },
      toneDecisivenessCalibration: {
        neutralDiplomaticBenchmark: {
          score: 10.0,
          markersDetected: [],
          characteristicSummary: 'Dereliction of duty overrides tone benchmarking.',
          strategicStrengths: [],
          crisisBlindspots: ['Total refusal of operational duty'],
          acousticFootprint: 'Detached or evasive delivery'
        },
        authoritativeDecisiveBenchmark: {
          score: 15.0,
          markersDetected: [],
          characteristicSummary: 'Zero decisive leadership present.',
          strategicStrengths: [],
          crisisBlindspots: ['Refusal of operational duty'],
          acousticFootprint: 'Detached cadence'
        },
        calibrationRatio: 1.0,
        biasMitigationApplied: false,
        biasType: 'passive_diplomacy',
        jobAdequacyCalibrationOffset: 0,
        culturalFitCalibrationOffset: 0,
        calibratedToneLabel: 'Dereliction / Detached Dismissal',
        calibratedLeadershipClassification: 'Developing Authority (Needs Decisive Grounding)',
        correctiveInterventions: [],
        antiWarmthBiasRationale: 'Dereliction of duty detected. Tone calibration bypassed.',
        benchmarkingComparisonNarrative: 'Candidate exhibited refusal of responsibility.'
      }
    };
  }

  /**
   * Zero-Tolerance Civility Engine:
   * Detects insults, ad-hominem derogatory attacks, profanity, and toxic blaming.
   */
  public static checkToxicHostility(transcript: string): {
    isToxic: boolean;
    matchedInsult: string;
    excerpt: string;
    reason: string;
  } {
    if (!transcript) return { isToxic: false, matchedInsult: '', excerpt: '', reason: '' };

    const lower = transcript.toLowerCase();

    // Multi-word compound insults and hostile phrases
    const compoundInsults = [
      "somebody's an idiot", "somebody is an idiot", "someone's an idiot", "someone is an idiot",
      "he's an idiot", "he is an idiot", "she's an idiot", "she is an idiot",
      "they're idiots", "they are idiots", "you're an idiot", "you are an idiot",
      "what an idiot", "bunch of idiots", "total idiot", "complete idiot", "damn idiot", "freaking idiot", "fucking idiot",
      "dealing with idiots", "surrounded by idiots", "working with idiots",
      "somebody's a moron", "someone's a moron", "he's a moron", "she's a moron", "they're morons", "bunch of morons", "total moron",
      "they're dumb", "they are dumb", "they're so dumb", "they are so dumb",
      "they're stupid", "they are stupid", "people are stupid", "people are dumb", "people are idiots",
      "shut up", "shut your mouth", "shut the fuck up",
      "piece of shit", "bullshit", "waste of time", "worthless fools",
      "incompetent fools", "incompetent staff", "stupid employees", "stupid coworkers",
      "hate them", "hate him", "hate her", "hate you",
      "fire them all", "they don't know shit", "they dont know shit"
    ];

    for (const phrase of compoundInsults) {
      if (lower.includes(phrase)) {
        const idx = lower.indexOf(phrase);
        const start = Math.max(0, idx - 25);
        const end = Math.min(transcript.length, idx + phrase.length + 25);
        const excerpt = `"...${transcript.substring(start, end).trim()}..."`;
        return {
          isToxic: true,
          matchedInsult: phrase,
          excerpt,
          reason: `Zero-tolerance workplace civility violation: Candidate used derogatory phrase "${phrase}". Acoustic poise or steady cadence can never excuse ad-hominem insult or contempt toward team members.`
        };
      }
    }

    // Single-word insults matched with word boundaries
    const singleWordInsults = [
      "idiot", "idiots", "moron", "morons", "dumbass", "dumbasses",
      "retard", "retarded", "asshole", "assholes", "bitch", "bitches", "bastard",
      "loser", "losers", "jerk", "jerks", "clown", "clowns"
    ];

    for (const word of singleWordInsults) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      const match = regex.exec(transcript);
      if (match) {
        const idx = match.index;
        const start = Math.max(0, idx - 25);
        const end = Math.min(transcript.length, idx + word.length + 25);
        const excerpt = `"...${transcript.substring(start, end).trim()}..."`;
        return {
          isToxic: true,
          matchedInsult: word,
          excerpt,
          reason: `Zero-tolerance workplace civility violation: Candidate used ad-hominem slur "${word}". Demeaning colleagues or stakeholders destroys psychological safety and triggers immediate candidate disqualification.`
        };
      }
    }

    // Contextual checks: "stupid", "dumb", "incompetent" paired with people/roles
    const contextualRegexes = [
      { regex: /\b(stupid|dumb|incompetent|lazy|useless|worthless)\b\s+(person|people|guy|girl|team|coworker|coworkers|manager|lead|employee|employees|colleague|colleagues|client|customer|boss)s?/i, label: 'derogatory characterization' },
      { regex: /\b(you|he|she|they|we|everyone|everybody)\s+(are|is|were|was)\s+(stupid|dumb|incompetent|lazy|useless|worthless)\b/i, label: 'hostile attribution' }
    ];

    for (const item of contextualRegexes) {
      const match = item.regex.exec(transcript);
      if (match) {
        const idx = match.index;
        const start = Math.max(0, idx - 25);
        const end = Math.min(transcript.length, idx + match[0].length + 25);
        const excerpt = `"...${transcript.substring(start, end).trim()}..."`;
        return {
          isToxic: true,
          matchedInsult: match[0],
          excerpt,
          reason: `Zero-tolerance workplace civility violation: Candidate engaged in ${item.label} ("${match[0]}"). Attacks on colleague competence violate the core standard of workplace dignity.`
        };
      }
    }

    return { isToxic: false, matchedInsult: '', excerpt: '', reason: '' };
  }

  /**
   * Generates strict failing result when toxic hostility, insults, or ad-hominem language are detected
   */
  private static generateToxicHostilityResult(
    cues: EvaluationCuesInput,
    hostilityCheck: { matchedInsult: string; excerpt: string; reason: string }
  ): EvaluationLogicResult {
    const matched = hostilityCheck.matchedInsult;
    const excerpt = hostilityCheck.excerpt;

    const microFlaws: MicroFlawItem[] = [
      {
        flawId: 'civility-breach-insult',
        category: 'Civility & Ad-Hominem',
        severity: 'critical',
        identifiedExcerpt: excerpt,
        issueNamed: `Ad-Hominem Insult & Hostile Language ("${matched}")`,
        whyItFailsScenario: `Candidate attacked colleague/stakeholder character using the insult "${matched}". Workplaces require emotional self-regulation and procedural inquiry. Regardless of acoustic steadiness, vocal pitch stability, or cadence, verbal hostility is an immediate non-negotiable failure.`,
        positiveGrowthCoaching: 'Separate the operational defect from the human being. Focus 100% on procedural diagnostics, system containment, and collaborative inquiry without personalizing blame or resorting to name-calling.',
        exemplarCorrection: `Model Diplomatic Reframing: Instead of "${excerpt}", state: "We experienced an unexpected execution variance during deployment. Let us inspect the system logs together and contain the blast radius without personalizing blame."`
      }
    ];

    const diagnostic: MicroFlawPrecisionDiagnostic = {
      hasFlaws: true,
      flawCount: 1,
      highestSeverity: 'critical_violation',
      flaws: microFlaws,
      truthTestingSummary: `Critical Civility Breach: Ad-hominem insult "${matched}" detected in spoken response. Acoustic composure cannot excuse derogatory attacks. Disqualified below 25% threshold.`
    };

    const toxicHostilityAudit: ToxicHostilityAudit = {
      isToxic: true,
      insultDetected: matched,
      civilityBreachReason: hostilityCheck.reason,
      penaltyAppliedPercent: 78.5
    };

    return {
      overallScore: 21.5,
      isPassing: false,
      exactGrade: '21.5% - Immediate Failure • Toxic Hostility & Ad-Hominem Civility Breach',
      ladderStatus: 'Disqualified • Mandatory Workplace Civility & Emotional Regulation Remediation',
      jobAdequacyAudit: {
        score: 16.0,
        verdict: 'Dereliction / Inadequate Execution',
        taskExecutionAnalysis: `Critical Failure: Candidate directed derogatory language ("${matched}") during professional assessment. Personal insults undermine basic team collaboration, compromise psychological safety, and fail the adequacy standard of ${cues.roleTitle || 'this position'}.`,
        protocolCompliancePercent: 12.0,
        decisiveCommandScore: 14.0
      },
      positiveLightAudit: {
        score: 12.0,
        verdict: 'Callous / Hostile / Toxic Demeanor',
        culturalImpactAnalysis: `Candidate exhibited active hostility, violating the core principle of representing the organization in a positive light. Civility is a non-negotiable executive requirement.`,
        reassuranceAndToneScore: 10.0,
        firmnessClassification: 'toxic_callousness'
      },
      doingItTheRightWayAudit: {
        score: 14.0,
        verdict: 'Wrong / Detrimental Approach',
        proceduralCorrectnessAnalysis: `Resorted to ad-hominem hostility rather than structured procedural containment. Attacking individuals halts problem-solving and escalates organizational damage.`,
        stepByStepRigorScore: 8.0
      },
      genuinenessDiagnostic: {
        score: 18.0,
        classification: 'callous_apathy',
        classificationLabel: 'Hostile Demeanor & Contempt',
        jitterMovementCorrelation: `Acoustic pitch stability measured at ${cues.pitchStabilityPercent ?? 92}%. However, remaining calm while delivering insults reflects passive-aggressive hostility or callous disregard, not executive composure. Authentic composure pairs vocal calm with deep human dignity.`,
        trainingGuidance: 'Candidate requires mandatory workplace dignity, emotional de-escalation, and non-violent communication retraining before any executive representation.'
      },
      authoritativeDecisivenessAudit: {
        score: 15.0,
        decisivenessTier: 'Detached / Derelict',
        isAuthoritativeFirm: false,
        tempoCadenceAnalysis: 'Vocal delivery conveyed toxic irritation rather than steady, respectful leadership.',
        jitterResonanceAnalysis: 'Vocal steadiness does not compensate for derogatory attacks.',
        terminalInflectionAnalysis: 'Sharp, hostile cadence.',
        commandVerbsDetected: [],
        leadershipStanceSummary: 'Hostile breach overrides all delivery metrics.'
      },
      cueContributionMap: [
        {
          cueName: 'Ad-Hominem Insult Detected',
          category: 'Semantic / Command',
          measuredValue: `"${matched}"`,
          impactOnAdequacy: -70,
          impactOnCulturalFit: -85,
          rationale: 'Zero-tolerance civility rule activated. Ad-hominem insult overrides all acoustic and optical scores.'
        }
      ],
      microFlawPrecisionDiagnostic: diagnostic,
      toxicHostilityAudit,
      keyStrengths: ['Audio telemetry recorded for forensic compliance review'],
      targetedCoachingRecommendations: [
        'Never use insulting, derogatory, or contemptuous language in professional discourse',
        'Direct scrutiny toward system processes and documentation, never personal character',
        'Practice non-violent de-escalation when navigating stakeholder or operational friction'
      ],
      whatShouldHaveBeenDoneInstead: `Instead of expressing irritation with "${excerpt}", the candidate should say: "We have an unexpected operational variance. I am stepping in to examine the procedural logs and isolate the issue immediately."`,
      exemplarCrisisResponse: 'Model Response: "I understand the urgency and frustration surrounding this variance. Let us keep our focus on stabilizing the system and restoring service for our stakeholders."',
      retryRecommendation: {
        shouldRetry: true,
        attemptNumber: cues.attemptNumber ?? 1,
        maxChancesAllowed: cues.maxChancesAllowed ?? 2,
        chancesRemaining: Math.max(0, (cues.maxChancesAllowed ?? 2) - (cues.attemptNumber ?? 1)),
        decisionPrompt: `⚠️ Immediate Failure • Civility Breach ("${matched}") — Try One More Time (Use Chance 2 of 2)`,
        recommendationReason: `Critical civility violation detected: Candidate utilized derogatory term "${matched}". Every candidate is granted 2 recorded response chances at a time for fair assessment. Use Chance 2 to demonstrate genuine accountability, respectful de-escalation, and procedural composure.`,
        detectedCuesSummary: {
          speechTempo: { wpm: 125, status: 'hesitant', label: 'Cadence overridden by verbal hostility' },
          jitterTremor: { percent: 1.2, status: 'alert', label: 'Acoustic calm does not excuse verbal abuse' },
          toneInflection: { type: 'flat_monotone', status: 'neutral', label: 'Hostile or contemptuous verbal content' },
          authoritativeFirmness: { tier: 'Detached / Derelict', score: 15, isFirm: false }
        },
        weightedImpacts: {
          jobAdequacyScore: 16.0,
          culturalFitScore: 12.0,
          proceduralRigorScore: 14.0,
          overallScore: 21.5
        },
        primaryTargetArea: 'Workplace Dignity & Non-Defensive Communication',
        actionableAdjustments: [
          'Eliminate all personal labels, insults, or derogatory adjectives.',
          'Adopt procedural framing: Address the technical fault, not the person.',
          'Articulate clear, constructive containment steps with calm respect.'
        ],
        exemplarAdjustmentCue: 'Model Demeanor: "I am taking full ownership of our response. Let us examine the telemetry calmly and resolve this together."'
      },
      toneDecisivenessCalibration: {
        neutralDiplomaticBenchmark: {
          score: 5.0,
          markersDetected: [],
          characteristicSummary: 'Civility breach overrides tone benchmarking.',
          strategicStrengths: [],
          crisisBlindspots: ['Ad-hominem insult'],
          acousticFootprint: 'Hostile cadence'
        },
        authoritativeDecisiveBenchmark: {
          score: 15.0,
          markersDetected: [],
          characteristicSummary: 'Toxic hostility is not decisive leadership.',
          strategicStrengths: [],
          crisisBlindspots: ['Derogatory verbal attack'],
          acousticFootprint: 'Hostile inflection'
        },
        calibrationRatio: 1.0,
        biasMitigationApplied: false,
        biasType: 'passive_diplomacy',
        jobAdequacyCalibrationOffset: 0,
        culturalFitCalibrationOffset: 0,
        calibratedToneLabel: 'Hostile / Derogatory Civility Breach',
        calibratedLeadershipClassification: 'Developing Authority (Needs Decisive Grounding)',
        correctiveInterventions: [],
        antiWarmthBiasRationale: 'Zero-tolerance civility breach detected. Tone calibration bypassed.',
        benchmarkingComparisonNarrative: 'Candidate engaged in ad-hominem attack.'
      }
    };
  }

  /**
   * Precision Scenario Competency & Micro-Flaw Diagnostic Engine
   * Pinpoints the slightest flaws in content and delivery, tests whether candidates
   * actually said what they were supposed to say for the scenario, and calibrates
   * scores to the truest high-standard level.
   */
  public static analyzeScenarioCompetencyAndFlaws(
    transcript: string,
    scenarioPrompt: string,
    roleTitle: string,
    tempo: TempoAnalysis,
    jitter: JitterAnalysis,
    tone: ToneAnalysis,
    decisive: DecisiveCommandAnalysis
  ): {
    substanceScore: number;
    protocolCompliance: number;
    flaws: MicroFlawItem[];
    flawPenalty: number;
    diagnostic: MicroFlawPrecisionDiagnostic;
    truthTestingSummary: string;
  } {
    const clean = (transcript || '').trim();
    const lower = clean.toLowerCase();
    const words = clean.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const flaws: MicroFlawItem[] = [];
    let flawPenalty = 0;

    // 1. Check for Insufficient Response Depth / Truncated Input
    if (wordCount < 16) {
      flaws.push({
        flawId: 'flaw-insufficient-depth',
        category: 'Scenario Substance',
        severity: wordCount < 8 ? 'critical' : 'moderate',
        identifiedExcerpt: clean ? `"${clean}"` : '(No substantive spoken response)',
        issueNamed: 'Insufficient Spoken Substance & Truncated Delivery',
        whyItFailsScenario: `Executive and specialist scenarios require thorough, sequential problem-solving. A brief ${wordCount}-word statement fails to demonstrate procedural depth or leadership readiness.`,
        positiveGrowthCoaching: 'Structure your response in three distinct phases: 1) Immediate Situation Ownership, 2) Step-by-Step Mitigation Protocol, and 3) Stakeholder Communication Cadence.',
        exemplarCorrection: `Elaborate thoroughly: "I am taking operational command of this incident. First, I am isolating the impacted microservices to prevent cascading latency. Second, I am spinning up our incident war room. Third, I will provide updates every 15 minutes."`
      });
      flawPenalty += wordCount < 8 ? 50 : 26;
    }

    // 2. Check for Defensive Blame-Shifting
    const blameShiftingPhrases = [
      "not my fault", "it's their fault", "its their fault", "they messed up", "they caused this",
      "they didn't tell me", "they didnt tell me", "not on me", "someone else pushed",
      "it's on them", "its on them", "they should have known", "they screwed up"
    ];
    for (const phrase of blameShiftingPhrases) {
      if (lower.includes(phrase)) {
        const idx = lower.indexOf(phrase);
        const start = Math.max(0, idx - 20);
        const end = Math.min(clean.length, idx + phrase.length + 20);
        const excerpt = `"...${clean.substring(start, end).trim()}..."`;
        flaws.push({
          flawId: 'flaw-blame-shifting',
          category: 'Accountability & Blame',
          severity: 'moderate',
          identifiedExcerpt: excerpt,
          issueNamed: 'Defensive Blame-Shifting During Crisis Escalation',
          whyItFailsScenario: 'Attributing fault during an active crisis fractures team trust and delays operational containment. Leaders absorb pressure and focus exclusively on resolution before dissecting origin causes.',
          positiveGrowthCoaching: 'Adopt universal operational ownership. Even when an upstream or external team introduced the variance, lead with service restoration first.',
          exemplarCorrection: `Model Accountability: "Regardless of where the variance originated, our sole mandate is service recovery. Once production telemetry is green, we will conduct a blameless root-cause analysis."`
        });
        flawPenalty += 22;
        break;
      }
    }

    // 2.5 Check for Evasive Dereliction & Refusal to Decide
    const evasivePhrases = [
      "not my call", "not my decision", "someone else should decide", "wait until tomorrow",
      "cant help you", "can't help you", "no idea", "i have no clue", "figure it out yourself",
      "not sure what to say", "someone else will deal with it", "i don't care"
    ];
    for (const phrase of evasivePhrases) {
      if (lower.includes(phrase)) {
        const idx = lower.indexOf(phrase);
        const start = Math.max(0, idx - 20);
        const end = Math.min(clean.length, idx + phrase.length + 20);
        const excerpt = `"...${clean.substring(start, end).trim()}..."`;
        flaws.push({
          flawId: 'flaw-evasive-dereliction',
          category: 'Accountability & Blame',
          severity: 'critical',
          identifiedExcerpt: excerpt,
          issueNamed: 'Operational Evasion & Dereliction of Duty',
          whyItFailsScenario: 'Deflecting responsibility or abdicating decision-making during high-stakes scenarios demonstrates lack of operational fortitude and breaches corporate leadership standards.',
          positiveGrowthCoaching: 'Even under acute ambiguity, establish structured triage bounds and take explicit command of the immediate next steps.',
          exemplarCorrection: `Model Ownership: "While variables remain unconfirmed, I am establishing immediate triage bounds and coordinating the next mitigation milestone."`
        });
        flawPenalty += 30;
        break;
      }
    }

    // 3. Check for Acoustic-Verbal Dissonance (The "Smooth Façade")
    // Steady pitch/WPM paired with dismissive minimization of a serious scenario
    const minimizingPhrases = [
      "no big deal", "relax everyone", "it's fine relax", "don't panic", "dont panic",
      "chill out", "calm down it's fine", "whatever happens", "not that serious", "everyone needs to chill",
      "it's just a server", "its just a server"
    ];
    for (const phrase of minimizingPhrases) {
      if (lower.includes(phrase)) {
        const idx = lower.indexOf(phrase);
        const start = Math.max(0, idx - 20);
        const end = Math.min(clean.length, idx + phrase.length + 20);
        const excerpt = `"...${clean.substring(start, end).trim()}..."`;
        flaws.push({
          flawId: 'flaw-acoustic-verbal-dissonance',
          category: 'Acoustic-Verbal Dissonance',
          severity: 'moderate',
          identifiedExcerpt: excerpt,
          issueNamed: 'Acoustic-Verbal Dissonance (Trivializing Operational Urgency)',
          whyItFailsScenario: 'Using a calm vocal demeanor to dismiss genuine operational urgency creates dissonance for stakeholders. Composure should convey focused, urgent capability—not apathy or trivialization.',
          positiveGrowthCoaching: 'Acknowledge the full operational gravity of the situation while using calm pitch modulation to project steady confidence in the mitigation plan.',
          exemplarCorrection: `Model Balance: "I recognize the high severity of this outage and the disruption it causes for our users. We are treating this as P0 critical, and here is our exact containment sequence."`
        });
        flawPenalty += 18;
        break;
      }
    }

    // 4. Check for Scenario Protocol Completeness
    // Does the candidate mention containment/triage?
    const containmentKeywords = [
      'isolate', 'isolating', 'contain', 'containing', 'containment', 'mitigate', 'mitigating',
      'mitigation', 'triage', 'protocol', 'quarantine', 'rollback', 'failover', 'stabilize',
      'stabilizing', 'stop the bleeding', 'freeze deployment', 'kill switch'
    ];
    const hasContainment = containmentKeywords.some(k => lower.includes(k));

    if (!hasContainment && wordCount >= 15) {
      flaws.push({
        flawId: 'flaw-missing-containment',
        category: 'Procedural Completeness',
        severity: 'moderate',
        identifiedExcerpt: clean.substring(0, Math.min(60, clean.length)) + '...',
        issueNamed: 'Procedural Omission: Missing Immediate Isolation / Containment Step',
        whyItFailsScenario: 'In emergency response protocols, containment must precede investigation. Failure to isolate the impacted blast radius allows faults to cascade into dependent systems.',
        positiveGrowthCoaching: 'Lead your operational sequence with explicit isolation: Step 1 Isolate, Step 2 Investigate, Step 3 Notify.',
        exemplarCorrection: `Model Triage Step: "Step 1 is isolating the affected cluster and severing compromised network routes to protect customer data. Step 2 is activating our engineering response team."`
      });
      flawPenalty += 16;
    }

    // 5. Check for Cadence & Milestone Vagueness
    // Candidate promises to fix without specifying a timeline or cadence
    const cadenceKeywords = [
      'minute', 'minutes', 'hour', 'hours', 'timeline', 'schedule', 'cadence',
      'interval', 'every 15', 'every 30', 'by 2', 'by 3', 'war room briefing'
    ];
    const hasTimeline = cadenceKeywords.some(k => lower.includes(k));

    if (!hasTimeline && wordCount >= 22) {
      flaws.push({
        flawId: 'flaw-milestone-vagueness',
        category: 'Procedural Completeness',
        severity: 'minor',
        identifiedExcerpt: 'General timeline references without explicit intervals',
        issueNamed: 'Milestone Vagueness: Absence of Defined Reporting Cadence',
        whyItFailsScenario: 'Vague commitments like "I will look into this" leave stakeholders in high cognitive anxiety. Executive maturity requires time-boxing communication intervals.',
        positiveGrowthCoaching: 'Anchor your containment commitments to concrete time milestones (e.g. "Written executive briefing in 20 minutes; bridge reconvened every 45 minutes").',
        exemplarCorrection: `Model Cadence: "I have stood up our incident bridge and will provide written telemetry updates to leadership every 30 minutes until resolution."`
      });
      flawPenalty += 10;
    }

    // 6. Check for Hollow Corporate Buzzwords Without Operational Meat
    const buzzwords = ['synergy', 'game changer', 'paradigm shift', 'giving 110%', 'circle back', 'rockstar'];
    const detectedBuzzwords = buzzwords.filter(b => lower.includes(b));
    if (detectedBuzzwords.length >= 2 && decisive.commandVerbsDetected.length < 2) {
      flaws.push({
        flawId: 'flaw-superficial-buzzwords',
        category: 'Scenario Substance',
        severity: 'minor',
        identifiedExcerpt: `Detected buzzwords: ${detectedBuzzwords.join(', ')}`,
        issueNamed: 'Superficial Corporate Jargon Without Operational Specifics',
        whyItFailsScenario: 'Relying on abstract corporate jargon dilutes leadership credibility and leaves engineering teams without concrete action items.',
        positiveGrowthCoaching: 'Swap conversational platitudes for concrete technical parameters and verifiable milestones.',
        exemplarCorrection: `Model Precision: "Focus on metrics: 'Inspect container error logs, verify database connection pooling, and roll back the deployment hash to release v2.4.'" `
      });
      flawPenalty += 10;
    }

    // Calculate Grounded Substance Score (40-50% foundation of the overall evaluation)
    // Tightened base: substance is earned through containment, milestones, and actionable problem solving
    let substanceBase = 32.0;
    if (hasContainment) substanceBase += 22.0;
    if (hasTimeline) substanceBase += 15.0;
    if (decisive.commandVerbsDetected.length >= 2) substanceBase += 15.0;
    if (lower.includes('step 1') || lower.includes('first') || lower.includes('phase 1')) substanceBase += 10.0;
    if (wordCount >= 20) substanceBase += 8.0;
    if (wordCount >= 38) substanceBase += 6.0;
    if (wordCount >= 60) substanceBase += 4.0;

    // Apply specific flaw deductions
    const substanceScore = Math.max(15.0, Math.min(98.5, Math.round((substanceBase - flawPenalty) * 10) / 10));

    // Calculate protocol compliance based on substance and flaws
    const protocolCompliance = Math.max(10.0, Math.min(99.0, Math.round((substanceScore * 0.95 + (hasContainment ? 5 : 0)) * 10) / 10));

    let highestSeverity: 'critical_violation' | 'significant_deficiency' | 'minor_polish' | 'none_detected' = 'none_detected';
    if (flaws.some(f => f.severity === 'critical')) highestSeverity = 'critical_violation';
    else if (flaws.some(f => f.severity === 'moderate')) highestSeverity = 'significant_deficiency';
    else if (flaws.length > 0) highestSeverity = 'minor_polish';

    let truthTestingSummary = '';
    if (flaws.length === 0 && substanceScore >= 88.0) {
      truthTestingSummary = 'Top-Tier Exemplary Substance: Response demonstrated complete procedural containment, explicit accountability, and structured cadence with zero detected flaws.';
    } else if (flaws.length === 0) {
      truthTestingSummary = 'Solid Baseline Competency: Response addressed the scenario appropriately with respectful demeanor and baseline protocol compliance.';
    } else {
      truthTestingSummary = `Truth-Tested Diagnostic: Identified ${flaws.length} specific operational ${flaws.length === 1 ? 'flaw' : 'flaws'} (${flaws.map(f => f.issueNamed).join(' • ')}). Acoustic delivery alone cannot substitute for missing operational substance.`;
    }

    const diagnostic: MicroFlawPrecisionDiagnostic = {
      hasFlaws: flaws.length > 0,
      flawCount: flaws.length,
      highestSeverity,
      flaws,
      truthTestingSummary
    };

    return {
      substanceScore,
      protocolCompliance,
      flaws,
      flawPenalty,
      diagnostic,
      truthTestingSummary
    };
  }

  /**
   * Evaluates audio/video cues when a recording is completed to detect if the candidate should try one more time.
   * Enforces the fairness policy: 2 recorded response chances at a time.
   */
  public static detectRetryRecommendation(params: {
    cues: EvaluationCuesInput;
    tempoAnalysis: TempoAnalysis;
    jitterAnalysis: JitterAnalysis;
    toneAnalysis: ToneAnalysis;
    decisiveAnalysis: DecisiveCommandAnalysis;
    kinesicScore: number;
    jobAdequacyScore: number;
    culturalFitScore: number;
    proceduralScore: number;
    overallScore: number;
    attemptNumber?: number; // 1 or 2 (defaults to 1)
    maxChancesAllowed?: number; // defaults to 2
    flaws?: MicroFlawItem[];
  }): RetryRecommendation {
    const attemptNumber = params.attemptNumber && params.attemptNumber >= 2 ? 2 : 1;
    const maxChancesAllowed = params.maxChancesAllowed ?? 2;
    const chancesRemaining = Math.max(0, maxChancesAllowed - attemptNumber);

    const {
      tempoAnalysis,
      jitterAnalysis,
      toneAnalysis,
      decisiveAnalysis,
      cues,
      overallScore,
      jobAdequacyScore,
      culturalFitScore,
      proceduralScore,
      flaws
    } = params;

    // Detect specific cue deviations
    const isTempoHesitant = tempoAnalysis.wpm < 110;
    const isTempoRushed = tempoAnalysis.wpm > 165;
    const isTempoOptimal = tempoAnalysis.wpm >= 120 && tempoAnalysis.wpm <= 155;

    const isJitterHigh = jitterAnalysis.jitterPercent > 2.2;
    const isJitterCalm = jitterAnalysis.jitterPercent <= 1.3;

    const isToneUptalk = toneAnalysis.terminalInflection === 'questioning_uptalk';
    const isToneCommanding = toneAnalysis.terminalInflection === 'definitive_downward';

    const fixation = cues.fixationRatioPercent ?? 90;
    const isFixationLow = fixation < 82;

    const isAuthoritative = decisiveAnalysis.isAuthoritativeFirm;

    // Determine retry recommendation
    let shouldRetry = false;
    let decisionPrompt = '';
    let recommendationReason = '';
    let primaryTargetArea = '';
    const actionableAdjustments: string[] = [];

    if (attemptNumber === 1 && chancesRemaining > 0) {
      // Chance 1 of 2 used. Check if candidate should try one more time!
      if (flaws && flaws.length > 0) {
        shouldRetry = true;
        const topFlaw = flaws[0];
        decisionPrompt = `⚠️ Flaw Detected: ${topFlaw.issueNamed} • Try One More Time (Use Chance 2 of 2)`;
        recommendationReason = `Breakthrough diagnostic pinpointed: ${topFlaw.whyItFailsScenario} Every candidate receives 2 recorded response chances at a time for fair assessment. Use Chance 2 to apply coaching: ${topFlaw.positiveGrowthCoaching}`;
        primaryTargetArea = `${topFlaw.category} Diagnostic Precision`;
        actionableAdjustments.push(topFlaw.exemplarCorrection);
      } else if (overallScore < 80) {
        shouldRetry = true;
        decisionPrompt = '⚠️ Passing Standard Not Met • Try One More Time (Use Chance 2 of 2)';
        recommendationReason = `Current composite score (${overallScore}%) is below the 80% passing threshold. Retrying with Chance 2 allows you to steady your pace, eliminate hesitation, and project clear operational command.`;
        primaryTargetArea = 'Operational Command & Procedural Delivery';
      } else if (isTempoHesitant || isTempoRushed) {
        shouldRetry = true;
        decisionPrompt = isTempoHesitant
          ? '💡 Cadence Hesitation Detected • Try One More Time (Use Chance 2 of 2)'
          : '💡 Rushed Pace Detected • Try One More Time (Use Chance 2 of 2)';
        recommendationReason = isTempoHesitant
          ? `Speech tempo clocked at ${tempoAnalysis.wpm} WPM (hesitant). Taking your 2nd chance to speak deliberately between 125–150 WPM will elevate your Job Adequacy by up to +12%.`
          : `Speech tempo clocked at ${tempoAnalysis.wpm} WPM (rapid). Taking your 2nd chance with 1.5-second deliberate breath pauses will project executive composure.`;
        primaryTargetArea = 'Speech Tempo & Cadence';
      } else if (isToneUptalk) {
        shouldRetry = true;
        decisionPrompt = '💡 Questioning Uptalk Detected • Try One More Time (Use Chance 2 of 2)';
        recommendationReason = 'Terminal uptalk (questioning pitch rise) was detected at phrase endings. Retrying with a definitive downward pitch inflection will solidify your authoritative executive command.';
        primaryTargetArea = 'Downward Pitch & Vocal Certainty';
      } else if (isJitterHigh && !isAuthoritative) {
        shouldRetry = true;
        decisionPrompt = '💡 Acoustic Tremor Detected • Try One More Time (Use Chance 2 of 2)';
        recommendationReason = `Vocal cord micro-tremor was elevated at ${jitterAnalysis.jitterPercent}%. Taking a deep physiological breath and using Chance 2 will ground your tone into executive calm.`;
        primaryTargetArea = 'Diaphragmatic Breath & Acoustic Calm';
      } else if (isFixationLow && cues.fixationRatioPercent !== undefined) {
        shouldRetry = true;
        decisionPrompt = '💡 Ocular Lens Wandering • Try One More Time (Use Chance 2 of 2)';
        recommendationReason = `Gaze fixation on the lens was ${fixation}%. Anchoring continuous eye contact on the camera aperture during Chance 2 projects unflinching transparency and poise.`;
        primaryTargetArea = 'Ocular Lens Anchoring';
      } else if (decisiveAnalysis.commandVerbsDetected.length < 2) {
        shouldRetry = true;
        decisionPrompt = '💡 Boost Command Action Verbs • Try One More Time (Use Chance 2 of 2)';
        recommendationReason = 'Your tone was composed, but could be elevated by including explicit triage verbs (e.g. "I have the bridge", "Step 1: Isolate", "Step 2: Mobilize").';
        primaryTargetArea = 'Decisive Command Verbs';
      } else if (overallScore < 88) {
        // Solid score (80-87%), candidate can try for 95%+
        shouldRetry = true;
        decisionPrompt = '🎯 Good First Take • Push for 95%+ Executive Distinction (Use Chance 2 of 2)';
        recommendationReason = `You earned a solid ${overallScore}% score! You have 1 recorded chance remaining—taking Chance 2 can push your score to the Top Prospect 95%+ tier.`;
        primaryTargetArea = 'Executive Polish & Distinction';
      } else {
        // Exceptional score (>= 88%)
        shouldRetry = false;
        decisionPrompt = '🌟 Certified High-Command Take • Chance 2 Optional';
        recommendationReason = `Outstanding delivery! Cadence (${tempoAnalysis.wpm} WPM), acoustic steadiness (${jitterAnalysis.jitterPercent}% jitter), and authoritative command are certified at an A+ level (${overallScore}%). You may keep this take or use Chance 2 if you wish.`;
        primaryTargetArea = 'Sustained Executive Distinction';
      }

      // Generate actionable adjustments based on detected cues
      if (isTempoHesitant) actionableAdjustments.push('Elevate cadence slightly to ~135 WPM by minimizing mid-sentence hesitation.');
      if (isTempoRushed) actionableAdjustments.push('Slow down by 15 WPM and insert a full breath pause between distinct points.');
      if (isToneUptalk) actionableAdjustments.push('Conclude action statements on a definitive downward pitch rather than a questioning rise.');
      if (isJitterHigh) actionableAdjustments.push('Take 2 deep belly breaths through your nose before speaking to steady vocal cord tension.');
      if (isFixationLow) actionableAdjustments.push('Look directly into the camera lens as if addressing the board chair directly.');
      if (decisiveAnalysis.commandVerbsDetected.length < 2) actionableAdjustments.push('Use structured sequence markers: "First, I am isolating...", "Next, we will brief stakeholders..."');
      if (actionableAdjustments.length === 0) {
        actionableAdjustments.push('Maintain steady posture and project unhurried command.');
      }
    } else {
      // Chance 2 completed (or final chance)
      shouldRetry = false;
      decisionPrompt = '🏁 Final Chance Completed (2 of 2 Chances Used)';
      recommendationReason = `Both recorded chances have been completed. Your highest-performing delivery has been calibrated and indexed into your certified dossier.`;
      primaryTargetArea = 'Final Candidate Dossier Verification';
      actionableAdjustments.push('Review your final cue contribution matrix and executive telemetry in the dossier summary.');
    }

    const exemplarAdjustmentCue = isAuthoritative
      ? `Model Command Statement: "I take full operational accountability for this incident. Here is our containment sequence: Step 1 is isolating the system, Step 2 is activating the incident bridge, and Step 3 is updating stakeholders."`
      : `Model Firm Statement: "I have the bridge. We will resolve this calmly, transparently, and immediately."`;

    return {
      shouldRetry,
      attemptNumber,
      maxChancesAllowed,
      chancesRemaining,
      decisionPrompt,
      recommendationReason,
      detectedCuesSummary: {
        speechTempo: {
          wpm: tempoAnalysis.wpm,
          status: isTempoOptimal ? 'optimal' : isTempoHesitant ? 'hesitant' : 'rushed',
          label: `${tempoAnalysis.wpm} WPM (${tempoAnalysis.cadenceClassification})`
        },
        jitterTremor: {
          percent: jitterAnalysis.jitterPercent,
          status: isJitterCalm ? 'calm' : isJitterHigh ? 'jittery' : 'alert',
          label: `${jitterAnalysis.jitterPercent}% Jitter (${jitterAnalysis.stabilityClassification})`
        },
        toneInflection: {
          type: toneAnalysis.terminalInflection,
          status: isToneCommanding ? 'commanding' : isToneUptalk ? 'uptalk' : 'neutral',
          label: toneAnalysis.terminalInflection === 'definitive_downward'
            ? 'Definitive Downward Inflection (Commanding)'
            : toneAnalysis.terminalInflection === 'questioning_uptalk'
            ? 'Questioning Uptalk (Dilutes Authority)'
            : 'Steady Neutral Delivery'
        },
        kinesicsFixation: {
          percent: fixation,
          status: isFixationLow ? 'wandering' : 'anchored',
          label: `${fixation}% Gaze Fixation on Camera`
        },
        authoritativeFirmness: {
          tier: decisiveAnalysis.decisivenessTier,
          score: decisiveAnalysis.decisiveScore,
          isFirm: decisiveAnalysis.isAuthoritativeFirm
        }
      },
      weightedImpacts: {
        jobAdequacyScore,
        culturalFitScore,
        proceduralRigorScore: proceduralScore,
        overallScore
      },
      primaryTargetArea,
      actionableAdjustments,
      exemplarAdjustmentCue
    };
  }

  /**
   * Compares two recorded attempts to showcase candidate improvement and determine the superior take.
   */
  public static compareAttempts(take1: RecordedResponseAttempt, take2: RecordedResponseAttempt) {
    const score1 = take1.evaluation.overallScore;
    const score2 = take2.evaluation.overallScore;
    const deltaScore = Math.round((score2 - score1) * 10) / 10;
    const deltaAdequacy = Math.round((take2.evaluation.jobAdequacyAudit.score - take1.evaluation.jobAdequacyAudit.score) * 10) / 10;
    const deltaCultural = Math.round((take2.evaluation.positiveLightAudit.score - take1.evaluation.positiveLightAudit.score) * 10) / 10;

    const preferredTakeNumber: 1 | 2 = score2 >= score1 ? 2 : 1;
    const preferredTake = preferredTakeNumber === 2 ? take2 : take1;

    let growthNarrative = '';
    if (deltaScore > 0) {
      growthNarrative = `Candidate demonstrated exceptional coachability on Take 2, gaining +${deltaScore}% overall with +${deltaAdequacy}% in Job Adequacy and +${deltaCultural}% in Cultural Fit.`;
    } else if (deltaScore === 0) {
      growthNarrative = `Candidate maintained consistent performance across both takes (${score1}% vs ${score2}%). Take ${preferredTakeNumber} indexed.`;
    } else {
      growthNarrative = `Take 1 established peak performance (${score1}% vs ${score2}%). Take 1 is retained as the official verified response.`;
    }

    return {
      take1,
      take2,
      deltaScore,
      deltaAdequacy,
      deltaCultural,
      preferredTakeNumber,
      preferredTake,
      growthNarrative,
      isSignificantImprovement: deltaScore >= 2.5
    };
  }
}
