import React, { useState, useEffect } from 'react';
import { UserRole, AuthUser, JobRequirement, CandidateProfile, TalentRadarSignal, CandidateSubmission, CandidateEvaluation, TrainingSessionRecord, CrisisScenarioRecord, EmployeeJourneyRecord } from './types';
import { INITIAL_JOB_REQUIREMENTS, INITIAL_CANDIDATES, INITIAL_TALENT_RADAR_SIGNALS, INITIAL_EMPLOYEE_JOURNEYS } from './data/initialData';
import {
  subscribeToJobRequirements,
  subscribeToCandidateProfiles,
  subscribeToTrainingSessions,
  subscribeToCrisisScenarios,
  subscribeToEmployeeJourneys,
  saveJobRequirementToFirestore,
  saveCandidateProfileToFirestore,
  updateCandidateStatusInFirestore,
  deleteCandidateFromFirestore,
  saveTrainingSessionToFirestore,
  saveCrisisScenarioToFirestore,
  saveEmployeeJourneyToFirestore
} from './services/firestoreService';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { EmployerDashboard } from './components/EmployerDashboard';
import { CandidatePortal } from './components/CandidatePortal';
import { AuthModal } from './components/AuthModal';
import { GatekeeperScreen } from './components/GatekeeperScreen';
import { PricingCalculator } from './components/PricingCalculator';
import { PrivateOwnerChat } from './components/PrivateOwnerChat';
import { AudioVoiceBanner } from './components/AudioVoiceBanner';
import { Building2, UserCheck, Eye, Sparkles, Shield, ArrowRight, LogOut, Home, Compass, Layers } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('mind_your_manners_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [activeRole, setActiveRole] = useState<UserRole>('business');
  const [currentView, setCurrentView] = useState<'landing' | 'portal' | 'pricing'>('portal');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [jobRequirements, setJobRequirements] = useState<JobRequirement[]>(INITIAL_JOB_REQUIREMENTS);
  const [candidates, setCandidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [talentRadarSignals, setTalentRadarSignals] = useState<TalentRadarSignal[]>(INITIAL_TALENT_RADAR_SIGNALS);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSessionRecord[]>([]);
  const [crisisScenarios, setCrisisScenarios] = useState<CrisisScenarioRecord[]>([]);
  const [employeeJourneys, setEmployeeJourneys] = useState<EmployeeJourneyRecord[]>(INITIAL_EMPLOYEE_JOURNEYS);

  // Firestore real-time synchronization listeners
  useEffect(() => {
    let initialJobsSeeded = false;
    let initialCandidatesSeeded = false;
    let initialJourneysSeeded = false;

    const unsubJobs = subscribeToJobRequirements((remoteJobs) => {
      if (remoteJobs && remoteJobs.length > 0) {
        setJobRequirements(remoteJobs);
      } else if (!initialJobsSeeded) {
        initialJobsSeeded = true;
        INITIAL_JOB_REQUIREMENTS.forEach((j) => {
          saveJobRequirementToFirestore(j).catch(() => {});
        });
      }
    });

    // Purge any lingering simulated pioneer profile from Firestore
    deleteCandidateFromFirestore('cand-pioneer-ronnie-hill').catch(() => {});

    const unsubCandidates = subscribeToCandidateProfiles((remoteCandidates) => {
      // Strictly retain real live recorded submissions, filtering out any simulated dummy profiles
      const realOnly = (remoteCandidates || []).filter(
        (c) => c.id !== 'cand-pioneer-ronnie-hill' && !c.id.startsWith('cand-sim-')
      );
      setCandidates(realOnly);
    });

    const unsubTraining = subscribeToTrainingSessions((remoteTraining) => {
      if (remoteTraining) {
        setTrainingSessions(remoteTraining);
      }
    });

    const unsubCrisis = subscribeToCrisisScenarios((remoteCrisis) => {
      if (remoteCrisis) {
        setCrisisScenarios(remoteCrisis);
      }
    });

    const unsubJourneys = subscribeToEmployeeJourneys((remoteJourneys) => {
      if (remoteJourneys && remoteJourneys.length > 0) {
        setEmployeeJourneys(remoteJourneys);
      } else if (!initialJourneysSeeded) {
        initialJourneysSeeded = true;
        INITIAL_EMPLOYEE_JOURNEYS.forEach((ej) => {
          saveEmployeeJourneyToFirestore(ej).catch(() => {});
        });
      }
    });

    return () => {
      unsubJobs();
      unsubCandidates();
      unsubTraining();
      unsubCrisis();
      unsubJourneys();
    };
  }, []);

  // Auto-enforce candidate view restriction if user tries to open pricing page
  useEffect(() => {
    if (currentUser?.role === 'candidate' && currentView === 'pricing') {
      setCurrentView('portal');
    }
  }, [currentUser?.role, currentView]);

  const handleSaveEmployeeJourney = (updatedJourney: EmployeeJourneyRecord) => {
    setEmployeeJourneys((prev) => {
      const idx = prev.findIndex((j) => j.id === updatedJourney.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedJourney;
        return next;
      } else {
        return [...prev, updatedJourney];
      }
    });
    saveEmployeeJourneyToFirestore(updatedJourney).catch((err) => {
      console.warn('Could not save employee journey to Firestore:', err);
    });
  };


  // When user logs in, enforce their role view automatically
  const handleUserLogin = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'corporate') {
      setActiveRole('business');
    } else if (user.role === 'candidate') {
      setActiveRole('candidate');
    }
    setCurrentView('portal');
  };

  const handleUserLogout = () => {
    localStorage.removeItem('mind_your_manners_auth_user');
    setCurrentUser(null);
  };

  // Add Job Requirement
  const handleAddJobRequirement = (newReq: JobRequirement) => {
    setJobRequirements((prev) => [newReq, ...prev]);
    saveJobRequirementToFirestore(newReq).catch((err) => {
      console.warn('Could not persist job to Firestore:', err);
    });
  };

  // Update Candidate Status
  const handleUpdateCandidateStatus = (candidateId: string, newStatus: CandidateProfile['status']) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );
    updateCandidateStatusInFirestore(candidateId, newStatus).catch((err) => {
      console.warn('Could not update candidate status in Firestore:', err);
    });
  };

  // Delete a single candidate profile
  const handleDeleteCandidate = (candidateId: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
    deleteCandidateFromFirestore(candidateId).catch((err) => {
      console.warn('Could not delete candidate from Firestore:', err);
    });
  };

  // Clear all candidate profiles
  const handleClearAllCandidates = () => {
    candidates.forEach((c) => {
      deleteCandidateFromFirestore(c.id).catch(() => {});
    });
    setCandidates([]);
  };

  // Load pre-populated system presets (Jobs, Radar Signals)
  const handleLoadDemoData = () => {
    setJobRequirements(INITIAL_JOB_REQUIREMENTS);
    setCandidates([]);
    setTalentRadarSignals(INITIAL_TALENT_RADAR_SIGNALS);
    INITIAL_JOB_REQUIREMENTS.forEach((j) => saveJobRequirementToFirestore(j).catch(() => {}));
  };

  // Reset workspace to a clean customizable blank state for new subscribers
  const handleResetBlankWorkspace = () => {
    const blankJob: JobRequirement = {
      id: `job-${Date.now()}`,
      title: 'Custom Role Posting Title',
      roleName: 'Custom Job Title',
      ageRange: '21 - 65',
      minExperienceYears: 2,
      skills: ['Strategic Planning', 'Teamwork', 'Communication'],
      uniqueExceptionsCriteria: 'Define your custom exception criteria here.',
      radiusMiles: 50,
      offerRelocationCost: true,
      relocationBudgetAmount: 10000,
      locationCity: 'Corporate HQ',
      customQuestions: {
        ethics: ['What is your protocol when faced with a conflict of interest?'],
        etiquette: ['How do you communicate complex priorities to diverse stakeholders?'],
        manners: ['How do you foster respect and clarity during team disagreements?'],
        toneScenario: 'Describe how you maintain composure when handling unexpected project shifts.',
        pressureScenario: 'Scenario: Walk us through your live response when a critical deliverable is delayed.',
        motivationScenario: 'What inner drive motivates your long-term growth and commitment?'
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setJobRequirements([blankJob]);
    setCandidates([]);
    setTalentRadarSignals([]);
  };

  // Handle Candidate Assessment Submission
  const handleCandidateSubmitAssessment = (
    submission: CandidateSubmission,
    evaluation: CandidateEvaluation,
    fullProfile?: CandidateProfile
  ) => {
    const newCandidate: CandidateProfile = fullProfile ? {
      ...fullProfile,
      submission,
      evaluation,
      status: evaluation.recommendationTier === 'Top Prospect' ? 'top_prospect' : 'screening',
    } : {
      id: `cand-${Date.now()}`,
      fullName: submission.candidateName || (currentUser?.role === 'candidate' && currentUser?.name !== 'Jordan Taylor (Job Seeker)' ? currentUser.name : 'Applicant Profile'),
      email: submission.candidateEmail || (currentUser?.role === 'candidate' ? currentUser.email : 'applicant@company.com'),
      phone: '+1 (512) 771-9920',
      locationCity: submission.candidateCity || 'Austin, TX',
      age: 30,
      experienceYears: 6,
      skills: ['Incident Response', 'Leadership', 'Problem Solving'],
      distanceFromCompanyMiles: 12,
      willingToRelocate: true,
      currentCompany: 'Autonomous Tech Group',
      currentRole: 'Senior Executive Specialist',
      isCompetitorProspect: false,
      submission,
      evaluation,
      status: evaluation.recommendationTier === 'Top Prospect' ? 'top_prospect' : 'screening',
    };

    setCandidates((prev) => [newCandidate, ...prev.filter((c) => c.id !== newCandidate.id)]);
    saveCandidateProfileToFirestore(newCandidate).catch((err) => {
      console.warn('Could not save candidate to Firestore:', err);
    });

    const trainingRecord: TrainingSessionRecord = {
      id: `train-${Date.now()}`,
      companyName: currentUser?.organization || 'Civility Corporate HQ',
      scenarioTitle: 'Autonomous Candidate Assessment & Tone Test',
      scenarioType: 'tone',
      prompt: submission.toneAudioTranscript || 'Tone & Pressure Response',
      candidateName: newCandidate.fullName,
      transcript: submission.toneAudioTranscript + ' | ' + submission.pressureVideoTranscript,
      score: evaluation.civilityScore,
      feedback: evaluation.overallSummary,
      audioBlobUrl: submission.toneAudioUrl,
      videoBlobUrl: submission.pressureVideoUrl,
      timestamp: new Date().toISOString()
    };
    saveTrainingSessionToFirestore(trainingRecord).catch((err) => {
      console.warn('Could not save training session to Firestore:', err);
    });
  };

  // Import scouted candidate into Candidate Ledger
  const handleImportScoutedCandidate = (candidate: CandidateProfile) => {
    setCandidates((prev) => {
      if (prev.some((c) => c.id === candidate.id || c.email === candidate.email)) return prev;
      return [candidate, ...prev];
    });
    saveCandidateProfileToFirestore(candidate).catch((err) => {
      console.warn('Could not save scouted candidate to Firestore:', err);
    });
  };

  // Refresh Talent Radar
  const handleRefreshTalentRadar = (newSignals: TalentRadarSignal[]) => {
    setTalentRadarSignals((prev) => [...newSignals, ...prev]);
  };

  const topProspectCount = candidates.filter((c) => c.status === 'top_prospect').length;

  // If user is not authenticated, render the flagship Landing Page with full navigation & auth
  if (!currentUser) {
    return <LandingPage onLogin={handleUserLogin} />;
  }

  // Determine effective active role based on auth mode:
  // - Candidate Accounts: Restricted strictly to candidate/employee portal view.
  // - Subscribed Corporate Accounts: All-Access Pass to BOTH Employer HQ & Employee View.
  const effectiveRole: UserRole =
    currentUser?.role === 'candidate'
      ? 'candidate'
      : activeRole;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Navbar with Role-Based Navigation & Auth Gateway */}
      <Navbar
        activeRole={effectiveRole}
        onRoleChange={(role) => {
          if (currentUser?.role === 'candidate' && role === 'business') {
            alert('Candidate Accounts are limited to the Candidate / Employee Portal. To access Employer HQ features, please sign in or subscribe as a Corporate Employer.');
            return;
          }
          setActiveRole(role);
          setCurrentView('portal');
        }}
        candidateCount={candidates.length}
        topProspectCount={topProspectCount}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onShowPricing={() => {
          if (currentUser?.role === 'candidate') {
            alert('Candidate Accounts are free for job seekers. Pricing and SaaS storage plans are reserved for Corporate Subscribers.');
            return;
          }
          setCurrentView('pricing');
        }}
        onShowLanding={() => setCurrentView('landing')}
        currentView={currentView}
        onLogout={handleUserLogout}
      />

      {/* Role Session Lock Banner - Rounded Bubble Styling */}
      <div className="w-full px-4 pt-3">
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-3xl md:rounded-full px-5 py-2.5 text-xs font-mono shadow-2xl backdrop-blur-xl max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center space-x-3 flex-wrap justify-center sm:justify-start">
            {currentUser?.role === 'universal' ? (
              <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Founder Account ({currentUser.name})</span>
              </span>
            ) : currentUser?.role === 'corporate' ? (
              <span className="inline-flex items-center gap-1.5 text-sky-300 font-bold uppercase tracking-wider bg-sky-500/10 px-3 py-1 rounded-full border border-sky-400/30">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Corporate Subscriber ({currentUser.organization || 'Civility Corp'})</span>
              </span>
            ) : currentUser?.role === 'candidate' ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-400/30">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Candidate Session ({currentUser.email})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-zinc-300 font-bold uppercase tracking-wider bg-zinc-800/60 px-3 py-1 rounded-full border border-zinc-700/60">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>Guest Evaluator Mode</span>
              </span>
            )}
            <span className="text-zinc-600 hidden md:inline">•</span>
            <span className="text-zinc-400 hidden lg:inline text-[11px] font-sans">
              {currentUser?.role === 'candidate'
                ? 'Access restricted to Candidate / Employee Portal & T.H.I.S. Civility Evaluation (100% Free).'
                : 'Subscribed Corporate Account: All-Access Pass active. Toggle between Employer HQ and Employee View.'}
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            {currentView === 'landing' ? (
              <button
                onClick={() => setCurrentView('portal')}
                className="bg-amber-400 hover:bg-amber-300 text-black px-3.5 py-1.5 uppercase text-[10px] tracking-wider font-extrabold flex items-center gap-1.5 cursor-pointer rounded-full shadow-md"
              >
                <span>Return to {effectiveRole === 'business' ? 'Employer HQ' : 'Candidate Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : currentView === 'pricing' ? (
              <button
                onClick={() => setCurrentView('portal')}
                className="text-amber-300 hover:text-amber-200 underline uppercase text-[10px] tracking-wider cursor-pointer font-bold px-2 py-1"
              >
                ← Return to {effectiveRole === 'business' ? 'Employer HQ' : 'Employee Portal'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('landing')}
                className="text-amber-300 hover:text-amber-200 uppercase text-[10px] tracking-wider flex items-center gap-1 cursor-pointer font-bold px-2 py-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Ecosystem Guide</span>
              </button>
            )}

            {currentView !== 'pricing' && currentUser?.role !== 'candidate' && (
              <button
                onClick={() => setCurrentView('pricing')}
                className="text-sky-300 hover:text-sky-200 underline uppercase text-[10px] tracking-wider flex items-center gap-1 cursor-pointer font-bold px-2 py-1"
              >
                <span>Pricing Tiers</span>
              </button>
            )}

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-1.5 border border-zinc-700 uppercase text-[10px] tracking-wider font-bold cursor-pointer rounded-full shadow-sm transition-transform active:scale-95"
            >
              Switch Role
            </button>

            <button
              onClick={handleUserLogout}
              className="bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 px-3.5 py-1.5 border border-rose-500/30 uppercase text-[10px] tracking-wider font-bold flex items-center gap-1 cursor-pointer rounded-full transition-transform active:scale-95"
            >
              <LogOut className="w-3 h-3 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App Content View */}
      <main className="flex-1 pb-16 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {currentView === 'landing' ? (
          <LandingPage
            onLogin={handleUserLogin}
            currentUser={currentUser}
            onNavigateToPortal={() => setCurrentView('portal')}
          />
        ) : currentView === 'pricing' ? (
          <PricingCalculator
            currentPlan={currentUser?.plan || 'Growth'}
            onSelectPlan={(plan) => {
              setCurrentUser((prev) => (prev ? { ...prev, plan } : { email: 'guest@company.com', role: 'corporate', name: 'Corporate Guest', organization: 'Civility Corp', plan }));
              alert(`Updated subscription plan to ${plan} Tier!`);
            }}
          />
        ) : effectiveRole === 'business' ? (
          <EmployerDashboard
            jobRequirements={jobRequirements}
            candidates={candidates}
            talentRadarSignals={talentRadarSignals}
            trainingSessions={trainingSessions}
            crisisScenarios={crisisScenarios}
            employeeJourneys={employeeJourneys}
            onSaveEmployeeJourney={handleSaveEmployeeJourney}
            onAddJobRequirement={handleAddJobRequirement}
            onUpdateCandidateStatus={handleUpdateCandidateStatus}
            onDeleteCandidate={handleDeleteCandidate}
            onClearAllCandidates={handleClearAllCandidates}
            onImportScoutedCandidate={handleImportScoutedCandidate}
            onRefreshTalentRadar={handleRefreshTalentRadar}
            onResetBlankWorkspace={handleResetBlankWorkspace}
            onLoadDemoData={handleLoadDemoData}
          />
        ) : (
          <CandidatePortal
            jobRequirements={jobRequirements}
            employeeJourneys={employeeJourneys}
            currentUser={currentUser}
            onSaveEmployeeJourney={handleSaveEmployeeJourney}
            onSubmitAssessment={handleCandidateSubmitAssessment}
          />
        )}
      </main>

      {/* Role Auth Gateway Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleUserLogin}
        currentUser={currentUser}
      />

      {/* Private Founder/Owner 1-on-1 Chat Widget */}
      <PrivateOwnerChat currentUser={currentUser} />

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-900 text-zinc-400 py-6 text-center text-[10px] uppercase tracking-widest font-mono mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Civility Corporate • Autonomous Candidate Intelligence Platform</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentView('pricing')} className="text-amber-400 font-bold hover:underline">
              Pricing & Storage Calculator
            </button>
            <span>•</span>
            <span className="text-zinc-500">Airtight Zero-Manpower Screening Systems</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

