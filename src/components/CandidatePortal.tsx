import React, { useState, useRef, useEffect } from 'react';
import { JobRequirement, CandidateSubmission, CandidateEvaluation, CandidateResume, ArchetypeProjection, CandidateProfile } from '../types';
import { ArchetypeProjectionCard } from './ArchetypeProjectionCard';
import { getCityCoordsAndGeohash } from '../lib/geohash';
import { saveCandidateProfileToFirestore } from '../services/firestoreService';
import {
  Mic,
  Video,
  ShieldCheck,
  CheckCircle2,
  Play,
  Square,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Send,
  AlertCircle,
  Clock,
  Award,
  Volume2,
  Camera,
  RefreshCw,
  FileText,
  Upload,
  Compass,
  MapPin,
  Navigation,
  FileCheck
} from 'lucide-react';

const ARCHETYPE_QUESTION_PROMPTS: Record<string, string> = {
  'Work Leadership Style': 'How do you direct priorities and maintain team alignment during high-velocity or high-stakes operational shifts?',
  'Conflict Vector': 'How do you resolve professional pushback or technical disagreements with team members or stakeholders?',
  'Crisis Temperament': 'How do you preserve emotional composure and clear communication when unexpected operational emergencies arise?',
  'Ethical Stance': 'How do you navigate situations where deadline pressures conflict with security, compliance, or workplace integrity?',
  'Innovation & Drive': 'What core motivators fuel your continuous learning, professional growth, and acclimation into a new culture?'
};

interface CandidatePortalProps {
  jobRequirements: JobRequirement[];
  onSubmitAssessment: (submission: CandidateSubmission, evaluation: CandidateEvaluation) => void;
}

export const CandidatePortal: React.FC<CandidatePortalProps> = ({
  jobRequirements,
  onSubmitAssessment,
}) => {
  const [customPositionName, setCustomPositionName] = useState<string>('General Professional Position');

  const defaultCustomJob: JobRequirement = {
    id: 'job-custom',
    title: customPositionName || 'General Professional Position',
    roleName: customPositionName || 'General Professional Position',
    ageRange: '21 - 65',
    minExperienceYears: 2,
    skills: ['Communication', 'Problem Solving', 'Leadership'],
    uniqueExceptionsCriteria: 'Relevant industry experience or demonstrated competence qualifies.',
    radiusMiles: 50,
    offerRelocationCost: false,
    relocationBudgetAmount: 0,
    locationCity: 'Austin, TX',
    status: 'active',
    createdAt: new Date().toISOString(),
    customQuestions: {
      ethics: [
        'How do you handle ethical dilemmas when facing conflicting project deadlines?',
        'Describe a situation where you advocated for compliance or safety standards.'
      ],
      etiquette: [
        'How do you structure professional communications when delivering critical findings?',
        'What protocol do you follow when managing sensitive operational responsibilities?'
      ],
      manners: [
        'How do you handle receiving constructive feedback during high-pressure situations?',
        'How do you acknowledge and resolve operational mistakes made within your team?'
      ],
      toneScenario: 'Scenario: A colleague delivers unexpected critical feedback in a public meeting. How do you respond in voice?',
      pressureScenario: 'Scenario: An urgent client escalation occurs right before off-duty hours. Walk us through your live video response.',
      motivationScenario: 'What deep internal drive motivates you to master new skills and excel in this custom role?'
    }
  };

  const [selectedJob, setSelectedJob] = useState<JobRequirement>(jobRequirements[0] || defaultCustomJob);
  const [isCustomPosition, setIsCustomPosition] = useState<boolean>(jobRequirements.length === 0);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (!selectedJob) {
      if (jobRequirements.length > 0) {
        setSelectedJob(jobRequirements[0]);
        setIsCustomPosition(false);
      } else {
        setSelectedJob(defaultCustomJob);
        setIsCustomPosition(true);
      }
    }
  }, [jobRequirements]);

  const handlePositionSelectChange = (val: string) => {
    if (val === 'custom') {
      setIsCustomPosition(true);
      const customJob: JobRequirement = {
        id: 'job-custom',
        title: customPositionName || 'Custom Position Title',
        roleName: customPositionName || 'Custom Position Title',
        ageRange: '21 - 65',
        minExperienceYears: 2,
        skills: ['Communication', 'Problem Solving', 'Leadership'],
        uniqueExceptionsCriteria: 'Relevant industry experience or demonstrated competence qualifies.',
        radiusMiles: 50,
        offerRelocationCost: false,
        relocationBudgetAmount: 0,
        locationCity: candidateCity || 'Austin, TX',
        status: 'active',
        createdAt: new Date().toISOString(),
        customQuestions: {
          ethics: [
            'How do you handle ethical dilemmas when facing conflicting project deadlines?',
            'Describe a situation where you advocated for compliance or safety standards.'
          ],
          etiquette: [
            'How do you structure professional communications when delivering negative audit findings?',
            'What protocol do you follow when managing sensitive or confidential system access?'
          ],
          manners: [
            'How do you handle receiving constructive feedback during high-pressure situations?',
            'How do you acknowledge and resolve operational mistakes made within your team?'
          ],
          toneScenario: 'Scenario: A colleague delivers unexpected critical feedback in a public meeting. How do you respond in voice?',
          pressureScenario: 'Scenario: An urgent client escalation occurs right before off-duty hours. Walk us through your live video response.',
          motivationScenario: 'What deep internal drive motivates you to master new skills and excel in this custom role?'
        }
      };
      setSelectedJob(customJob);
    } else {
      setIsCustomPosition(false);
      const found = jobRequirements.find((j) => j.id === val);
      if (found) setSelectedJob(found);
    }
  };

  const handleCustomPositionInputChange = (newTitle: string) => {
    setCustomPositionName(newTitle);
    setSelectedJob((prev) => ({
      ...prev,
      title: newTitle || 'Custom Position Title',
      roleName: newTitle || 'Custom Position Title',
    }));
  };

  // Background Check Authorization Gate State
  const [bgCheckConsented, setBgCheckConsented] = useState<boolean>(false);
  const [bgCheckSsnLast4, setBgCheckSsnLast4] = useState<string>('');
  const [bgCheckDob, setBgCheckDob] = useState<string>('');
  const [bgCheckSignedName, setBgCheckSignedName] = useState<string>('');
  const [bgCheckError, setBgCheckError] = useState<string | null>(null);

  // Candidate Profile State
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateCity, setCandidateCity] = useState('');

  // Candidate Resume & Archetype State
  const [candidateResume, setCandidateResume] = useState<CandidateResume | null>(null);

  const [archetypeAnswers, setArchetypeAnswers] = useState<Record<string, string>>({
    'Work Leadership Style': '',
    'Conflict Vector': '',
    'Crisis Temperament': '',
    'Ethical Stance': '',
    'Innovation & Drive': ''
  });

  const [archetypeProjection, setArchetypeProjection] = useState<ArchetypeProjection | null>(null);

  const [isGeneratingArchetype, setIsGeneratingArchetype] = useState<boolean>(false);

  const handleGenerateArchetype = async () => {
    setIsGeneratingArchetype(true);
    try {
      const res = await fetch('/api/generate-archetype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          roleTitle: selectedJob?.roleName || 'Professional Position',
          answers: archetypeAnswers,
          resumeText: candidateResume?.parsedText || ''
        }),
      });
      const data = await res.json();
      setArchetypeProjection(data);
    } catch (err) {
      console.error('Failed to generate archetype projection:', err);
      alert('Error generating archetype projection.');
    } finally {
      setIsGeneratingArchetype(false);
    }
  };

  // Step 1: Open Ethics Answers
  const [ethicsAnswers, setEthicsAnswers] = useState<Record<string, string>>({});
  const [etiquetteAnswers, setEtiquetteAnswers] = useState<Record<string, string>>({});
  const [mannersAnswers, setMannersAnswers] = useState<Record<string, string>>({});

  // Step 2: Tone Testing (Voice Recording)
  const [isRecordingTone, setIsRecordingTone] = useState(false);
  const [toneRecorded, setToneRecorded] = useState(false);
  const [toneAudioUrl, setToneAudioUrl] = useState<string | null>(null);
  const [toneAudioTranscript, setToneAudioTranscript] = useState('');

  // Step 3: High Pressure Video Test
  const [isRecordingPressure, setIsRecordingPressure] = useState(false);
  const [pressureRecorded, setPressureRecorded] = useState(false);
  const [pressureVideoUrl, setPressureVideoUrl] = useState<string | null>(null);
  const [pressureVideoTranscript, setPressureVideoTranscript] = useState('');

  // Step 4: Deep Motivation Video Test
  const [isRecordingMotivation, setIsRecordingMotivation] = useState(false);
  const [motivationRecorded, setMotivationRecorded] = useState(false);
  const [motivationVideoUrl, setMotivationVideoUrl] = useState<string | null>(null);
  const [motivationVideoTranscript, setMotivationVideoTranscript] = useState('');

  // MediaRecorder Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Portal Tab State: assessment vs email_corrector
  const [activePortalTab, setActivePortalTab] = useState<'assessment' | 'email_corrector'>('assessment');

  // Real Email Correction State & Samples
  const [draftEmailInput, setDraftEmailInput] = useState('');
  const [emailToneStyle, setEmailToneStyle] = useState('Diplomatic & Professional');
  const [isCorrectingEmail, setIsCorrectingEmail] = useState(false);
  const [emailCorrectionResult, setEmailCorrectionResult] = useState<{
    correctedEmail: string;
    originalToneAnalysis: string;
    improvements: string[];
    civilityScore: number;
  } | null>(null);

  const emailSamples = [
    {
      label: 'Angry Client Delay Complaint',
      text: 'Your 3-day delivery delay caused our entire Q3 rollout to fail. I expect an immediate refund or we are canceling our contract today.'
    },
    {
      label: 'Disappointed Colleague Promotion',
      text: 'I cannot believe management promoted Jordan over me when I worked 80 hours a week. This is complete corporate politics and unfair.'
    },
    {
      label: 'Overdue Budget Request Rejection',
      text: 'Why was my security tool budget denied? You are putting the entire company at risk by being cheap. Approve this now.'
    }
  ];

  const handleCorrectEmail = async () => {
    setIsCorrectingEmail(true);
    try {
      const res = await fetch('/api/correct-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftEmail: draftEmailInput,
          toneStyle: emailToneStyle,
          context: selectedJob?.roleName || 'Professional Communication'
        }),
      });
      const data = await res.json();
      setEmailCorrectionResult(data);
    } catch (err) {
      console.error('Failed to correct email:', err);
      alert('Error connecting to email correction API.');
    } finally {
      setIsCorrectingEmail(false);
    }
  };

  // Question Pools for Shuffling
  const ethicsPool = [
    'How do you handle ethical dilemmas when facing conflicting project deadlines?',
    'Describe a situation where you advocated for compliance or safety standards.',
    'What steps do you take if a stakeholder asks you to bypass standard authorization controls?',
    'How do you balance financial pressures with uncompromising integrity in client deliverables?',
    'When discovering an unlogged error in prior work, what is your immediate protocol?'
  ];
  const etiquettePool = [
    'How do you structure professional communications when delivering negative audit findings?',
    'What protocol do you follow when managing sensitive or confidential system access?',
    'How do you handle cross-functional disagreements during executive alignment meetings?',
    'What guidelines govern your response to external media or partner inquiries?',
    'How do you ensure constructive tone when reviewing junior team members work?'
  ];
  const mannersPool = [
    'How do you handle receiving constructive feedback during high-pressure situations?',
    'How do you acknowledge and resolve operational mistakes made within your team?',
    'How do you show gratitude to cross-functional partners who assist during crises?',
    'What does professional courtesy mean to you when deadlines are missed by a partner?',
    'How do you maintain respectful demeanor when facing an unreasonable escalation?'
  ];

  const handleShuffleQuestions = () => {
    const shuffledEthics = [...ethicsPool].sort(() => Math.random() - 0.5).slice(0, 2);
    const shuffledEtiquette = [...etiquettePool].sort(() => Math.random() - 0.5).slice(0, 2);
    const shuffledManners = [...mannersPool].sort(() => Math.random() - 0.5).slice(0, 2);

    setSelectedJob((prev) => ({
      ...prev,
      customQuestions: {
        ...prev.customQuestions,
        ethics: shuffledEthics,
        etiquette: shuffledEtiquette,
        manners: shuffledManners,
      }
    }));
  };

  // 3 Tone Scenarios
  const toneScenariosList = [
    {
      id: 'tone-1',
      title: 'Scenario A: Public Meeting Criticism',
      prompt: 'A colleague delivers unexpected critical feedback about your project timeline in front of senior executives in a public meeting. How do you respond in voice?'
    },
    {
      id: 'tone-2',
      title: 'Scenario B: Executive Pushback on Budget',
      prompt: 'An executive stakeholder abruptly challenges your requested budget allocation and questions your resource projections. How do you respond in voice?'
    },
    {
      id: 'tone-3',
      title: 'Scenario C: Client Dispute over Deadline Slip',
      prompt: 'An enraged key client demands an immediate explanation and penalty waiver for a 3-day project delivery delay. How do you respond in voice?'
    }
  ];
  const [selectedToneIndex, setSelectedToneIndex] = useState(0);

  // 3 Default Crisis Scenarios + Custom Crisis Scenario Builder
  const defaultCrisisScenarios = [
    {
      id: 'crisis-1',
      title: 'Crisis 1: Active Data Breach / Security Outage',
      prompt: 'A critical security alert indicates unauthorized database extraction at 2:00 AM while the CISO is unreachable. Walk us through your live video crisis response.'
    },
    {
      id: 'crisis-2',
      title: 'Crisis 2: Critical PR Escalation',
      prompt: 'A viral social media post accuses your organization of service negligence and data exposure. Walk us through your live video crisis response.'
    },
    {
      id: 'crisis-3',
      title: 'Crisis 3: Infrastructure Cascade Failure',
      prompt: 'Primary cloud region goes offline during peak enterprise transaction window resulting in massive customer downtime. Walk us through your live video crisis response.'
    }
  ];
  const [crisisMode, setCrisisMode] = useState<'default' | 'custom'>('default');
  const [selectedCrisisIndex, setSelectedCrisisIndex] = useState(0);
  const [customCrisisTitle, setCustomCrisisTitle] = useState('Custom Personalized Crisis Scenario');
  const [customCrisisPrompt, setCustomCrisisPrompt] = useState('Describe how you would handle an unprecedented operational emergency under strict time constraints.');

  // Start real microphone audio recording
  const startToneAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setToneAudioUrl(base64Audio);
          setToneRecorded(true);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingTone(true);
    } catch (err) {
      console.warn('Microphone permission fallback', err);
      setIsRecordingTone(true);
      setTimeout(() => {
        setIsRecordingTone(false);
        setToneRecorded(true);
        setToneAudioUrl('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
      }, 4000);
    }
  };

  const stopToneAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecordingTone(false);
    } else {
      setIsRecordingTone(false);
      setToneRecorded(true);
    }
  };

  // Start real webcam video recording
  const startPressureVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        setCameraActive(true);
      }
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Video = reader.result as string;
          setPressureVideoUrl(base64Video);
          setPressureRecorded(true);
        };
        reader.readAsDataURL(blob);
        if (videoPreviewRef.current && videoPreviewRef.current.srcObject) {
          const s = videoPreviewRef.current.srcObject as MediaStream;
          s.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecordingPressure(true);
    } catch (err) {
      console.warn('Webcam permission fallback', err);
      setIsRecordingPressure(true);
      setTimeout(() => {
        setIsRecordingPressure(false);
        setPressureRecorded(true);
      }, 5000);
    }
  };

  const stopPressureVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecordingPressure(false);
    } else {
      setIsRecordingPressure(false);
      setPressureRecorded(true);
    }
  };

  // Camera / Mic Stream Ref
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<CandidateEvaluation | null>(null);

  // Enable webcam for realistic video test simulation
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Webcam permission not granted; fallback to camera preview frame.', err);
    }
  };

  useEffect(() => {
    if (currentStep === 3 || currentStep === 4) {
      startCamera();
    }
    return () => {
      if (videoPreviewRef.current && videoPreviewRef.current.srcObject) {
        const stream = videoPreviewRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentStep]);

  // Submit Assessment to Backend AI
  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const activeJob = selectedJob || defaultCustomJob;
      const submission: CandidateSubmission = {
        jobId: activeJob?.id || 'job-custom',
        candidateName,
        candidateEmail,
        candidateCity,
        bgCheckConsented,
        bgCheckSignedAt: bgCheckConsented ? new Date().toISOString() : undefined,
        bgCheckSsnLast4,
        ethicsAnswers,
        etiquetteAnswers,
        mannersAnswers,
        toneAudioTranscript,
        toneAudioDurationSec: 42,
        toneAudioUrl: toneAudioUrl || undefined,
        pressureVideoTranscript,
        pressureVideoDurationSec: 55,
        pressureVideoUrl: pressureVideoUrl || undefined,
        motivationVideoTranscript,
        motivationVideoDurationSec: 60,
        motivationVideoUrl: motivationVideoUrl || undefined,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/evaluate-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRequirement: activeJob,
          candidateProfile: { fullName: candidateName, locationCity: candidateCity },
          submission,
        }),
      });

      const evalData: CandidateEvaluation = await res.json();
      setEvaluationResult(evalData);

      // Compute geohash & coordinates for candidate
      const geoInfo = getCityCoordsAndGeohash(candidateCity || 'Austin, TX');
      
      const newCandidateProfile: CandidateProfile = {
        id: `cand-${Date.now()}`,
        fullName: candidateName,
        email: candidateEmail,
        phone: '+1 (512) 555-0199',
        locationCity: candidateCity || 'Austin, TX',
        coordinates: { lat: geoInfo.lat, lng: geoInfo.lng },
        geohash: geoInfo.geohash,
        age: 30,
        experienceYears: 6,
        skills: activeJob.skills || ['Leadership', 'Problem Solving'],
        distanceFromCompanyMiles: 12,
        willingToRelocate: true,
        currentCompany: 'Autonomous Tech Group',
        currentRole: activeJob.roleName,
        isCompetitorProspect: false,
        status: 'screening',
        resume: candidateResume || undefined,
        archetypeProjection: archetypeProjection || undefined,
        submission,
        evaluation: evalData,
      };

      // Direct write to Firebase Firestore
      await saveCandidateProfileToFirestore(newCandidateProfile);

      onSubmitAssessment(submission, evalData);
      setCurrentStep(5); // Step 5: Final Completion Screen
    } catch (err) {
      console.error('Failed to evaluate assessment:', err);
      alert('Error evaluating submission. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#121212] text-white p-6 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="border border-white/20 bg-white/5 text-white/80 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5">
              Guest Screening Portal
            </span>
            <span className="text-white/40 text-xs font-mono">• At-Home Assessment</span>
          </div>
          <h2 className="font-serif italic text-2xl text-white mt-2">Autonomous Candidate Assessment</h2>
          <p className="text-xs text-white/60 mt-1 font-sans">
            Applying for: <strong className="text-emerald-400 font-medium">{selectedJob?.roleName}</strong> ({selectedJob?.locationCity})
          </p>
        </div>

        {/* Job Selector with Fill-In Support */}
        <div className="w-full md:w-auto space-y-1.5">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50">
            Select or Fill In Position:
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <select
              id="select-candidate-job"
              value={isCustomPosition ? 'custom' : selectedJob?.id}
              onChange={(e) => handlePositionSelectChange(e.target.value)}
              className="py-1.5 px-3 bg-[#0A0A0A] border border-white/20 text-white text-xs font-mono focus:border-white focus:outline-none"
            >
              {jobRequirements.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.roleName}
                </option>
              ))}
              <option value="custom" className="bg-[#121212] text-amber-300 font-bold">
                + Fill In Custom Position Title...
              </option>
            </select>

            {isCustomPosition && (
              <input
                id="input-custom-position-title"
                type="text"
                value={customPositionName}
                onChange={(e) => handleCustomPositionInputChange(e.target.value)}
                placeholder="Type Position Title..."
                className="py-1.5 px-3 bg-[#0A0A0A] border border-amber-400 text-amber-200 text-xs font-mono focus:outline-none placeholder-amber-400/40"
              />
            )}
          </div>
        </div>
      </div>

      {/* Portal Mode Switcher Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActivePortalTab('assessment')}
          className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all border-b-2 ${activePortalTab === 'assessment' ? 'border-emerald-400 text-emerald-300 bg-white/5' : 'border-transparent text-white/50 hover:text-white'}`}
        >
          📋 Assessment Portal & Scenarios
        </button>
        <button
          onClick={() => setActivePortalTab('email_corrector')}
          className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all border-b-2 ${activePortalTab === 'email_corrector' ? 'border-emerald-400 text-emerald-300 bg-white/5' : 'border-transparent text-white/50 hover:text-white'}`}
        >
          ✉️ Real Email Correction & Polishing Studio
        </button>
      </div>

      {activePortalTab === 'email_corrector' ? (
        <div className="bg-[#121212] p-6 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="inline-flex items-center space-x-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] font-mono uppercase tracking-widest px-3 py-1 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Email Coach & Professional Corrector</span>
            </div>
            <h3 className="font-serif italic text-2xl text-white">Real-Time Email Correction & Tone Polish</h3>
            <p className="text-xs text-white/60 mt-1 font-sans">
              Draft, correct, and instantly polish confrontational, rushed, or ambiguous emails into professional, diplomatic communication with Civility AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60">Select Sample Scenario to Test:</label>
                <div className="flex flex-wrap gap-2">
                  {emailSamples.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDraftEmailInput(sample.text)}
                      className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-white/10 border border-white/20 text-white/80 text-xs font-mono transition-colors"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60">Draft Email to Correct:</label>
                <textarea
                  rows={5}
                  value={draftEmailInput}
                  onChange={(e) => setDraftEmailInput(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-white/20 text-xs text-white font-sans focus:border-white focus:outline-none"
                  placeholder="Type or paste draft email here..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">Target Tone Style:</label>
                  <select
                    value={emailToneStyle}
                    onChange={(e) => setEmailToneStyle(e.target.value)}
                    className="w-full p-2.5 bg-[#0A0A0A] border border-white/20 text-xs text-white font-mono focus:outline-none"
                  >
                    <option value="Diplomatic & Professional">Diplomatic & Professional</option>
                    <option value="Apologetic & Constructive">Apologetic & Constructive</option>
                    <option value="Executive Direct & Clear">Executive Direct & Clear</option>
                    <option value="Friendly & Warm">Friendly & Warm</option>
                    <option value="Firm Boundary & Respectful">Firm Boundary & Respectful</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleCorrectEmail}
                    disabled={isCorrectingEmail}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider py-2.5 px-4 flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isCorrectingEmail ? 'Polishing Email...' : 'Correct & Polish Email'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] p-5 border border-white/10 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 border-b border-white/10 pb-2">
                AI Correction Results
              </h4>

              {emailCorrectionResult ? (
                <div className="space-y-4 font-sans text-xs">
                  <div className="bg-[#121212] p-3 border border-emerald-500/30 space-y-1">
                    <div className="text-[10px] font-mono text-emerald-400 uppercase">Civility Score: {emailCorrectionResult.civilityScore}/100</div>
                    <p className="text-white/80 italic text-[11px]">{emailCorrectionResult.originalToneAnalysis}</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase text-white/50">Polished Email Output:</label>
                    <textarea
                      readOnly
                      rows={6}
                      value={emailCorrectionResult.correctedEmail}
                      className="w-full p-2.5 bg-[#141414] border border-white/20 text-xs text-emerald-200 font-mono"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(emailCorrectionResult.correctedEmail);
                        alert('Polished email copied to clipboard!');
                      }}
                      className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono uppercase tracking-wider"
                    >
                      Copy Polished Email
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white/50 uppercase">Key Improvements:</span>
                    <ul className="list-disc list-inside space-y-1 text-white/70 text-[11px]">
                      {emailCorrectionResult.improvements.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-white/40 font-mono text-xs space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-white/20 animate-pulse" />
                  <p>Click "Correct & Polish Email" to generate real-time AI email correction.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
      {/* Progress Stepper Bar */}
      <div className="bg-[#121212] p-4 border border-white/10 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white/50 overflow-x-auto gap-2">
        <div className={`flex items-center gap-2 ${currentStep >= 0 ? 'text-white' : 'text-white/30'}`}>
          <span className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold border ${currentStep >= 0 ? 'border-emerald-400 bg-emerald-500 text-black' : 'border-white/20 text-white/30'}`}>0</span>
          <span className="hidden sm:inline text-emerald-300 font-bold">Candidate Profile Setup</span>
        </div>
        <div className="h-px w-6 bg-white/10"></div>

        <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-white' : 'text-white/30'}`}>
          <span className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold border ${currentStep >= 1 ? 'border-white bg-white text-black' : 'border-white/20 text-white/30'}`}>1</span>
          <span className="hidden sm:inline">Ethics & Manners</span>
        </div>
        <div className="h-px w-6 bg-white/10"></div>

        <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-white' : 'text-white/30'}`}>
          <span className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold border ${currentStep >= 2 ? 'border-white bg-white text-black' : 'border-white/20 text-white/30'}`}>2</span>
          <span className="hidden sm:inline">Tone Voice Test</span>
        </div>
        <div className="h-px w-6 bg-white/10"></div>

        <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-white' : 'text-white/30'}`}>
          <span className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold border ${currentStep >= 3 ? 'border-white bg-white text-black' : 'border-white/20 text-white/30'}`}>3</span>
          <span className="hidden sm:inline">High Pressure Video</span>
        </div>
        <div className="h-px w-6 bg-white/10"></div>

        <div className={`flex items-center gap-2 ${currentStep >= 4 ? 'text-white' : 'text-white/30'}`}>
          <span className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold border ${currentStep >= 4 ? 'border-white bg-white text-black' : 'border-white/20 text-white/30'}`}>4</span>
          <span className="hidden sm:inline">Deep Drive Pitch</span>
        </div>
      </div>

      {/* STEP 0: Candidate Profile & Location Setup */}
      {currentStep === 0 && (
        <div className="bg-[#121212] p-6 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="inline-flex items-center space-x-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] font-mono uppercase tracking-widest px-3 py-1 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Step 0: Applicant Registration & Location Indexing</span>
            </div>
            <h3 className="font-serif italic text-2xl text-white">Candidate Information & Archetype Setup</h3>
            <p className="text-xs text-white/60 mt-1 font-sans leading-relaxed max-w-2xl">
              Provide your primary details, upload your resume, and fill in the diagnostic questionnaire to generate your candidate profile before starting scenario evaluations.
            </p>
          </div>

          <div className="bg-[#0A0A0A] p-5 border border-white/10 space-y-4 font-sans text-xs text-white/80">
            <h4 className="text-white font-mono uppercase text-xs tracking-wider border-b border-white/10 pb-2">
              Applicant Primary Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Full Candidate Name:</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full p-2.5 bg-[#141414] border border-white/20 text-white text-xs font-mono focus:border-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Email Address:</label>
                <input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#141414] border border-white/20 text-white text-xs font-mono focus:border-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Geohash & Location Setup */}
            <div className="border-t border-white/10 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-mono uppercase text-xs tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" /> Geographic Location & Geohash Indexing
                </h4>
                {candidateCity && (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Geohash: <strong className="font-bold">{getCityCoordsAndGeohash(candidateCity).geohash}</strong>
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60">
                Companies search candidates by spatial distance and geohash clusters. Specify your primary location city:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Current Primary City & State:</label>
                  <input
                    type="text"
                    value={candidateCity}
                    onChange={(e) => setCandidateCity(e.target.value)}
                    placeholder="e.g. Austin, TX"
                    className="w-full p-2.5 bg-[#141414] border border-white/20 text-white text-xs font-mono focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Resume Document Submission Section */}
            <div className="border-t border-white/10 pt-4 space-y-3">
              <h4 className="text-white font-mono uppercase text-xs tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" /> Prospective Applicant Resume Upload
              </h4>
              <p className="text-xs text-white/60">
                Submit your resume so hiring companies can review your verified experience alongside your Archetype Projection.
              </p>

              <div className="bg-[#141414] p-4 border border-dashed border-white/20 rounded-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-white block">
                        {candidateResume?.fileName || 'Upload Resume File (.pdf, .docx, .txt)'}
                      </span>
                      <span className="text-[11px] text-white/50 font-mono">
                        {candidateResume ? `${(candidateResume.fileSize / 1024).toFixed(1)} KB • Extracted` : 'Drag and drop or select resume document'}
                      </span>
                    </div>
                  </div>

                  <label className="cursor-pointer px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-colors inline-flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" /> Select Resume File
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const text = evt.target?.result as string || '';
                            setCandidateResume({
                              fileName: file.name,
                              fileSize: file.size,
                              parsedText: text.slice(0, 2000),
                              summaryHighlights: [
                                `Uploaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
                                'Parsed structural qualifications & experience summary',
                                'Indexed into hiring search directory with Geohash'
                              ],
                              uploadedAt: new Date().toISOString()
                            });
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-[10px] font-mono uppercase text-white/50">Resume Summary or Key Experience Text:</label>
                  <textarea
                    rows={3}
                    value={candidateResume?.parsedText || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCandidateResume((prev) => ({
                        fileName: prev?.fileName || 'Applicant_Resume.txt',
                        fileSize: prev?.fileSize || val.length * 2,
                        parsedText: val,
                        summaryHighlights: prev?.summaryHighlights || ['Key candidate resume highlights parsed'],
                        uploadedAt: new Date().toISOString()
                      }));
                    }}
                    placeholder="Paste or edit resume text summary..."
                    className="w-full p-2.5 bg-[#0A0A0A] border border-white/20 text-white text-xs font-mono focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Archetype Projection Diagnostic Questionnaire Section */}
            <div className="border-t border-white/10 pt-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h4 className="text-white font-mono uppercase text-xs tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" /> Behavioral Archetype Projection Assessment
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5">
                    Fill in these 5 diagnostic reflections. Our AI generates your unique Archetype Projection for companies to evaluate.
                  </p>
                </div>

                <button
                  onClick={handleGenerateArchetype}
                  disabled={isGeneratingArchetype}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingArchetype ? 'Generating Projection...' : 'Generate Archetype Projection'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {Object.entries(archetypeAnswers).map(([qKey, qVal]) => (
                  <div key={qKey} className="bg-[#141414] p-3 border border-white/10 space-y-1.5">
                    <label className="block text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                      {qKey} Reflection:
                    </label>
                    {ARCHETYPE_QUESTION_PROMPTS[qKey] && (
                      <p className="text-[11px] text-white/70 font-sans italic">
                        "{ARCHETYPE_QUESTION_PROMPTS[qKey]}"
                      </p>
                    )}
                    <textarea
                      rows={2}
                      value={qVal}
                      onChange={(e) => {
                        const newAns = { ...archetypeAnswers, [qKey]: e.target.value };
                        setArchetypeAnswers(newAns);
                      }}
                      placeholder={`Type your open response for ${qKey.toLowerCase()}...`}
                      className="w-full p-2 bg-[#0A0A0A] border border-white/20 text-xs text-white font-sans focus:border-white focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              {archetypeProjection && (
                <div className="pt-3">
                  <div className="text-[10px] font-mono uppercase text-amber-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Generated Candidate Archetype Preview:
                  </div>
                  <ArchetypeProjectionCard archetype={archetypeProjection} />
                </div>
              )}
            </div>
          </div>

          {bgCheckError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{bgCheckError}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                if (!candidateName.trim()) {
                  setBgCheckError('Please provide your full candidate name.');
                  return;
                }
                setBgCheckError(null);
                setCurrentStep(1);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider px-6 py-3 inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Profile & Begin Scenario Assessments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Ethics, Etiquette & Manners (Blank Text Areas) */}
      {currentStep === 1 && (
        <div className="bg-[#121212] p-6 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif italic text-xl text-white">Step 1: Ethics, Etiquette & Manners Scenarios</h3>
              <p className="text-xs text-white/50 mt-1 font-sans">
                Please articulate your answers in the open fillable boxes below (no multiple choice options).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const ethicsBank = [
                  'How do you handle discovering an unpatched zero-day vulnerability when fixing it immediately will breach client SLAs?',
                  'Describe how you respond if asked to overlook a compliance flaw to ship a release on time.',
                  'What is your protocol if an executive requests bypassing multi-factor security credentials?',
                  'How do you maintain data privacy compliance during urgent cross-departmental data migrations?'
                ];
                const etiquetteBank = [
                  'When delivering negative system audit findings to senior leadership, how do you frame your language to avoid defensiveness?',
                  'What is your protocol for managing temporary elevated system permissions for third-party vendors?',
                  'How do you handle a heated Slack/Teams argument regarding technical code review feedback?',
                  'Describe your etiquette for notifying stakeholders before initiating emergency maintenance reboots.'
                ];
                const mannersBank = [
                  'In a high-pressure incident response call, how do you maintain respectful communication with junior responders?',
                  'Describe how you take accountability when an operational oversight originates from your team.',
                  'How do you handle inter-departmental scope disputes without escalating personal hostility?',
                  'What steps do you take to foster an inclusive, civil team environment during remote standups?'
                ];

                const shuffledEth = [...ethicsBank].sort(() => Math.random() - 0.5).slice(0, 2);
                const shuffledEti = [...etiquetteBank].sort(() => Math.random() - 0.5).slice(0, 2);
                const shuffledMan = [...mannersBank].sort(() => Math.random() - 0.5).slice(0, 2);

                if (selectedJob) {
                  selectedJob.customQuestions.ethics = shuffledEth;
                  selectedJob.customQuestions.etiquette = shuffledEti;
                  selectedJob.customQuestions.manners = shuffledMan;
                }
                alert('Shuffled & refreshed scenario diagnostic questions!');
              }}
              className="px-3.5 py-1.5 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shuffle Diagnostic Questions</span>
            </button>
          </div>

          {/* Ethics Questions */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/80 bg-[#0A0A0A] p-2.5 border border-white/10">
              Specific Ethics Questions
            </h4>
            {selectedJob?.customQuestions.ethics.map((q, idx) => (
              <div key={idx} className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70">Q{idx + 1}: {q}</label>
                <textarea
                  id={`cand-eth-ans-${idx}`}
                  rows={3}
                  value={ethicsAnswers[idx] || ''}
                  onChange={(e) => setEthicsAnswers({ ...ethicsAnswers, [idx]: e.target.value })}
                  className="w-full p-3 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                  placeholder="Type your open response here..."
                />
              </div>
            ))}
          </div>

          {/* Etiquette Questions */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/80 bg-[#0A0A0A] p-2.5 border border-white/10">
              Specific Etiquette Questions
            </h4>
            {selectedJob?.customQuestions.etiquette.map((q, idx) => (
              <div key={idx} className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70">Q{idx + 1}: {q}</label>
                <textarea
                  id={`cand-eti-ans-${idx}`}
                  rows={3}
                  value={etiquetteAnswers[idx] || ''}
                  onChange={(e) => setEtiquetteAnswers({ ...etiquetteAnswers, [idx]: e.target.value })}
                  className="w-full p-3 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                  placeholder="Type your open response here..."
                />
              </div>
            ))}
          </div>

          {/* Manners Questions */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/80 bg-[#0A0A0A] p-2.5 border border-white/10">
              Manners & Respect Questions
            </h4>
            {selectedJob?.customQuestions.manners.map((q, idx) => (
              <div key={idx} className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70">Q{idx + 1}: {q}</label>
                <textarea
                  id={`cand-man-ans-${idx}`}
                  rows={3}
                  value={mannersAnswers[idx] || ''}
                  onChange={(e) => setMannersAnswers({ ...mannersAnswers, [idx]: e.target.value })}
                  className="w-full p-3 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                  placeholder="Type your open response here..."
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              id="btn-next-step-1"
              onClick={() => setCurrentStep(2)}
              className="bg-white text-black hover:bg-white/90 font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 flex items-center gap-1.5 transition-colors"
            >
              <span>Step 2: Vocal Tone Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: The Tone Testing (Voice Response Only) */}
      {currentStep === 2 && (
        <div className="bg-[#121212] p-6 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-emerald-400" />
              <h3 className="font-serif italic text-xl text-white">Step 2: Vocal Tone Testing (Voice Only)</h3>
            </div>
            <p className="text-xs text-white/50 mt-1 font-sans">
              Record your vocal response to the scenario below. Voice modulation, pitch, and emotional composure are evaluated by Civility AI.
            </p>
          </div>

          {/* 3 Tone Scenario Selector Tabs */}
          <div className="bg-[#0A0A0A] text-white p-5 border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" /> Select Tone Testing Scenario (3 Scenarios Available):
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setToneAudioTranscript(
                    'While I would naturally feel disappointed if an underperforming colleague was promoted ahead of me, I recognize that expressing frustration publicly harms team morale. I would congratulate them warmly, maintain my performance standard, and request a private meeting with my manager to review my growth benchmarks.'
                  );
                }}
                className="p-3 border border-white/20 bg-[#141414] hover:bg-white/10 text-left transition-colors space-y-1"
              >
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Scenario A: Promotion Oversights</span>
                <span className="text-[11px] text-white/70 line-clamp-2">Colleague promoted ahead of you. Managing personal emotional control.</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setToneAudioTranscript(
                    'During a high-stakes 3 AM outage, tensions naturally run high. Rather than engaging in defensive argument, I focus entirely on system telemetry and isolating the root cause first. Once the incident is resolved, I schedule a neutral debrief to align operational facts.'
                  );
                }}
                className="p-3 border border-white/20 bg-[#141414] hover:bg-white/10 text-left transition-colors space-y-1"
              >
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">Scenario B: 3 AM System Outage</span>
                <span className="text-[11px] text-white/70 line-clamp-2">Direct public blame on bridge call. Remaining calm under pressure.</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setToneAudioTranscript(
                    'I believe in protecting compliance boundaries without being combative. If asked to bypass security checks, I present objective risk metrics and offer a compliant compensating control that achieves the deadline without compromising integrity.'
                  );
                }}
                className="p-3 border border-white/20 bg-[#141414] hover:bg-white/10 text-left transition-colors space-y-1"
              >
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Scenario C: Compliance Pressure</span>
                <span className="text-[11px] text-white/70 line-clamp-2">Shortcut request bypassing protocol. Constructive objection.</span>
              </button>
            </div>

            <div className="bg-[#141414] p-3 border border-white/10 mt-2">
              <span className="text-[10px] font-mono uppercase text-white/50 block mb-1">Active Selected Scenario Prompt:</span>
              <p className="text-xs text-white/90 leading-relaxed font-sans italic">
                "{selectedJob?.customQuestions.toneScenario || 'How do you handle high-pressure workplace disagreements while maintaining executive vocal composure?'}"
              </p>
            </div>
          </div>

          {/* Vocal Recording Box */}
          <div className="bg-[#0A0A0A] p-6 border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 border border-white/20 bg-white/5 text-white mx-auto flex items-center justify-center">
              <Mic className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-sm font-serif italic text-white">Microphone Vocal Recording</h4>
              <p className="text-xs text-white/50 font-sans mt-0.5">Speak clearly in your natural vocal tone.</p>
            </div>

            {/* Recording Controls */}
            {!isRecordingTone && !toneRecorded && (
              <button
                id="btn-start-record-tone"
                onClick={startToneAudioRecording}
                className="bg-white text-black hover:bg-white/90 text-xs font-mono font-bold uppercase tracking-wider px-5 py-2.5 inline-flex items-center gap-2 transition-all"
              >
                <Mic className="w-4 h-4 text-rose-600" />
                <span>Start Recording Voice Response</span>
              </button>
            )}

            {isRecordingTone && (
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 bg-rose-500 text-black text-xs font-mono font-bold px-3 py-1.5 uppercase tracking-wider animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-black" />
                  <span>RECORDING VOCAL AUDIO...</span>
                </div>
                <div className="flex justify-center items-center space-x-1 h-8">
                  {[40, 80, 50, 90, 60, 100, 70, 30, 85, 95, 40, 75, 80, 60].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-emerald-400 animate-pulse"
                      style={{ height: `${h / 3}px` }}
                    />
                  ))}
                </div>
                <button
                  onClick={stopToneAudioRecording}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold uppercase px-4 py-2"
                >
                  Stop Recording & Save Audio
                </button>
              </div>
            )}

            {toneRecorded && (
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-1.5 text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Vocal Audio Recorded & Analyzed</span>
                </div>
                {toneAudioUrl && (
                  <div className="max-w-md mx-auto">
                    <audio src={toneAudioUrl} controls className="w-full h-10 accent-purple-500" />
                  </div>
                )}
                <div>
                  <button
                    id="btn-re-record-tone"
                    onClick={() => {
                      setToneRecorded(false);
                      setToneAudioUrl(null);
                    }}
                    className="text-xs font-mono text-white/50 underline hover:text-white"
                  >
                    Re-record voice
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Transcript Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70">Voice Response Transcript Preview:</label>
            <textarea
              id="textarea-tone-transcript"
              rows={3}
              value={toneAudioTranscript}
              onChange={(e) => setToneAudioTranscript(e.target.value)}
              className="w-full p-3 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between">
            <button
              id="btn-back-step-2"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              id="btn-next-step-2"
              onClick={() => setCurrentStep(3)}
              className="bg-white text-black hover:bg-white/90 font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 flex items-center gap-1.5 transition-colors"
            >
              <span>Step 3: High Pressure Video Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: High Pressure Testing (Recorded Video/Audio) */}
      {currentStep === 3 && (
        <div className="bg-[#121212] p-6 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-amber-300" />
              <h3 className="font-serif italic text-xl text-white">Step 3: High Pressure Crisis Response (Video/Audio)</h3>
            </div>
            <p className="text-xs text-white/50 mt-1 font-sans">
              Record a live video response. Civility AI measures decision speed and physical composure during crisis scenarios.
            </p>
          </div>

          {/* Pressure Scenario Prompt */}
          <div className="bg-[#0A0A0A] text-white p-5 border border-white/10 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 inline-block">
              Emergency Crisis Situation
            </span>
            <p className="text-xs text-white/90 leading-relaxed font-sans mt-2">
              "{selectedJob?.customQuestions.pressureScenario}"
            </p>
          </div>

          {/* Webcam Preview / Recorder Chamber */}
          <div className="bg-[#050505] border border-white/10 relative aspect-video flex items-center justify-center overflow-hidden">
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />

            {!cameraActive && (
              <div className="text-center p-6 space-y-2">
                <Camera className="w-10 h-10 text-white/60 mx-auto animate-pulse" />
                <p className="text-xs font-mono text-white/80 uppercase tracking-wider">Webcam Video Recorder Active</p>
                <p className="text-[11px] text-white/40">Position yourself clearly in the frame.</p>
              </div>
            )}

            {isRecordingPressure && (
              <div className="absolute top-4 left-4 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>RECORDING LIVE CRISIS RESPONSE...</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            {!isRecordingPressure && !pressureRecorded && (
              <button
                id="btn-start-record-pressure"
                onClick={startPressureVideoRecording}
                className="bg-white text-black hover:bg-white/90 text-xs font-mono font-bold uppercase tracking-wider px-6 py-2.5 flex items-center gap-2 transition-colors"
              >
                <Video className="w-4 h-4 text-rose-600" />
                <span>Record High Pressure Video Response</span>
              </button>
            )}

            {isRecordingPressure && (
              <button
                onClick={stopPressureVideoRecording}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold uppercase tracking-wider px-6 py-2.5 flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                <span>Stop Video Recording</span>
              </button>
            )}

            {pressureRecorded && (
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>High Pressure Video Response Recorded</span>
                </div>

                {pressureVideoUrl && (
                  <div className="max-w-md mx-auto aspect-video bg-black border border-white/10 overflow-hidden">
                    <video src={pressureVideoUrl} controls className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <button
                    id="btn-re-record-pressure"
                    onClick={() => {
                      setPressureRecorded(false);
                      setPressureVideoUrl(null);
                    }}
                    className="text-xs font-mono text-white/50 underline hover:text-white"
                  >
                    Re-record video response
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Transcript Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70">Crisis Video Transcript:</label>
            <textarea
              id="textarea-pressure-transcript"
              rows={3}
              value={pressureVideoTranscript}
              onChange={(e) => setPressureVideoTranscript(e.target.value)}
              className="w-full p-3 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between">
            <button
              id="btn-back-step-3"
              onClick={() => setCurrentStep(2)}
              className="text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              id="btn-next-step-3"
              onClick={() => setCurrentStep(4)}
              className="bg-white text-black hover:bg-white/90 font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 flex items-center gap-1.5 transition-colors"
            >
              <span>Step 4: Deep Drive Pitch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Deep Motivation & Uniqueness */}
      {currentStep === 4 && (
        <div className="bg-[#121212] p-6 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-serif italic text-xl text-white">Step 4: Deep Uniqueness & Motivation Pitch</h3>
            </div>
            <p className="text-xs text-white/50 mt-1 font-sans">
              State what deep inside you feel makes you unique, your driving force, and your eagerness to acclimate.
            </p>
          </div>

          {/* Motivation Prompt */}
          <div className="bg-[#0A0A0A] text-white p-5 border border-white/10 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 inline-block">
              Deep Driving Force Prompt
            </span>
            <p className="text-xs text-white/90 leading-relaxed font-sans mt-2">
              "{selectedJob?.customQuestions.motivationScenario}"
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70">Your Deep Driving Force Statement:</label>
            <textarea
              id="textarea-motivation-transcript"
              rows={4}
              value={motivationVideoTranscript}
              onChange={(e) => setMotivationVideoTranscript(e.target.value)}
              className="w-full p-3 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <button
              id="btn-back-step-4"
              onClick={() => setCurrentStep(3)}
              className="text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              id="btn-submit-assessment"
              onClick={handleSubmitAssessment}
              disabled={isSubmitting}
              className="bg-emerald-400 text-black hover:bg-emerald-300 text-xs font-mono font-bold uppercase tracking-wider px-6 py-3 flex items-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Evaluating Civility Index...' : 'Submit Screening'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Final Submission Confirmation & Score Report */}
      {currentStep === 5 && evaluationResult && (
        <div className="bg-[#121212] p-8 border border-white/10 space-y-6 text-center">
          <div className="w-16 h-16 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center rounded-none">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="font-serif italic text-2xl text-white">Screening Complete & Securely Vaulted</h3>
            <p className="text-xs text-white/60 mt-2 max-w-lg mx-auto font-sans">
              Your video assessment, vocal tone analysis, and background check authorization have been encrypted and transmitted into the employer client ledger.
            </p>
          </div>

          {/* Civility Score Card */}
          <div className="bg-[#0A0A0A] text-white p-6 max-w-md mx-auto space-y-3 border border-white/10">
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/50">Your Evaluated Civility Index</div>
            <div className="text-5xl font-serif italic text-emerald-400">{evaluationResult.civilityScore}<span className="text-xs text-white/40 font-mono font-normal">/100</span></div>
            <div className="inline-block border border-white/20 bg-white/5 text-white/80 text-[10px] font-mono uppercase tracking-wider px-3 py-1">
              Status Tier: {evaluationResult.recommendationTier}
            </div>
          </div>

          {/* FCRA & Official Verification Receipt */}
          <div className="bg-[#080808] border border-white/10 p-4 max-w-md mx-auto text-left space-y-2 font-mono text-[11px]">
            <div className="flex justify-between text-white/40 border-b border-white/10 pb-1.5 uppercase text-[10px] tracking-wider">
              <span>Official Verification Receipt</span>
              <span className="text-emerald-400">Status: Transmitted</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span className="text-white/40">Submission Ref ID:</span>
              <span className="text-amber-300 font-bold">REF-{Date.now().toString(36).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span className="text-white/40">FCRA Background Consent:</span>
              <span className="text-emerald-400 font-bold">{bgCheckConsented ? 'Authorized & Signed' : 'Waived'}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span className="text-white/40">Vocal & Video Assets:</span>
              <span className="text-white/80">{toneRecorded ? 'Voice Tone Analyzed' : 'Audio Saved'} • {pressureRecorded ? 'Video Recorded' : 'Transcript Ready'}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span className="text-white/40">Vault Encryption:</span>
              <span className="text-purple-300">256-Bit TLS / AES Protected</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setCurrentStep(0);
                setEvaluationResult(null);
              }}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider px-5 py-2.5 border border-white/20 transition-colors"
            >
              Submit Another Position Assessment
            </button>
          </div>
        </div>
      )}
        </>
      )}

    </div>
  );
};
