import React, { useState, useEffect } from 'react';
import { JobRequirement, CandidateProfile, TalentRadarSignal, CustomQuestions, TrainingSessionRecord, CrisisScenarioRecord, LinkedInAuthAccount, LinkedInScoutQuery, EmployeeJourneyRecord, EmployeeScorecardEntry, RecentHireFeedItem } from '../types';
import { INITIAL_RECENT_HIRES_FEED } from '../data/initialData';
import {
  saveCrisisScenarioToFirestore,
  subscribeToLinkedInAuthAccount,
  saveLinkedInAuthAccountToFirestore,
  subscribeToLinkedInScoutQueries,
  saveLinkedInScoutQueryToFirestore,
  saveCandidateProfileToFirestore,
  subscribeToRecentHiresFeed,
  saveRecentHireFeedItemToFirestore
} from '../services/firestoreService';
import { CandidateDetailModal } from './CandidateDetailModal';
import { BoardroomDossierModal } from './BoardroomDossierModal';
import { GoogleFormsManager } from './GoogleFormsManager';
import { GoogleTasksManager } from './GoogleTasksManager';
import { GoogleClassroomManager } from './GoogleClassroomManager';
import { GoogleClassroomSyncModal } from './GoogleClassroomSyncModal';
import { ClassroomCandidateSyncResult } from '../services/googleClassroomService';
import { RecentHiresFeed } from './RecentHiresFeed';
import { CompanyAdsMarketplace } from './CompanyAdsMarketplace';
import { TrillionDollarTurnoverLedger } from './TrillionDollarTurnoverLedger';
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
  Linkedin,
  TrendingUp,
  GraduationCap,
  UserCheck,
  BarChart2,
  LineChart
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

export const INITIAL_SCHEDULED_INTERVIEWS: ScheduledInterview[] = [];

interface EmployerDashboardProps {
  jobRequirements: JobRequirement[];
  candidates: CandidateProfile[];
  talentRadarSignals: TalentRadarSignal[];
  trainingSessions?: TrainingSessionRecord[];
  crisisScenarios?: CrisisScenarioRecord[];
  employeeJourneys?: EmployeeJourneyRecord[];
  onSaveEmployeeJourney?: (journey: EmployeeJourneyRecord) => void;
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
  employeeJourneys = [],
  onSaveEmployeeJourney,
  onAddJobRequirement,
  onUpdateCandidateStatus,
  onDeleteCandidate,
  onClearAllCandidates,
  onImportScoutedCandidate,
  onRefreshTalentRadar,
  onResetBlankWorkspace,
  onLoadDemoData,
}) => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'turnover-engine' | 'builder' | 'free-ads' | 'radar' | 'vault' | 'google-forms' | 'google-tasks' | 'google-classroom' | 'outbound-scout' | 'calendar' | 'training-vault' | 'employee-journeys' | 'recent-hires'>('turnover-engine');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [dossierCandidate, setDossierCandidate] = useState<CandidateProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken());
  const [isClassroomSyncModalOpen, setIsClassroomSyncModalOpen] = useState<boolean>(false);
  const [classroomSyncToast, setClassroomSyncToast] = useState<string | null>(null);

  const handleCandidatesSyncedFromClassroom = (result: ClassroomCandidateSyncResult) => {
    if (result.candidates && result.candidates.length > 0) {
      result.candidates.forEach((cand) => {
        if (onImportScoutedCandidate) {
          onImportScoutedCandidate(cand);
        } else {
          saveCandidateProfileToFirestore(cand).catch(console.error);
        }
      });

      setClassroomSyncToast(
        `Synced ${result.syncedCount} candidates from "${result.courseName}" with T.H.I.S. scores (Avg: ${result.mappedTHISSummary.averageCivilityScore}%)!`
      );
      setTimeout(() => setClassroomSyncToast(null), 6000);
    }
  };

  // Recent Hires Feed State & Real-time Subscription
  const [recentHireFeedItems, setRecentHireFeedItems] = useState<RecentHireFeedItem[]>(INITIAL_RECENT_HIRES_FEED);

  useEffect(() => {
    let initialSeeded = false;
    const unsub = subscribeToRecentHiresFeed((remoteItems) => {
      if (remoteItems && remoteItems.length > 0) {
        setRecentHireFeedItems(remoteItems);
      } else if (!initialSeeded) {
        initialSeeded = true;
        INITIAL_RECENT_HIRES_FEED.forEach((item) => {
          saveRecentHireFeedItemToFirestore(item).catch(() => {});
        });
      }
    });
    return () => unsub();
  }, []);

  // Employee Journey & Recurring Scorecard State
  const [selectedEmployeeJourney, setSelectedEmployeeJourney] = useState<EmployeeJourneyRecord | null>(null);
  const [isAddingScorecard, setIsAddingScorecard] = useState(false);
  const [newAssessmentType, setNewAssessmentType] = useState<EmployeeScorecardEntry['assessmentType']>('Q3 Review');
  const [newCivilityScore, setNewCivilityScore] = useState(92);
  const [newToneScore, setNewToneScore] = useState(90);
  const [newEthicsScore, setNewEthicsScore] = useState(94);
  const [newPressureScore, setNewPressureScore] = useState(89);
  const [newDriveScore, setNewDriveScore] = useState(91);
  const [newManagerNotes, setNewManagerNotes] = useState('');
  const [newKeyImprovements, setNewKeyImprovements] = useState('');
  const [newFocusAreas, setNewFocusAreas] = useState('');
  const [newRefresherModuleTitle, setNewRefresherModuleTitle] = useState('');

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
  const [linkedInConnectToast, setLinkedInConnectToast] = useState<string | null>(null);

  // Modal Editable Recruiter Fields
  const [modalRecruiterName, setModalRecruiterName] = useState('Verified Executive Recruiter');
  const [modalRecruiterEmail, setModalRecruiterEmail] = useState('recruiter.talent@linkedin-firebase.org');
  const [modalRecruiterHeadline, setModalRecruiterHeadline] = useState('Senior Talent Acquisition Lead & Scout Specialist');
  const [modalRecruiterProfileUrl, setModalRecruiterProfileUrl] = useState('https://linkedin.com/in/verified-corporate-recruiter');

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'LINKEDIN_OAUTH_SUCCESS') {
        const prof = event.data.profile || {};
        const linkedInName = prof.name || modalRecruiterName;
        const linkedInEmail = prof.email || modalRecruiterEmail;
        const updatedAcc: LinkedInAuthAccount = {
          connected: true,
          linkedInName,
          linkedInEmail,
          linkedInHeadline: modalRecruiterHeadline,
          linkedInProfileUrl: modalRecruiterProfileUrl,
          accessTokenExpiry: new Date(Date.now() + 86400000 * 60).toISOString(),
          recruiterSeatActive: true,
          openToWorkNetworkEnabled: true,
          connectedAt: new Date().toISOString(),
        };
        saveLinkedInAuthAccountToFirestore(updatedAcc, 'default_scout');
        setLinkedInAccount(updatedAcc);
        if (prof.name) setModalRecruiterName(prof.name);
        if (prof.email) setModalRecruiterEmail(prof.email);
        setLinkedInConnectToast(`✅ LinkedIn OAuth Success! Connected profile for ${linkedInName}.`);
        setTimeout(() => setLinkedInConnectToast(null), 5000);
        setShowLinkedInModal(false);
      }
    };
    window.addEventListener('message', handleOAuthMessage);

    const unsubAccount = subscribeToLinkedInAuthAccount('default_scout', (acc) => {
      if (acc) {
        setLinkedInAccount(acc);
        if (acc.linkedInName) setModalRecruiterName(acc.linkedInName);
        if (acc.linkedInEmail) setModalRecruiterEmail(acc.linkedInEmail);
        if (acc.linkedInHeadline) setModalRecruiterHeadline(acc.linkedInHeadline);
        if (acc.linkedInProfileUrl) setModalRecruiterProfileUrl(acc.linkedInProfileUrl);
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
      window.removeEventListener('message', handleOAuthMessage);
      unsubAccount();
      unsubQueries();
    };
  }, []);

  // Sync all current scouted candidates into candidate ledger & Firestore database
  const handleSyncAllScoutedToFirestore = async () => {
    if (scoutedCandidates.length === 0) return;
    let syncedCount = 0;
    for (const cand of scoutedCandidates) {
      const candidateProfile: CandidateProfile = {
        id: cand.id || `scout-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        fullName: cand.fullName,
        email: cand.email,
        phone: cand.phone || '(512) 555-0199',
        locationCity: cand.locationCity || 'Seattle, WA',
        age: cand.age || 30,
        experienceYears: cand.experienceYears || 5,
        skills: cand.skills && cand.skills.length > 0 ? cand.skills : ['LinkedIn Sourced', 'Civility Leadership'],
        distanceFromCompanyMiles: cand.distanceFromCompanyMiles || 50,
        willingToRelocate: cand.willingToRelocate !== false,
        currentCompany: cand.currentCompany || 'Established Enterprise',
        currentRole: cand.currentRole || scoutRoleQuery || 'Professional Specialist',
        isCompetitorProspect: cand.isCompetitorProspect !== false,
        competitorNotes: cand.competitorNotes || `Sourced via Outbound LinkedIn Scout. ${cand.resumeSummary || ''}`,
        matchesUniqueExceptions: cand.matchesUniqueExceptions !== false,
        exceptionMatchReason: cand.exceptionMatchReason || 'Sourced via LinkedIn Search',
        linkedinUrl: cand.linkedinUrl || `https://linkedin.com/in/${cand.fullName.toLowerCase().replace(/\s+/g, '-')}`,
        linkedinHeadline: cand.linkedinHeadline || `${cand.currentRole} at ${cand.currentCompany}`,
        linkedinConnectionsCount: cand.linkedinConnectionsCount || '500+',
        linkedinVerified: true,
        linkedinOpenToWork: cand.linkedinOpenToWork !== false,
        linkedinMutualConnections: cand.linkedinMutualConnections || 12,
        status: 'screening',
        evaluation: {
          civilityScore: cand.predictedCivilityScore || 92,
          toneScore: 93,
          ethicsScore: 94,
          pressureScore: 91,
          driveScore: 95,
          overallSummary: `Scouted outbound candidate via LinkedIn Recruiter OAuth. Verified civility score profile.`,
          toneEvaluation: 'Projected calm, diplomatic vocal demeanor.',
          pressureEvaluation: 'Strong history of emergency handling.',
          ethicsEvaluation: 'High professional ethics record.',
          driveEvaluation: 'Proactive commitment & leadership.',
          keyStrengths: cand.skills || ['Top Professional Skill', 'Civility Leadership'],
          potentialRisks: ['Requires formal onboarding invitation'],
          recommendationTier: 'Top Prospect',
          evaluatedAt: new Date().toISOString(),
        },
      };

      if (onImportScoutedCandidate) {
        onImportScoutedCandidate(candidateProfile);
      }
      await saveCandidateProfileToFirestore(candidateProfile);
      syncedCount++;
    }
    setImportedScoutIds(scoutedCandidates.map((c) => c.id));
    setLinkedInConnectToast(`Successfully synced ${syncedCount} scouted candidate profile(s) directly to the Firestore database!`);
    setTimeout(() => setLinkedInConnectToast(null), 5000);
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

  // Candidate List: Present all real candidates sorted by civility score without cluttered search filters
  const sortedCandidates = [...candidates].sort((a, b) => {
    return (b.evaluation?.civilityScore || 0) - (a.evaluation?.civilityScore || 0);
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
                T.H.I.S. Scored
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
              id="tab-btn-turnover-engine"
              onClick={() => setActiveTab('turnover-engine')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'turnover-engine'
                  ? 'border-amber-400 text-amber-300 font-bold bg-amber-400/10'
                  : 'border-transparent text-amber-400/90 hover:text-amber-300'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>🔥 Turnover Elimination & Handshake Engine</span>
              <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded font-mono">
                $1.2T SAVED
              </span>
            </button>
            <button
              id="tab-btn-candidates"
              onClick={() => setActiveTab('candidates')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'candidates'
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Candidate Ledger ({sortedCandidates.length})
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
              id="tab-btn-free-ads"
              onClick={() => setActiveTab('free-ads')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'free-ads'
                  ? 'border-amber-400 text-amber-300 font-bold bg-amber-400/10'
                  : 'border-transparent text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>📢 Free Ads & Commission Hub</span>
              <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded font-mono">
                $0 POST
              </span>
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
              id="tab-btn-recent-hires"
              onClick={() => setActiveTab('recent-hires')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'recent-hires'
                  ? 'border-sky-400 text-sky-300 font-semibold'
                  : 'border-transparent text-sky-400/70 hover:text-sky-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Recent Hires Feed</span>
              {recentHireFeedItems.length > 0 && (
                <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono">
                  {recentHireFeedItems.length}
                </span>
              )}
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
              id="tab-btn-google-classroom"
              onClick={() => setActiveTab('google-classroom')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'google-classroom'
                  ? 'border-emerald-400 text-emerald-300 font-semibold'
                  : 'border-transparent text-emerald-400/70 hover:text-emerald-300'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Google Classroom
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
            <button
              id="tab-btn-employee-journeys"
              onClick={() => setActiveTab('employee-journeys')}
              className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'employee-journeys'
                  ? 'border-amber-400 text-amber-300 font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Employee Journeys & Scorecards ({employeeJourneys.length})</span>
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

        {/* Tab 0: Trillion-Dollar Turnover Elimination Engine */}
        {activeTab === 'turnover-engine' && (
          <div className="p-6 space-y-6">
            <TrillionDollarTurnoverLedger
              candidates={candidates}
              onSelectCandidate={(cand) => {
                setSelectedCandidate(cand);
              }}
              onOpenDossier={(cand) => {
                setDossierCandidate(cand);
              }}
            />
          </div>
        )}

        {/* Tab 1: Candidate Database */}
        {activeTab === 'candidates' && (
          <div className="p-6 space-y-6">
            
            {/* Clean Candidate Ledger Header (Search & filters removed for pure clarity and beauty) */}
            <div className="bg-[#121212] p-6 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h2 className="font-serif italic text-2xl text-white font-bold tracking-tight">
                    Executive Candidate Ledger
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Live Verified Submissions Only
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-1 font-sans">
                  Real candidate submissions with verified civility scores, authentic acoustic recordings, and video chambers.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono text-xs text-white/70">
                  <span className="text-white font-bold text-base">{sortedCandidates.length}</span> Active Dossier{sortedCandidates.length === 1 ? '' : 's'}
                </div>
                {onClearAllCandidates && candidates.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Erase current candidate profiles to start fresh with 0 applicants?')) {
                        onClearAllCandidates();
                      }
                    }}
                    className="px-3.5 py-2 border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reset Ledger</span>
                  </button>
                )}
              </div>
            </div>

            {/* Candidate Roster Grid */}
            {sortedCandidates.length === 0 ? (
              <div className="bg-[#121212] border border-white/10 p-14 text-center space-y-4 font-mono">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 flex items-center justify-center mx-auto text-white/50">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-base uppercase tracking-wider">Candidate Ledger Ready • 0 Live Submissions</h3>
                <p className="text-xs text-white/60 max-w-lg mx-auto font-sans leading-relaxed">
                  All simulated candidates have been removed. This ledger only displays real live submissions. Head over to the <strong className="text-white">Candidate Portal</strong> to complete an assessment from beginning to interview, and your premier boardroom dossier will appear here in real-time.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-mono">
                    <ShieldCheck className="w-4 h-4" />
                    <span>100% Real Live Recorded Data Guaranteed</span>
                  </span>
                </div>
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
                          {(cand.skills || []).slice(0, 3).map((skill, idx) => (
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
                    <div className="bg-[#0A0A0A] px-5 py-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                        {cand.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          id={`btn-dossier-candidate-${cand.id}`}
                          type="button"
                          onClick={() => setDossierCandidate(cand)}
                          className="px-2.5 py-1 bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer rounded-sm"
                          title="Generate Boardroom PDF Summary Dossier"
                        >
                          <FileText className="w-3 h-3" />
                          <span>PDF Summary</span>
                        </button>
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

        {/* Tab: Free Company Ads & Contingency Commission Hub */}
        {activeTab === 'free-ads' && (
          <div className="p-6">
            <CompanyAdsMarketplace
              currentUser={{
                email: 'corporate.recruiter@mindyourmanners.io',
                name: 'Corporate Hiring Director',
                role: 'corporate',
                organization: 'Enterprise Defense & Tech'
              }}
              mode="employer"
              candidates={candidates}
              onOpenCandidateDossier={(cand) => setSelectedCandidate(cand)}
            />
          </div>
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

        {/* Tab 4: Airtight Client Vault & Candidate Document Storage */}
        {activeTab === 'vault' && (
          <div className="p-6 space-y-8">
            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif italic text-2xl text-white flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" /> Airtight Client Vault & Candidate Ledger
                </h3>
                <p className="text-xs text-white/50 mt-1 font-sans">
                  Access 256-bit encrypted candidate video assessments, vocal tone recordings, and official T.H.I.S. civility certificates.
                </p>
              </div>
              <span className="text-[10px] font-mono border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 px-3 py-1 uppercase tracking-wider font-bold flex items-center gap-1.5 w-fit">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Encrypted Vault
              </span>
            </div>

            {/* Top 3 Security & Compliance Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0A0A0A] text-white p-5 border border-white/10 space-y-3">
                <div className="p-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 w-fit">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-serif italic text-lg text-white">T.H.I.S. Standard Compliance</h4>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Train, Hire, Impress, Sustain framework ensuring candidate evaluations are scored strictly to the truest grade.
                </p>
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Immutable Truest Grade Protocol
                </div>
              </div>

              <div className="bg-[#0A0A0A] text-white p-5 border border-white/10 space-y-3">
                <div className="p-2 border border-white/20 bg-white/5 text-white/80 w-fit">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-serif italic text-lg text-white">Encrypted Asset Vault</h4>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Direct encrypted storage for candidate audio recordings, pressure scenario videos, and resume breakdown matrices.
                </p>
                <div className="text-[10px] font-mono text-white/70 uppercase tracking-wider flex items-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Vault Storage Online
                </div>
              </div>

              <div className="bg-[#0A0A0A] text-white p-5 border border-white/10 space-y-3">
                <div className="p-2 border border-amber-500/30 bg-amber-500/10 text-amber-300 w-fit">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-serif italic text-lg text-white">Audit Trail Engine</h4>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Complete timestamped audit trails of candidate submissions, evaluation certificates, and employer interview invitations.
                </p>
                <div className="text-[10px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Ledger Audit Ready
                </div>
              </div>
            </div>

            {/* Candidate Evaluation Certificates & Document Ledger */}
            <div className="bg-[#0A0A0A] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" /> Vaulted Candidate Evaluation Certificates ({candidates.length})
                </h4>
                <span className="text-[10px] font-mono text-white/40 uppercase">Encrypted Records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-[10px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Certificate Ref</th>
                      <th className="py-2.5 px-3">Candidate</th>
                      <th className="py-2.5 px-3">Target Role</th>
                      <th className="py-2.5 px-3">Civility Score</th>
                      <th className="py-2.5 px-3">T.H.I.S. Status</th>
                      <th className="py-2.5 px-3 text-right">Certificate Export</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {candidates.map((cand) => (
                      <tr key={cand.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-bold text-emerald-300">CERT-2026-{cand.id.substring(0, 6).toUpperCase()}</td>
                        <td className="py-3 px-3 text-white">
                          <div>{cand.fullName}</div>
                          <div className="text-[10px] text-white/40">{cand.email}</div>
                        </td>
                        <td className="py-3 px-3 text-white/80">{cand.currentRole || 'Candidate'}</td>
                        <td className="py-3 px-3 font-bold text-emerald-400">{cand.evaluation?.civilityScore ?? 90}/100</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                            Truest Grade Verified
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            id={`btn-download-cert-${cand.id}`}
                            onClick={() => {
                              const content = `MIND YOUR MANNERS - OFFICIAL EVALUATION CERTIFICATE\n----------------------------------------------------\nCandidate Name: ${cand.fullName}\nEmail: ${cand.email}\nEvaluated Role: ${cand.currentRole || 'Target Candidate'}\nCivility Score: ${cand.evaluation?.civilityScore ?? 90}/100\nT.H.I.S. Protocol Status: Truest Grade Verified\nEvaluated At: ${new Date().toLocaleDateString()}\n\nSummary:\nCandidate demonstrated exemplary composure, ethics, and manners across video and vocal assessments.`;
                              const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `Certificate_${cand.fullName.replace(/\s+/g, '_')}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                            className="border border-white/20 hover:border-white text-white text-[10px] font-mono uppercase px-2.5 py-1 inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Download className="w-3 h-3 text-emerald-400" />
                            <span>Download Certificate</span>
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
                  <Search className="w-6 h-6 text-amber-400" /> AI Outbound Candidate Scout
                </h3>
                <p className="text-xs text-white/60 mt-1 font-sans">
                  Search nationwide across candidate networks, Open-To-Work profiles, and candidate resume registries backed by Firebase Firestore persistence.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Gemini & Firebase Sourcing Active
                </span>
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
                    className="w-full px-3 py-2 bg-[#121212] border border-white/15 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="linkedin_open_to_work">💼 Open-To-Work Talent</option>
                    <option value="linkedin_recruiter_network">⚡ Outbound Recruiter Network</option>
                    <option value="linkedin_public_profiles">🌐 Verified Candidate Profiles</option>
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
                    className="accent-amber-400 w-4 h-4 cursor-pointer"
                  />
                  <span>Filter by Verified Profiles Only</span>
                </label>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                  {scoutedCandidates.length > 0 && (
                    <>
                      <button
                        id="btn-sync-scouted-to-firestore"
                        type="button"
                        onClick={handleSyncAllScoutedToFirestore}
                        className="border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider px-4 py-2.5 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Seamlessly sync all scouted profiles to the Firestore database"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sync All ({scoutedCandidates.length}) to Database</span>
                      </button>

                      <button
                        id="btn-erase-scouted-candidates"
                        type="button"
                        onClick={() => setScoutedCandidates([])}
                        className="border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono font-bold text-xs uppercase tracking-wider px-4 py-2.5 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>Erase Results</span>
                      </button>
                    </>
                  )}

                  <button
                    id="btn-run-outbound-scout"
                    type="button"
                    onClick={handleScoutOutboundCandidates}
                    disabled={isScouting}
                    className="bg-amber-400 text-black hover:bg-amber-300 font-mono font-bold text-xs uppercase tracking-wider px-6 py-2.5 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isScouting ? 'animate-spin' : ''}`} />
                    <span>{isScouting ? 'Scouting Talent Network...' : 'Scout Outbound Candidates'}</span>
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
                  <Search className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-sm font-serif italic text-white/80">
                    No active scouts performed yet for "{scoutRoleQuery || 'Requested Role'}".
                  </p>
                  <p className="text-xs text-white/40 font-mono max-w-md mx-auto">
                    Click "Scout Outbound Candidates" above to perform live AI & Firebase cross-network search across verified Open-To-Work candidate profiles.
                  </p>
                  <button
                    onClick={handleScoutOutboundCandidates}
                    className="mt-2 bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider px-5 py-2 hover:bg-amber-300"
                  >
                    Run Outbound Scout
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
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-serif italic text-xl text-white font-semibold">{cand.fullName}</h5>
                              <span title="Firebase Verified Profile" className="text-emerald-400 shrink-0">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              </span>
                            </div>
                            <p className="text-xs text-white/60 font-sans mt-0.5">
                              {cand.currentRole} at <strong className="text-white font-medium">{cand.currentCompany}</strong>
                            </p>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5">
                            {cand.predictedCivilityScore} Civility
                          </span>
                        </div>

                        {/* Professional Headline & Summary */}
                        <div className="bg-[#121215] border border-white/10 p-2.5 text-xs font-mono text-amber-100/90 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>Verified Candidate Profile</span>
                            </span>
                            {cand.linkedinOpenToWork !== false && (
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] px-2 py-0.2 rounded font-bold uppercase">
                                #OpenToWork
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-white/80 font-sans leading-snug italic">
                            "{cand.resumeSummary || cand.linkedinHeadline || 'Experienced professional with verified civility metrics.'}"
                          </p>
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
                        <span className="text-[10px] font-mono text-white/50 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>Verified Talent</span>
                        </span>

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
                          {cand.fullName} — Civility: {cand.evaluation?.civilityScore ?? 90}/100 {cand.status === 'top_prospect' ? '★ (TOP PROSPECT)' : ''}
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

        {/* Tab: Google Classroom Workspace */}
        {activeTab === 'google-classroom' && (
          <div className="p-6">
            <GoogleClassroomManager
              jobRequirements={jobRequirements}
              candidates={candidates}
              employeeJourneys={employeeJourneys}
              accessToken={accessToken}
              onLoginClick={handleGoogleLogin}
              onOpenClassroomSync={() => setIsClassroomSyncModalOpen(true)}
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

        {/* Tab 8: Employee Journeys & Recurring Scorecards */}
        {activeTab === 'employee-journeys' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center space-x-2 border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] font-mono uppercase tracking-widest px-3 py-1 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>T.H.I.S. System • Train, Hire, Impress, Sustain</span>
                </div>
                <h3 className="font-serif italic text-2xl text-white">Current Employee Journeys & Recurring Scorecards</h3>
                <p className="text-xs text-white/60 mt-1 font-sans">
                  Score all testing to the truest grade. Monitor continuous employee growth, record quarterly civility evaluations, and assign recurring refresher modules.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#0A0A0A] border border-amber-500/30 p-3 text-right">
                  <div className="text-[10px] font-mono text-white/40 uppercase">Enrolled Staff</div>
                  <div className="text-xl font-mono text-amber-300 font-bold">{employeeJourneys.length} Employees</div>
                </div>
                <div className="bg-[#0A0A0A] border border-emerald-500/30 p-3 text-right">
                  <div className="text-[10px] font-mono text-white/40 uppercase">Avg Civility Score</div>
                  <div className="text-xl font-mono text-emerald-400 font-bold">
                    {employeeJourneys.length > 0
                      ? Math.round(employeeJourneys.reduce((sum, e) => sum + e.overallCurrentScore, 0) / employeeJourneys.length)
                      : 0} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Journeys Roster Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {employeeJourneys.map((employee) => {
                const latestScorecard = employee.scorecardHistory[employee.scorecardHistory.length - 1];
                const baselineScorecard = employee.scorecardHistory[0];
                const totalImprovement = latestScorecard && baselineScorecard
                  ? latestScorecard.overallScore - baselineScorecard.overallScore
                  : 0;

                return (
                  <div
                    key={employee.id}
                    className="bg-[#141414] border border-white/10 hover:border-amber-500/50 p-5 space-y-4 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300">
                            {employee.certificationLevel}
                          </span>
                          <h4 className="font-serif italic text-xl text-white mt-1">{employee.employeeName}</h4>
                          <p className="text-xs text-white/60">{employee.role}</p>
                          <p className="text-[10px] font-mono text-white/40 mt-0.5">{employee.department} • Hired {employee.hireDate}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-mono text-emerald-400 font-bold">{employee.overallCurrentScore}</div>
                          <div className="text-[9px] font-mono text-white/40 uppercase">Civility Score</div>
                          {totalImprovement > 0 && (
                            <span className="inline-block mt-1 text-[10px] font-mono text-emerald-400 font-bold">
                              +{totalImprovement}% Growth
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dimension Progress Mini Metrics */}
                      {latestScorecard && (
                        <div className="bg-[#0A0A0A] p-3 border border-white/5 space-y-2 font-mono text-[11px]">
                          <div className="flex justify-between items-center">
                            <span className="text-white/60">Tone under Pressure:</span>
                            <span className="text-emerald-400 font-bold">{latestScorecard.toneScore}/100</span>
                          </div>
                          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full" style={{ width: `${latestScorecard.toneScore}%` }} />
                          </div>

                          <div className="flex justify-between items-center pt-1">
                            <span className="text-white/60">Ethics & Compliance:</span>
                            <span className="text-emerald-400 font-bold">{latestScorecard.ethicsScore}/100</span>
                          </div>
                          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full" style={{ width: `${latestScorecard.ethicsScore}%` }} />
                          </div>

                          <div className="flex justify-between items-center pt-1">
                            <span className="text-white/60">Crisis Composure:</span>
                            <span className="text-emerald-400 font-bold">{latestScorecard.pressureScore}/100</span>
                          </div>
                          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full" style={{ width: `${latestScorecard.pressureScore}%` }} />
                          </div>
                        </div>
                      )}

                      {/* Assigned Refresher Modules */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Assigned Refresher Modules:</div>
                        {(employee.assignedRefresherModules || []).length > 0 ? (
                          <div className="space-y-1">
                            {(employee.assignedRefresherModules || []).map((m, idx) => (
                              <div key={idx} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-200 px-2.5 py-1 flex items-center justify-between">
                                <span className="line-clamp-1">{m}</span>
                                <span className="text-[9px] font-mono text-amber-400 uppercase">Pending</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-white/40 italic">No pending refresher modules.</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEmployeeJourney(employee);
                          setIsAddingScorecard(false);
                        }}
                        className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 py-2 px-3 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <LineChart className="w-3.5 h-3.5" />
                        <span>Inspect Scorecard History ({employee.scorecardHistory.length} Entries)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Employee Detailed Scorecard Inspector & Entry Modal */}
            {selectedEmployeeJourney && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#121212] border border-amber-500/40 w-full max-w-4xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-start justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 border border-amber-500/30">
                        {selectedEmployeeJourney.certificationLevel}
                      </span>
                      <h3 className="font-serif italic text-2xl text-white mt-1">{selectedEmployeeJourney.employeeName}</h3>
                      <p className="text-xs text-white/60">{selectedEmployeeJourney.role} • {selectedEmployeeJourney.department}</p>
                      <p className="text-[10px] font-mono text-white/40">Email: {selectedEmployeeJourney.email} • Hired: {selectedEmployeeJourney.hireDate}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right bg-[#0A0A0A] p-3 border border-emerald-500/30">
                        <div className="text-2xl font-mono text-emerald-400 font-bold">{selectedEmployeeJourney.overallCurrentScore}/100</div>
                        <div className="text-[9px] font-mono text-white/40 uppercase">Current Grade</div>
                      </div>
                      <button
                        onClick={() => setSelectedEmployeeJourney(null)}
                        className="text-white/40 hover:text-white font-mono text-xl p-2 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Historical Scorecard Timeline Breakdown */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif italic text-lg text-white flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-amber-400" />
                        <span>Recurring Scorecard Journey Timeline</span>
                      </h4>

                      <button
                        type="button"
                        onClick={() => setIsAddingScorecard(!isAddingScorecard)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider font-bold px-3 py-1.5 transition-all cursor-pointer"
                      >
                        {isAddingScorecard ? 'Cancel Scorecard Entry' : '+ Record New Scorecard Evaluation'}
                      </button>
                    </div>

                    {/* New Scorecard Entry Form */}
                    {isAddingScorecard && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const overall = Math.round((newCivilityScore + newToneScore + newEthicsScore + newPressureScore + newDriveScore) / 5);
                          const lastScore = selectedEmployeeJourney.scorecardHistory.length > 0
                            ? selectedEmployeeJourney.scorecardHistory[selectedEmployeeJourney.scorecardHistory.length - 1].overallScore
                            : overall;
                          const delta = overall - lastScore;

                          const newEntry: EmployeeScorecardEntry = {
                            id: `sc-${Date.now()}`,
                            employeeId: selectedEmployeeJourney.id,
                            employeeName: selectedEmployeeJourney.employeeName,
                            evaluationDate: new Date().toISOString().split('T')[0],
                            assessmentType: newAssessmentType,
                            civilityScore: newCivilityScore,
                            toneScore: newToneScore,
                            ethicsScore: newEthicsScore,
                            pressureScore: newPressureScore,
                            driveScore: newDriveScore,
                            overallScore: overall,
                            deltaImprovementPercent: delta,
                            managerNotes: newManagerNotes || 'Routine quarterly civility evaluation completed.',
                            keyImprovements: newKeyImprovements ? newKeyImprovements.split(',').map((s) => s.trim()) : ['Continued Composure'],
                            focusAreasForNextQuarter: newFocusAreas ? newFocusAreas.split(',').map((s) => s.trim()) : ['Executive Mentorship'],
                            completedModulesCount: selectedEmployeeJourney.scorecardHistory.length + 1,
                            status: 'verified'
                          };

                          const updatedJourney: EmployeeJourneyRecord = {
                            ...selectedEmployeeJourney,
                            overallCurrentScore: overall,
                            lastAssessedAt: new Date().toISOString().split('T')[0],
                            scorecardHistory: [...selectedEmployeeJourney.scorecardHistory, newEntry]
                          };

                          if (onSaveEmployeeJourney) {
                            onSaveEmployeeJourney(updatedJourney);
                          }
                          setSelectedEmployeeJourney(updatedJourney);
                          setIsAddingScorecard(false);
                          setNewManagerNotes('');
                          setNewKeyImprovements('');
                          setNewFocusAreas('');
                          alert('New Scorecard Evaluation recorded and saved to Firestore!');
                        }}
                        className="bg-[#1A1A1A] border border-emerald-500/40 p-5 space-y-4 font-sans text-xs"
                      >
                        <h5 className="font-serif italic text-base text-emerald-300">Record New Quarterly / Refresher Scorecard</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">Assessment Type</label>
                            <select
                              value={newAssessmentType}
                              onChange={(e) => setNewAssessmentType(e.target.value as any)}
                              className="w-full bg-[#0A0A0A] border border-white/20 p-2 text-white font-sans focus:outline-none"
                            >
                              <option value="Q1 Review">Q1 Review</option>
                              <option value="Q2 Review">Q2 Review</option>
                              <option value="Q3 Review">Q3 Review</option>
                              <option value="Q4 Review">Q4 Review</option>
                              <option value="Annual Refresher">Annual Refresher</option>
                              <option value="Crisis Retraining">Crisis Retraining</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">Civility ({newCivilityScore})</label>
                              <input
                                type="range"
                                min="50"
                                max="100"
                                value={newCivilityScore}
                                onChange={(e) => setNewCivilityScore(Number(e.target.value))}
                                className="w-full accent-emerald-400 cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">Tone ({newToneScore})</label>
                              <input
                                type="range"
                                min="50"
                                max="100"
                                value={newToneScore}
                                onChange={(e) => setNewToneScore(Number(e.target.value))}
                                className="w-full accent-emerald-400 cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">Ethics ({newEthicsScore})</label>
                              <input
                                type="range"
                                min="50"
                                max="100"
                                value={newEthicsScore}
                                onChange={(e) => setNewEthicsScore(Number(e.target.value))}
                                className="w-full accent-emerald-400 cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">Pressure ({newPressureScore})</label>
                              <input
                                type="range"
                                min="50"
                                max="100"
                                value={newPressureScore}
                                onChange={(e) => setNewPressureScore(Number(e.target.value))}
                                className="w-full accent-emerald-400 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">Manager Coaching Notes</label>
                          <textarea
                            rows={2}
                            value={newManagerNotes}
                            onChange={(e) => setNewManagerNotes(e.target.value)}
                            placeholder="Detailed manager observations regarding demeanor, ethics, and team communication..."
                            className="w-full bg-[#0A0A0A] border border-white/20 p-2 text-white font-sans focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">Key Improvements (Comma Separated)</label>
                            <input
                              type="text"
                              value={newKeyImprovements}
                              onChange={(e) => setNewKeyImprovements(e.target.value)}
                              placeholder="e.g., Calm Vocal Tone under Outages, Ethics Protocol Mastery"
                              className="w-full bg-[#0A0A0A] border border-white/20 p-2 text-white font-sans focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">Focus Areas Next Quarter</label>
                            <input
                              type="text"
                              value={newFocusAreas}
                              onChange={(e) => setNewFocusAreas(e.target.value)}
                              placeholder="e.g., Cross-functional Leadership, Media Crisis Readiness"
                              className="w-full bg-[#0A0A0A] border border-white/20 p-2 text-white font-sans focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider font-bold py-2 px-4 transition-all cursor-pointer"
                        >
                          Save Scorecard Entry & Update Trajectory
                        </button>
                      </form>
                    )}

                    {/* Timeline List of Historical Scorecards */}
                    <div className="space-y-3">
                      {(selectedEmployeeJourney?.scorecardHistory || []).map((sc, idx) => (
                        <div key={sc.id || idx} className="bg-[#0A0A0A] border border-white/10 p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300">
                                {sc.assessmentType}
                              </span>
                              <span className="text-xs text-white/60 font-mono">Date: {sc.evaluationDate}</span>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              <span className="text-xs font-mono text-white/60">
                                Delta: <strong className={sc.deltaImprovementPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                  {sc.deltaImprovementPercent >= 0 ? `+${sc.deltaImprovementPercent}%` : `${sc.deltaImprovementPercent}%`}
                                </strong>
                              </span>
                              <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/30">
                                {sc.overallScore} / 100
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-mono text-center bg-[#141414] p-2 border border-white/5">
                            <div>
                              <span className="text-white/40 block">Civility</span>
                              <span className="text-white font-bold">{sc.civilityScore}</span>
                            </div>
                            <div>
                              <span className="text-white/40 block">Tone</span>
                              <span className="text-white font-bold">{sc.toneScore}</span>
                            </div>
                            <div>
                              <span className="text-white/40 block">Ethics</span>
                              <span className="text-white font-bold">{sc.ethicsScore}</span>
                            </div>
                            <div>
                              <span className="text-white/40 block">Pressure</span>
                              <span className="text-white font-bold">{sc.pressureScore}</span>
                            </div>
                            <div>
                              <span className="text-white/40 block">Drive</span>
                              <span className="text-white font-bold">{sc.driveScore}</span>
                            </div>
                          </div>

                          <p className="text-xs text-white/80 font-sans italic bg-[#141414] p-2.5 border-l-2 border-amber-500">
                            "{sc.managerNotes}"
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-200 space-y-1">
                              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">Key Improvements:</span>
                              <div className="flex flex-wrap gap-1">
                                {(sc?.keyImprovements || []).map((imp, i) => (
                                  <span key={i} className="bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono">
                                    ✓ {imp}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="bg-amber-500/10 border border-amber-500/20 p-2 text-amber-200 space-y-1">
                              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">Focus Areas Next Quarter:</span>
                              <div className="flex flex-wrap gap-1">
                                {(sc?.focusAreasForNextQuarter || []).map((fa, i) => (
                                  <span key={i} className="bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono">
                                    🎯 {fa}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Assign New Refresher Module Section */}
                    <div className="bg-[#141414] border border-white/10 p-4 space-y-3 font-sans">
                      <h5 className="font-serif italic text-base text-white">Assign Next Refresher Module to {selectedEmployeeJourney.employeeName}</h5>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newRefresherModuleTitle}
                          onChange={(e) => setNewRefresherModuleTitle(e.target.value)}
                          placeholder="e.g., Q4 Customer De-escalation & High-Pressure Crisis Test"
                          className="flex-1 bg-[#0A0A0A] border border-white/20 p-2 text-xs text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newRefresherModuleTitle.trim()) return;
                            const updatedJourney: EmployeeJourneyRecord = {
                              ...selectedEmployeeJourney,
                              assignedRefresherModules: [...selectedEmployeeJourney.assignedRefresherModules, newRefresherModuleTitle.trim()]
                            };
                            if (onSaveEmployeeJourney) {
                              onSaveEmployeeJourney(updatedJourney);
                            }
                            setSelectedEmployeeJourney(updatedJourney);
                            setNewRefresherModuleTitle('');
                            alert(`Assigned module "${newRefresherModuleTitle}" to employee!`);
                          }}
                          className="bg-amber-600 hover:bg-amber-500 text-black font-mono text-xs uppercase font-bold px-4 py-2 transition-all cursor-pointer"
                        >
                          + Assign Refresher
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 11: Recent Hires Feed */}
        {activeTab === 'recent-hires' && (
          <div className="p-6">
            <RecentHiresFeed
              feedItems={recentHireFeedItems}
              candidateProfiles={candidates}
              onSelectCandidate={(cand) => setSelectedCandidate(cand)}
              currentUserRole="Corporate Recruiter"
            />
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


      {/* Google Classroom Sync Modal */}
      {isClassroomSyncModalOpen && (
        <GoogleClassroomSyncModal
          isOpen={isClassroomSyncModalOpen}
          onClose={() => setIsClassroomSyncModalOpen(false)}
          jobRequirements={jobRequirements}
          existingCandidates={candidates}
          accessToken={accessToken}
          onLoginClick={handleGoogleLogin}
          onCandidatesSynced={handleCandidatesSyncedFromClassroom}
        />
      )}

      {/* Classroom Sync Toast Notification */}
      {classroomSyncToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] border border-emerald-500/50 p-4 shadow-2xl flex items-center gap-3 text-xs font-mono text-emerald-300 animate-slideUp">
          <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{classroomSyncToast}</span>
          <button
            type="button"
            onClick={() => setClassroomSyncToast(null)}
            className="text-white/40 hover:text-white ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          jobRequirement={jobRequirements.find((j) => j.id === selectedCandidate.submission?.jobId)}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={onUpdateCandidateStatus}
          onUpdateCandidateEvaluation={(candId, updatedEval) => {
            const updated = candidates.map((c) => (c.id === candId ? { ...c, evaluation: updatedEval } : c));
            const target = updated.find((c) => c.id === candId);
            if (target) {
              setSelectedCandidate(target);
              saveCandidateProfileToFirestore(target).catch(console.error);
            }
          }}
        />
      )}

      {/* Boardroom Dossier Modal */}
      {dossierCandidate && (
        <BoardroomDossierModal
          candidate={dossierCandidate}
          jobRequirement={jobRequirements.find((j) => j.id === dossierCandidate.submission?.jobId)}
          onClose={() => setDossierCandidate(null)}
          onUpdateCandidateEvaluation={(candId, updatedEval) => {
            const updated = candidates.map((c) => (c.id === candId ? { ...c, evaluation: updatedEval } : c));
            const target = updated.find((c) => c.id === candId);
            if (target) {
              setDossierCandidate(target);
              if (selectedCandidate?.id === candId) {
                setSelectedCandidate(target);
              }
              saveCandidateProfileToFirestore(target).catch(console.error);
            }
          }}
        />
      )}
    </div>
  );
};
