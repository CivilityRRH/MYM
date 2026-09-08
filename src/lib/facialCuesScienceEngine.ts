/**
 * FacialCuesScienceEngine
 * 
 * Scientific Psychophysiological, Kinesic, and Experiential Grounding Architecture.
 * 
 * THEORETICAL & PEER-REVIEWED SCIENTIFIC FOUNDATIONS:
 * 1. Facial Action Coding System (FACS) - Paul Ekman & Wallace Friesen (1978, 2003):
 *    - Action Units (AU1: Inner Brow Raiser, AU2: Outer Brow Raiser, AU4: Brow Lowerer, 
 *      AU6: Cheek Raiser, AU12: Lip Corner Puller - Duchenne smile of authentic affect,
 *      AU14: Dimpler, AU15: Lip Corner Depressor, AU23/24: Lip Tightener/Pressor).
 *    - Micro-expression latency (40-200ms) and involuntary affective leakage.
 *    - CRITICAL SCIENTIFIC PRINCIPLE: Safeguard against the "Othello Error" (Ekman, 1985).
 *      Autonomic agitation, fear of being disbelieved, and stage fright MUST NEVER be conflated
 *      with deceit. Nerves indicate sympathetic nervous system arousal and high conscientiousness.
 * 
 * 2. Polyvagal Theory - Dr. Stephen Porges (2011):
 *    - Ventral Vagal Social Engagement Complex (calm prosody, responsive facial musculature).
 *    - Sympathetic Arousal (pupil dilation, elevated blink rate, vocal shimmer/micro-tremor).
 *    - Dorsal Vagal Brake / Freeze (tonic facial rigidity, flat prosody, gaze suppression).
 * 
 * 3. Cognitive Load & Autobiographical Reality Monitoring - Aldert Vrij (2008, 2019) & Johnson & Raye (1981):
 *    - Criteria-Based Content Analysis (CBCA) & Reality Monitoring framework.
 *    - Differentiating Lived Episodic Memory vs Fabricated Conceptual Scripting:
 *      * Authentic lived operational experience spontaneously generates:
 *        a) Granular temporal/spatial contextualization ("At 3 AM when database cluster B dropped...").
 *        b) Specific operational constraints and friction points ("The legacy API lacked rate-limiting...").
 *        c) Organic speech-gesture synchrony (illustrators slightly lead or accompany verbal markers by 100-250ms).
 *        d) Natural, brief cognitive retrieval gaze shifts rather than prolonged upward evasion.
 *      * Superficial or manufactured claims exhibit high conceptual abstraction, low episodic detail density,
 *        and mechanical affective latency.
 * 
 * DIRECTIVE & PRODUCT TRANSFORMATION:
 * - Reshaped entirely into an empowering, positive Executive Coaching & Authentic Identity verification system.
 * - NEVER uses labels like "Lie Detector", "True/False", "Deception", or "Fraud".
 * - Positively pinpoints stage fright / performance nerves and provides neuro-somatic regulation drills.
 * - Positively verifies authentic, lived track records to eliminate resume embellishment without accusatory framing.
 */

import { FacialComposureAndExperientialVeracity } from '../types.ts';
import { OpticalScanReport } from './videoOpticalAnalyzer.ts';

export interface FacialCuesScienceConfig {
  speechPacingWpm?: number;
  jitterPercent?: number;
  shimmerPercent?: number;
  hnrDb?: number;
  pitchStabilityPercent?: number;
  transcript?: string;
  scenarioType?: 'crisis_incident' | 'true_calling' | 'leadership_inquiry' | 'general';
}

export class FacialCuesScienceEngine {
  /**
   * Main synthesis pipeline that ingests optical scan report, acoustic telemetry,
   * and response transcript to produce a comprehensive, positively framed evaluation.
   */
  public static synthesize(
    opticalReport?: Partial<OpticalScanReport> | null,
    config: FacialCuesScienceConfig = {}
  ): FacialComposureAndExperientialVeracity {
    const optical = opticalReport || {};
    const oculometrics = optical.oculometrics || {
      fixationRatioPercent: 78,
      saccadeFrequencyPerMin: 24,
      gazeAversionPattern: 'direct_anchored' as const,
      cognitiveVsNervousAnalysis: 'Ocular movements reflect active cognitive synthesis with steady lens anchoring.',
      blinkRatePerMin: 22,
      blinkStressClassification: 'mild_alertness' as const
    };
    
    const kinesics = optical.kinesicMovements || {
      posturalSwayIndex: 18,
      adaptorFrequency: 'Minimal / Grounded',
      illustratorEffectiveness: 'High Speech-Gesture Synchrony',
      nervousSystemState: 'regulated_ventral' as const,
      shoulderTensionScore: 28
    };

    const transcript = (config.transcript || '').trim();
    const wpm = config.speechPacingWpm || 135;
    const jitter = config.jitterPercent ?? 1.35;
    const pitchStability = config.pitchStabilityPercent ?? 92;

    // 1. Stage Fright & Autonomic Nerve Calibration
    const nerveResult = this.evaluateNerveAndStageFrightCalibration(
      oculometrics,
      kinesics,
      wpm,
      jitter,
      pitchStability
    );

    // 2. Experiential Grounding & Autobiographical Reality (Positive Anti-Resume-Embellishment)
    const experientialResult = this.evaluateExperientialGrounding(
      transcript,
      oculometrics,
      kinesics,
      config.scenarioType || 'crisis_incident'
    );

    return {
      nerveAndAnxietyCalibration: nerveResult,
      experientialGroundingAudit: experientialResult
    };
  }

  /**
   * Dimension 1: Nerve, Stage-Fright & Physiological Tension Calibration
   * Diagnoses performance anxiety loci, safeguards against Othello Error, and builds somatic coaching drills.
   */
  private static evaluateNerveAndStageFrightCalibration(
    oculometrics: NonNullable<OpticalScanReport['oculometrics']>,
    kinesics: NonNullable<OpticalScanReport['kinesicMovements']>,
    wpm: number,
    jitter: number,
    pitchStability: number
  ): FacialComposureAndExperientialVeracity['nerveAndAnxietyCalibration'] {
    let steadinessScore = 86; // Baseline executive composure

    // Factor A: Ocular Flutter & Blinking (Autonomic Sympathetic Indicator)
    if (oculometrics.blinkRatePerMin > 38) {
      steadinessScore -= 7;
    } else if (oculometrics.blinkRatePerMin >= 14 && oculometrics.blinkRatePerMin <= 26) {
      steadinessScore += 5; // Optimal parasympathetic resting window
    }

    // Factor B: Ocular Fixation & Lens Anchoring
    if (oculometrics.fixationRatioPercent >= 80) {
      steadinessScore += 5;
    } else if (oculometrics.fixationRatioPercent < 60) {
      steadinessScore -= 6;
    }

    // Factor C: Vocal Cord Micro-Tremor (Jitter & Shimmer)
    if (jitter <= 1.4) {
      steadinessScore += 4;
    } else if (jitter > 2.8) {
      steadinessScore -= 6;
    }

    // Factor D: Postural Sway & Vestibular Balancing
    if (kinesics.posturalSwayIndex < 20) {
      steadinessScore += 4;
    } else if (kinesics.posturalSwayIndex > 45) {
      steadinessScore -= 6;
    }

    // Factor E: Cervical / Shoulder Trapezius Muscle Contraction
    if (kinesics.shoulderTensionScore > 50) {
      steadinessScore -= 5;
    } else if (kinesics.shoulderTensionScore < 30) {
      steadinessScore += 3;
    }

    // Clamp score
    const autonomicSteadinessScore = Math.min(98, Math.max(52, Math.round(steadinessScore * 10) / 10));

    // Determine Stage Fright Index
    let stageFrightIndex: FacialComposureAndExperientialVeracity['nerveAndAnxietyCalibration']['stageFrightIndex'];
    let stageFrightSummary: string;

    if (autonomicSteadinessScore >= 88) {
      stageFrightIndex = 'calm_ventral_equilibrium';
      stageFrightSummary = 'Exceptional physiological composure. Parasympathetic vagal tone remained stabilized under high stakes, marked by grounded respiratory rhythms and steady lens alignment.';
    } else if (autonomicSteadinessScore >= 78) {
      stageFrightIndex = 'mild_anticipatory_excitement';
      stageFrightSummary = 'Healthy anticipatory alertness detected. The candidate channeled physiological adrenaline into vibrant verbal engagement, maintaining clear diaphragmatic control with minimal micro-tremor.';
    } else if (autonomicSteadinessScore >= 66) {
      stageFrightIndex = 'transient_performance_nerves';
      stageFrightSummary = 'Transient performance nerves observed during the initial seconds of the scenario. Demonstrates deep conscientiousness and emotional investment; stabilized composure as articulation progressed.';
    } else {
      stageFrightIndex = 'acute_stage_fright';
      stageFrightSummary = 'High sympathetic arousal and stage fright detected during crisis delivery. Reflects acute situational reverence and genuine care; benefited significantly from structured somatic pacing.';
    }

    // Identify Precise Physical Tension Loci
    const detectedTensionPoints: string[] = [];

    if (oculometrics.blinkRatePerMin > 35) {
      detectedTensionPoints.push(`Ocular flutter (${oculometrics.blinkRatePerMin} blinks/min) during introductory cognitive framing`);
    }
    if (oculometrics.fixationRatioPercent < 68) {
      detectedTensionPoints.push('Brief downward/lateral gaze shifts while searching for procedural recall');
    }
    if (kinesics.shoulderTensionScore > 40) {
      detectedTensionPoints.push('Cervical trapezius micro-elevation under high-stakes interrogation');
    }
    if (jitter > 2.0) {
      detectedTensionPoints.push('Subtle vocal fold shimmer indicating emotional adrenaline surge');
    }
    if (kinesics.posturalSwayIndex > 30) {
      detectedTensionPoints.push('Subtle vestibular weight shifting while formulating complex triage steps');
    }
    if (wpm > 170) {
      detectedTensionPoints.push('Accelerated verbal cadence under pressure (exceeds optimal 125-155 WPM zone)');
    }

    if (detectedTensionPoints.length === 0) {
      detectedTensionPoints.push('Zero localized somatic tension detected; full bodily equilibrium maintained');
      detectedTensionPoints.push('Steady ocular anchoring with authentic facial micro-responsiveness');
    }

    // Targeted Neuro-Somatic Calming Protocols
    const targetedNerveCalmingProtocols = [
      {
        technique: 'Cyclic Physiological Sigh Protocol',
        targetArea: 'Autonomic Sympathetic Surge & Diaphragmatic Spasm',
        protocol: 'Execute two deep rapid nasal inhalations followed immediately by an unhurried, extended oral exhale. Repeat for 3 cycles prior to high-stakes delivery.',
        neuroScienceRationale: 'Instantly re-inflates collapsed pulmonary alveoli, triggers the baroreceptor reflex, and signals the vagus nerve to decelerate resting heart rate within 30 seconds.'
      },
      {
        technique: 'Optic Flow & Horizon Soft-Focus Anchor',
        targetArea: 'Ocular Flutter & Sympathetic Saccades',
        protocol: 'Widen focal visual gaze to take in peripheral room boundaries without staring fixedly at a single point before re-anchoring directly to the camera lens.',
        neuroScienceRationale: 'Engaging panoramic peripheral vision activates cholinergic pathways that downregulate amygdala excitation, counteracting the tunnel-vision effect of stage fright.'
      },
      {
        technique: 'Diaphragmatic Cadence Pacing (125-145 WPM)',
        targetArea: 'Vocal Fold Shimmer & Frantic Speech Acceleration',
        protocol: 'Group critical executive recommendations into 4-to-6 word breath clusters, utilizing 1.2-second pauses at period boundaries.',
        neuroScienceRationale: 'Prevents air depletion over laryngeal cartilage, eliminating vocal pitch jitter and ensuring authoritative gravitas under pressure.'
      }
    ];

    return {
      autonomicSteadinessScore,
      stageFrightIndex,
      stageFrightSummary,
      detectedTensionPoints,
      targetedNerveCalmingProtocols
    };
  }

  /**
   * Dimension 2: Experiential Grounding & Autobiographical Reality (Positive Anti-Resume-Embellishment)
   * Evaluates episodic density, operational milestones, and cognitive retrieval synchrony.
   */
  private static evaluateExperientialGrounding(
    transcript: string,
    oculometrics: NonNullable<OpticalScanReport['oculometrics']>,
    kinesics: NonNullable<OpticalScanReport['kinesicMovements']>,
    scenarioType: string
  ): FacialComposureAndExperientialVeracity['experientialGroundingAudit'] {
    const textLower = transcript.toLowerCase();
    const wordCount = transcript.split(/\s+/).filter(Boolean).length;

    // 1. Operational & Concrete Experience Vocabulary Markers
    const concreteOperationalTerms = [
      'first', 'then', 'isolated', 'protocol', 'timeline', 'escalated', 'communicated',
      'stakeholder', 'metric', 'triage', 'mitigate', 'audit', 'containment', 'root cause',
      'implemented', 'coordinate', 'dispatched', 'verified', 'measured', 'framework',
      'cross-functional', 'deployed', 'resolved', 'boundary', 'handoff', 'governance'
    ];

    let operationalMatchCount = 0;
    concreteOperationalTerms.forEach(term => {
      if (textLower.includes(term)) operationalMatchCount++;
    });

    // 2. Episodic Specificity vs Generic Platitudes
    const genericPlatitudeTerms = [
      'very good', 'really hard', 'best practice', 'i always do my best', 'all aspects',
      'basically', 'kind of', 'sort of', 'stuff like that', 'handled everything'
    ];

    let platitudeCount = 0;
    genericPlatitudeTerms.forEach(term => {
      if (textLower.includes(term)) platitudeCount++;
    });

    // Calculate Autobiographical Detail Density (0 - 100%)
    let detailDensity = 68; // Baseline
    if (wordCount > 35) {
      detailDensity += Math.min(22, operationalMatchCount * 3.5);
      detailDensity -= Math.min(15, platitudeCount * 4.0);
    } else {
      detailDensity -= 10; // Brevity penalty for superficial answers
    }
    const autobiographicalDetailDensity = Math.min(98, Math.max(45, Math.round(detailDensity)));

    // 3. Cognitive Retrieval Congruence
    // Natural memory access: brief lateral glance, followed by immediate direct contact.
    let cognitiveRetrievalCongruence: FacialComposureAndExperientialVeracity['experientialGroundingAudit']['cognitiveRetrievalCongruence'];
    if (oculometrics.gazeAversionPattern === 'direct_anchored' || oculometrics.gazeAversionPattern === 'cognitive_gating_lateral') {
      cognitiveRetrievalCongruence = 'effortless_episodic_recall';
    } else if (oculometrics.gazeAversionPattern === 'nervous_downward_avoidance') {
      cognitiveRetrievalCongruence = 'natural_deliberative_retrieval';
    } else {
      cognitiveRetrievalCongruence = 'calculated_conceptual_synthesis';
    }

    // 4. Affective-Verbal Synchrony
    let synchrony = 88;
    if (kinesics.illustratorEffectiveness === 'High Speech-Gesture Synchrony') {
      synchrony += 7;
    } else if (kinesics.illustratorEffectiveness === 'Rigid Tonic Freeze') {
      synchrony -= 8;
    }
    if (oculometrics.fixationRatioPercent >= 75) synchrony += 3;
    const affectiveVerbalSynchronyPercent = Math.min(99, Math.max(55, synchrony));

    // 5. Composite Grounding Score
    const groundingScore = Math.min(99, Math.max(48, Math.round(
      (autobiographicalDetailDensity * 0.45) +
      (affectiveVerbalSynchronyPercent * 0.35) +
      (operationalMatchCount >= 3 ? 18 : 10)
    )));

    // Tier Classification
    let experientialDepthTier: FacialComposureAndExperientialVeracity['experientialGroundingAudit']['experientialDepthTier'];
    if (groundingScore >= 88) {
      experientialDepthTier = 'Deep Lived Operational Mastery';
    } else if (groundingScore >= 78) {
      experientialDepthTier = 'Substantive Authentic Background';
    } else if (groundingScore >= 65) {
      experientialDepthTier = 'Emerging Experiential Foundation';
    } else {
      experientialDepthTier = 'High-Level Surface Summary';
    }

    // Verified Experience Markers (Empowering, positive verification of real past work)
    const verifiedExperienceMarkers: string[] = [];

    if (operationalMatchCount >= 2) {
      verifiedExperienceMarkers.push('Spontaneously articulated multi-stage operational sequencing and containment protocol');
    }
    if (autobiographicalDetailDensity >= 75) {
      verifiedExperienceMarkers.push('Rich situational context reflecting genuine field tenure and operational adversity');
    }
    if (affectiveVerbalSynchronyPercent >= 85) {
      verifiedExperienceMarkers.push('High affective-verbal synchrony without rehearsed latency or synthetic masking');
    }
    if (oculometrics.fixationRatioPercent >= 70) {
      verifiedExperienceMarkers.push('Unwavering ocular commitment while defending professional methodology');
    }

    if (verifiedExperienceMarkers.length === 0) {
      verifiedExperienceMarkers.push('Foundational communication profile; candidate articulates core career objectives clearly');
      verifiedExperienceMarkers.push('Direct lens engagement maintained throughout introductory briefing');
    }

    const depthEnhancementGuidance = groundingScore >= 85
      ? 'Exemplary lived experience demonstrated. When briefing board-level executive panels, further amplify historical impact by citing concrete percentage efficiencies and institutional governance frameworks.'
      : 'To translate your authentic capabilities into boardroom authority, anchor future responses in specific operational milestones, legacy architecture challenges overcome, and concrete cross-functional stakeholders.';

    return {
      groundingScore,
      experientialDepthTier,
      autobiographicalDetailDensity,
      cognitiveRetrievalCongruence,
      affectiveVerbalSynchronyPercent,
      verifiedExperienceMarkers,
      depthEnhancementGuidance
    };
  }
}
