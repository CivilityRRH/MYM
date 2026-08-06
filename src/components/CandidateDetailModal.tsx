import React, { useState } from 'react';
import { CandidateProfile, JobRequirement } from '../types';
import { ArchetypeProjectionCard } from './ArchetypeProjectionCard';
import {
  X,
  ShieldCheck,
  Mic,
  Video,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  DollarSign,
  User,
  Clock,
  Sparkles,
  Send,
  Play,
  Pause,
  Volume2,
  Calendar,
  Compass,
  FileCheck,
  Navigation,
  Download
} from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: CandidateProfile;
  jobRequirement?: JobRequirement;
  onClose: () => void;
  onStatusChange: (candidateId: string, newStatus: CandidateProfile['status']) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  jobRequirement,
  onClose,
  onStatusChange,
}) => {
  const evalData = candidate.evaluation;
  const sub = candidate.submission;
  const archetype = candidate.archetypeProjection;
  const resume = candidate.resume;

  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [isPlayingPressure, setIsPlayingPressure] = useState(false);
  const [isPlayingMotivation, setIsPlayingMotivation] = useState(false);
  const [activeTab, setActiveTab] = useState<'evaluation' | 'archetype' | 'resume' | 'email-assistant' | 'recordings' | 'ethics'>('evaluation');

  // Email Correction State
  const [emailRawText, setEmailRawText] = useState<string>(
    `Dear ${candidate.fullName},\n\nthanks for doing our civility assessment. we want to inform you that your civility index score of ${evalData?.civilityScore || 92}/100 was good. let us know if your free next week for follow up interview.`
  );
  const [emailTone, setEmailTone] = useState<string>('diplomatic');
  const [emailPurpose, setEmailPurpose] = useState<string>('Candidate Interview Follow-Up');
  const [isCorrectingEmail, setIsCorrectingEmail] = useState<boolean>(false);
  const [correctedEmailResult, setCorrectedEmailResult] = useState<{
    correctedSubject: string;
    correctedBody: string;
    grammarCorrections: string[];
    toneImprovementSummary: string;
  } | null>(null);

  const handleCorrectEmail = async () => {
    setIsCorrectingEmail(true);
    try {
      const res = await fetch('/api/correct-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: emailRawText,
          purpose: emailPurpose,
          desiredTone: emailTone
        }),
      });
      const data = await res.json();
      setCorrectedEmailResult(data);
    } catch (err) {
      console.error('Email correction failed:', err);
      alert('Failed to correct email via AI. Check connection.');
    } finally {
      setIsCorrectingEmail(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-white/50 bg-white/5 border-white/10';
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 80) return 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30';
    if (score >= 70) return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div id="modal-candidate-detail" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121212] border border-white/10 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-white">
        
        {/* Header */}
        <div className="bg-[#0A0A0A] px-6 py-5 flex items-start justify-between border-b border-white/10">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center text-white font-serif text-xl">
              {candidate.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="font-serif italic text-2xl text-white">{candidate.fullName}</h2>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border ${getScoreColor(evalData?.civilityScore)}`}>
                  Civility Index: {evalData?.civilityScore || 'N/A'}/100
                </span>
                {evalData?.recommendationTier === 'Top Prospect' && (
                  <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Top Prospect
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60 mt-1 font-sans">
                {candidate.currentRole} at <span className="text-white font-medium">{candidate.currentCompany}</span> • {candidate.locationCity}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-white/50 mt-2">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Age {candidate.age}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {candidate.experienceYears} Yrs Exp
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {candidate.distanceFromCompanyMiles} mi
                </span>
                {candidate.geohash && (
                  <span className="inline-flex items-center gap-1 text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px]">
                    <Navigation className="w-3 h-3" /> Geohash: <span className="font-bold">{candidate.geohash}</span>
                  </span>
                )}
                {candidate.willingToRelocate && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" /> Relocation Package Fit
                  </span>
                )}
                {/* FCRA Upfront Background Check Consent Status */}
                <span className="inline-flex items-center gap-1.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FCRA Background Check Authorized (SSN: ***-**-{(sub?.bgCheckSsnLast4 || candidate.bgCheckSsnLast4 || '4829')})</span>
                </span>
              </div>
            </div>
          </div>
          <button
            id="btn-close-candidate-modal"
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="bg-[#0A0A0A] border-b border-white/10 px-6 flex space-x-6 text-xs font-mono uppercase tracking-wider overflow-x-auto scrollbar-none">
          <button
            id="tab-candidate-eval"
            onClick={() => setActiveTab('evaluation')}
            className={`py-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'evaluation'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" /> AI Evaluation
          </button>
          <button
            id="tab-candidate-archetype"
            onClick={() => setActiveTab('archetype')}
            className={`py-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'archetype'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-white/50 hover:text-amber-300'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" /> Archetype Projection
            {archetype && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
          </button>
          <button
            id="tab-candidate-resume"
            onClick={() => setActiveTab('resume')}
            className={`py-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'resume'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-white/50 hover:text-cyan-300'
            }`}
          >
            <FileCheck className="w-4 h-4 text-cyan-400" /> Verified Resume
            {resume && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
          </button>
          <button
            id="tab-candidate-email-assistant"
            onClick={() => setActiveTab('email-assistant')}
            className={`py-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'email-assistant'
                ? 'border-indigo-400 text-indigo-300 font-bold'
                : 'border-transparent text-white/50 hover:text-indigo-200'
            }`}
          >
            <Send className="w-4 h-4 text-indigo-400" /> AI Email Correction
          </button>
          <button
            id="tab-candidate-recordings"
            onClick={() => setActiveTab('recordings')}
            className={`py-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'recordings'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" /> Voice & Video Scenarios
          </button>
          <button
            id="tab-candidate-ethics"
            onClick={() => setActiveTab('ethics')}
            className={`py-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'ethics'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Ethics & Manners
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#121212]">
          {activeTab === 'evaluation' && (
            <div className="space-y-6">
              {/* Score Matrix */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0A0A0A] p-4 border border-white/10">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">Tone & Emotion</div>
                  <div className="text-2xl font-serif italic text-white mt-1">{evalData?.toneScore || 0}<span className="text-xs text-white/40 font-mono font-normal">/100</span></div>
                  <p className="text-[11px] text-white/50 font-sans mt-1">Vocal modulation</p>
                </div>
                <div className="bg-[#0A0A0A] p-4 border border-white/10">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">High Pressure</div>
                  <div className="text-2xl font-serif italic text-white mt-1">{evalData?.pressureScore || 0}<span className="text-xs text-white/40 font-mono font-normal">/100</span></div>
                  <p className="text-[11px] text-white/50 font-sans mt-1">Crisis composure</p>
                </div>
                <div className="bg-[#0A0A0A] p-4 border border-white/10">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">Ethics & Manners</div>
                  <div className="text-2xl font-serif italic text-white mt-1">{evalData?.ethicsScore || 0}<span className="text-xs text-white/40 font-mono font-normal">/100</span></div>
                  <p className="text-[11px] text-white/50 font-sans mt-1">Custom ethics score</p>
                </div>
                <div className="bg-[#0A0A0A] p-4 border border-white/10">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">Deep Drive</div>
                  <div className="text-2xl font-serif italic text-white mt-1">{evalData?.driveScore || 0}<span className="text-xs text-white/40 font-mono font-normal">/100</span></div>
                  <p className="text-[11px] text-white/50 font-sans mt-1">Eagerness to acclimate</p>
                </div>
              </div>

              {/* Overall Summary */}
              <div className="bg-[#0A0A0A] border border-white/10 p-5 space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Executive Summary
                </h3>
                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  {evalData?.overallSummary}
                </p>
              </div>

              {/* Detailed Breakdown Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0A0A0A] p-4 border border-white/10 space-y-3">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-white/80" /> Vocal Tone Analysis
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">
                    {evalData?.toneEvaluation}
                  </p>
                </div>

                <div className="bg-[#0A0A0A] p-4 border border-white/10 space-y-3">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-white/80" /> High Pressure Composure
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">
                    {evalData?.pressureEvaluation}
                  </p>
                </div>
              </div>

              {/* Strengths & Risks */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0A0A0A] border border-emerald-500/30 p-4">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Key Strengths
                  </h4>
                  <ul className="space-y-1.5">
                    {evalData?.keyStrengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-white/80 flex items-start gap-1.5 font-sans">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#0A0A0A] border border-amber-500/30 p-4">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-300" /> Areas for Verification
                  </h4>
                  <ul className="space-y-1.5">
                    {evalData?.potentialRisks.map((risk, idx) => (
                      <li key={idx} className="text-xs text-white/80 flex items-start gap-1.5 font-sans">
                        <span className="text-amber-300 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Unique Exception Match */}
              {candidate.matchesUniqueExceptions && (
                <div className="bg-[#0A0A0A] text-white p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white">Matches Unique Exceptions Criteria</h4>
                        <p className="text-xs text-white/50 mt-0.5 font-sans">{candidate.exceptionMatchReason}</p>
                      </div>
                    </div>
                    <span className="border border-white/20 bg-white/5 text-white/80 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1">
                      Exception Verified
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'archetype' && (
            <div className="space-y-6">
              {archetype ? (
                <ArchetypeProjectionCard archetype={archetype} />
              ) : (
                <div className="p-8 text-center bg-[#0A0A0A] border border-white/10 space-y-3">
                  <Compass className="w-10 h-10 text-white/30 mx-auto" />
                  <p className="text-sm text-white/60 font-sans">No Archetype Projection generated for this candidate yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="space-y-6">
              {resume ? (
                <div className="space-y-6">
                  <div className="bg-[#0A0A0A] border border-cyan-500/30 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-serif font-bold text-white">{resume.fileName}</h3>
                          <p className="text-xs font-mono text-white/50">
                            Size: {(resume.fileSize / 1024).toFixed(1)} KB • Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(resume.parsedText || '')}`}
                        download={resume.fileName}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download Resume Document
                      </a>
                    </div>

                    {resume.summaryHighlights && resume.summaryHighlights.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400">AI Key Career Highlights</h4>
                        <ul className="space-y-1.5">
                          {resume.summaryHighlights.map((hl, i) => (
                            <li key={i} className="text-xs text-white/80 flex items-start gap-2">
                              <span className="text-cyan-400 font-bold">•</span>
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {resume.parsedText && (
                    <div className="bg-[#0A0A0A] border border-white/10 p-5 space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white/50">Extracted Resume Content</h4>
                      <div className="bg-[#141414] p-4 border border-white/10 text-xs text-white/80 font-mono leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {resume.parsedText}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#0A0A0A] border border-white/10 space-y-3">
                  <FileText className="w-10 h-10 text-white/30 mx-auto" />
                  <p className="text-sm text-white/60 font-sans">No resume uploaded yet for this applicant.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'email-assistant' && (
            <div className="space-y-6 font-sans">
              <div className="bg-[#0A0A0A] p-5 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-white font-serif italic text-xl flex items-center gap-2">
                      <Send className="w-5 h-5 text-indigo-400" /> Executive AI Email Communication & Correction
                    </h3>
                    <p className="text-xs text-white/60 mt-1">
                      Draft candidate communications, feedback, or interview invitations. AI automatically corrects grammar, refines tone, and fixes errors.
                    </p>
                  </div>

                  <button
                    onClick={handleCorrectEmail}
                    disabled={isCorrectingEmail || !emailRawText.trim()}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isCorrectingEmail ? 'Correcting Email...' : 'Correct Email with AI'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Communication Purpose:</label>
                    <select
                      value={emailPurpose}
                      onChange={(e) => setEmailPurpose(e.target.value)}
                      className="w-full p-2 bg-[#141414] border border-white/20 text-xs text-white font-mono focus:border-white focus:outline-none"
                    >
                      <option value="Candidate Interview Follow-Up">Candidate Interview Follow-Up</option>
                      <option value="Formal Job Offer & Relocation Terms">Formal Job Offer & Relocation Terms</option>
                      <option value="Constructive Civility Feedback">Constructive Civility Feedback</option>
                      <option value="Executive Assessment Clarification">Executive Assessment Clarification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Desired Tone Scenario:</label>
                    <select
                      value={emailTone}
                      onChange={(e) => setEmailTone(e.target.value)}
                      className="w-full p-2 bg-[#141414] border border-white/20 text-xs text-white font-mono focus:border-white focus:outline-none"
                    >
                      <option value="diplomatic">Diplomatic & Courteous</option>
                      <option value="firm-executive">Firm Executive & Objective</option>
                      <option value="warm-welcoming">Warm & Welcoming</option>
                      <option value="constructive-feedback">Constructive & Clear</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase text-white/50">Raw Email Draft Text:</label>
                  <textarea
                    rows={4}
                    value={emailRawText}
                    onChange={(e) => setEmailRawText(e.target.value)}
                    placeholder="Type or paste draft message to candidate..."
                    className="w-full p-3 bg-[#141414] border border-white/20 text-xs text-white font-mono focus:border-white focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {correctedEmailResult && (
                <div className="bg-[#0A0A0A] p-5 border border-indigo-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-mono uppercase text-indigo-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" /> AI Corrected & Polished Email Output
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${correctedEmailResult.correctedSubject}\n\n${correctedEmailResult.correctedBody}`);
                        alert('Copied corrected email to clipboard!');
                      }}
                      className="text-[10px] font-mono uppercase px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      Copy to Clipboard
                    </button>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="bg-[#141414] p-2.5 border border-white/10 text-indigo-200">
                      <strong>Subject:</strong> {correctedEmailResult.correctedSubject}
                    </div>

                    <div className="bg-[#141414] p-4 border border-white/10 text-white/90 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                      {correctedEmailResult.correctedBody}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">
                        Grammar & Phrasing Fixes Applied:
                      </span>
                      <ul className="space-y-1">
                        {correctedEmailResult.grammarCorrections.map((corr, idx) => (
                          <li key={idx} className="text-white/80 text-[11px] flex items-start gap-1">
                            <span className="text-indigo-400">•</span> {corr}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-3 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                        Tone Optimization Summary:
                      </span>
                      <p className="text-amber-100/80 text-[11px] leading-relaxed">
                        {correctedEmailResult.toneImprovementSummary}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recordings' && (
            <div className="space-y-6">
              {/* Tone Audio Player Simulation / Real Audio */}
              <div className="bg-[#0A0A0A] p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 border border-white/20 bg-white/5 text-white">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-serif italic text-white">Scenario 1: Tone Testing (Voice Response)</h4>
                      <p className="text-xs text-white/50 font-mono">Duration: {sub?.toneAudioDurationSec || 40}s • Voice Analysis Active</p>
                    </div>
                  </div>
                  {!sub?.toneAudioUrl && (
                    <button
                      id="btn-play-tone-audio"
                      onClick={() => setIsPlayingTone(!isPlayingTone)}
                      className="flex items-center space-x-2 bg-white text-black hover:bg-white/90 text-[10px] font-mono uppercase tracking-wider font-bold px-3 py-1.5 transition-colors"
                    >
                      {isPlayingTone ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlayingTone ? 'Pause Track' : 'Play Audio'}</span>
                    </button>
                  )}
                </div>

                {sub?.toneAudioUrl ? (
                  <div className="bg-[#141414] p-3 border border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Recorded Vocal Track:</span>
                    <audio src={sub.toneAudioUrl} controls className="w-full h-10 accent-purple-500" />
                  </div>
                ) : isPlayingTone && (
                  <div className="bg-[#141414] p-3 border border-white/10 flex items-center space-x-3 text-emerald-400 text-xs">
                    <Volume2 className="w-4 h-4 animate-bounce" />
                    <div className="flex-1 flex items-center space-x-1">
                      {[40, 70, 30, 85, 95, 60, 45, 90, 80, 50, 65, 30, 75, 85, 90, 40].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-emerald-400 rounded-none transition-all duration-150 animate-pulse"
                          style={{ height: `${h / 2.5}px` }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-white/40">0:24 / 0:42</span>
                  </div>
                )}

                <div className="bg-[#121212] p-4 border border-white/10 text-xs text-white/80 font-sans">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1">Audio Transcript:</div>
                  <p className="italic leading-relaxed">"{sub?.toneAudioTranscript || 'No transcript provided.'}"</p>
                </div>
              </div>

              {/* High Pressure Video Simulator */}
              <div className="bg-[#0A0A0A] p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 border border-white/20 bg-white/5 text-white">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-serif italic text-white">Scenario 2: High Pressure Crisis Response (Recorded Video)</h4>
                      <p className="text-xs text-white/50 font-mono">Duration: {sub?.pressureVideoDurationSec || 55}s • Emergency Situation Protocol</p>
                    </div>
                  </div>
                  <button
                    id="btn-play-pressure-video"
                    onClick={() => setIsPlayingPressure(!isPlayingPressure)}
                    className="flex items-center space-x-2 bg-white text-black hover:bg-white/90 text-[10px] font-mono uppercase tracking-wider font-bold px-3 py-1.5 transition-colors"
                  >
                    {isPlayingPressure ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlayingPressure ? 'Pause Video' : 'Play Video'}</span>
                  </button>
                </div>

                {sub?.pressureVideoUrl ? (
                  <div className="bg-[#141414] p-3 border border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Recorded High Pressure Response Video:</span>
                    <video src={sub.pressureVideoUrl} controls className="w-full aspect-video border border-white/10 bg-black" />
                  </div>
                ) : isPlayingPressure && (
                  <div className="aspect-video bg-[#050505] border border-white/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-3 left-3 bg-white text-black text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> REPLAY
                    </div>
                    <div className="text-center p-6 space-y-2">
                      <div className="w-16 h-16 border border-white/30 bg-white/5 mx-auto flex items-center justify-center text-white text-2xl font-serif italic">
                        {candidate.fullName.charAt(0)}
                      </div>
                      <p className="text-xs text-white/80 font-sans">{candidate.fullName} responding to 2 AM Crisis Simulation</p>
                      <p className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 inline-block uppercase tracking-wider">
                        AI Facial & Pitch Composure Rating: 94/100
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-[#121212] p-4 border border-white/10 text-xs text-white/80 font-sans">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1">Video Response Transcript:</div>
                  <p className="italic leading-relaxed">"{sub?.pressureVideoTranscript || 'No video transcript available.'}"</p>
                </div>
              </div>

              {/* Deep Motivation Video */}
              <div className="bg-[#0A0A0A] p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 border border-white/20 bg-white/5 text-white">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-serif italic text-white">Scenario 3: Deep Motivation & Uniqueness Pitch</h4>
                      <p className="text-xs text-white/50 font-mono">Duration: {sub?.motivationVideoDurationSec || 60}s • Uniqueness & Acclimation</p>
                    </div>
                  </div>
                  <button
                    id="btn-play-motivation-video"
                    onClick={() => setIsPlayingMotivation(!isPlayingMotivation)}
                    className="flex items-center space-x-2 bg-white text-black hover:bg-white/90 text-[10px] font-mono uppercase tracking-wider font-bold px-3 py-1.5 transition-colors"
                  >
                    {isPlayingMotivation ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlayingMotivation ? 'Pause Pitch' : 'Play Pitch'}</span>
                  </button>
                </div>

                <div className="bg-[#121212] p-4 border border-white/10 text-xs text-white/80 font-sans">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1">Uniqueness Statement:</div>
                  <p className="italic leading-relaxed">"{sub?.motivationVideoTranscript || 'No motivation transcript available.'}"</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ethics' && (
            <div className="space-y-6">
              <div className="bg-[#0A0A0A] border border-amber-500/30 p-4 text-xs text-amber-200/90 font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Client-specified open screening responses (strictly NO multiple choice).
                </span>
              </div>

              {/* Ethics Answers */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-white/80 border-b border-white/10 pb-2">Ethics Responses</h4>
                {sub?.ethicsAnswers && Object.entries(sub.ethicsAnswers).map(([idxStr, ans]) => {
                  const qText = jobRequirement?.customQuestions.ethics[parseInt(idxStr)] || `Ethics Question ${parseInt(idxStr) + 1}`;
                  return (
                    <div key={idxStr} className="bg-[#0A0A0A] p-4 border border-white/10 space-y-2">
                      <div className="text-xs font-mono text-white/70">Q: {qText}</div>
                      <div className="bg-[#121212] p-3 border border-white/10 text-xs text-white/90 leading-relaxed font-sans">
                        {ans}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Etiquette Answers */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-white/80 border-b border-white/10 pb-2">Etiquette Responses</h4>
                {sub?.etiquetteAnswers && Object.entries(sub.etiquetteAnswers).map(([idxStr, ans]) => {
                  const qText = jobRequirement?.customQuestions.etiquette[parseInt(idxStr)] || `Etiquette Question ${parseInt(idxStr) + 1}`;
                  return (
                    <div key={idxStr} className="bg-[#0A0A0A] p-4 border border-white/10 space-y-2">
                      <div className="text-xs font-mono text-white/70">Q: {qText}</div>
                      <div className="bg-[#121212] p-3 border border-white/10 text-xs text-white/90 leading-relaxed font-sans">
                        {ans}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Manners Answers */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-white/80 border-b border-white/10 pb-2">Manners & Respect Responses</h4>
                {sub?.mannersAnswers && Object.entries(sub.mannersAnswers).map(([idxStr, ans]) => {
                  const qText = jobRequirement?.customQuestions.manners[parseInt(idxStr)] || `Manners Question ${parseInt(idxStr) + 1}`;
                  return (
                    <div key={idxStr} className="bg-[#0A0A0A] p-4 border border-white/10 space-y-2">
                      <div className="text-xs font-mono text-white/70">Q: {qText}</div>
                      <div className="bg-[#121212] p-3 border border-white/10 text-xs text-white/90 leading-relaxed font-sans">
                        {ans}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Company Actions */}
        <div className="bg-[#0A0A0A] px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono uppercase tracking-wider text-white/50">
            Status: <span className="text-white font-bold">{candidate.status}</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              id="btn-decline-candidate"
              onClick={() => {
                onStatusChange(candidate.id, 'declined');
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white border border-white/20 hover:border-white transition-colors"
            >
              Archive
            </button>

            <button
              id="btn-schedule-candidate-interview"
              onClick={() => {
                onStatusChange(candidate.id, 'top_prospect');
                onClose();
              }}
              className="flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-mono uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 transition-colors w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Book Follow-up Interview</span>
            </button>

            {candidate.status !== 'top_prospect' && (
              <button
                id="btn-promote-top-prospect"
                onClick={() => {
                  onStatusChange(candidate.id, 'top_prospect');
                  onClose();
                }}
                className="flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold bg-white text-black hover:bg-white/90 transition-colors w-full sm:w-auto"
              >
                <Award className="w-4 h-4" />
                <span>Select as Top Prospect</span>
              </button>
            )}

            {candidate.status === 'top_prospect' && (
              <button
                id="btn-hire-candidate"
                onClick={() => {
                  onStatusChange(candidate.id, 'hired');
                  onClose();
                }}
                className="flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold bg-emerald-400 text-black hover:bg-emerald-300 transition-colors w-full sm:w-auto"
              >
                <Send className="w-4 h-4" />
                <span>Extend Formal Offer & Relocation</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
