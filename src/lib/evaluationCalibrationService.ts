/**
 * EvaluationCalibrationService
 * 
 * Precision calibration engine that benchmarks 'neutral/diplomatic' tone against
 * 'authoritative/decisive' responses to prevent bias toward 'warm/diplomatic' results.
 * 
 * CORE MANDATE:
 * In crisis leadership, operational governance, and incident management, candidate responses
 * that take firm, corrective action (e.g., halting non-compliant deployments, enforcing safety boundaries,
 * establishing triage sequences, assigning single-threaded ownership, and holding teams to standards)
 * must be recognized and celebrated as "Leadership-Adequate" rather than downgraded or
 * misclassified as merely "warm" or "lacking empathy".
 * 
 * This service implements:
 * 1. Dual-Axis Benchmarking (Neutral/Diplomatic vs. Authoritative/Decisive).
 * 2. Bias Detection & Parity Offset Calibration (protects Job Adequacy from warmth-penalty bias).
 * 3. Corrective Intervention Detection (extracts verifiable boundary & protocol actions).
 * 4. Executive Calibrated Labeling ('Leadership-Adequate (Firm & Corrective)').
 */

import {
  EvaluationCuesInput,
  ToneDecisivenessCalibrationResult,
  ToneDecisivenessBenchmarkProfile,
  CorrectiveInterventionItem
} from '../types.ts';
import { ToneAnalysis, DecisiveCommandAnalysis, TempoAnalysis, JitterAnalysis } from './evaluationLogicEngine.ts';

export class EvaluationCalibrationService {
  /**
   * Neutral / Diplomatic marker lexicon
   */
  private static readonly DIPLOMATIC_MARKERS = [
    'let\'s align', 'align with everyone', 'hear everyone out', 'find common ground',
    'middle ground', 'open to feedback', 'collaborative review', 'consensus',
    'understand everyone\'s perspective', 'everyone\'s point of view', 'team feeling',
    'work together peacefully', 'gentle reminder', 'explore options', 'perhaps we can',
    'might consider', 'could we possibly', 'would it be okay', 'if you\'re open to it',
    'if that works for you', 'just wondering', 'if you don\'t mind', 'with all due respect',
    'thank you so much', 'really appreciate it', 'apologize for the friction'
  ];

  /**
   * Authoritative / Decisive command marker lexicon
   */
  private static readonly AUTHORITATIVE_COMMAND_MARKERS = [
    'take command', 'taking command', 'take ownership', 'taking ownership',
    'isolate', 'isolating', 'contain', 'containing', 'stabilize', 'stabilizing',
    'escalate', 'escalating', 'notify', 'notifying', 'triage', 'triaging',
    'step 1', 'step one', 'step 2', 'step two', 'step 3', 'step three',
    'first priority', 'second priority', 'immediate priority', 'immediately',
    'protocol', 'incident bridge', 'war room', 'briefing', 'standby', 'we will',
    'i will', 'our plan', 'align', 'coordinate', 'execute', 'resolve',
    'i have the bridge', 'our priority is containment', 'timeline is 15 minutes'
  ];

  /**
   * Firm / Corrective intervention marker lexicon
   */
  private static readonly CORRECTIVE_INTERVENTION_MARKERS = [
    'halt production', 'stop deployment', 'halt immediately', 'stop the process',
    'this violates protocol', 'violates our standard', 'unacceptable risk',
    'corrective action required', 'immediate corrective action', 'non-negotiable standard',
    'safety protocol', 'security boundary', 'cease operation', 'reassign ownership',
    'hold the line', 'enforce compliance', 'escalate immediately', 'correct this variance',
    'stand down', 'do not proceed', 'i am pausing', 'pause release', 'quarantine the build',
    'address root cause', 'hold to standard', 'mandatory review', 'must comply',
    'safety comes first', 'will not compromise', 'clear ownership'
  ];

  /**
   * Benchmarks the candidate response along the Neutral / Diplomatic Axis
   */
  public static benchmarkNeutralDiplomatic(
    transcript: string,
    cues: EvaluationCuesInput,
    tone: ToneAnalysis
  ): ToneDecisivenessBenchmarkProfile {
    const lower = transcript.toLowerCase();
    const detected: string[] = [];

    for (const marker of this.DIPLOMATIC_MARKERS) {
      if (lower.includes(marker) && !detected.includes(marker)) {
        detected.push(marker);
      }
    }

    let score = 65.0;
    score += Math.min(25, detected.length * 5.0);

    // Tone modulation bonuses for diplomatic consensus
    if (tone.terminalInflection === 'steady_neutral') score += 6.0;
    if (tone.spectralWarmth.toLowerCase().includes('warm') || tone.spectralWarmth.toLowerCase().includes('resonant')) score += 4.0;
    if (tone.terminalInflection === 'questioning_uptalk') score -= 5.0; // Uptalk sounds insecure rather than diplomatic

    score = Math.min(98.0, Math.max(30.0, Math.round(score * 10) / 10));

    const strategicStrengths: string[] = [
      'Facilitates cross-functional consensus and team buy-in',
      'Minimizes interpersonal friction in non-emergency stakeholder discussions',
      'Promotes psychological safety when gathering divergent team perspectives'
    ];

    const crisisBlindspots: string[] = [
      'Risk of diffusion of responsibility during operational incidents',
      'Reluctance to halt non-compliant processes due to desire to avoid friction',
      'Ambiguity regarding who owns the final go/no-go operational decision'
    ];

    const characteristicSummary = detected.length > 0
      ? `Diplomatic demeanor utilizing collaborative consensus markers (${detected.slice(0, 3).map(m => `"${m}"`).join(', ')}). High emotional accommodation.`
      : 'Baseline professional diplomacy with moderate collaborative language.';

    const acousticFootprint = `Measured modulation with ${tone.spectralWarmth} acoustic resonance and ${tone.terminalInflection.replace(/_/g, ' ')} cadence.`;

    return {
      score,
      markersDetected: detected,
      characteristicSummary,
      strategicStrengths,
      crisisBlindspots,
      acousticFootprint
    };
  }

  /**
   * Benchmarks the candidate response along the Authoritative / Decisive Axis
   */
  public static benchmarkAuthoritativeDecisive(
    transcript: string,
    cues: EvaluationCuesInput,
    tone: ToneAnalysis,
    tempo: TempoAnalysis,
    jitter: JitterAnalysis,
    baseDecisiveScore: number
  ): ToneDecisivenessBenchmarkProfile {
    const lower = transcript.toLowerCase();
    const detectedCommands: string[] = [];
    const detectedCorrectives: string[] = [];

    for (const cmd of this.AUTHORITATIVE_COMMAND_MARKERS) {
      if (lower.includes(cmd) && !detectedCommands.includes(cmd)) {
        detectedCommands.push(cmd);
      }
    }

    for (const cor of this.CORRECTIVE_INTERVENTION_MARKERS) {
      if (lower.includes(cor) && !detectedCorrectives.includes(cor)) {
        detectedCorrectives.push(cor);
      }
    }

    const allMarkers = [...detectedCommands, ...detectedCorrectives];

    let score = baseDecisiveScore;
    // Boost for specific corrective boundary enforcement
    if (detectedCorrectives.length > 0) {
      score += Math.min(12, detectedCorrectives.length * 4.0);
    }
    // Boost for downward definitive cadence
    if (tone.terminalInflection === 'definitive_downward') {
      score += 4.0;
    }
    // Boost for executive tempo
    if (tempo.cadenceClassification.includes('Optimal Executive')) {
      score += 3.0;
    }

    score = Math.min(99.0, Math.max(32.0, Math.round(score * 10) / 10));

    const strategicStrengths: string[] = [
      'Provides unambiguous operational clarity and halts hazardous divergence',
      'Establishes immediate triage sequencing (Step 1, Step 2) under pressure',
      'Models fearless accountability and structural psychological safety for the organization'
    ];

    const crisisBlindspots: string[] = [
      'Requires intentional follow-up context to prevent perception of brusqueness',
      'Must ensure directives are paired with human dignity and procedural grounding'
    ];

    const characteristicSummary = allMarkers.length > 0
      ? `Authoritative decisive command featuring explicit directives (${allMarkers.slice(0, 3).map(m => `"${m}"`).join(', ')}). High operational accountability.`
      : 'Baseline decisive intent with developing executive command.';

    const acousticFootprint = `Down-inflected cadence (${tempo.wpm} WPM) paired with low physiological tremor (${jitter.jitterPercent}% jitter).`;

    return {
      score,
      markersDetected: allMarkers,
      characteristicSummary,
      strategicStrengths,
      crisisBlindspots,
      acousticFootprint
    };
  }

  /**
   * Identifies explicit corrective interventions where the candidate intervened
   * to correct errors, halt unsafe actions, or enforce operating standards.
   */
  public static extractCorrectiveInterventions(transcript: string): CorrectiveInterventionItem[] {
    const sentences = transcript.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
    const interventions: CorrectiveInterventionItem[] = [];

    for (const sentence of sentences) {
      const lower = sentence.toLowerCase();

      // Protocol enforcement
      if (
        lower.includes('protocol') ||
        lower.includes('standard') ||
        lower.includes('compliance') ||
        lower.includes('policy')
      ) {
        interventions.push({
          interventionType: 'protocol_enforcement',
          typeLabel: 'Protocol & Standard Enforcement',
          excerpt: sentence.trim(),
          rationale: 'Candidate explicitly grounds execution in established protocols, ensuring institutional compliance.',
          leadershipAdequacyWeight: 14
        });
        continue;
      }

      // Halting improper or unsafe actions
      if (
        lower.includes('halt') ||
        lower.includes('stop') ||
        lower.includes('pause') ||
        lower.includes('cease') ||
        lower.includes('quarantine')
      ) {
        interventions.push({
          interventionType: 'halt_improper_procedure',
          typeLabel: 'Halt Non-Compliant Procedure',
          excerpt: sentence.trim(),
          rationale: 'Candidate exercises executive courage to stop unsafe or compromised operations before further damage occurs.',
          leadershipAdequacyWeight: 16
        });
        continue;
      }

      // Setting non-negotiable boundaries
      if (
        lower.includes('unacceptable') ||
        lower.includes('will not compromise') ||
        lower.includes('boundary') ||
        lower.includes('cannot allow') ||
        lower.includes('safety comes first')
      ) {
        interventions.push({
          interventionType: 'boundary_setting',
          typeLabel: 'Executive Boundary Setting',
          excerpt: sentence.trim(),
          rationale: 'Candidate establishes unequivocal operational standards, protecting organizational integrity.',
          leadershipAdequacyWeight: 15
        });
        continue;
      }

      // Triage & step sequencing
      if (
        lower.includes('step 1') ||
        lower.includes('step 2') ||
        lower.includes('priority is') ||
        lower.includes('first step') ||
        lower.includes('immediate action')
      ) {
        interventions.push({
          interventionType: 'triage_prioritization',
          typeLabel: 'Triage & Step Sequencing',
          excerpt: sentence.trim(),
          rationale: 'Candidate breaks crisis complexity into an orderly, sequential action plan for the team.',
          leadershipAdequacyWeight: 12
        });
        continue;
      }

      // Clear accountability assignment
      if (
        lower.includes('i take responsibility') ||
        lower.includes('i will own') ||
        lower.includes('i have the bridge') ||
        lower.includes('taking ownership') ||
        lower.includes('reassigning')
      ) {
        interventions.push({
          interventionType: 'clear_accountability_assignment',
          typeLabel: 'Single-Threaded Accountability',
          excerpt: sentence.trim(),
          rationale: 'Candidate eliminates ambiguity by anchoring decisive ownership to named individuals or incident roles.',
          leadershipAdequacyWeight: 14
        });
      }
    }

    return interventions;
  }

  /**
   * Main Calibration & Benchmarking Orchestrator
   * 
   * Benchmarks Neutral/Diplomatic vs Authoritative/Decisive profiles,
   * detects and offsets warmth bias, and ensures firm or corrective responses
   * are correctly labeled as 'Leadership-Adequate'.
   */
  public static calibrate(params: {
    transcript: string;
    cues: EvaluationCuesInput;
    toneAnalysis: ToneAnalysis;
    tempoAnalysis: TempoAnalysis;
    jitterAnalysis: JitterAnalysis;
    decisiveAnalysis: DecisiveCommandAnalysis;
    rawJobAdequacy: number;
    rawCulturalFit: number;
    roleTitle?: string;
  }): ToneDecisivenessCalibrationResult {
    const {
      transcript,
      cues,
      toneAnalysis,
      tempoAnalysis,
      jitterAnalysis,
      decisiveAnalysis,
      rawJobAdequacy,
      rawCulturalFit
    } = params;

    // 1. Compute both benchmark profiles
    const neutralDiplomatic = this.benchmarkNeutralDiplomatic(transcript, cues, toneAnalysis);
    const authoritativeDecisive = this.benchmarkAuthoritativeDecisive(
      transcript,
      cues,
      toneAnalysis,
      tempoAnalysis,
      jitterAnalysis,
      decisiveAnalysis.decisiveScore
    );

    // 2. Extract specific corrective interventions
    const correctiveInterventions = this.extractCorrectiveInterventions(transcript);

    // 3. Compute Calibration Parity Ratio (Decisive / Diplomatic)
    const calibrationRatio = Math.round(
      (authoritativeDecisive.score / Math.max(1, neutralDiplomatic.score)) * 100
    ) / 100;

    // 4. Bias Detection Engine
    // Detect whether an authoritative, firm, or corrective response is at risk of being
    // downgraded or misclassified as merely "warm" or "lacking cultural fit"
    const hasCorrectiveInterventions = correctiveInterventions.length > 0;
    const isFirmOrDecisive = authoritativeDecisive.score >= 78 || decisiveAnalysis.isAuthoritativeFirm || hasCorrectiveInterventions;

    let biasMitigationApplied = false;
    let biasType: 'warmth_overindexing' | 'corrective_underappreciation' | 'balanced_mastery' | 'passive_diplomacy' = 'balanced_mastery';
    let jobAdequacyCalibrationOffset = 0;
    let culturalFitCalibrationOffset = 0;

    if (isFirmOrDecisive && hasCorrectiveInterventions) {
      // Candidate executed firm, corrective leadership
      biasMitigationApplied = true;
      biasType = 'corrective_underappreciation';
      // Anti-warmth bias adjustment: ensure corrective stances receive leadership-adequate credit
      jobAdequacyCalibrationOffset = Math.min(14, Math.max(6, Math.round(correctiveInterventions.length * 3.5 * 10) / 10));
      // Protect cultural fit score: firm leadership is constructive cultural leadership, not friction
      culturalFitCalibrationOffset = 8.0;
    } else if (isFirmOrDecisive && authoritativeDecisive.score > neutralDiplomatic.score + 5) {
      biasMitigationApplied = true;
      biasType = 'warmth_overindexing';
      jobAdequacyCalibrationOffset = 8.5;
      culturalFitCalibrationOffset = 6.0;
    } else if (neutralDiplomatic.score >= 82 && authoritativeDecisive.score >= 82) {
      biasMitigationApplied = false;
      biasType = 'balanced_mastery';
      jobAdequacyCalibrationOffset = 4.0;
      culturalFitCalibrationOffset = 4.0;
    } else if (neutralDiplomatic.score > 80 && authoritativeDecisive.score < 68) {
      biasMitigationApplied = false;
      biasType = 'passive_diplomacy';
      jobAdequacyCalibrationOffset = 0;
      culturalFitCalibrationOffset = 0;
    }

    // 5. Produce Calibrated Classifications
    let calibratedLeadershipClassification: 
      | 'Leadership-Adequate (Firm & Corrective Command)'
      | 'Leadership-Adequate (Decisive Authority)'
      | 'Leadership-Adequate (Balanced Executive Stance)'
      | 'Diplomatic & Conciliatory'
      | 'Developing Authority (Needs Decisive Grounding)';

    let calibratedToneLabel: string;

    if (hasCorrectiveInterventions && authoritativeDecisive.score >= 80) {
      calibratedLeadershipClassification = 'Leadership-Adequate (Firm & Corrective Command)';
      calibratedToneLabel = 'Firm & Corrective Command (Leadership-Adequate)';
    } else if (authoritativeDecisive.score >= 82 || decisiveAnalysis.isAuthoritativeFirm) {
      calibratedLeadershipClassification = 'Leadership-Adequate (Decisive Authority)';
      calibratedToneLabel = 'Authoritative & Resolute (Leadership-Adequate)';
    } else if (authoritativeDecisive.score >= 74 && neutralDiplomatic.score >= 74) {
      calibratedLeadershipClassification = 'Leadership-Adequate (Balanced Executive Stance)';
      calibratedToneLabel = 'Grounded Executive Decisiveness (Leadership-Adequate)';
    } else if (neutralDiplomatic.score >= 76) {
      calibratedLeadershipClassification = 'Diplomatic & Conciliatory';
      calibratedToneLabel = 'Warm & Diplomatic (Conciliatory)';
    } else {
      calibratedLeadershipClassification = 'Developing Authority (Needs Decisive Grounding)';
      calibratedToneLabel = 'Developing Authority (Needs Firmer Cadence)';
    }

    // 6. Benchmarking Comparison Narrative & Anti-Warmth Bias Rationale
    const antiWarmthBiasRationale = isFirmOrDecisive
      ? `Calibration Audit Verified: Candidate demonstrated firm, corrective operational directives (${correctiveInterventions.length} corrective interventions identified). The Calibration Service successfully benchmarked this against the diplomatic baseline and mitigated warmth-bias: rather than mislabeling the response as merely 'warm' or requiring unnecessary apologetic hedging, this stance is officially validated as 'Leadership-Adequate' with a +${jobAdequacyCalibrationOffset} pt Job Adequacy parity adjustment.`
      : `Calibration Audit: Response was evaluated across both diplomatic (${neutralDiplomatic.score}%) and decisive (${authoritativeDecisive.score}%) axes. Candidate leaned toward diplomatic consensus. No warmth-penalty detected.`;

    const benchmarkingComparisonNarrative = `Authoritative/Decisive Index: ${authoritativeDecisive.score}% vs Neutral/Diplomatic Index: ${neutralDiplomatic.score}% (Parity Ratio: ${calibrationRatio}x). ${
      isFirmOrDecisive
        ? 'Authoritative decisiveness prevailed with downward terminal inflection and clear accountability boundaries.'
        : 'Diplomatic consensus markers predominated over operational triage commands.'
    }`;

    return {
      neutralDiplomaticBenchmark: neutralDiplomatic,
      authoritativeDecisiveBenchmark: authoritativeDecisive,
      calibrationRatio,
      biasMitigationApplied,
      biasType,
      jobAdequacyCalibrationOffset,
      culturalFitCalibrationOffset,
      calibratedToneLabel,
      calibratedLeadershipClassification,
      correctiveInterventions,
      antiWarmthBiasRationale,
      benchmarkingComparisonNarrative
    };
  }
}
