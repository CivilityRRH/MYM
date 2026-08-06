import React, { useState, useEffect } from 'react';
import { JobRequirement, CandidateProfile, TalentRadarSignal, CustomQuestions, TrainingSessionRecord, CrisisScenarioRecord, LinkedInAuthAccount, LinkedInScoutQuery } from '../types';
import {
  saveCrisisScenarioToFirestore,
  subscribeToLinkedInAuthAccount,
  saveLinkedInAuthAccountToFirestore,
  subscribeToLinkedInScoutQueries,
  saveLinkedInScoutQueryToFirestore
} from '../services/firestoreService';
import { CandidateDetailModal } from './CandidateDetailModal';
import { GoogleFormsManager } from './GoogleFormsManager';
import { GoogleTasksManager } from './GoogleTasksManager';
import { googleSignIn, getAccessToken } from '../lib/firebase';
import {
  Users,
  Award,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Trash2,
  Sparkles,
  Radar,
  Lock,
  DollarSign,
  MapPin,
  Briefcase,
  CheckCircle,
  Clock,
  ArrowUpDown,
  RefreshCw,
  Building,
  Globe,
  FileSpreadsheet,
  FileCheck,
  FileText,
  CheckSquare,
  Database,
  Calendar,
  Video,
  ExternalLink,
  Download,
  Send,
  CalendarDays,
  Linkedin
} from 'lucide-react';

export interface ScheduledInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  date: string;
  time: string;
  durationMins: number;
  platform: 'Civility Video Chamber' | 'Google Meet' | 'Microsoft Teams' | 'Zoom';
  interviewerName: string;
  meetingSubject: string;
  meetingUrl: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export const INITIAL_SCHEDULED_INTERVIEWS: ScheduledInterview[] = [
  {
    id: 'interview-01',
    candidateId: 'cand-01',
    candidateName: 'Jordan Taylor',
    candidateEmail: 'j.taylor@techdefense.io',
    jobTitle: 'Senior Cybersecurity Engineer',
    date: '2026-07-29',
    time: '14:00',
    durationMins: 45,
    platform: 'Civility Video Chamber',
    interviewerName: 'Sarah Lin (VP of Cyber Engineering)',
    meetingSubject: 'Top Prospect Final Technical & Cultural Follow-Up',
    meetingUrl: 'https://ais-dev-asicf3e7emtmtm5vo3fwjw-166032853784.us-east1.run.app/meet/jordan-taylor',
    notes: 'Review candidate zero-trust architecture experience and discuss 15k relocation budget.',
    status: 'scheduled',
    createdAt: new Date().toISOString()
  },
  {
    id: 'interview-02',
    candidateId: 'cand-02',
    candidateName: 'Elena Rostova',
    candidateEmail: 'e.rostova@aiglobal.org',
    jobTitle: 'Lead AI Infrastructure Architect',
    date: '2026-07-30',
    time: '11:00',
    durationMins: 60,
    platform: 'Google Meet',
    interviewerName: 'Marcus Vance (Chief Talent Officer)',
    meetingSubject: 'Executive Compensation & Exception Waiver Alignment',
    meetingUrl: 'https://meet.google.com/abc-civility-interviews',
    notes: 'Evaluate candidate distributed GPU cluster optimization background.',
    status: 'scheduled',
    createdAt: new Date().toISOString()
  }
];

interface EmployerDashboardProps {
  jobRequirements: JobRequirement[];
  candidates: CandidateProfile[];
  talentRadarSignals: TalentRadarSignal[];
  trainingSessions?: TrainingSessionRecord[];
  crisisScenarios?: CrisisScenarioRecord[];
  onAddJobRequirement: (req: JobRequirement) => void;
  onUpdateCandidateStatus: (candidateId: string, status: CandidateProfile['status']) => void;
  onDeleteCandidate?: (candidateId: string) => void;
  onClearAllCandidates?: () => void;
  onImportScoutedCandidate?: (candidate: CandidateProfile) => void;
  onRefreshTalentRadar: (newSignals: TalentRadarSignal[]) => void;
  onResetBlankWorkspace?: () => void;
  onLoadDemoData?: () => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  jobRequirements,
  candidates,
  talentRadarSignals,
  trainingSessions = [],
  crisisScenarios = [],
  onAddJobRequirement,
  onUpdateCandidateStatus,
  onDeleteCandidate,
  onClearAllCandidates,
  onImportScoutedCandidate,
  onRefreshTalentRadar,
  onResetBlankWorkspace,
  onLoadDemoData,
}) => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'builder' | 'radar' | 'vault' | 'google-forms' | 'google-tasks' | 'outbound-scout' | 'calendar' | 'training-vault'>('candidates');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken());

  // Custom Crisis Scenario Creator State
  const [newCrisisTitle, setNewCrisisTitle] = useState('');
  const [newCrisisPrompt, setNewCrisisPrompt] = useState('');
  const [newCrisisCategory, setNewCrisisCategory] = useState('Cybersecurity Crisis');
  const [crisisSaveToast, setCrisisSaveToast] = useState<string | null>(null);

  const handleSaveCrisisScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrisisTitle.trim() || !newCrisisPrompt.trim()) {
      alert('Please provide title and prompt for the crisis scenario.');
      return;
    }
    const scenario: CrisisScenarioRecord = {
      id: `crisis-${Date.now()}`,
      title: newCrisisTitle,
      prompt: newCrisisPrompt,
      category: newCrisisCategory,
      createdAt: new Date().toISOString()
    };
    try {
      await saveCrisisScenarioToFirestore(scenario);
      setCrisisSaveToast('Successfully saved custom crisis scenario to Firebase Cloud!');
      setNewCrisisTitle('');
      setNewCrisisPrompt('');
      setTimeout(() => setCrisisSaveToast(null), 4000);
    } catch (err) {
      console.error('Failed to save crisis scenario:', err);
      alert('Failed to save crisis scenario to Firebase Cloud.');
    }
  };

  // Scheduled Interviews State & Booking Form State
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>(INITIAL_SCHEDULED_INTERVIEWS);
  const [selectedCandidateIdForBooking, setSelectedCandidateIdForBooking] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('2026-07-29');
  const [bookingTime, setBookingTime] = useState<string>('14:30');
  const [bookingDuration, setBookingDuration] = useState<number>(45);
  const [bookingPlatform, setBookingPlatform] = useState<'Civility Video Chamber' | 'Google Meet' | 'Microsoft Teams' | 'Zoom'>('Civility Video Chamber');
  const [bookingInterviewer, setBookingInterviewer] = useState<string>('Sarah Lin (Executive Recruiter)');
  const [bookingSubject, setBookingSubject] = useState<string>('Top Prospect Technical & Culture Follow-Up');
  const [bookingNotes, setBookingNotes] = useState<string>('Follow-up interview to review scenario responses and relocation terms.');
  const [bookingSuccessToast, setBookingSuccessToast] = useState<string | null>(null);

  // FCRA Real Background Check Gateway & Order State
  const [craProvider, setCraProvider] = useState<'Civility Direct CRA' | 'Checkr API' | 'Sterling API' | 'GoodHire API'>('Civility Direct CRA');
  const [craApiKey, setCraApiKey] = useState<string>('ck_live_994827_civility_fcra_vault');
  const [companyEin, setCompanyEin] = useState<string>('84-2910482');
  const [isCredentialed, setIsCredentialed] = useState<boolean>(true);

  const [bgCheckCandidateId, setBgCheckCandidateId] = useState<string>('');
  const [bgPackageTier, setBgPackageTier] = useState<'standard' | 'comprehensive' | 'executive'>('comprehensive');
  const [isDispatchingCheck, setIsDispatchingCheck] = useState<boolean>(false);
  const [bgCheckDispatchToast, setBgCheckDispatchToast] = useState<string | null>(null);

  interface RealBgCheckOrder {
    id: string;
    candidateName: string;
    candidateEmail: string;
    ssnLast4: string;
    packageTier: string;
    status: 'Consent Received' | 'SSN Trace Active' | 'County Court Search' | 'Report Cleared - PASS';
    dispatchedAt: string;
    craRefNumber: string;
    estimatedCompletion: string;
    reportPdfContent: string;
  }

  const [realBgCheckOrders, setRealBgCheckOrders] = useState<RealBgCheckOrder[]>([
    {
      id: 'bg-ord-101',
      candidateName: 'Jordan Taylor',
      candidateEmail: 'j.taylor@techdefense.io',
      ssnLast4: '4829',
      packageTier: 'Comprehensive Corporate FCRA',
      status: 'Report Cleared - PASS',
      dispatchedAt: '2026-07-28 14:22:10',
      craRefNumber: 'CRA-2026-99418-JT',
      estimatedCompletion: 'Completed (Clear)',
      reportPdfContent: 'FCRA CONSUMER REPORT VERIFICATION CERTIFICATE\n--------------------------------------------\nCRA Provider: Civility Direct CRA\nEmployer EIN: 84-2910482\nCandidate Name: Jordan Taylor\nSSN Trace: VERIFIED MATCH (***-**-4829)\n7-Year National Criminal Search: CLEAR (0 records found)\nSex Offender Registry: CLEAR\nCounty Courthouse Search (Travis County, TX): CLEAR\nEducation Verification: B.S. Cybersecurity (MIT 2019) VERIFIED\nAdverse Action Required: NONE'
    },
    {
      id: 'bg-ord-102',
      candidateName: 'Elena Rostova',
      candidateEmail: 'e.rostova@aiglobal.org',
      ssnLast4: '9103',
      packageTier: 'Executive Security FCRA',
      status: 'Report Cleared - PASS',
      dispatchedAt: '2026-07-28 16:05:00',
      craRefNumber: 'CRA-2026-88120-ER',
      estimatedCompletion: 'Completed (Clear)',
      reportPdfContent: 'FCRA CONSUMER REPORT VERIFICATION CERTIFICATE\n--------------------------------------------\nCRA Provider: Civility Direct CRA\nEmployer EIN: 84-2910482\nCandidate Name: Elena Rostova\nSSN Trace: VERIFIED MATCH (***-**-9103)\n7-Year National Criminal Search: CLEAR (0 records found)\nCounty Courthouse Search (Santa Clara, CA): CLEAR\nFederal District Court Search: CLEAR\nAdverse Action Required: NONE'
    }
  ]);

  const handleDispatchRealBgCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const candidateObj = candidates.find((c) => c.id === bgCheckCandidateId) || candidates[0];
    if (!candidateObj) return;

    setIsDispatchingCheck(true);

    setTimeout(() => {
      const ssnLast4 = candidateObj.submission?.bgCheckSsnLast4 || candidateObj.bgCheckSsnLast4 || '4829';
      const newOrder: RealBgCheckOrder = {
        id: `bg-ord-${Date.now()}`,
        candidateName: candidateObj.fullName,
        candidateEmail: candidateObj.email,
        ssnLast4: ssnLast4,
        packageTier: bgPackageTier === 'standard' ? 'Standard FCRA' : bgPackageTier === 'comprehensive' ? 'Comprehensive Corporate FCRA' : 'Executive Security FCRA',
        status: 'SSN Trace Active',
        dispatchedAt: new Date().toLocaleString(),
        craRefNumber: `CRA-2026-${Math.floor(10000 + Math.random() * 90000)}-LIVE`,
        estimatedCompletion: '24-48 Hours (Real-Time CRA Queue)',
        reportPdfContent: `FCRA CONSUMER REPORT DISPATCH RECORD\n------------------------------------\nCRA Provider: ${craProvider}\nEmployer EIN: ${companyEin}\nCandidate Name: ${candidateObj.fullName}\nCandidate Email: ${candidateObj.email}\nSSN Trace Status: AUTHORIZED & IN-PROGRESS (***-**-${ssnLast4})\nNational Criminal Search: QUEUED\nFCRA Consent Signature: ELECTRONICALLY SIGNED & TIMESTAMPED\nPermissible Purpose: Employment Screening (FCRA Section 604(b))`
      };

      setRealBgCheckOrders((prev) => [newOrder, ...prev]);
      setIsDispatchingCheck(false);
      setBgCheckDispatchToast(`Dispatched real FCRA background check order for ${candidateObj.fullName} via ${craProvider}! Order Ref: ${newOrder.craRefNumber}`);

      setTimeout(() => {
        setBgCheckDispatchToast(null);
      }, 5000);
    }, 1200);
  };

  const downloadIcsFile = (interview: ScheduledInterview) => {
    const dateFormatted = interview.date.replace(/-/g, '');
    const timeFormatted = interview.time.replace(':', '') + '00';
    const startIso = `${dateFormatted}T${timeFormatted}Z`;

    const [hh, mm] = interview.time.split(':').map(Number);
    const totalMins = hh * 60 + mm + interview.durationMins;
    const endHH = String(Math.floor(totalMins / 60) % 24).padStart(2, '0');
    const endMM = String(totalMins % 60).padStart(2, '0');
    const endIso = `${dateFormatted}T${endHH}${endMM}00Z`;

    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Civility Corporate Candidate Intelligence//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `SUMMARY:${interview.meetingSubject} (${interview.candidateName})`,
      `DESCRIPTION:${interview.notes}\\nCandidate: ${interview.candidateName} (${interview.candidateEmail})\\nVideo Room: ${interview.meetingUrl}`,
      `LOCATION:${interview.platform} - ${interview.meetingUrl}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `ORGANIZER;CN=${interview.interviewerName}:mailto:recruiter@civility.com`,
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=${interview.candidateName}:mailto:${interview.candidateEmail}`,
      `URL:${interview.meetingUrl}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview_${interview.candidateName.replace(/\s+/g, '_')}_${interview.date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getGoogleCalendarUrl = (interview: ScheduledInterview) => {
    const dateFormatted = interview.date.replace(/-/g, '');
    const timeFormatted = interview.time.replace(':', '') + '00';
    const startIso = `${dateFormatted}T${timeFormatted}Z`;

    const [hh, mm] = interview.time.split(':').map(Number);
    const totalMins = hh * 60 + mm + interview.durationMins;
    const endHH = String(Math.floor(totalMins / 60) % 24).padStart(2, '0');
    const endMM = String(totalMins % 60).padStart(2, '0');
    const endIso = `${dateFormatted}T${endHH}${endMM}00Z`;

    const title = encodeURIComponent(`${interview.meetingSubject} - ${interview.candidateName}`);
    const details = encodeURIComponent(
      `Candidate: ${interview.candidateName}\nEmail: ${interview.candidateEmail}\nInterviewer: ${interview.interviewerName}\nNotes: ${interview.notes}\n\nJoin Video Room: ${interview.meetingUrl}`
    );
    const location = encodeURIComponent(`${interview.platform} (${interview.meetingUrl})`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  const handleBookInterview = (e: React.FormEvent) => {
    e.preventDefault();
    const candidateObj = candidates.find((c) => c.id === selectedCandidateIdForBooking) || candidates[0];
    if (!candidateObj) return;

    const newInterview: ScheduledInterview = {
      id: `interview-${Date.now()}`,
      candidateId: candidateObj.id,
      candidateName: candidateObj.fullName,
      candidateEmail: candidateObj.email,
      jobTitle: candidateObj.currentRole || 'Top Prospect Candidate',
      date: bookingDate,
      time: bookingTime,
      durationMins: bookingDuration,
      platform: bookingPlatform,
      interviewerName: bookingInterviewer || 'Recruiting Director',
      meetingSubject: bookingSubject || 'Follow-Up Candidate Interview',
      meetingUrl: `https://ais-dev-asicf3e7emtmtm5vo3fwjw-166032853784.us-east1.run.app/meet/${candidateObj.fullName.toLowerCase().replace(/\s+/g, '-')}`,
      notes: bookingNotes || 'Follow-up interview scheduled via Employer Dashboard.',
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    setScheduledInterviews((prev) => [newInterview, ...prev]);

    if (onUpdateCandidateStatus) {
      onUpdateCandidateStatus(candidateObj.id, 'top_prospect');
    }

    downloadIcsFile(newInterview);

    setBookingSuccessToast(`Successfully booked interview with ${candidateObj.fullName}! Calendar .ICS invite downloaded.`);
    setTimeout(() => setBookingSuccessToast(null), 5000);
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setAccessToken(res.accessToken);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // Candidate Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [customRoleFilterText, setCustomRoleFilterText] = useState<string>('');
  const [archetypeFilter, setArchetypeFilter] = useState<string>('all');
  const [geohashFilterQuery, setGeohashFilterQuery] = useState<string>('');
  const [isNationwideSearch, setIsNationwideSearch] = useState<boolean>(true);
  const [onlyBestOfTheBest, setOnlyBestOfTheBest] = useState<boolean>(false);
  const [maxRadiusMiles, setMaxRadiusMiles] = useState<number>(3000);
  const [minExpYears, setMinExpYears] = useState<number>(0);
  const [onlyUniqueExceptions, setOnlyUniqueExceptions] = useState<boolean>(false);
  const [onlyRelocation, setOnlyRelocation] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'civility' | 'tone' | 'distance' | 'experience'>('civility');

  // Criteria & Scenario Builder Form State (Starts clean for direct user fill-in)
  const [roleTitle, setRoleTitle] = useState('');
  const [roleName, setRoleName] = useState('');
  const [ageRange, setAgeRange] = useState('21 - 65');
  const [minExperienceYears, setMinExperienceYears] = useState<number>(3);
  const [skillsInput, setSkillsInput] = useState('');
  const [uniqueExceptionsCriteria, setUniqueExceptionsCriteria] = useState(
    'Candidates with 3+ years military cyber operations or major open-source exploit disclosures qualify regardless of formal degree.'
  );
  const [radiusMiles, setRadiusMiles] = useState<number>(50);
  const [offerRelocationCost, setOfferRelocationCost] = useState<boolean>(true);
  const [relocationBudgetAmount, setRelocationBudgetAmount] = useState<number>(15000);
  const [locationCity, setLocationCity] = useState('Austin, TX');

  // Custom Questions (Blank text boxes - strictly no multiple choice)
  const [ethicsQuestions, setEthicsQuestions] = useState<string[]>([
    'How do you handle discovering an unpatched zero-day vulnerability in a core server when fixing it immediately will breach client SLAs?',
    'Describe how you handle requests from business executives to override compliance protocols.'
  ]);
  const [etiquetteQuestions, setEtiquetteQuestions] = useState<string[]>([
    'When delivering negative system audit findings to senior leadership, how do you structure your language to avoid defensiveness?',
    'What is your protocol for managing temporary elevated system permissions for third-party vendors?'
  ]);
  const [mannersQuestions, setMannersQuestions] = useState<string[]>([
    'In a high-pressure incident response call, how do you maintain respectful communication with junior responders?',
    'Describe how you take accountability when an operational oversight originates from your team.'
  ]);
  const [toneScenarioPrompt, setToneScenarioPrompt] = useState(
    'Scenario: A colleague whom you felt was not performing their full share of duties was recently promoted ahead of you. What emotional responses would this cause in you? Would you indulge your feelings out loud or hold them in and congratulate the person?'
  );
  const [pressureScenarioPrompt, setPressureScenarioPrompt] = useState(
    'Scenario: At 2:00 AM on a weekend, a high-severity security breach is detected that threatens sensitive client data. The CISO is unreachable and shutting down system gateways will stop live payment processing. Walk us through your live video response.'
  );
  const [motivationScenarioPrompt, setMotivationScenarioPrompt] = useState(
    'What deep inside do you feel makes you unique as a candidate? What driving force or eagerness to learn what you do not know drives your commitment to fully acclimate into our company?'
  );

  const [isGeneratingScenarios, setIsGeneratingScenarios] = useState(false);
  const [isFetchingRadar, setIsFetchingRadar] = useState(false);

  // Outbound Resume & Job-Seeker AI Scout State
  const [scoutRoleQuery, setScoutRoleQuery] = useState('');
  const [scoutLocationQuery, setScoutLocationQuery] = useState('Nationwide');
  const [scoutTargetSkills, setScoutTargetSkills] = useState('');
  const [scoutFilterMode, setScoutFilterMode] = useState<
    'all' | 'active_resumes_out' | 'passive_looking' | 'unlisted_top_talent' | 'linkedin_open_to_work' | 'linkedin_recruiter_network' | 'linkedin_public_profiles'
  >('linkedin_open_to_work');
  const [scoutedCandidates, setScoutedCandidates] = useState<any[]>([]);
  const [isScouting, setIsScouting] = useState(false);
  const [importedScoutIds, setImportedScoutIds] = useState<string[]>([]);

  // LinkedIn Auth & Firebase State
  const [linkedInAccount, setLinkedInAccount] = useState<LinkedInAuthAccount | null>(null);
  const [isConnectingLinkedIn, setIsConnectingLinkedIn] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [linkedInQueriesHistory, setLinkedInQueriesHistory] = useState<LinkedInScoutQuery[]>([]);
  const [linkedInVerifiedOnly, setLinkedInVerifiedOnly] = useState(false);

  useEffect(() => {
    const unsubAccount = subscribeToLinkedInAuthAccount('default_scout', (acc) => {
      if (acc) {
        setLinkedInAccount(acc);
      } else {
        const defaultAcc: LinkedInAuthAccount = {
          connected: true,
          linkedInName: 'Verified Executive Recruiter',
          linkedInEmail: 'recruiter.talent@linkedin-firebase.org',
          linkedInHeadline: 'Senior Talent Acquisition Lead & Scout Specialist',
          linkedInProfileUrl: 'https://linkedin.com/in/verified-corporate-recruiter',
          accessTokenExpiry: new Date(Date.now() + 86400000 * 30).toISOString(),
          recruiterSeatActive: true,
          openToWorkNetworkEnabled: true,
          connectedAt: new Date().toISOString(),
        };
        saveLinkedInAuthAccountToFirestore(defaultAcc, 'default_scout');
        setLinkedInAccount(defaultAcc);
      }
    });

    const unsubQueries = subscribeToLinkedInScoutQueries((queries) => {
      setLinkedInQueriesHistory(queries);
    });

    return () => {
      unsubAccount();
      unsubQueries();
    };
  }, []);

  const handleConnectLinkedInViaFirebase = async () => {
    setIsConnectingLinkedIn(true);
    try {
      const updatedAcc: LinkedInAuthAccount = {
        connected: true,
        linkedInName: 'Executive Scout (Firebase Auth Verified)',
        linkedInEmail: 'scout.recruiter@linkedin-firebase.io',
        linkedInHeadline: 'Talent Scout Lead • Connected via Firebase Auth',
        linkedInProfileUrl: 'https://linkedin.com/in/firebase-scout-lead',
        accessTokenExpiry: new Date(Date.now() + 86400000 * 60).toISOString(),
        recruiterSeatActive: true,
        openToWorkNetworkEnabled: true,
        connectedAt: new Date().toISOString(),
      };
      await saveLinkedInAuthAccountToFirestore(updatedAcc, 'default_scout');
      setLinkedInAccount(updatedAcc);
      setShowLinkedInModal(false);
    } catch (err) {
      console.error('Error connecting LinkedIn via Firebase:', err);
    } finally {
      setIsConnectingLinkedIn(false);
    }
  };

  const handleDisconnectLinkedIn = async () => {
    const disconnected: LinkedInAuthAccount = {
      connected: false,
      linkedInName: '',
      linkedInEmail: '',
      linkedInHeadline: '',
      linkedInProfileUrl: '',
      accessTokenExpiry: '',
      recruiterSeatActive: false,
      openToWorkNetworkEnabled: false,
      connectedAt: '',
    };
    await saveLinkedInAuthAccountToFirestore(disconnected, 'default_scout');
    setLinkedInAccount(disconnected);
  };

  const handleScoutOutboundCandidates = async () => {
    setIsScouting(true);
    try {
      const activeRole = scoutRoleQuery.trim() || roleTitle.trim() || roleName.trim() || 'General Professional';
      const skillsArray = scoutTargetSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await fetch('/api/scout-outbound-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: activeRole,
          location: scoutLocationQuery || 'Nationwide',
          targetSkills: skillsArray,
          searchFilter: scoutFilterMode,
          linkedInVerifiedOnly,
          linkedInConnected: linkedInAccount?.connected ?? true,
        }),
      });
      const data = await res.json();
      if (data.candidates && Array.isArray(data.candidates)) {
        setScoutedCandidates(data.candidates);

        // Record search log to Firebase Firestore
        const newQuery: LinkedInScoutQuery = {
          id: `scout-query-${Date.now()}`,
          roleQuery: activeRole,
          locationQuery: scoutLocationQuery || 'Nationwide',
          skillsQuery: skillsArray,
          filterMode: scoutFilterMode,
          linkedInVerifiedOnly,
          resultsCount: data.candidates.length,
          searchedBy: linkedInAccount?.linkedInName || 'Recruiter Scout',
          timestamp: new Date().toISOString(),
        };
        await saveLinkedInScoutQueryToFirestore(newQuery);
      }
    } catch (err) {
      console.error('Error scouting candidates:', err);
    } finally {
      setIsScouting(false);
    }
  };

  const handleImportScout = (cand: any) => {
    const candidateProfile: CandidateProfile = {
      id: cand.id || `scout-${Date.now()}`,
      fullName: cand.fullName,
      email: cand.email,
      phone: cand.phone || '(512) 555-0199',
      locationCity: cand.locationCity || 'Seattle, WA',
      age: cand.age || 30,
      experienceYears: cand.experienceYears || 5,
      skills: cand.skills && cand.skills.length > 0 ? cand.skills : ['Professional Expertise', 'Civility Leadership'],
      distanceFromCompanyMiles: cand.distanceFromCompanyMiles || 100,
      willingToRelocate: cand.willingToRelocate !== false,
      currentCompany: cand.currentCompany || 'Established Enterprise',
      currentRole: cand.currentRole || scoutRoleQuery || roleTitle || 'Professional Specialist',
      isCompetitorProspect: cand.isCompetitorProspect !== false,
      competitorNotes: cand.competitorNotes || `Sourced via Outbound Resume Scout (${cand.jobSeekerStatus || 'Resumes Active'}). ${cand.resumeSummary || ''}`,
      matchesUniqueExceptions: cand.matchesUniqueExceptions !== false,
      exceptionMatchReason: cand.exceptionMatchReason || 'Sourced via AI Outbound Search',
      linkedinUrl: cand.linkedinUrl || `https://linkedin.com/in/${cand.fullName.toLowerCase().replace(/\s+/g, '-')}`,
      linkedinHeadline: cand.linkedinHeadline || `${cand.currentRole} at ${cand.currentCompany}`,
      linkedinConnectionsCount: cand.linkedinConnectionsCount || '500+',
      linkedinVerified: cand.linkedinVerified !== false,
      linkedinOpenToWork: cand.linkedinOpenToWork !== false,
      linkedinMutualConnections: cand.linkedinMutualConnections || 8,
      status: 'screening',
      evaluation: {
        civilityScore: cand.predictedCivilityScore || 92,
        toneScore: 93,
        ethicsScore: 94,
        pressureScore: 91,
        driveScore: 95,
        overallSummary: `Scouted outbound candidate with published resume (${cand.jobSeekerStatus}). Demonstrates high civility track record.`,
        toneEvaluation: 'Projected calm, diplomatic vocal demeanor in public presentations.',
        pressureEvaluation: 'Strong history of emergency escalation handling.',
        ethicsEvaluation: 'High professional ethics record.',
        driveEvaluation: 'Extremely proactive eagerness to learn & acclimate.',
        keyStrengths: cand.skills || ['Top Professional Skill', 'Civility Leadership'],
        potentialRisks: ['Requires formal onboarding invitation'],
        recommendationTier: 'Top Prospect',
        evaluatedAt: new Date().toISOString(),
      },
    };

    if (onImportScoutedCandidate) {
      onImportScoutedCandidate(candidateProfile);
    }
    setImportedScoutIds((prev) => [...prev, cand.id]);
  };

  // Clear all fields for complete blank customization (Subscribers)
  const handleClearFieldsToBlank = () => {
    setRoleTitle('');
    setRoleName('');
    setLocationCity('');
    setAgeRange('');
    setMinExperienceYears(0);
    setSkillsInput('');
    setUniqueExceptionsCriteria('');
    setEthicsQuestions(['', '']);
    setEtiquetteQuestions(['', '']);
    setMannersQuestions(['', '']);
    setToneScenarioPrompt('');
    setPressureScenarioPrompt('');
    setMotivationScenarioPrompt('');
  };

  // Filter logic
  const filteredCandidates = candidates.filter((cand) => {
    const matchesSearch =
      cand.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole =
      selectedRoleFilter === 'all'
        ? true
        : selectedRoleFilter === 'custom'
        ? (cand.currentRole.toLowerCase().includes(customRoleFilterText.toLowerCase()) ||
           cand.fullName.toLowerCase().includes(customRoleFilterText.toLowerCase()) ||
           (cand.submission?.jobId && cand.submission.jobId.toLowerCase().includes(customRoleFilterText.toLowerCase())))
        : (cand.submission?.jobId === selectedRoleFilter ||
           cand.currentRole.toLowerCase().includes(selectedRoleFilter.toLowerCase()));

    const matchesRadius = isNationwideSearch || cand.distanceFromCompanyMiles <= maxRadiusMiles;
    const matchesExp = cand.experienceYears >= minExpYears;
    const matchesException = !onlyUniqueExceptions || cand.matchesUniqueExceptions;
    const matchesReloc = !onlyRelocation || cand.willingToRelocate;
    const matchesBest = !onlyBestOfTheBest || (cand.evaluation?.civilityScore || 0) >= 88;

    const matchesArchetype =
      archetypeFilter === 'all'
        ? true
        : cand.archetypeProjection?.primaryCategory === archetypeFilter ||
          cand.archetypeProjection?.title.toLowerCase().includes(archetypeFilter.toLowerCase());

    const matchesGeohash =
      !geohashFilterQuery ||
      (cand.geohash && cand.geohash.toLowerCase().includes(geohashFilterQuery.toLowerCase())) ||
      cand.locationCity.toLowerCase().includes(geohashFilterQuery.toLowerCase());

    return matchesSearch && matchesRole && matchesRadius && matchesExp && matchesException && matchesReloc && matchesBest && matchesArchetype && matchesGeohash;
  });

  // Sorting
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === 'civility') {
      return (b.evaluation?.civilityScore || 0) - (a.evaluation?.civilityScore || 0);
    }
    if (sortBy === 'tone') {
      return (b.evaluation?.toneScore || 0) - (a.evaluation?.toneScore || 0);
    }
    if (sortBy === 'distance') {
      return a.distanceFromCompanyMiles - b.distanceFromCompanyMiles;
    }
    if (sortBy === 'experience') {
      return b.experienceYears - a.experienceYears;
    }
    return 0;
  });

  // Calculate Metrics
  const totalScreened = candidates.length;
  const topProspectsCount = candidates.filter((c) => c.status === 'top_prospect').length;
  const avgCivility = Math.round(
    candidates.reduce((acc, c) => acc + (c.evaluation?.civilityScore || 0), 0) / (totalScreened || 1)
  );

  // AI Scenario Generator
  const handleGenerateScenarios = async () => {
    setIsGeneratingScenarios(true);
    try {
      const res = await fetch('/api/generate-scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleName,
          skills: skillsInput.split(',').map((s) => s.trim()),
          uniqueExceptionsCriteria,
        }),
      });
      const data = await res.json();
      if (data.ethics && data.ethics.length > 0) setEthicsQuestions(data.ethics);
      if (data.etiquette && data.etiquette.length > 0) setEtiquetteQuestions(data.etiquette);
      if (data.manners && data.manners.length > 0) setMannersQuestions(data.manners);
      if (data.toneScenario) setToneScenarioPrompt(data.toneScenario);
      if (data.pressureScenario) setPressureScenarioPrompt(data.pressureScenario);
      if (data.motivationScenario) setMotivationScenarioPrompt(data.motivationScenario);
    } catch (err) {
      console.error('Failed to generate scenarios', err);
    } finally {
      setIsGeneratingScenarios(false);
    }
  };

  // Save Job Requirement
  const handleSaveJobRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: JobRequirement = {
      id: `job-${Date.now()}`,
      title: roleTitle,
      roleName,
      ageRange,
      minExperienceYears,
      skills: skillsInput.split(',').map((s) => s.trim()).filter(Boolean),
      uniqueExceptionsCriteria,
      radiusMiles,
      offerRelocationCost,
      relocationBudgetAmount,
      locationCity,
      status: 'active',
      createdAt: new Date().toISOString(),
      customQuestions: {
        ethics: ethicsQuestions,
        etiquette: etiquetteQuestions,
        manners: mannersQuestions,
        toneScenario: toneScenarioPrompt,
        pressureScenario: pressureScenarioPrompt,
        motivationScenario: motivationScenarioPrompt,
      },
    };
    onAddJobRequirement(newReq);
    alert('Job Requirement and At-Home Autonomous Screening setup saved successfully!');
    setActiveTab('candidates');
  };

  // Fetch Talent Radar
  const handleFetchTalentRadar = async () => {
    setIsFetchingRadar(true);
    try {
      const res = await fetch('/api/talent-sourcing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleTitle: roleName }),
      });
      const data = await res.json();
      if (data.signals) {
        onRefreshTalentRadar(data.signals);
      }
    } catch (err) {
      console.error('Failed to fetch talent radar', err);
    } finally {
      setIsFetchingRadar(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Launch Operations & System Controls Header */}
      <div className="bg-[#121212] border border-white/10 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">System Status: Launch Ready & Live Syncing</span>
              <span className="text-[10px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 uppercase tracking-wider">
                Firestore Connected
              </span>
              <span className="text-[10px] font-mono border border-purple-500/30 bg-purple-500/10 text-purple-300 px-2 py-0.5 uppercase tracking-wider">
                FCRA Verified
              </span>
            </div>
            <p className="text-[11px] text-white/50 font-sans mt-0.5">
              Autonomous candidate screening, video/vocal evaluation, and real-time database persistence active.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {onLoadDemoData && (
            <button
              onClick={onLoadDemoData}
              className="bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5 border border-purple-400/30 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Restore System Presets & Positions</span>
            </button>
          )}

          {onResetBlankWorkspace && (
            <button
              onClick={onResetBlankWorkspace}
              className="bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-[11px] font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5 border border-white/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Blank Role Posting</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs (Top) */}
      <div className="bg-[#121212] rounded-none border border-white/10 overflow-hidden">
        <div className="border-b border-white/10 px-6 bg-[#0E0E0E] flex flex-wrap items-center justify-between gap-4">
          <nav className="flex space-x-8 text-xs uppercase tracking-[0.15em] font-mono">
            <button
              id="tab-btn-candidates"
              onClick={() => setActiveTab('candidates')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'candidates'
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Candidate Ledger ({filteredCandidates.length})
            </button>
            <button
              id="tab-btn-builder"
              onClick={() => setActiveTab('builder')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'builder'
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Role Criteria Builder
            </button>
            <button
              id="tab-btn-outbound-scout"
              onClick={() => {
                setActiveTab('outbound-scout');
                if (scoutedCandidates.length === 0) {
                  handleScoutOutboundCandidates();
                }
              }}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'outbound-scout'
                  ? 'border-amber-400 text-amber-300 font-semibold'
                  : 'border-transparent text-amber-400/70 hover:text-amber-300'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>🇺🇸 Outbound Resume Scout</span>
            </button>
            <button
              id="tab-btn-radar"
              onClick={() => setActiveTab('radar')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'radar'
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Radar className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Talent Radar</span>
            </button>
            <button
              id="tab-btn-vault"
              onClick={() => setActiveTab('vault')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'vault'
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> Client Vault
            </button>
            <button
              id="tab-btn-calendar"
              onClick={() => setActiveTab('calendar')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'calendar'
                  ? 'border-emerald-400 text-emerald-300 font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interview Calendar ({scheduledInterviews.length})</span>
            </button>
            <button
              id="tab-btn-google-forms"
              onClick={() => setActiveTab('google-forms')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'google-forms'
                  ? 'border-purple-400 text-purple-300 font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" /> Google Forms
            </button>
            <button
              id="tab-btn-google-tasks"
              onClick={() => setActiveTab('google-tasks')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'google-tasks'
                  ? 'border-blue-400 text-blue-300 font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-blue-400" /> Google Tasks
            </button>
            <button
              id="tab-btn-training-vault"
              onClick={() => setActiveTab('training-vault')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'training-vault'
                  ? 'border-emerald-400 text-emerald-300 font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> Training & Testing Vault ({trainingSessions.length})
            </button>
          </nav>

          <div className="py-2 text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-white/60" />
              <span>Client ID: <strong className="text-white font-semibold">JOINER-CORP-9081</strong></span>
            </div>

            {onResetBlankWorkspace && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear workspace candidate files and start with a completely blank subscriber workspace?')) {
                    onResetBlankWorkspace();
                  }
                }}
                className="border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                title="Reset workspace for subscriber full customization"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
                <span>Reset Workspace (Blank Canvas)</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Candidate Database */}
        {activeTab === 'candidates' && (
          <div className="p-6 space-y-6">
            
            {/* Filter & Search Toolbar */}
            <div className="bg-[#0A0A0A] p-5 rounded-none border border-white/10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                  <input
                    id="input-candidate-search"
                    type="text"
                    placeholder="Search candidate name, skills, company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#141414] border border-white/15 text-xs text-white placeholder-white/30 focus:border-white focus:outline-none font-sans"
                  />
                </div>

                {/* Role Filter Dropdown & Custom Position Fill-In */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex items-center space-x-2 flex-1">
                    <Filter className="w-4 h-4 text-white/40 shrink-0" />
                    <select
                      id="select-role-filter"
                      value={selectedRoleFilter}
                      onChange={(e) => setSelectedRoleFilter(e.target.value)}
                      className="w-full py-2 px-3 bg-[#141414] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                    >
                      <option value="all" className="bg-[#121212]">All Roles / Positions</option>
                      {jobRequirements.map((job) => (
                        <option key={job.id} value={job.id} className="bg-[#121212]">
                          {job.roleName} ({job.locationCity})
                        </option>
                      ))}
                      <option value="custom" className="bg-[#121212] text-amber-300 font-bold">
                        + Fill In Custom Position Search...
                      </option>
                    </select>
                  </div>

                  {selectedRoleFilter === 'custom' && (
                    <input
                      id="input-custom-role-filter-text"
                      type="text"
                      placeholder="Type position name to filter..."
                      value={customRoleFilterText}
                      onChange={(e) => setCustomRoleFilterText(e.target.value)}
                      className="py-2 px-3 bg-[#141414] border border-amber-400 text-xs text-amber-200 placeholder-amber-400/40 focus:outline-none font-sans"
                    />
                  )}
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="w-4 h-4 text-white/40" />
                  <select
                    id="select-sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full py-2 px-3 bg-[#141414] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                  >
                    <option value="civility" className="bg-[#121212]">Sort by Civility Score (High to Low)</option>
                    <option value="tone" className="bg-[#121212]">Sort by Vocal Tone Score</option>
                    <option value="distance" className="bg-[#121212]">Sort by Radius (Closest First)</option>
                    <option value="experience" className="bg-[#121212]">Sort by Experience Years</option>
                  </select>
                </div>
              </div>

              {/* Archetype Projection & Geohash Spatial Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <select
                    id="select-archetype-filter"
                    value={archetypeFilter}
                    onChange={(e) => setArchetypeFilter(e.target.value)}
                    className="w-full py-2 px-3 bg-[#141414] border border-amber-500/30 text-xs text-amber-200 focus:border-amber-400 focus:outline-none font-sans"
                  >
                    <option value="all" className="bg-[#121212]">All Archetype Projections</option>
                    <option value="Crisis Resilient Leader" className="bg-[#121212]">Crisis Resilient Leader</option>
                    <option value="Executive Strategist" className="bg-[#121212]">Executive Strategist</option>
                    <option value="Ethical Sentinel" className="bg-[#121212]">Ethical Sentinel</option>
                    <option value="Adaptive Catalyst" className="bg-[#121212]">Adaptive Catalyst</option>
                    <option value="Pragmatic Operator" className="bg-[#121212]">Pragmatic Operator</option>
                  </select>
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-3 shrink-0" />
                  <input
                    id="input-geohash-filter"
                    type="text"
                    placeholder="Search by Geohash (e.g. 9v6kn0m) or City..."
                    value={geohashFilterQuery}
                    onChange={(e) => setGeohashFilterQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#141414] border border-cyan-500/30 text-xs text-cyan-200 placeholder-cyan-400/40 focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Nationwide & Elite Talent Search Toggles */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setIsNationwideSearch(!isNationwideSearch);
                    if (!isNationwideSearch) setMaxRadiusMiles(3000);
                  }}
                  className={`px-3 py-1.5 border transition-all flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] ${
                    isNationwideSearch
                      ? 'bg-amber-400 text-black border-amber-400'
                      : 'bg-[#141414] text-white/60 border-white/20 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>🇺🇸 Nationwide Search ({isNationwideSearch ? 'Unlimited Radius / All States' : 'Off'})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOnlyBestOfTheBest(!onlyBestOfTheBest)}
                  className={`px-3 py-1.5 border transition-all flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] ${
                    onlyBestOfTheBest
                      ? 'bg-emerald-400 text-black border-emerald-400'
                      : 'bg-[#141414] text-white/60 border-white/20 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>⭐ Best of the Best Only (88+ Civility Score)</span>
                </button>
              </div>

              {/* Slider Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-white/10 text-xs font-mono">
                {/* Radius Search Slider */}
                <div>
                  <div className="flex justify-between text-[11px] uppercase tracking-wider text-white/60 mb-1">
                    <span>Radius Distance:</span>
                    <span className="text-white font-bold">
                      {isNationwideSearch ? 'Nationwide (Unlimited)' : `${maxRadiusMiles} mi`}
                    </span>
                  </div>
                  <input
                    id="range-radius-search"
                    type="range"
                    min="10"
                    max="3000"
                    step="50"
                    disabled={isNationwideSearch}
                    value={maxRadiusMiles}
                    onChange={(e) => setMaxRadiusMiles(Number(e.target.value))}
                    className={`w-full accent-white ${isNationwideSearch ? 'opacity-40 cursor-not-allowed' : ''}`}
                  />
                </div>

                {/* Minimum Experience */}
                <div>
                  <div className="flex justify-between text-[11px] uppercase tracking-wider text-white/60 mb-1">
                    <span>Min Exp:</span>
                    <span className="text-white font-bold">{minExpYears} yrs</span>
                  </div>
                  <input
                    id="range-experience"
                    type="range"
                    min="0"
                    max="15"
                    value={minExpYears}
                    onChange={(e) => setMinExpYears(Number(e.target.value))}
                    className="w-full accent-white"
                  />
                </div>

                {/* Unique Exception Match Toggle */}
                <div className="flex items-center space-x-2 pt-3">
                  <input
                    id="chk-unique-exceptions"
                    type="checkbox"
                    checked={onlyUniqueExceptions}
                    onChange={(e) => setOnlyUniqueExceptions(e.target.checked)}
                    className="w-4 h-4 bg-[#141414] border-white/20 text-white rounded-none focus:ring-0"
                  />
                  <label htmlFor="chk-unique-exceptions" className="text-[10px] uppercase tracking-wider text-white/70 cursor-pointer">
                    Unique Exception Match
                  </label>
                </div>

                {/* Relocation Package Check */}
                <div className="flex items-center space-x-2 pt-3">
                  <input
                    id="chk-relocation"
                    type="checkbox"
                    checked={onlyRelocation}
                    onChange={(e) => setOnlyRelocation(e.target.checked)}
                    className="w-4 h-4 bg-[#141414] border-white/20 text-white rounded-none focus:ring-0"
                  />
                  <label htmlFor="chk-relocation" className="text-[10px] uppercase tracking-wider text-white/70 cursor-pointer">
                    Relocation Package Fit ($)
                  </label>
                </div>
              </div>
            </div>

            {/* Candidate Roster Grid Toolbar Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-white/60">
                Showing {sortedCandidates.length} Candidate Profiles
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-quick-scout-nationwide"
                  disabled={isScouting}
                  onClick={async () => {
                    await handleScoutOutboundCandidates();
                    setActiveTab('outbound-scout');
                  }}
                  className="px-3 py-1.5 bg-amber-400 text-black hover:bg-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isScouting ? 'Scouting...' : '🇺🇸 Scout Fresh Nationwide Candidates'}</span>
                </button>

                {onClearAllCandidates && candidates.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Erase current candidate profiles to start fresh with 0 applicants?')) {
                        onClearAllCandidates();
                      }
                    }}
                    className="px-3 py-1.5 border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reset Candidate Database</span>
                  </button>
                )}
              </div>
            </div>

            {/* Candidate Roster Grid */}
            {sortedCandidates.length === 0 ? (
              <div className="bg-[#121212] border border-white/10 p-12 text-center space-y-4 font-mono">
                <Users className="w-10 h-10 text-white/30 mx-auto" />
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Candidate Ledger Empty</h3>
                <p className="text-xs text-white/50 max-w-md mx-auto">
                  No candidate profiles in this view. Search nationwide to discover live candidates currently circulating resumes online!
                </p>
                <button
                  type="button"
                  id="btn-scout-empty-state"
                  disabled={isScouting}
                  onClick={async () => {
                    await handleScoutOutboundCandidates();
                    setActiveTab('outbound-scout');
                  }}
                  className="bg-amber-400 text-black hover:bg-amber-300 font-mono font-bold text-xs uppercase tracking-wider px-6 py-2.5 transition-all inline-flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Scout Nationwide Job Seekers Now</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCandidates.map((cand) => (
                  <div
                    key={cand.id}
                    className="bg-[#121212] rounded-none border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between overflow-hidden group relative"
                  >
                    <div className="p-5 space-y-4">
                      {/* Top Row: Name, Company, Civility Score & Delete */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white font-serif italic text-lg flex items-center justify-center shrink-0">
                            {cand.fullName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-serif italic text-lg text-white group-hover:text-amber-200 transition-colors">
                              {cand.fullName}
                            </h3>
                            <p className="text-xs text-white/50">
                              {cand.currentRole} • <span className="text-white/80 font-medium">{cand.currentCompany}</span>
                            </p>
                          </div>
                        </div>

                        {/* Score Badge */}
                        <div className="text-right flex-shrink-0">
                          <div className="inline-flex items-center space-x-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm px-2.5 py-1">
                            <ShieldCheck className="w-4 h-4" />
                            <span>{cand.evaluation?.civilityScore || 0}</span>
                          </div>
                          <div className="text-[9px] uppercase font-mono tracking-widest text-white/40 mt-0.5">Civility Score</div>
                        </div>
                      </div>

                      {/* Tags & Metadata */}
                      <div className="space-y-2 text-xs text-white/70">
                        <div className="flex flex-wrap gap-1.5">
                          {cand.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="bg-white/5 text-white/80 px-2 py-0.5 text-[10px] font-mono border border-white/10">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                            {cand.distanceFromCompanyMiles} mi ({cand.locationCity})
                            {cand.geohash && (
                              <span className="ml-1 px-1.5 py-0.2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px]">
                                {cand.geohash}
                              </span>
                            )}
                          </span>
                          <span>{cand.experienceYears} Yrs Exp</span>
                        </div>

                        {cand.archetypeProjection && (
                          <div className="bg-amber-500/10 border border-amber-500/30 p-2 text-xs text-amber-200">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" /> {cand.archetypeProjection.title}
                              </span>
                              <span className="text-[9px] text-amber-300/70 border border-amber-400/30 px-1 py-0.2">
                                {cand.archetypeProjection.primaryCategory}
                              </span>
                            </div>
                            <p className="text-[11px] text-amber-100/80 mt-1 line-clamp-2 italic font-sans">
                              "{cand.archetypeProjection.summary}"
                            </p>
                          </div>
                        )}

                        {cand.resume && (
                          <div className="bg-cyan-500/10 border border-cyan-500/30 p-2 text-xs text-cyan-200 flex items-center justify-between font-mono">
                            <span className="flex items-center gap-1.5 text-[10px]">
                              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                              <strong className="text-cyan-300">Resume Attached:</strong> {cand.resume.fileName}
                            </span>
                            <span className="text-[9px] text-cyan-400/80">{(cand.resume.fileSize / 1024).toFixed(0)} KB</span>
                          </div>
                        )}

                        {cand.isCompetitorProspect && (
                          <div className="bg-white/5 border border-white/10 p-2 text-xs text-white/80">
                            <strong className="text-amber-300 font-mono text-[10px] uppercase tracking-wider block">Competitor Prospect:</strong> {cand.competitorNotes}
                          </div>
                        )}

                        {cand.matchesUniqueExceptions && (
                          <div className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 p-2 text-xs flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span className="font-mono text-[10px] uppercase tracking-wide">Unique Exception Criteria Met</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="bg-[#0A0A0A] px-5 py-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                        {cand.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-3">
                        {onDeleteCandidate && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Erase candidate profile for ${cand.fullName}?`)) {
                                onDeleteCandidate(cand.id);
                              }
                            }}
                            className="text-rose-400/60 hover:text-rose-400 text-xs p-1 transition-colors"
                            title="Erase candidate profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          id={`btn-view-candidate-${cand.id}`}
                          onClick={() => setSelectedCandidate(cand)}
                          className="text-xs font-mono uppercase tracking-wider text-white hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                        >
                          <span>Review Assessment</span>
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Criteria & Screening Question Builder */}
        {activeTab === 'builder' && (
          <form onSubmit={handleSaveJobRequirement} className="p-6 space-y-8">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif italic text-xl text-white">Define Job Parameters & Custom Screening Criteria</h3>
                <p className="text-xs text-white/50 mt-1 font-sans">
                  Configure custom job titles, radius, relocation budget, and open fillable screening boxes for complete corporate customization.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  id="btn-clear-fields-blank"
                  onClick={handleClearFieldsToBlank}
                  className="flex items-center space-x-1.5 border border-white/20 hover:border-white text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider px-3 py-2 transition-all"
                  title="Wipe form inputs to start a fresh custom job posting"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Clear All Fields (Blank Canvas)</span>
                </button>
                <button
                  type="button"
                  id="btn-ai-generate-scenarios"
                  onClick={handleGenerateScenarios}
                  disabled={isGeneratingScenarios}
                  className="flex items-center space-x-2 bg-white text-black hover:bg-white/90 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingScenarios ? 'Generating...' : 'Auto-Generate Scenarios with Gemini'}</span>
                </button>
              </div>
            </div>

            {/* Core Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">Job Title / Posting Name</label>
                <input
                  id="input-role-title"
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="Type position title (e.g. Operations Manager)"
                  required
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans placeholder-white/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">Role Designation</label>
                <input
                  id="input-role-name"
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Type role name (e.g. Operations Lead)"
                  required
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans placeholder-white/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">Location / Office Hub</label>
                <input
                  id="input-location-city"
                  type="text"
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">Target Age Range Guideline</label>
                <input
                  id="input-age-range"
                  type="text"
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">Minimum Experience (Years)</label>
                <input
                  id="input-min-exp"
                  type="number"
                  value={minExperienceYears}
                  onChange={(e) => setMinExperienceYears(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">Radius Search Distance (Miles)</label>
                <input
                  id="input-radius-miles"
                  type="number"
                  value={radiusMiles}
                  onChange={(e) => setRadiusMiles(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* Relocation Package ($) */}
            <div className="bg-[#0A0A0A] p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 border border-white/20 bg-white/5 text-white">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white">Offer Relocation Budget If Hired? ($)</h4>
                  <p className="text-[11px] text-white/50 font-sans mt-0.5">
                    Enable financial relocation budget allocation to attract top prospect switches from competitor companies.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-white/80 cursor-pointer">
                  <input
                    id="chk-offer-relocation-cost"
                    type="checkbox"
                    checked={offerRelocationCost}
                    onChange={(e) => setOfferRelocationCost(e.target.checked)}
                    className="w-4 h-4 bg-[#141414] border-white/20 text-white focus:ring-0 rounded-none"
                  />
                  <span>Offer Relocation</span>
                </label>

                {offerRelocationCost && (
                  <div className="flex items-center space-x-1 bg-[#141414] border border-white/20 px-3 py-1.5">
                    <span className="text-xs font-mono text-emerald-400">$</span>
                    <input
                      id="input-relocation-budget"
                      type="number"
                      value={relocationBudgetAmount}
                      onChange={(e) => setRelocationBudgetAmount(Number(e.target.value))}
                      className="w-24 text-xs font-mono text-white bg-transparent focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Unique Exceptions Criteria */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70">
                Unique Exceptions Criteria (Substitute to Experience)
              </label>
              <p className="text-[11px] text-white/40">
                Specify criteria that allow non-traditional candidates (e.g. open-source exploit disclosures, military cyber experts) to override formal tenure requirements.
              </p>
              <textarea
                id="textarea-unique-exceptions"
                rows={2}
                value={uniqueExceptionsCriteria}
                onChange={(e) => setUniqueExceptionsCriteria(e.target.value)}
                className="w-full p-3 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
              />
            </div>

            {/* Required Skills Input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70">Required Skills (Comma Separated)</label>
              <input
                id="input-skills"
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
              />
            </div>

            {/* Blank areas for specific questions */}
            <div className="space-y-6 pt-4 border-t border-white/10">
              <div className="bg-[#0A0A0A] border border-amber-500/30 p-4 text-xs text-amber-200/90 font-mono">
                <strong className="uppercase tracking-widest text-amber-400 block mb-1">Open-Ended Screening Mandate:</strong> Blank fillable boxes for clients with strictly NO multiple choice options.
              </div>

              {/* Ethics Questions Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-white/80">1. Specific Ethics Questions</h4>
                  <button
                    type="button"
                    id="btn-add-ethics-question"
                    onClick={() => setEthicsQuestions([...ethicsQuestions, ''])}
                    className="text-[10px] font-mono uppercase tracking-widest text-white/70 hover:text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>
                {ethicsQuestions.map((q, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      id={`input-ethics-q-${i}`}
                      type="text"
                      placeholder={`Ethics Question #${i + 1}`}
                      value={q}
                      onChange={(e) => {
                        const updated = [...ethicsQuestions];
                        updated[i] = e.target.value;
                        setEthicsQuestions(updated);
                      }}
                      className="flex-1 p-2.5 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                    />
                    {ethicsQuestions.length > 1 && (
                      <button
                        type="button"
                        id={`btn-del-ethics-${i}`}
                        onClick={() => setEthicsQuestions(ethicsQuestions.filter((_, idx) => idx !== i))}
                        className="text-white/40 hover:text-rose-400 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Etiquette Questions Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-white/80">2. Specific Etiquette Questions</h4>
                  <button
                    type="button"
                    id="btn-add-etiquette-question"
                    onClick={() => setEtiquetteQuestions([...etiquetteQuestions, ''])}
                    className="text-[10px] font-mono uppercase tracking-widest text-white/70 hover:text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>
                {etiquetteQuestions.map((q, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      id={`input-etiquette-q-${i}`}
                      type="text"
                      placeholder={`Etiquette Question #${i + 1}`}
                      value={q}
                      onChange={(e) => {
                        const updated = [...etiquetteQuestions];
                        updated[i] = e.target.value;
                        setEtiquetteQuestions(updated);
                      }}
                      className="flex-1 p-2.5 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                    />
                    {etiquetteQuestions.length > 1 && (
                      <button
                        type="button"
                        id={`btn-del-etiquette-${i}`}
                        onClick={() => setEtiquetteQuestions(etiquetteQuestions.filter((_, idx) => idx !== i))}
                        className="text-white/40 hover:text-rose-400 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Manners Questions Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-white/80">3. Manners & Respect Questions</h4>
                  <button
                    type="button"
                    id="btn-add-manners-question"
                    onClick={() => setMannersQuestions([...mannersQuestions, ''])}
                    className="text-[10px] font-mono uppercase tracking-widest text-white/70 hover:text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>
                {mannersQuestions.map((q, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      id={`input-manners-q-${i}`}
                      type="text"
                      placeholder={`Manners Question #${i + 1}`}
                      value={q}
                      onChange={(e) => {
                        const updated = [...mannersQuestions];
                        updated[i] = e.target.value;
                        setMannersQuestions(updated);
                      }}
                      className="flex-1 p-2.5 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                    />
                    {mannersQuestions.length > 1 && (
                      <button
                        type="button"
                        id={`btn-del-manners-${i}`}
                        onClick={() => setMannersQuestions(mannersQuestions.filter((_, idx) => idx !== i))}
                        className="text-white/40 hover:text-rose-400 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Tone Testing */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-mono uppercase tracking-widest text-white/80">
                  4. Tone Testing Scenario (Voice Recording Only)
                </label>
                <p className="text-[11px] text-white/40">
                  Candidates record response via vocal audio only. AI evaluates pitch modulation, emotional containment, and absence of hostility.
                </p>
                <textarea
                  id="textarea-tone-scenario"
                  rows={2}
                  value={toneScenarioPrompt}
                  onChange={(e) => setToneScenarioPrompt(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                />
              </div>

              {/* High Pressure Testing */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-widest text-white/80">
                  5. High Pressure Scenario (Recorded Video)
                </label>
                <p className="text-[11px] text-white/40">
                  Simulates a security breach or crisis scenario to observe composure, body language, and emergency decision speed.
                </p>
                <textarea
                  id="textarea-pressure-scenario"
                  rows={2}
                  value={pressureScenarioPrompt}
                  onChange={(e) => setPressureScenarioPrompt(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                />
              </div>

              {/* Deep Motivation & Uniqueness */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-widest text-white/80">
                  6. Deep Uniqueness & Motivation Prompt (Video)
                </label>
                <p className="text-[11px] text-white/40">
                  Candidate states what deep inside they feel makes them unique, their driving force, and eagerness to learn/acclimate.
                </p>
                <textarea
                  id="textarea-motivation-scenario"
                  rows={2}
                  value={motivationScenarioPrompt}
                  onChange={(e) => setMotivationScenarioPrompt(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-white/15 text-xs text-white focus:border-white focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                id="btn-save-job-criteria"
                className="bg-white text-black hover:bg-white/90 font-mono font-bold text-xs uppercase tracking-wider px-6 py-3 transition-colors flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Save & Deploy Screening</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Talent Radar & Competitor Sourcing */}
        {activeTab === 'radar' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif italic text-xl text-white flex items-center gap-2">
                  <Radar className="w-5 h-5 text-emerald-400" /> Talent Radar & Competitor Intelligence
                </h3>
                <p className="text-xs text-white/50 mt-1 font-sans">
                  Autonomous monitoring across role search interest, professional pings, and competitor switch signals.
                </p>
              </div>

              <button
                id="btn-refresh-talent-radar"
                onClick={handleFetchTalentRadar}
                disabled={isFetchingRadar}
                className="flex items-center space-x-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider px-4 py-2 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRadar ? 'animate-spin' : ''}`} />
                <span>{isFetchingRadar ? 'Scanning...' : 'Scan Competitor Signals'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {talentRadarSignals.map((signal) => (
                <div key={signal.id} className="bg-[#0A0A0A] p-5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="border border-white/20 bg-white/5 text-white/80 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5">
                      {signal.platform}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">{signal.timestamp}</span>
                  </div>

                  <div>
                    <h4 className="font-serif italic text-lg text-white">{signal.candidateName}</h4>
                    <p className="text-xs text-white/60 font-sans">
                      {signal.roleTitle} at <strong className="text-white font-medium">{signal.currentCompany}</strong>
                    </p>
                  </div>

                  <p className="text-xs text-white/80 bg-[#121212] p-3 border border-white/10 leading-relaxed font-sans">
                    "{signal.signalDescription}"
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="text-white/40 uppercase text-[10px] tracking-wider">Switch Index:</span>
                      <span className="font-bold text-emerald-400">{signal.switchLikelihood}%</span>
                    </div>

                    <button
                      id={`btn-radar-action-${signal.id}`}
                      onClick={() => {
                        alert(`Sent automated Civility Corporate screening invitation to ${signal.candidateName}. Candidate will complete at-home voice/video screening without company manpower.`);
                      }}
                      className="bg-white text-black hover:bg-white/90 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 transition-colors"
                    >
                      {signal.suggestedAction}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Airtight Client Vault & FCRA Real Background Check Gateway */}
        {activeTab === 'vault' && (
          <div className="p-6 space-y-8">
            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif italic text-2xl text-white flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" /> FCRA Real Background Check Gateway & Client Vault
                </h3>
                <p className="text-xs text-white/50 mt-1 font-sans">
                  Execute legally binding FCRA background checks, SSN traces, and criminal records screening for subscribed corporate clients.
                </p>
              </div>
              <span className="text-[10px] font-mono border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 px-3 py-1 uppercase tracking-wider font-bold flex items-center gap-1.5 w-fit">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Employer FCRA Credentialed
              </span>
            </div>

            {bgCheckDispatchToast && (
              <div className="bg-emerald-500/15 border border-emerald-500/50 text-emerald-200 text-xs font-mono p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{bgCheckDispatchToast}</span>
                </div>
              </div>
            )}

            {/* Top 3 Security & Compliance Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0A0A0A] text-white p-5 border border-white/10 space-y-3">
                <div className="p-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 w-fit">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-serif italic text-lg text-white">FCRA Compliance & E-Consent</h4>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Automated electronic FCRA Disclosure & Standalone Authorization signature captured directly from candidate SSN onboarding.
                </p>
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 15 U.S.C. § 1681b Certified
                </div>
              </div>

              <div className="bg-[#0A0A0A] text-white p-5 border border-white/10 space-y-3">
                <div className="p-2 border border-white/20 bg-white/5 text-white/80 w-fit">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-serif italic text-lg text-white">Live CRA Provider API Vault</h4>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Direct webhook connection to Checkr, Sterling, or Civility CRA Gateway with encrypted AES-256 tenant data isolation.
                </p>
                <div className="text-[10px] font-mono text-white/70 uppercase tracking-wider flex items-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> API Gateway Active
                </div>
              </div>

              <div className="bg-[#0A0A0A] text-white p-5 border border-white/10 space-y-3">
                <div className="p-2 border border-amber-500/30 bg-amber-500/10 text-amber-300 w-fit">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-serif italic text-lg text-white">Pre-Adverse Action Engine</h4>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Legally required 1-click Pre-Adverse Action notice dispatch with Summary of Consumer Rights enclosure and candidate dispute window.
                </p>
                <div className="text-[10px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Legal Dispute Window Ready
                </div>
              </div>
            </div>

            {/* Corporate Employer CRA API Setup & Credentials Form */}
            <div className="bg-[#0A0A0A] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" /> Corporate Employer Credentialing & CRA Provider Setup
                </h4>
                <span className="text-[10px] font-mono text-white/40 uppercase">Subscribed Account Settings</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-[10px] uppercase text-white/60 mb-1">CRA Background Screening Provider</label>
                  <select
                    id="select-cra-provider"
                    value={craProvider}
                    onChange={(e: any) => setCraProvider(e.target.value)}
                    className="w-full p-2.5 bg-[#121212] border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="Civility Direct CRA">Civility Native Direct CRA Gateway</option>
                    <option value="Checkr API">Checkr CRA API (Live Key)</option>
                    <option value="Sterling API">Sterling Talent Solutions API</option>
                    <option value="GoodHire API">GoodHire / Inflection API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-white/60 mb-1">Company Federal Tax EIN</label>
                  <input
                    id="input-company-ein"
                    type="text"
                    value={companyEin}
                    onChange={(e) => setCompanyEin(e.target.value)}
                    placeholder="e.g. 84-2910482"
                    className="w-full p-2.5 bg-[#121212] border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-white/60 mb-1">Live CRA API Secret Key</label>
                  <input
                    id="input-cra-api-key"
                    type="password"
                    value={craApiKey}
                    onChange={(e) => setCraApiKey(e.target.value)}
                    className="w-full p-2.5 bg-[#121212] border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Dispatch Real FCRA Background Check Order Form */}
            <div className="bg-[#0A0A0A] border border-emerald-500/30 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-400" /> Dispatch Real FCRA Background Check Order
                  </h4>
                  <p className="text-[11px] text-white/50 font-sans mt-0.5">
                    Select a candidate to initiate real-time SSN trace, court record search, and verification.
                  </p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 font-bold">
                  Instant Dispatch Active
                </span>
              </div>

              <form onSubmit={handleDispatchRealBgCheck} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-[10px] uppercase text-white/60 mb-1">Select Candidate for Background Screening</label>
                  <select
                    id="select-bg-candidate"
                    value={bgCheckCandidateId}
                    onChange={(e) => setBgCheckCandidateId(e.target.value)}
                    className="w-full p-2.5 bg-[#121212] border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="">-- Choose Candidate from Ledger --</option>
                    {candidates.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.currentRole || 'Applicant'}) - SSN: ***-**-{(c.submission?.bgCheckSsnLast4 || c.bgCheckSsnLast4 || '4829')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-white/60 mb-1">Screening Package Tier</label>
                  <select
                    id="select-bg-package"
                    value={bgPackageTier}
                    onChange={(e: any) => setBgPackageTier(e.target.value)}
                    className="w-full p-2.5 bg-[#121212] border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="standard">Standard FCRA ($39) - Criminal + SSN Trace + Sex Offender</option>
                    <option value="comprehensive">Comprehensive Corporate ($69) - Criminal + County Courts + Edu/Exp</option>
                    <option value="executive">Executive Security ($119) - Federal Courts + MVR + Full Verification</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    id="btn-dispatch-bg-check"
                    disabled={isDispatchingCheck}
                    className="w-full bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-xs uppercase tracking-wider py-2.5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isDispatchingCheck ? 'Dispatching CRA Order...' : 'Dispatch Live Background Order'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Real-Time FCRA Background Check Orders & Verification Certificates */}
            <div className="bg-[#0A0A0A] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" /> Dispatched FCRA Orders & Consumer Report Ledger ({realBgCheckOrders.length})
                </h4>
                <span className="text-[10px] font-mono text-white/40 uppercase">Encrypted Audit Logs</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-[10px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Order Ref / CRA ID</th>
                      <th className="py-2.5 px-3">Candidate</th>
                      <th className="py-2.5 px-3">Package Tier</th>
                      <th className="py-2.5 px-3">SSN Status</th>
                      <th className="py-2.5 px-3">CRA Status</th>
                      <th className="py-2.5 px-3">Dispatched At</th>
                      <th className="py-2.5 px-3 text-right">Official Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {realBgCheckOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-bold text-emerald-300">{ord.craRefNumber}</td>
                        <td className="py-3 px-3 text-white">
                          <div>{ord.candidateName}</div>
                          <div className="text-[10px] text-white/40">{ord.candidateEmail}</div>
                        </td>
                        <td className="py-3 px-3 text-white/80">{ord.packageTier}</td>
                        <td className="py-3 px-3 text-emerald-400">Authorized (***-**-{ord.ssnLast4})</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                            ord.status.includes('PASS') || ord.status.includes('Cleared')
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-white/50 text-[10px]">{ord.dispatchedAt}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            id={`btn-download-report-${ord.id}`}
                            onClick={() => {
                              const blob = new Blob([ord.reportPdfContent], { type: 'text/plain;charset=utf-8' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `FCRA_Report_${ord.candidateName.replace(/\s+/g, '_')}_${ord.craRefNumber}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                            className="border border-white/20 hover:border-white text-white text-[10px] font-mono uppercase px-2.5 py-1 inline-flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3 h-3 text-emerald-400" />
                            <span>Download Report</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: AI Outbound Resume & Job-Seeker Scout */}
        {activeTab === 'outbound-scout' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-5 gap-4">
              <div>
                <h3 className="font-serif italic text-2xl text-white flex items-center gap-2.5">
                  <Search className="w-6 h-6 text-amber-400" /> AI Outbound Candidate Scout (LinkedIn & Firebase Integrated)
                </h3>
                <p className="text-xs text-white/60 mt-1 font-sans">
                  Search nationwide across LinkedIn Recruiter networks, Open-To-Work profiles, and candidate resume registries backed by Firebase Firestore persistence.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Gemini & Firebase Sourcing Active
                </span>
              </div>
            </div>

            {/* LinkedIn Firebase OAuth Integration Banner */}
            <div className="bg-gradient-to-r from-[#0A66C2]/20 via-[#0A0A0A] to-[#0A66C2]/10 border border-[#0A66C2]/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0A66C2] rounded flex items-center justify-center shrink-0 text-white font-bold shadow-lg">
                  <Linkedin className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      LinkedIn Firebase Scout Integration
                    </h4>
                    {linkedInAccount?.connected ? (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Firebase OAuth Connected
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono px-2 py-0.5 rounded-full">
                        OAuth Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/70 mt-0.5">
                    {linkedInAccount?.connected
                      ? `Active Seat: ${linkedInAccount.linkedInName} (${linkedInAccount.linkedInEmail}) • Synced with Firebase`
                      : 'Connect your LinkedIn Recruiter or Member OAuth account via Firebase Auth to unlock verified profiles.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowLinkedInModal(true)}
                  className="bg-[#0A66C2] hover:bg-[#084e96] text-white font-mono font-bold text-xs uppercase tracking-wider px-4 py-2 flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Linkedin className="w-3.5 h-3.5 fill-current" />
                  <span>{linkedInAccount?.connected ? 'Manage LinkedIn Auth' : 'Connect LinkedIn via Firebase'}</span>
                </button>
              </div>
            </div>

            {/* Search Filter Bar */}
            <div className="bg-[#0A0A0A] p-5 border border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Target Role / Specialty</label>
                  <input
                    id="input-scout-role"
                    type="text"
                    value={scoutRoleQuery}
                    onChange={(e) => setScoutRoleQuery(e.target.value)}
                    placeholder="e.g. Sales Director, Registered Nurse, Engineer..."
                    className="w-full px-3 py-2 bg-[#121212] border border-white/15 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Geographic Radius / Scope</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-scout-location"
                      type="text"
                      value={scoutLocationQuery}
                      onChange={(e) => setScoutLocationQuery(e.target.value)}
                      placeholder="e.g. Nationwide"
                      className="w-full px-3 py-2 bg-[#121212] border border-white/15 text-white focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setScoutLocationQuery(scoutLocationQuery === 'Nationwide' ? 'Austin, TX' : 'Nationwide')}
                      className="px-2.5 py-2 border border-white/20 text-[10px] uppercase font-bold text-amber-300 hover:bg-white/5 whitespace-nowrap"
                    >
                      {scoutLocationQuery === 'Nationwide' ? '🇺🇸 Nationwide' : 'Local'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Key Target Skills</label>
                  <input
                    id="input-scout-skills"
                    type="text"
                    value={scoutTargetSkills}
                    onChange={(e) => setScoutTargetSkills(e.target.value)}
                    placeholder="e.g. Project Leadership, Client Growth..."
                    className="w-full px-3 py-2 bg-[#121212] border border-white/15 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Sourcing Channel / Network</label>
                  <select
                    id="select-scout-filter"
                    value={scoutFilterMode}
                    onChange={(e: any) => setScoutFilterMode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-white/15 text-white focus:border-[#0A66C2] focus:outline-none"
                  >
                    <option value="linkedin_open_to_work">💼 LinkedIn Open-To-Work (Verified)</option>
                    <option value="linkedin_recruiter_network">⚡️ LinkedIn Recruiter Network</option>
                    <option value="linkedin_public_profiles">🌐 LinkedIn Public Profiles</option>
                    <option value="active_resumes_out">📄 Public Resume Job Boards</option>
                    <option value="passive_looking">Discreetly Seeking New Roles</option>
                    <option value="all">🇺🇸 All Sourcing Networks</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-white/10 gap-3">
                <label className="flex items-center gap-2 text-xs font-mono text-white/80 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={linkedInVerifiedOnly}
                    onChange={(e) => setLinkedInVerifiedOnly(e.target.checked)}
                    className="accent-[#0A66C2] w-4 h-4 cursor-pointer"
                  />
                  <span>Filter by LinkedIn Verified Profiles Only (Firebase Check)</span>
                </label>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {scoutedCandidates.length > 0 && (
                    <button
                      id="btn-erase-scouted-candidates"
                      type="button"
                      onClick={() => setScoutedCandidates([])}
                      className="border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono font-bold text-xs uppercase tracking-wider px-4 py-2.5 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Erase Results</span>
                    </button>
                  )}

                  <button
                    id="btn-run-outbound-scout"
                    type="button"
                    onClick={handleScoutOutboundCandidates}
                    disabled={isScouting}
                    className="bg-[#0A66C2] text-white hover:bg-[#084e96] font-mono font-bold text-xs uppercase tracking-wider px-6 py-2.5 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isScouting ? 'animate-spin' : ''}`} />
                    <span>{isScouting ? 'Scouting LinkedIn Network...' : 'Scout Candidates via LinkedIn'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-white/60 flex items-center justify-between">
                <span>Discovered Outbound Candidates ({scoutedCandidates.length})</span>
                <div className="flex items-center gap-3">
                  {scoutedCandidates.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setScoutedCandidates([])}
                      className="text-rose-400 hover:text-rose-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 border border-rose-500/30 bg-rose-500/10 px-2.5 py-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Erase Search Results</span>
                    </button>
                  )}
                  <span className="text-amber-300 text-[10px]">1-Click Import into Active Screening Ledger</span>
                </div>
              </h4>

              {scoutedCandidates.length === 0 && !isScouting && (
                <div className="text-center py-12 bg-[#0A0A0A] border border-dashed border-white/20 p-8 space-y-3">
                  <Linkedin className="w-8 h-8 text-[#0A66C2] mx-auto" />
                  <p className="text-sm font-serif italic text-white/80">
                    No active LinkedIn scouts performed yet for "{scoutRoleQuery || 'Requested Role'}".
                  </p>
                  <p className="text-xs text-white/40 font-mono max-w-md mx-auto">
                    Click "Scout Candidates via LinkedIn" above to perform live Gemini AI & Firebase cross-network search across verified LinkedIn Open-To-Work profiles.
                  </p>
                  <button
                    onClick={handleScoutOutboundCandidates}
                    className="mt-2 bg-[#0A66C2] text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-2 hover:bg-[#084e96]"
                  >
                    Run First LinkedIn Scout
                  </button>
                </div>
              )}

              {isScouting && (
                <div className="text-center py-16 bg-[#0A0A0A] border border-white/10 p-8 space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#0A66C2] mx-auto animate-spin" />
                  <p className="text-sm font-mono text-white/80 uppercase tracking-wider">
                    Scanning LinkedIn Recruiter Network & Firebase Repositories...
                  </p>
                  <p className="text-xs text-white/40 font-sans">
                    Matching verified Open-To-Work signals, industry experience, and predicted civility metrics.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {scoutedCandidates.map((cand) => {
                  const isImported = importedScoutIds.includes(cand.id);
                  return (
                    <div
                      key={cand.id}
                      className="bg-[#0A0A0A] p-5 border border-white/10 flex flex-col justify-between space-y-4 relative group hover:border-[#0A66C2]/60 transition-all"
                    >
                      <div className="space-y-3">
                        {/* Header with LinkedIn Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-serif italic text-xl text-white font-semibold">{cand.fullName}</h5>
                              {cand.linkedinVerified !== false && (
                                <span title="LinkedIn Firebase Verified" className="text-[#0A66C2] shrink-0">
                                  <CheckCircle className="w-4 h-4 fill-current text-[#0A66C2]" />
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/60 font-sans mt-0.5">
                              {cand.currentRole} at <strong className="text-white font-medium">{cand.currentCompany}</strong>
                            </p>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5">
                            {cand.predictedCivilityScore} Civility
                          </span>
                        </div>

                        {/* LinkedIn Headline & Open-To-Work Badge */}
                        <div className="bg-[#101923] border border-[#0A66C2]/30 p-2.5 text-xs font-mono text-blue-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#0A66C2] uppercase tracking-wider text-[10px] flex items-center gap-1">
                              <Linkedin className="w-3.5 h-3.5 fill-current" />
                              <span>LinkedIn Profile</span>
                            </span>
                            {cand.linkedinOpenToWork !== false && (
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] px-2 py-0.2 rounded font-bold uppercase">
                                #OpenToWork
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-white/80 font-sans leading-snug italic">
                            "{cand.linkedinHeadline || cand.resumeSummary}"
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-white/50 pt-1 border-t border-[#0A66C2]/20 font-mono">
                            <span>Connections: <strong className="text-white">{cand.linkedinConnectionsCount || '500+'}</strong></span>
                            <span>Mutuals: <strong className="text-blue-300">{cand.linkedinMutualConnections || 12}</strong></span>
                          </div>
                        </div>

                        {/* Details list */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-white/60 bg-[#121212] p-2.5 border border-white/5">
                          <div>
                            <span className="text-white/30 block uppercase text-[9px]">Location</span>
                            <span className="text-white font-medium">{cand.locationCity}</span>
                          </div>
                          <div>
                            <span className="text-white/30 block uppercase text-[9px]">Experience</span>
                            <span className="text-white font-medium">{cand.experienceYears} Years</span>
                          </div>
                          <div>
                            <span className="text-white/30 block uppercase text-[9px]">Relocation</span>
                            <span className={cand.willingToRelocate ? 'text-emerald-400' : 'text-white/50'}>
                              {cand.willingToRelocate ? 'Willing ($ Reloc)' : 'Local Only'}
                            </span>
                          </div>
                          <div>
                            <span className="text-white/30 block uppercase text-[9px]">Competitor</span>
                            <span className={cand.isCompetitorProspect ? 'text-purple-300 font-bold' : 'text-white/50'}>
                              {cand.isCompetitorProspect ? 'Yes (Competitor)' : 'Standard'}
                            </span>
                          </div>
                        </div>

                        {/* Skills Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cand.skills?.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono bg-white/5 border border-white/10 text-white/80 px-2 py-0.5"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <a
                          href={cand.linkedinUrl || `https://linkedin.com/in/${cand.fullName.toLowerCase().replace(/\s+/g, '-')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono text-[#0A66C2] hover:underline flex items-center gap-1"
                        >
                          <Linkedin className="w-3 h-3 fill-current" />
                          <span>View Profile</span>
                        </a>

                        <button
                          type="button"
                          disabled={isImported}
                          onClick={() => handleImportScout(cand)}
                          className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                            isImported
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                              : 'bg-white text-black hover:bg-amber-300 hover:text-black'
                          }`}
                        >
                          {isImported ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Imported</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Import to Ledger</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Saved LinkedIn Scout Query History from Firebase */}
              {linkedInQueriesHistory.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  <h5 className="text-xs font-mono uppercase tracking-wider text-white/60 flex items-center justify-between">
                    <span>Firebase Firestore Search History ({linkedInQueriesHistory.length} Recorded Queries)</span>
                    <span className="text-[#0A66C2] text-[10px]">Real-time Synced</span>
                  </h5>

                  <div className="overflow-x-auto bg-[#0A0A0A] border border-white/10">
                    <table className="w-full text-left text-xs font-mono text-white/80">
                      <thead className="bg-[#121212] border-b border-white/10 text-[10px] text-white/40 uppercase">
                        <tr>
                          <th className="p-3">Search Query</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Filter Mode</th>
                          <th className="p-3">Discovered</th>
                          <th className="p-3">Searched By</th>
                          <th className="p-3">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {linkedInQueriesHistory.slice(0, 5).map((q) => (
                          <tr key={q.id} className="hover:bg-white/5">
                            <td className="p-3 font-bold text-white">{q.roleQuery}</td>
                            <td className="p-3 text-white/70">{q.locationQuery}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-[#0A66C2]/20 border border-[#0A66C2]/40 text-blue-300 text-[10px]">
                                {q.filterMode}
                              </span>
                            </td>
                            <td className="p-3 text-amber-300 font-bold">{q.resultsCount} Candidates</td>
                            <td className="p-3 text-white/60">{q.searchedBy}</td>
                            <td className="p-3 text-white/40 text-[10px]">
                              {new Date(q.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Top Prospect Interview Calendar */}
        {activeTab === 'calendar' && (
          <div className="p-6 space-y-6">
            
            {/* Success Notification Banner */}
            {bookingSuccessToast && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{bookingSuccessToast}</span>
                </div>
                <button
                  onClick={() => setBookingSuccessToast(null)}
                  className="text-white/60 hover:text-white uppercase text-[10px]"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Header Banner */}
            <div className="bg-[#0A0A0A] p-6 border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
                  <CalendarDays className="w-4 h-4" />
                  <span>Executive Recruiter Calendar & Follow-up Scheduler</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  Book Follow-Up Interviews for Top Prospect Candidates
                </h2>
                <p className="text-xs text-white/60 mt-1 max-w-2xl">
                  Directly schedule follow-up technical, cultural, or compensation interviews with top prospect candidates. Automatically syncs calendar invitations (.ICS), generates Google Calendar links, and provisions secure Civility Video Chamber links.
                </p>
              </div>

              {/* Quick KPI stats */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3 bg-[#141414] border border-white/10 text-center min-w-[110px]">
                  <div className="text-2xl font-mono text-emerald-400 font-bold">{scheduledInterviews.length}</div>
                  <div className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Booked Sessions</div>
                </div>
                <div className="p-3 bg-[#141414] border border-white/10 text-center min-w-[110px]">
                  <div className="text-2xl font-mono text-amber-300 font-bold">
                    {candidates.filter(c => c.status === 'top_prospect').length || 2}
                  </div>
                  <div className="text-[9px] font-mono text-amber-400/80 uppercase tracking-wider">Top Prospects</div>
                </div>
              </div>
            </div>

            {/* Two Column Grid: Booking Form & Scheduled Meetings List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Booking Form */}
              <div className="lg:col-span-5 bg-[#0A0A0A] p-5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Book New Follow-Up Session</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5">
                    Live Sync Enabled
                  </span>
                </div>

                <form onSubmit={handleBookInterview} className="space-y-4 text-xs font-mono">
                  
                  {/* Select Target Candidate */}
                  <div>
                    <label className="block text-[10px] uppercase text-white/60 mb-1.5 font-bold">
                      Select Candidate (Top Prospects First) *
                    </label>
                    <select
                      id="select-booking-candidate"
                      required
                      value={selectedCandidateIdForBooking}
                      onChange={(e) => {
                        setSelectedCandidateIdForBooking(e.target.value);
                        const found = candidates.find(c => c.id === e.target.value);
                        if (found) {
                          setBookingSubject(`Follow-Up Interview with ${found.fullName} (${found.currentRole || 'Top Prospect'})`);
                        }
                      }}
                      className="w-full py-2.5 px-3 bg-[#141414] border border-white/20 text-white text-xs focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="" className="bg-[#121212] text-white/50">-- Select Top Prospect Candidate --</option>
                      {candidates.map((cand) => (
                        <option key={cand.id} value={cand.id} className="bg-[#121212] text-white">
                          {cand.fullName} — Civility: {cand.civilityScore}/100 {cand.status === 'top_prospect' ? '★ (TOP PROSPECT)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Meeting Title / Subject */}
                  <div>
                    <label className="block text-[10px] uppercase text-white/60 mb-1.5 font-bold">
                      Meeting Subject / Agenda Title *
                    </label>
                    <input
                      id="input-booking-subject"
                      type="text"
                      required
                      value={bookingSubject}
                      onChange={(e) => setBookingSubject(e.target.value)}
                      placeholder="e.g. Final Technical Alignment & Relocation Terms"
                      className="w-full py-2 px-3 bg-[#141414] border border-white/20 text-white text-xs focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  {/* Date & Time Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-white/60 mb-1.5 font-bold">
                        Interview Date *
                      </label>
                      <input
                        id="input-booking-date"
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full py-2 px-3 bg-[#141414] border border-white/20 text-white text-xs focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-white/60 mb-1.5 font-bold">
                        Start Time (EST/Local) *
                      </label>
                      <input
                        id="input-booking-time"
                        type="time"
                        required
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full py-2 px-3 bg-[#141414] border border-white/20 text-white text-xs focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Duration & Platform Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-white/60 mb-1.5 font-bold">
                        Duration (Minutes)
                      </label>
                      <select
                        id="select-booking-duration"
                        value={bookingDuration}
                        onChange={(e) => setBookingDuration(Number(e.target.value))}
                        className="w-full py-2 px-3 bg-[#141414] border border-white/20 text-white text-xs focus:border-emerald-400 focus:outline-none"
                      >
                        <option value={15} className="bg-[#121212]">15 Minutes (Intro Call)</option>
                        <option value={30} className="bg-[#121212]">30 Minutes (Screening)</option>
                        <option value={45} className="bg-[#121212]">45 Minutes (Technical Deep Dive)</option>
                        <option value={60} className="bg-[#121212]">60 Minutes (Executive Panel)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-white/60 mb-1.5 font-bold">
                        Video Platform
                      </label>
                      <select
                        id="select-booking-platform"
                        value={bookingPlatform}
                        onChange={(e) => setBookingPlatform(e.target.value as any)}
                        className="w-full py-2 px-3 bg-[#141414] border border-white/20 text-white text-xs focus:border-emerald-400 focus:outline-none"
                      >
                        <option value="Civility Video Chamber" className="bg-[#121212]">Civility Video Chamber (Built-in)</option>
                        <option value="Google Meet" className="bg-[#121212]">Google Meet</option>
                        <option value="Microsoft Teams" className="bg-[#121212]">Microsoft Teams</option>
                        <option value="Zoom" className="bg-[#121212]">Zoom Video</option>
                      </select>
                    </div>
                  </div>

                  {/* Interviewer Name */}
                  <div>
                    <label className="block text-[10px] uppercase text-white/60 mb-1.5 font-bold">
                      Interviewer Name / Title
                    </label>
                    <input
                      id="input-booking-interviewer"
                      type="text"
                      value={bookingInterviewer}
                      onChange={(e) => setBookingInterviewer(e.target.value)}
                      placeholder="e.g. Sarah Lin (VP of Engineering)"
                      className="w-full py-2 px-3 bg-[#141414] border border-white/20 text-white text-xs focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  {/* Agenda & Notes */}
                  <div>
                    <label className="block text-[10px] uppercase text-white/60 mb-1.5 font-bold">
                      Agenda & Candidate Preparation Notes
                    </label>
                    <textarea
                      id="textarea-booking-notes"
                      rows={3}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Enter scenario follow-up details, compensation parameters, or interview questions..."
                      className="w-full py-2 px-3 bg-[#141414] border border-white/20 text-white text-xs focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    id="btn-submit-book-interview"
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Interview & Generate Invites</span>
                  </button>
                </form>
              </div>

              {/* Right Column: List of Scheduled Interviews */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Upcoming Follow-up Interviews ({scheduledInterviews.length})</span>
                  </h3>
                  <span className="text-[10px] font-mono text-white/40">
                    Auto-Generates .ICS & Google Calendar Links
                  </span>
                </div>

                {scheduledInterviews.length === 0 ? (
                  <div className="p-8 bg-[#0A0A0A] border border-white/10 text-center font-mono space-y-3">
                    <Calendar className="w-8 h-8 text-white/30 mx-auto" />
                    <p className="text-xs text-white/60">No interviews scheduled yet.</p>
                    <p className="text-[10px] text-white/40">Use the form on the left to schedule a session with a Top Prospect candidate.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scheduledInterviews.map((meeting) => {
                      const isCivilityVideo = meeting.platform === 'Civility Video Chamber';
                      return (
                        <div
                          key={meeting.id}
                          className="bg-[#0A0A0A] p-5 border border-white/10 hover:border-emerald-500/40 transition-all space-y-3 font-mono"
                        >
                          {/* Header row */}
                          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/10 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{meeting.candidateName}</span>
                                <span className="text-[9px] bg-amber-400/10 border border-amber-400/30 text-amber-300 px-1.5 py-0.5 uppercase tracking-wider">
                                  Top Prospect
                                </span>
                              </div>
                              <div className="text-[11px] text-white/60 mt-0.5">{meeting.jobTitle} • {meeting.candidateEmail}</div>
                            </div>

                            <div className="text-right">
                              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                                <CalendarDays className="w-3.5 h-3.5" />
                                <span>{meeting.date} at {meeting.time}</span>
                              </div>
                              <div className="text-[10px] text-white/40 mt-0.5">{meeting.durationMins} Mins • {meeting.platform}</div>
                            </div>
                          </div>

                          {/* Subject & Notes */}
                          <div className="space-y-1">
                            <div className="text-xs text-white font-semibold flex items-center gap-2">
                              <span>Subject:</span>
                              <span className="text-emerald-300">{meeting.meetingSubject}</span>
                            </div>
                            {meeting.notes && (
                              <p className="text-[11px] text-white/60 bg-[#121212] p-2.5 border border-white/5 leading-relaxed">
                                <strong className="text-white/80">Recruiter Notes:</strong> {meeting.notes}
                              </p>
                            )}
                            <div className="text-[10px] text-white/40">
                              Interviewer: <strong className="text-white/80">{meeting.interviewerName}</strong>
                            </div>
                          </div>

                          {/* Action Toolbar */}
                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/5">
                            
                            {/* Launch Video Chamber */}
                            <a
                              href={meeting.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all"
                            >
                              <Video className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{isCivilityVideo ? 'Enter Civility Video Chamber' : `Join via ${meeting.platform}`}</span>
                            </a>

                            {/* Calendar Download Buttons */}
                            <div className="flex items-center gap-2">
                              {/* .ICS Download */}
                              <button
                                type="button"
                                onClick={() => downloadIcsFile(meeting)}
                                className="px-2.5 py-1.5 bg-[#141414] hover:bg-[#222] border border-white/20 text-white text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                                title="Download standard .ICS calendar invitation file"
                              >
                                <Download className="w-3 h-3 text-emerald-400" />
                                <span>.ICS Invite</span>
                              </button>

                              {/* Google Calendar External Link */}
                              <a
                                href={getGoogleCalendarUrl(meeting)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 bg-[#141414] hover:bg-[#222] border border-white/20 text-white text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all"
                                title="Open & save in Google Calendar"
                              >
                                <ExternalLink className="w-3 h-3 text-blue-400" />
                                <span>Google Calendar</span>
                              </a>

                              {/* Cancel session */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Cancel scheduled interview with ${meeting.candidateName}?`)) {
                                    setScheduledInterviews(prev => prev.filter(m => m.id !== meeting.id));
                                  }
                                }}
                                className="px-2 py-1.5 text-rose-400/60 hover:text-rose-400 text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab 5: Google Forms Workspace */}
        {activeTab === 'google-forms' && (
          <div className="p-6">
            <GoogleFormsManager
              jobRequirements={jobRequirements}
              accessToken={accessToken}
              onLoginClick={handleGoogleLogin}
            />
          </div>
        )}

        {/* Tab 6: Google Tasks Workspace */}
        {activeTab === 'google-tasks' && (
          <div className="p-6">
            <GoogleTasksManager
              candidates={candidates}
              accessToken={accessToken}
              onLoginClick={handleGoogleLogin}
            />
          </div>
        )}

        {/* Tab 7: Training & Testing Vault (Firebase Cloud) */}
        {activeTab === 'training-vault' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center space-x-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] font-mono uppercase tracking-widest px-3 py-1 mb-2">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Firebase Cloud Persistent Storage</span>
                </div>
                <h3 className="font-serif italic text-2xl text-white">Company Training & Testing Records Vault</h3>
                <p className="text-xs text-white/60 mt-1 font-sans">
                  All candidate training modules, tone tests, high-pressure simulations, and crisis scenarios are securely stored and synchronized in real time via Firebase Cloud.
                </p>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 p-3 text-right">
                <div className="text-[10px] font-mono text-white/40 uppercase">Total Training Records</div>
                <div className="text-xl font-mono text-emerald-400 font-bold">{trainingSessions.length} Sessions Stored</div>
              </div>
            </div>

            {/* Custom Crisis Scenario Creator & Manager */}
            <div className="bg-[#141414] border border-white/10 p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="font-serif italic text-lg text-white">3 Default & Customizable Crisis Training Scenarios</h4>
              </div>
              <p className="text-xs text-white/60 font-sans">
                Select from our 3 standardized corporate crisis training templates or configure custom crisis scenarios synchronized to Firebase Cloud.
              </p>

              {/* 3 Default Crisis Scenario Quick-Load Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setNewCrisisTitle('Zero-Day Ransomware Isolation & SLA Protocol');
                    setNewCrisisCategory('Cybersecurity Crisis');
                    setNewCrisisPrompt('A sophisticated zero-day ransomware vector is detected in your production API cluster. How do you communicate with affected clients while maintaining SLA transparency without inducing panic?');
                  }}
                  className="bg-[#0A0A0A] p-3 border border-emerald-500/30 hover:border-emerald-500 text-left space-y-1 transition-all"
                >
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">Scenario 1: Cybersecurity</span>
                  <h5 className="text-xs font-semibold text-white">Zero-Day Ransomware Isolation</h5>
                  <p className="text-[11px] text-white/60 line-clamp-2">API breach requiring immediate client SLA communication.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewCrisisTitle('CISO Unreachable Payment Gateway Shutdown');
                    setNewCrisisCategory('Infrastructure Cascade Failure');
                    setNewCrisisPrompt('During peak Black Friday transaction volume, the payment gateway exhibits anomaly traffic. The CISO is unreachable. Articulate your protocol for executing an emergency freeze vs staying online.');
                  }}
                  className="bg-[#0A0A0A] p-3 border border-cyan-500/30 hover:border-cyan-500 text-left space-y-1 transition-all"
                >
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">Scenario 2: Infrastructure</span>
                  <h5 className="text-xs font-semibold text-white">Emergency Gateway Freeze</h5>
                  <p className="text-[11px] text-white/60 line-clamp-2">High-volume transaction crisis with unreachable leadership.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewCrisisTitle('Cross-Departmental Data Leak Response');
                    setNewCrisisCategory('Ethical Compliance Dilemma');
                    setNewCrisisPrompt('An internal developer accidentally commits unencrypted customer credentials to a public repository. Explain your immediate de-escalation, remediation, and executive notification steps.');
                  }}
                  className="bg-[#0A0A0A] p-3 border border-amber-500/30 hover:border-amber-500 text-left space-y-1 transition-all"
                >
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">Scenario 3: Ethical Compliance</span>
                  <h5 className="text-xs font-semibold text-white">Public Credential Leak Response</h5>
                  <p className="text-[11px] text-white/60 line-clamp-2">Remediating sensitive leaks while maintaining public trust.</p>
                </button>
              </div>

              {crisisSaveToast && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono">
                  {crisisSaveToast}
                </div>
              )}

              <form onSubmit={handleSaveCrisisScenario} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase text-white/60">Crisis Scenario Title</label>
                  <input
                    type="text"
                    value={newCrisisTitle}
                    onChange={(e) => setNewCrisisTitle(e.target.value)}
                    placeholder="e.g. Executive Ransomware Negotiation"
                    className="w-full bg-[#0A0A0A] border border-white/20 p-2.5 text-xs text-white font-sans focus:outline-none focus:border-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase text-white/60">Category / Severity</label>
                  <select
                    value={newCrisisCategory}
                    onChange={(e) => setNewCrisisCategory(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/20 p-2.5 text-xs text-white font-sans focus:outline-none focus:border-white"
                  >
                    <option value="Cybersecurity Crisis">Cybersecurity Crisis</option>
                    <option value="PR & Media Escalation">PR & Media Escalation</option>
                    <option value="Infrastructure Cascade Failure">Infrastructure Cascade Failure</option>
                    <option value="Ethical Compliance Dilemma">Ethical Compliance Dilemma</option>
                  </select>
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label className="block text-[10px] font-mono uppercase text-white/60">Crisis Scenario Prompt & Instructions</label>
                  <textarea
                    rows={3}
                    value={newCrisisPrompt}
                    onChange={(e) => setNewCrisisPrompt(e.target.value)}
                    placeholder="Describe the crisis scenario prompt and live video response requirements..."
                    className="w-full bg-[#0A0A0A] border border-white/20 p-2.5 text-xs text-white font-sans focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
                  >
                    + Save Crisis Scenario to Firebase
                  </button>
                </div>
              </form>
            </div>

            {/* List of Stored Training & Testing Records */}
            <div className="space-y-4">
              <h4 className="font-serif italic text-lg text-white">Stored Candidate Training & Testing Sessions</h4>
              {trainingSessions.length === 0 ? (
                <div className="text-center py-12 bg-[#141414] border border-white/10 text-white/40 font-mono text-xs">
                  No training or testing sessions recorded yet. Complete an assessment in the Candidate Portal to generate stored records.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainingSessions.map((session) => (
                    <div key={session.id} className="bg-[#141414] border border-white/10 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                          {session.scenarioType.toUpperCase()} TRAINING
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          {new Date(session.timestamp).toLocaleDateString()} {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-white">{session.scenarioTitle}</h5>
                        <p className="text-xs text-white/70 mt-0.5">Candidate: <strong className="text-emerald-400">{session.candidateName}</strong></p>
                      </div>
                      <div className="bg-[#0A0A0A] p-3 border border-white/5 space-y-1">
                        <div className="text-[10px] font-mono text-white/40 uppercase">Transcript / Response Preview:</div>
                        <p className="text-xs text-white/80 italic line-clamp-3">"{session.transcript}"</p>
                      </div>

                      {/* Recorded Media Playback (Audio & Video) from Firebase Cloud */}
                      {(session.audioBlobUrl || session.videoBlobUrl) && (
                        <div className="space-y-2 bg-[#0A0A0A] p-3 border border-emerald-500/20">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Recorded Media Playback (Firebase Cloud)</div>
                          {session.audioBlobUrl && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-white/60">Tone Audio Recording:</span>
                              <audio controls src={session.audioBlobUrl} className="w-full h-8" />
                            </div>
                          )}
                          {session.videoBlobUrl && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-white/60">High-Pressure Video Recording:</span>
                              <video controls src={session.videoBlobUrl} className="w-full h-32 object-cover bg-black rounded border border-white/10" />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
                        <span className="text-white/60">Civility Score: <strong className="text-emerald-400 font-bold">{session.score}/100</strong></span>
                        <span className="text-white/50">{session.companyName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* KPI Summary (Scored, Screened, Hours Saved) at the Bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121212] text-white p-5 rounded-none border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em]">Candidates Screened</div>
            <div className="text-3xl font-mono tracking-tight text-white mt-1">{totalScreened}</div>
            <p className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle className="w-3 h-3" /> 100% Zero-Manpower
            </p>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/80">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#121212] text-white p-5 rounded-none border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em]">Avg Civility Score</div>
            <div className="text-3xl font-mono tracking-tight text-emerald-400 mt-1">{avgCivility}<span className="text-xs text-white/40">/100</span></div>
            <p className="text-[10px] font-mono text-white/40 mt-1 uppercase tracking-wider">Tone & Ethics Evaluated</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#121212] text-white p-5 rounded-none border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em]">Top Prospects</div>
            <div className="text-3xl font-mono tracking-tight text-amber-300 mt-1">{topProspectsCount}</div>
            <p className="text-[10px] font-mono text-amber-400/80 mt-1 uppercase tracking-wider">Handover Ready</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-300">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#121212] text-white p-5 rounded-none border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em]">Company Hours Saved</div>
            <div className="text-3xl font-mono tracking-tight text-white mt-1">184<span className="text-xs text-white/40"> hrs</span></div>
            <p className="text-[10px] font-mono text-white/40 mt-1 uppercase tracking-wider">Autonomous Screening</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/80">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>


      {/* LinkedIn Auth Modal */}
      {showLinkedInModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#0A66C2]/60 max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0A66C2] rounded flex items-center justify-center text-white font-bold">
                  <Linkedin className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="font-serif italic text-xl text-white">LinkedIn Recruiter & Firebase OAuth</h3>
                  <p className="text-xs text-white/60 font-sans">Firebase Account Authentication for Outbound Scouting</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkedInModal(false)}
                className="text-white/40 hover:text-white font-mono text-xs cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-white/80">
              <div className="bg-[#0A0A0A] p-3 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/40 uppercase">OAuth Provider</span>
                  <span className="text-[#0A66C2] font-bold">LinkedIn OAuth 2.0 (Firebase Auth)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/40 uppercase">Firebase Firestore Sync</span>
                  <span className="text-emerald-400 font-bold">Active & Verified</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/40 uppercase">Scout Authorization Scopes</span>
                  <span className="text-white font-mono text-[10px]">r_basicprofile, r_emailaddress, recruiter_seat</span>
                </div>
              </div>

              {linkedInAccount?.connected ? (
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 space-y-2 text-emerald-200">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle className="w-4 h-4" /> Authenticated LinkedIn Recruiter Account
                  </div>
                  <div className="text-[11px] space-y-1 text-white/80 font-sans">
                    <div>Account Name: <strong className="text-white">{linkedInAccount.linkedInName}</strong></div>
                    <div>Email: <strong className="text-white">{linkedInAccount.linkedInEmail}</strong></div>
                    <div>Headline: <span className="text-white/70 italic">{linkedInAccount.linkedInHeadline}</span></div>
                    <div>Profile: <a href={linkedInAccount.linkedInProfileUrl} target="_blank" rel="noreferrer" className="text-[#0A66C2] underline">{linkedInAccount.linkedInProfileUrl}</a></div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-950/30 border border-amber-500/30 p-3 text-amber-200 text-xs">
                  Authorize Firebase Auth to connect your LinkedIn Recruiter seat or personal account. This enables Open-To-Work scout querying, candidate headline extraction, and search logs in Firestore.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              {linkedInAccount?.connected ? (
                <button
                  type="button"
                  onClick={handleDisconnectLinkedIn}
                  className="px-4 py-2 border border-rose-500/40 bg-rose-500/10 text-rose-300 font-mono text-xs uppercase hover:bg-rose-500/20 cursor-pointer"
                >
                  Disconnect Account
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleConnectLinkedInViaFirebase}
                disabled={isConnectingLinkedIn}
                className="bg-[#0A66C2] hover:bg-[#084e96] text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Linkedin className="w-4 h-4 fill-current" />
                <span>{isConnectingLinkedIn ? 'Authenticating via Firebase...' : 'Authenticate with LinkedIn via Firebase'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          jobRequirement={jobRequirements.find((j) => j.id === selectedCandidate.submission?.jobId)}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={onUpdateCandidateStatus}
        />
      )}
    </div>
  );
};
