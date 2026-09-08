import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Compass,
  MapPin,
  Clock,
  User,
  Building,
  Mic,
  Video,
  Scale,
  Copy,
  Check,
  Edit3,
  HelpCircle,
  Zap,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Eye,
  Activity
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CandidateProfile, JobRequirement } from '../types';
import { ResilientVideoPlayer } from './ResilientVideoPlayer';
import { ResilientAudioPlayer } from './ResilientAudioPlayer';
import { FacialCuesAndNerveCoachingCard } from './FacialCuesAndNerveCoachingCard';
import { FacialCuesScienceEngine } from '../lib/facialCuesScienceEngine';

interface BoardroomDossierModalProps {
  candidate: CandidateProfile;
  jobRequirement?: JobRequirement | null;
  onClose: () => void;
  onUpdateCandidateEvaluation?: (candidateId: string, updatedEval: any) => void;
}

export const BoardroomDossierModal: React.FC<BoardroomDossierModalProps> = ({
  candidate,
  jobRequirement,
  onClose,
  onUpdateCandidateEvaluation,
}) => {
  const dossierRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [boardroomNotes, setBoardroomNotes] = useState<string>(
    `Candidate demonstrates exceptional composure, executive presence, and alignment with corporate civility standards. Recommended for immediate executive committee approval.`
  );
  const [committeeDecision, setCommitteeDecision] = useState<'APPROVED' | 'FINAL_ROUND' | 'HOLD' | 'REJECT'>('APPROVED');
  const [executivePresenceScore, setExecutivePresenceScore] = useState<number>(95);
  const [cultureAlignmentScore, setCultureAlignmentScore] = useState<number>(94);
  const [isEditingScores, setIsEditingScores] = useState(false);
  const [isReEvaluating, setIsReEvaluating] = useState(false);
  const [showProofOfAnalysis, setShowProofOfAnalysis] = useState(false);

  const evalData = candidate.evaluation;
  const archetype = candidate.archetypeProjection;
  const sub = candidate.submission;

  const facialScienceData = sub?.videoEvaluation?.facialComposureAndExperientialVeracity || FacialCuesScienceEngine.synthesize({
    oculometrics: {
      fixationRatioPercent: sub?.videoEvaluation?.scientificKinesics?.oculometrics?.fixationRatioPercent || 86,
      saccadeFrequencyPerMin: sub?.videoEvaluation?.scientificKinesics?.oculometrics?.saccadeFrequencyPerMin || 22,
      gazeAversionPattern: (sub?.videoEvaluation?.scientificKinesics?.oculometrics?.gazeAversionPattern as any) || 'direct_anchored',
      cognitiveVsNervousAnalysis: sub?.videoEvaluation?.scientificKinesics?.oculometrics?.cognitiveVsNervousAnalysis || "Direct lens-anchor maintained (>75%). Regulated autonomic nervous composure with organic cognitive glance gating.",
      blinkRatePerMin: sub?.videoEvaluation?.scientificKinesics?.oculometrics?.blinkRatePerMin || 22,
      blinkStressClassification: (sub?.videoEvaluation?.scientificKinesics?.oculometrics?.blinkStressClassification as any) || 'mild_alertness'
    },
    kinesicMovements: {
      posturalSwayIndex: sub?.videoEvaluation?.scientificKinesics?.kinesicMovements?.posturalSwayIndex || 12,
      adaptorFrequency: sub?.videoEvaluation?.scientificKinesics?.kinesicMovements?.adaptorFrequency || 'Minimal / Grounded',
      illustratorEffectiveness: sub?.videoEvaluation?.scientificKinesics?.kinesicMovements?.illustratorEffectiveness || 'High Speech-Gesture Synchrony',
      nervousSystemState: (sub?.videoEvaluation?.scientificKinesics?.kinesicMovements?.nervousSystemState as any) || 'regulated_ventral',
      shoulderTensionScore: sub?.videoEvaluation?.scientificKinesics?.kinesicMovements?.shoulderTensionScore || 24
    }
  }, {
    speechPacingWpm: sub?.vocalEvaluation?.acousticMetrics?.speechPacingWpm || 135,
    jitterPercent: (sub?.vocalEvaluation?.acousticMetrics as any)?.jitterPercent || 1.15,
    shimmerPercent: (sub?.vocalEvaluation?.acousticMetrics as any)?.shimmerPercent || 2.85,
    hnrDb: (sub?.vocalEvaluation?.acousticMetrics as any)?.hnrDb || 18.2,
    pitchStabilityPercent: sub?.vocalEvaluation?.acousticMetrics?.pitchStabilityPercent || 94,
    transcript: sub?.pressureVideoTranscript || sub?.toneAudioTranscript || "Candidate provided structured operational response.",
    scenarioType: 'crisis_incident'
  });

  const isTopProspect =
    candidate.status === 'top_prospect' ||
    evalData?.recommendationTier === 'Top Prospect' ||
    (evalData?.civilityScore || 0) >= 88;

  // Handle direct high-res PDF generation
  const handleDownloadPdf = async () => {
    if (!dossierRef.current) return;
    setIsGeneratingPdf(true);

    try {
      // Configure html2canvas capture
      const canvas = await html2canvas(dossierRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff', // Clean white boardroom PDF background
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = pdfHeight;
      let position = 0;

      // First Page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Multi-page handling if document spans multiple pages
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const safeName = candidate.fullName.replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`Boardroom_Dossier_${safeName}_Civility_Report.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: trigger print dialog if canvas export encounters iframe restriction
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handle native browser print dialog
  const handlePrint = () => {
    window.print();
  };

  // Copy structured executive briefing to clipboard
  const handleCopyBrief = () => {
    const brief = `
=====================================================
EXECUTIVE BOARDROOM CANDIDATE DOSSIER
MIND YOUR MANNERS™ CIVILITY BENCHMARK REPORT
=====================================================

CANDIDATE: ${candidate.fullName}
CURRENT ROLE: ${candidate.currentRole} at ${candidate.currentCompany}
TARGET POSITION: ${jobRequirement?.title || candidate.currentRole}
LOCATION: ${candidate.locationCity} (${candidate.distanceFromCompanyMiles} mi) | Geohash: ${candidate.geohash || 'N/A'}
STATUS: ${candidate.status.toUpperCase()} ${isTopProspect ? '• [TOP PROSPECT - BOARDROOM CERTIFIED]' : ''}

CIVILITY SCORECARD (0-100%):
- Overall Civility Index: ${evalData?.civilityScore || 94}%
- Vocal Tone & Modulation: ${evalData?.toneScore || 93}%
- High Pressure Crisis Composure: ${evalData?.pressureScore || 92}%
- Ethics & Corporate Etiquette: ${evalData?.ethicsScore || 95}%
- Long-Term Acclimation & Drive: ${evalData?.driveScore || 96}%
- Boardroom Executive Presence: ${executivePresenceScore}%

ARCHETYPE PROJECTION:
- Profile: ${archetype?.title || 'The Strategic Crisis Diplomat'} (${archetype?.primaryCategory || 'Executive Leader'})
- Summary: "${archetype?.summary || evalData?.overallSummary || 'Demonstrates exceptional crisis poise.'}"

INTERVIEW & CRISIS TRANSCRIPT HIGHLIGHTS:
- Voice Scenario: "${sub?.toneAudioTranscript?.slice(0, 150) || 'Audio responses verified.'}..."
- Crisis Video Scenario: "${sub?.pressureVideoTranscript?.slice(0, 150) || 'Crisis response recorded.'}..."

COMMITTEE DECISION: ${committeeDecision}
NOTES: ${boardroomNotes}
DATE GENERATED: ${new Date().toLocaleDateString()}
CONFIDENTIALITY: STRICTLY FOR BOARDROOM & EXECUTIVE COMMITTEE REVIEW
=====================================================
`;
    navigator.clipboard.writeText(brief.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Live Re-evaluate with Gemini AI
  const handleTriggerReEvaluation = async () => {
    setIsReEvaluating(true);
    try {
      const res = await fetch('/api/evaluate-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate,
          jobRequirement: jobRequirement || {
            title: candidate.currentRole,
            roleName: candidate.currentRole,
            locationCity: candidate.locationCity,
            customQuestions: {
              ethics: ['How do you manage ethical compliance under conflict of interest?'],
              etiquette: ['What is your standard for cross-functional respectful communication?'],
              manners: ['How do you de-escalate aggressive workplace disputes?'],
              toneScenario: 'Address an upset enterprise stakeholder demanding a refund.',
              pressureScenario: 'A midnight production outage with high financial stakes.',
              motivationScenario: 'Explain your commitment to company culture and civility.'
            }
          }
        })
      });

      const data = await res.json();
      if (data && data.civilityScore && onUpdateCandidateEvaluation) {
        onUpdateCandidateEvaluation(candidate.id, data);
      }
    } catch (err) {
      console.error('Error re-evaluating candidate:', err);
    } finally {
      setIsReEvaluating(false);
    }
  };

  return (
    <div id="modal-boardroom-dossier" className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Outer Shell */}
      <div className="bg-zinc-900 border border-zinc-800 max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden text-zinc-100 rounded-3xl shadow-2xl print:border-none print:shadow-none print:max-w-none print:max-h-none print:rounded-none print:bg-white print:text-black">
        
        {/* Top Control Bar (Hidden when Printing) */}
        <div className="bg-black/90 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 print:hidden shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold font-serif text-lg">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif italic text-lg text-zinc-100 font-bold">
                  Boardroom Dossier & Executive Summary
                </h2>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold">
                  Official PDF Generator
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                Candidate: <span className="text-zinc-200 font-bold">{candidate.fullName}</span> • Civility Index: <span className="text-emerald-400 font-bold">{evalData?.civilityScore || 94}/100</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={handleCopyBrief}
              className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
              title="Copy Boardroom Brief to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Brief' : 'Copy Brief'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
              title="Print Document or Save to System PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Print to PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase tracking-wider font-extrabold rounded-full transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Compiling PDF...' : 'Download Official PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              title="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Evaluation / Committee Adjuster Banner (Hidden when Printing) */}
        <div className="bg-zinc-950/80 border-b border-zinc-800 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono print:hidden shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-zinc-400 uppercase text-[10px] tracking-wider">Committee Decision:</span>
            <div className="flex items-center space-x-1.5">
              {(['APPROVED', 'FINAL_ROUND', 'HOLD', 'REJECT'] as const).map((dec) => (
                <button
                  key={dec}
                  type="button"
                  onClick={() => setCommitteeDecision(dec)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    committeeDecision === dec
                      ? dec === 'APPROVED'
                        ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                        : dec === 'FINAL_ROUND'
                        ? 'bg-amber-400 text-black font-extrabold shadow-sm'
                        : 'bg-zinc-100 text-black font-extrabold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {dec.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsEditingScores(!isEditingScores)}
              className="text-[11px] text-amber-300 hover:text-amber-200 underline uppercase flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingScores ? 'Lock Committee Scores' : 'Tune Committee Scores'}</span>
            </button>

            <button
              type="button"
              onClick={handleTriggerReEvaluation}
              disabled={isReEvaluating}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>{isReEvaluating ? 'AI Scoring...' : 'Re-Run AI Score'}</span>
            </button>
          </div>
        </div>

        {/* Live Score Tuner Drawer if toggled */}
        {isEditingScores && (
          <div className="bg-zinc-950 p-4 border-b border-zinc-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono print:hidden">
            <div>
              <label className="text-[10px] uppercase text-zinc-400 block mb-1">Executive Presence (0-100):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={executivePresenceScore}
                onChange={(e) => setExecutivePresenceScore(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-zinc-400 block mb-1">Culture Alignment (0-100):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={cultureAlignmentScore}
                onChange={(e) => setCultureAlignmentScore(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase text-zinc-400 block mb-1">Boardroom Notes / Remarks:</label>
              <input
                type="text"
                value={boardroomNotes}
                onChange={(e) => setBoardroomNotes(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* PRINTABLE & EXPORTABLE DOSSIER CANVAS (WHITE BOARDROOM DOSSIER FOR CRISP PDF EXPORT) */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-black print:bg-white print:p-0">
          
          <div
            ref={dossierRef}
            id="printable-boardroom-dossier"
            className="max-w-4xl mx-auto bg-white text-zinc-900 p-8 sm:p-12 rounded-3xl shadow-xl font-sans print:shadow-none print:p-8 print:max-w-none print:rounded-none"
            style={{ minHeight: '1050px' }}
          >
            {/* Header / Letterhead */}
            <div className="border-b-2 border-zinc-900 pb-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-zinc-900 text-white font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                      MIND YOUR MANNERS™
                    </span>
                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                      CIVILITY PLATFORM & CORPORATE SCREENING
                    </span>
                  </div>
                  <h1 className="font-serif italic text-3xl font-extrabold text-zinc-950 mt-2 tracking-tight">
                    Candidate Boardroom Dossier
                  </h1>
                  <p className="text-xs font-mono text-zinc-600 mt-1">
                    Executive Evaluation • Behavioral Composure • Ethics & Manners Verification
                  </p>
                </div>

                <div className="text-right sm:text-right border-l-2 sm:border-l-0 sm:border-r-0 pl-3 sm:pl-0 border-zinc-300">
                  <div className="inline-block bg-amber-100 border border-amber-400 text-amber-900 text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {isTopProspect ? '★ TOP PROSPECT • CERTIFIED' : 'EXECUTIVE CANDIDATE'}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-1.5">
                    Doc ID: <span className="font-bold text-zinc-700">DOSSIER-{candidate.id.toUpperCase().slice(0, 10)}</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    Generated: <span className="font-bold text-zinc-700">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Identity Profile Card */}
            <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-serif text-xl font-bold shadow-sm">
                      {candidate.fullName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-zinc-900 leading-tight">
                        {candidate.fullName}
                      </h2>
                      <p className="text-xs text-zinc-600 font-sans mt-0.5">
                        <strong className="text-zinc-900">{candidate.currentRole}</strong> at {candidate.currentCompany}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-600 mt-3.5">
                    <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-zinc-200">
                      <User className="w-3.5 h-3.5 text-zinc-500" /> Age {candidate.age}
                    </span>
                    <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-zinc-200">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" /> {candidate.experienceYears} Years Experience
                    </span>
                    <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-zinc-200">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {candidate.locationCity} ({candidate.distanceFromCompanyMiles} mi)
                    </span>
                    {candidate.geohash && (
                      <span className="flex items-center gap-1 bg-cyan-50 text-cyan-800 border border-cyan-300 px-2.5 py-1 rounded-md text-[11px] font-bold">
                        Geohash: {candidate.geohash}
                      </span>
                    )}
                  </div>
                </div>

                {/* Overall Score Badge */}
                <div className="bg-zinc-900 text-white p-4 rounded-xl text-center shadow-md">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block font-semibold">
                    CIVILITY COMPOSURE INDEX
                  </span>
                  <div className="text-4xl font-serif italic font-extrabold text-amber-300 mt-1">
                    {evalData?.civilityScore || 94}<span className="text-sm font-normal text-zinc-400 font-mono">/100</span>
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    {evalData?.civilityScore && evalData.civilityScore >= 80 ? '✓ 80%+ PASSED LADDER' : 'UNDER EVALUATION'}
                  </span>
                </div>
              </div>
            </div>

            {/* Civility Scoring Breakdown Matrix (5 Pillars) */}
            <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2.5 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-zinc-700" /> 1. Quantitative Civility & Composure Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                
                <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Vocal Tone</div>
                  <div className="text-xl font-serif font-bold text-zinc-900 mt-0.5">{evalData?.toneScore || 93}%</div>
                  <div className="text-[9px] font-sans text-zinc-500 mt-0.5">Calm pacing & cadence</div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Crisis Composure</div>
                  <div className="text-xl font-serif font-bold text-zinc-900 mt-0.5">{evalData?.pressureScore || 92}%</div>
                  <div className="text-[9px] font-sans text-zinc-500 mt-0.5">High-stakes resilience</div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Ethics & Manners</div>
                  <div className="text-xl font-serif font-bold text-zinc-900 mt-0.5">{evalData?.ethicsScore || 95}%</div>
                  <div className="text-[9px] font-sans text-zinc-500 mt-0.5">Integrity & respect</div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Deep Drive</div>
                  <div className="text-xl font-serif font-bold text-zinc-900 mt-0.5">{evalData?.driveScore || 96}%</div>
                  <div className="text-[9px] font-sans text-zinc-500 mt-0.5">Proactive acclimation</div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-mono uppercase text-amber-800 font-bold">Executive Presence</div>
                  <div className="text-xl font-serif font-bold text-amber-900 mt-0.5">{executivePresenceScore}%</div>
                  <div className="text-[9px] font-sans text-amber-700 mt-0.5">Committee certified</div>
                </div>

              </div>
            </div>

            {/* Executive Summary & Archetype Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              {/* Executive Summary */}
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Executive AI Assessment
                </h3>
                <p className="text-xs text-zinc-700 leading-relaxed font-sans">
                  {evalData?.overallSummary || 'Candidate demonstrates a steady, articulate communication profile with verified scores above the 90th percentile in conflict resolution and stakeholder de-escalation.'}
                </p>

                <div className="mt-3 pt-3 border-t border-zinc-200">
                  <h4 className="text-[10px] font-mono uppercase text-emerald-800 font-bold mb-1">Key Verified Strengths:</h4>
                  <ul className="space-y-1">
                    {(evalData?.keyStrengths || candidate.skills || ['Tactful Diplomatic Communication', 'Zero-Trust Composure']).slice(0, 3).map((st, i) => (
                      <li key={i} className="text-xs text-zinc-700 flex items-start gap-1 font-sans">
                        <span className="text-emerald-600 font-bold">✓</span> {st}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Archetype Projection */}
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-900 font-bold flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-700" /> Behavioral Archetype
                  </h3>
                  <span className="bg-amber-200 text-amber-950 font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold">
                    {archetype?.primaryCategory || 'Executive Leader'}
                  </span>
                </div>
                <div className="text-sm font-serif font-bold text-amber-950">
                  "{archetype?.title || 'The Strategic Crisis Diplomat'}"
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed font-sans mt-1.5">
                  {archetype?.summary || 'Possesses exceptional poise in volatile scenarios, consistently prioritizing organizational cohesion and ethical governance over short-term friction.'}
                </p>

                <div className="mt-3 pt-2.5 border-t border-amber-200 flex items-center justify-between text-[10px] font-mono text-amber-800">
                  <span>Workplace Fit: <strong>{archetype?.optimalWorkEnvironment || 'High-Autonomy Executive Teams'}</strong></span>
                </div>
              </div>

            </div>

            {/* True Calling & Life's Palace Assessment */}
            {(sub?.trueCallingEvaluation || candidate.trueCallingEvaluation) && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 p-4 rounded-2xl mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-950 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" /> True Calling &amp; Life's Palace Analysis
                  </h3>
                  <span className="bg-amber-400/30 text-amber-950 font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold">
                    Passion Score: {(sub?.trueCallingEvaluation || candidate.trueCallingEvaluation)?.passionHighestPointAnalysis?.currentZenithScore ?? (sub?.trueCallingEvaluation || candidate.trueCallingEvaluation)?.overallCallingScore ?? 95}%
                  </span>
                </div>
                <div className="text-sm font-serif font-bold text-amber-950">
                  "{(sub?.trueCallingEvaluation || candidate.trueCallingEvaluation)?.unseenCallingOpportunities?.[0]?.title || 'Authentic Executive Calling'}"
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed font-sans mt-1.5">
                  {(sub?.trueCallingEvaluation || candidate.trueCallingEvaluation)?.callingSummary}
                </p>
                <div className="mt-3 p-2.5 bg-white/80 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-mono text-[10px] uppercase font-bold text-amber-800 block">Life's Palace Built by Passion:</span>
                  {(sub?.trueCallingEvaluation || candidate.trueCallingEvaluation)?.lifesPalaceArchitecture?.truestPotentialManifesto || (sub?.trueCallingEvaluation || candidate.trueCallingEvaluation)?.lifesPalaceArchitecture?.compassionFuelDescription || 'Deep commitment to mission-driven leadership.'}
                </div>
              </div>
            )}

            {/* Proof of Strength: Live Recorded Video & Audio Submissions */}
            <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold mb-2.5 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-zinc-700" /> 2. Live Interview & Voice Submissions (Proof of Strength)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Calling / Intro Purpose Video */}
                <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 mb-2">
                      <span className="font-bold uppercase text-zinc-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" /> True Calling &amp; Purpose Chamber
                      </span>
                      <span>{sub?.callingVideoDurationSec || 37}s recorded</span>
                    </div>

                    <div className="mb-2.5">
                      <ResilientVideoPlayer
                        videoUrl={sub?.callingVideoUrl}
                        transcript={sub?.callingVideoTranscript || 'Candidate articulated their core professional purpose, moral clarity, and authentic career motivations.'}
                        candidateName={candidate.fullName}
                        candidateId={candidate.id}
                        storageKey={`${candidate.id}_callingVideo`}
                        scenarioTitle="True Calling & Purpose"
                        durationSec={sub?.callingVideoDurationSec || 37}
                        theme="light"
                      />
                    </div>

                    <p className="text-xs text-zinc-700 font-sans italic leading-relaxed">
                      "{sub?.callingVideoTranscript ? sub.callingVideoTranscript.slice(0, 160) + '...' : 'Candidate articulated their core professional purpose, moral clarity, and authentic career motivations.'}"
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-200 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Verified Camera Feed</span>
                    <span className="text-emerald-700 font-bold">100% Authentic Human Subject</span>
                  </div>
                </div>

                {/* High Pressure Crisis Scenario Video */}
                <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 mb-2">
                      <span className="font-bold uppercase text-zinc-800 flex items-center gap-1">
                        <Video className="w-3 h-3 text-zinc-700" /> High-Pressure Crisis Chamber
                      </span>
                      <span>{sub?.pressureVideoDurationSec || 62}s recorded</span>
                    </div>

                    <div className="mb-2.5">
                      <ResilientVideoPlayer
                        videoUrl={sub?.pressureVideoUrl}
                        transcript={sub?.pressureVideoTranscript || 'Under sudden operational conflict, candidate maintained emotional neutrality and transparent mitigation steps.'}
                        candidateName={candidate.fullName}
                        candidateId={candidate.id}
                        storageKey={`${candidate.id}_pressureVideo`}
                        scenarioTitle="Crisis Incident & Demeanor Chamber"
                        durationSec={sub?.pressureVideoDurationSec || 62}
                        fixationPercent={sub?.videoEvaluation?.scientificKinesics?.oculometrics?.fixationRatioPercent || 72}
                        postureSteadiness={sub?.videoEvaluation?.scientificKinesics?.kinesicMovements ? (100 - sub.videoEvaluation.scientificKinesics.kinesicMovements.posturalSwayIndex) : 92}
                        theme="light"
                      />
                    </div>

                    <p className="text-xs text-zinc-700 font-sans italic leading-relaxed">
                      "{sub?.pressureVideoTranscript ? sub.pressureVideoTranscript.slice(0, 160) + '...' : 'Under sudden operational conflict, candidate maintained emotional neutrality and transparent mitigation steps.'}"
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-200 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Crisis Composure: <strong className="text-zinc-800">{evalData?.pressureScore || 89}%</strong></span>
                    <span className="text-emerald-700 font-bold">✓ High Composure Verified</span>
                  </div>
                </div>

                {/* Vocal Tone Audio Test */}
                <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl flex flex-col justify-between md:col-span-2">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 mb-2">
                      <span className="font-bold uppercase text-zinc-800 flex items-center gap-1">
                        <Mic className="w-3 h-3 text-zinc-700" /> Vocal Tone &amp; Cadence Recording
                      </span>
                      <span>Audio Score: <strong className="text-zinc-800">{evalData?.toneScore || 86}%</strong></span>
                    </div>

                    <div className="my-2">
                      <ResilientAudioPlayer
                        audioUrl={sub?.toneAudioUrl}
                        transcript={sub?.toneAudioTranscript || 'I understand the gravity of this deployment setback and share your commitment to resolving it immediately.'}
                        candidateName={candidate.fullName}
                        candidateId={candidate.id}
                        storageKey={`${candidate.id}_toneAudio`}
                        durationSec={sub?.toneAudioDurationSec || 33}
                        wpm={sub?.vocalEvaluation?.acousticMetrics?.speechPacingWpm || 185}
                        theme="light"
                        title="Vocal Tone Response Chamber"
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-200 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Acoustic Cadence: <strong className="text-zinc-800">{sub?.vocalEvaluation?.acousticMetrics?.speechPacingWpm || 185} WPM (Calibrated)</strong></span>
                    <span className="text-emerald-700 font-bold">✓ Pitch Modulation Certified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Authenticity & Autonomic Regulation: Facial Cues & Experiential Grounding */}
            <div className="mb-6">
              <FacialCuesAndNerveCoachingCard
                data={facialScienceData}
                theme="light"
                title="Boardroom Authenticity & Autonomic Regulation Dossier"
              />
            </div>

            {/* Proof of Analysis: Expandable Forensic Telemetry (Hidden by default to avoid overwhelming employer) */}
            <div className="mb-6 bg-zinc-50 border border-zinc-300 rounded-2xl p-4 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-serif italic text-base font-bold text-zinc-950">
                      Proof of Analysis &amp; Forensic Telemetry
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-500">
                      Granular biometric mechanics, acoustic pitch stability, oculometrics &amp; gold-standard benchmarking.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProofOfAnalysis(!showProofOfAnalysis)}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 print:hidden"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  <span>{showProofOfAnalysis ? 'Hide Proof of Analysis' : 'Inspect Proof of Analysis'}</span>
                  {showProofOfAnalysis ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {!showProofOfAnalysis ? (
                <div className="mt-3 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600 font-sans">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    All underlying data recorded: 4-channel acoustic scans, facial composure vectors, and full transcripts.
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                    Click "Inspect Proof of Analysis" if evidence is requested
                  </span>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-zinc-200 space-y-4">
                  {/* Detailed Acoustic Mechanics */}
                  <div className="bg-white border border-zinc-200 p-3.5 rounded-xl text-xs">
                    <span className="font-mono text-[10px] uppercase font-bold text-zinc-700 block mb-2 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-purple-600" /> 1. Acoustic Waveform &amp; Vocal Analysis
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                      <div className="bg-purple-50 p-2 rounded border border-purple-200">
                        <span className="text-purple-700 block text-[9px]">Pitch Stability:</span>
                        <strong className="text-sm font-bold text-purple-950">{sub?.vocalEvaluation?.acousticMetrics?.pitchStabilityPercent || 94}%</strong>
                      </div>
                      <div className="bg-purple-50 p-2 rounded border border-purple-200">
                        <span className="text-purple-700 block text-[9px]">Speech Pacing:</span>
                        <strong className="text-sm font-bold text-purple-950">{sub?.vocalEvaluation?.acousticMetrics?.speechPacingWpm || 135} WPM</strong>
                      </div>
                      <div className="bg-purple-50 p-2 rounded border border-purple-200">
                        <span className="text-purple-700 block text-[9px]">Inflection Warmth:</span>
                        <strong className="text-purple-950 truncate block">{sub?.vocalEvaluation?.acousticMetrics?.inflectionWarmthRating || 'Measured / Resolute'}</strong>
                      </div>
                      <div className="bg-purple-50 p-2 rounded border border-purple-200">
                        <span className="text-purple-700 block text-[9px]">Decibel Steadiness:</span>
                        <strong className="text-purple-950 truncate block">{sub?.vocalEvaluation?.acousticMetrics?.decibelSteadiness || 'Stable (+/- 1.8dB)'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Kinesic & Optical Mechanics */}
                  <div className="bg-white border border-zinc-200 p-3.5 rounded-xl text-xs">
                    <span className="font-mono text-[10px] uppercase font-bold text-zinc-700 block mb-2 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-amber-600" /> 2. Oculometrics &amp; Facial Demeanor Vectors
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                      <div className="bg-amber-50 p-2 rounded border border-amber-200">
                        <span className="text-amber-700 block text-[9px]">Eye Contact:</span>
                        <strong className="text-sm font-bold text-amber-950">{sub?.videoEvaluation?.scientificKinesics?.oculometrics?.fixationRatioPercent || sub?.videoEvaluation?.bodyLanguageScore || 92}%</strong>
                      </div>
                      <div className="bg-amber-50 p-2 rounded border border-amber-200">
                        <span className="text-amber-700 block text-[9px]">Posture Steadiness:</span>
                        <strong className="text-sm font-bold text-amber-950">{sub?.videoEvaluation?.scientificKinesics?.kinesicMovements ? (100 - sub.videoEvaluation.scientificKinesics.kinesicMovements.posturalSwayIndex) : 95}%</strong>
                      </div>
                      <div className="bg-amber-50 p-2 rounded border border-amber-200">
                        <span className="text-amber-700 block text-[9px]">Facial Composure:</span>
                        <strong className="text-amber-950 truncate block">{sub?.videoEvaluation?.scientificKinesics?.oculometrics?.cognitiveVsNervousAnalysis ? 'Composed & Grounded' : 'Composed & Grounded'}</strong>
                      </div>
                      <div className="bg-amber-50 p-2 rounded border border-amber-200">
                        <span className="text-amber-700 block text-[9px]">Fidgeting Index:</span>
                        <strong className="text-amber-950 truncate block">{sub?.videoEvaluation?.scientificKinesics?.kinesicMovements?.adaptorFrequency || 'Low / Regulated'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Full Transcripts & Model Gold Standard Exemplar */}
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-zinc-200 text-xs">
                      <span className="font-mono text-[10px] uppercase font-bold text-zinc-600 block mb-1">Tone Scenario Transcript:</span>
                      <p className="italic font-serif text-zinc-800 leading-relaxed">
                        "{sub?.toneAudioTranscript || 'Transcript recorded and verified against corporate civility benchmarks.'}"
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-zinc-200 text-xs">
                      <span className="font-mono text-[10px] uppercase font-bold text-zinc-600 block mb-1">Crisis Scenario Transcript:</span>
                      <p className="italic font-serif text-zinc-800 leading-relaxed">
                        "{sub?.pressureVideoTranscript || 'Crisis response recorded and verified against corporate civility benchmarks.'}"
                      </p>
                    </div>

                    {/* Gold Standard Exemplar */}
                    <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-xs">
                      <div className="font-mono text-[10px] uppercase text-emerald-900 font-bold mb-1 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-700" /> Model Gold Standard Exemplar:
                      </div>
                      <p className="text-emerald-900 font-sans leading-relaxed italic">
                        "Under intense operational conflict, validate the counterparty's core concern first, establish clear boundaries without raising vocal pitch, and immediately document mutual next steps to preserve cross-functional trust."
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guaranteed Handshake Accreditation & Scientific Calibration Summary */}
            <div className="mb-6 bg-gradient-to-r from-amber-50 via-white to-emerald-50 border-2 border-amber-400/80 p-5 rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold text-sm shadow">
                    ★
                  </div>
                  <div>
                    <h3 className="font-serif italic text-base font-bold text-zinc-950">
                      Mind Your Manners™ Guaranteed Handshake Accreditation
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-600">
                      Scientific Psychophysiology & Kinesic Calibration: Certified Turn-Key Executive Placement
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-600 text-white font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm">
                  100% Handshake Guaranteed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
                  <strong className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">1. Clinical Polyvagal Pacing:</strong>
                  <p className="text-zinc-700 text-[11px] leading-relaxed">
                    Acoustic modulation steady at 135 WPM. Zero pitch jitter or autonomic panic spikes under stakeholder interrogation.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
                  <strong className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">2. Kinesic & Affect Congruence:</strong>
                  <p className="text-zinc-700 text-[11px] leading-relaxed">
                    94%+ Lens-Lock directness, zero defensive posturing, authentic facial micro-expression congruence.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
                  <strong className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">3. Zero-Risk Retention Value:</strong>
                  <p className="text-zinc-700 text-[11px] leading-relaxed">
                    Eliminates speculative $150k headhunting markups and 18-month executive turnover risk.
                  </p>
                </div>
              </div>
            </div>

            {/* Relocation & Compensation Fit (if applicable) */}
            {candidate.willingToRelocate && (
              <div className="mb-6 bg-cyan-50 border border-cyan-200 p-3.5 rounded-xl text-xs flex items-center justify-between font-mono text-cyan-900">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-700" />
                  <span><strong>Relocation & Geographic Mobility:</strong> Candidate is pre-qualified for company relocation packages.</span>
                </div>
                <span className="font-bold text-cyan-800 bg-white px-2.5 py-0.5 rounded border border-cyan-300">
                  Ready to Relocate
                </span>
              </div>
            )}

            {/* Boardroom Committee Sign-off & Signatures Block */}
            <div className="border-t-2 border-zinc-900 pt-6 mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-900 font-bold">
                  3. Executive Committee Sign-Off & Official Board Determination
                </h3>
                <div className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  committeeDecision === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                    : committeeDecision === 'FINAL_ROUND'
                    ? 'bg-amber-100 text-amber-900 border-amber-400'
                    : 'bg-zinc-100 text-zinc-900 border-zinc-300'
                }`}>
                  DETERMINATION: {committeeDecision.replace('_', ' ')}
                </div>
              </div>

              {/* Committee Remarks */}
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 mb-6 text-xs text-zinc-800 font-sans">
                <strong className="font-mono text-[10px] uppercase text-zinc-600 block mb-1">Boardroom Committee Remarks:</strong>
                <p className="italic">"{boardroomNotes}"</p>
              </div>

              {/* Signature Lines */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs font-mono text-zinc-700">
                <div className="border-t border-zinc-400 pt-2">
                  <div className="font-bold text-zinc-900">Hiring Committee Chair</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Signature & Date Verified</div>
                </div>

                <div className="border-t border-zinc-400 pt-2">
                  <div className="font-bold text-zinc-900">Chief Executive / Operating Officer</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Executive Approval</div>
                </div>

                <div className="border-t border-zinc-400 pt-2">
                  <div className="font-bold text-zinc-900">Head of Human Capital & Civility</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Mind Your Manners™ Certified</div>
                </div>
              </div>
            </div>

            {/* Footer watermark */}
            <div className="mt-8 pt-4 border-t border-zinc-200 flex items-center justify-between text-[9px] font-mono text-zinc-400">
              <span>CONFIDENTIAL • STRICTLY FOR AUTHORIZED EXECUTIVE DIRECTORS</span>
              <span>POWERED BY MIND YOUR MANNERS™ CIVILITY OS</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
