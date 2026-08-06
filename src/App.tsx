import React, { useState, useEffect } from 'react';
import { UserRole, AuthUser, JobRequirement, CandidateProfile, TalentRadarSignal, CandidateSubmission, CandidateEvaluation, TrainingSessionRecord, CrisisScenarioRecord } from './types';
import { INITIAL_JOB_REQUIREMENTS, INITIAL_CANDIDATES, INITIAL_TALENT_RADAR_SIGNALS } from './data/initialData';
import {
  subscribeToJobRequirements,
  subscribeToCandidateProfiles,
  subscribeToTrainingSessions,
  subscribeToCrisisScenarios,
  saveJobRequirementToFirestore,
  saveCandidateProfileToFirestore,
  updateCandidateStatusInFirestore,
  deleteCandidateFromFirestore,
  saveTrainingSessionToFirestore,
  saveCrisisScenarioToFirestore
} from './services/firestoreService';
import { Navbar } from './components/Navbar';
import { EmployerDashboard } from './components/EmployerDashboard';
import { CandidatePortal } from './components/CandidatePortal';
import { AuthModal } from './components/AuthModal';
import { PricingCalculator } from './components/PricingCalculator';
import { PrivateOwnerChat } from './components/PrivateOwnerChat';
import { AudioVoiceBanner } from './components/AudioVoiceBanner';
import { Building2, UserCheck, Eye, Sparkles, Shield, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser>({
    email: 'universal@civility.com',
    role: 'universal',
    name: 'Universal Admin',
    organization: 'Civility Dual Access HQ',
    plan: 'Growth',
  });

  const [activeRole, setActiveRole] = useState<UserRole>('business');
  const [currentView, setCurrentView] = useState<'portal' | 'pricing'>('portal');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [jobRequirements, setJobRequirements] = useState<JobRequirement[]>(INITIAL_JOB_REQUIREMENTS);
  const [candidates, setCandidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [talentRadarSignals, setTalentRadarSignals] = useState<TalentRadarSignal[]>(INITIAL_TALENT_RADAR_SIGNALS);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSessionRecord[]>([]);
  const [crisisScenarios, setCrisisScenarios] = useState<CrisisScenarioRecord[]>([]);

  // Firestore real-time synchronization listeners
  useEffect(() => {
    let initialJobsSeeded = false;
    let initialCandidatesSeeded = false;

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

    const unsubCandidates = subscribeToCandidateProfiles((remoteCandidates) => {
      if (remoteCandidates && remoteCandidates.length > 0) {
        setCandidates(remoteCandidates);
      } else if (!initialCandidatesSeeded) {
        initialCandidatesSeeded = true;
        INITIAL_CANDIDATES.forEach((c) => {
          saveCandidateProfileToFirestore(c).catch(() => {});
        });
      }
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

    return () => {
      unsubJobs();
      unsubCandidates();
      unsubTraining();
      unsubCrisis();
    };
  }, []);


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

  // Load pre-populated system presets (Jobs, Applicants, Radar Signals)
  const handleLoadDemoData = () => {
    setJobRequirements(INITIAL_JOB_REQUIREMENTS);
    setCandidates(INITIAL_CANDIDATES);
    setTalentRadarSignals(INITIAL_TALENT_RADAR_SIGNALS);
    INITIAL_JOB_REQUIREMENTS.forEach((j) => saveJobRequirementToFirestore(j).catch(() => {}));
    INITIAL_CANDIDATES.forEach((c) => saveCandidateProfileToFirestore(c).catch(() => {}));
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
  const handleCandidateSubmitAssessment = (submission: CandidateSubmission, evaluation: CandidateEvaluation) => {
    const newCandidate: CandidateProfile = {
      id: `cand-${Date.now()}`,
      fullName: submission.candidateName || (currentUser.role === 'candidate' && currentUser.name !== 'Jordan Taylor (Job Seeker)' ? currentUser.name : 'Applicant Profile'),
      email: submission.candidateEmail || (currentUser.role === 'candidate' ? currentUser.email : 'applicant@company.com'),
      phone: '+1 (512) 771-9920',
      locationCity: submission.candidateCity || 'Austin, TX',
      age: 31,
      experienceYears: 6,
      skills: ['Incident Response', 'Zero Trust Architecture', 'Cloud Security', 'Python'],
      distanceFromCompanyMiles: 18,
      willingToRelocate: true,
      currentCompany: 'Apex Tech Defense',
      currentRole: 'Senior Cybersecurity Engineer',
      isCompetitorProspect: true,
      competitorNotes: 'Submitted via Guest Hire At-Home Screening Chamber.',
      matchesUniqueExceptions: true,
      exceptionMatchReason: 'Verified 4+ years active threat defense background.',
      submission,
      evaluation,
      status: evaluation.recommendationTier === 'Top Prospect' ? 'top_prospect' : 'screening',
    };

    setCandidates((prev) => [newCandidate, ...prev]);
    saveCandidateProfileToFirestore(newCandidate).catch((err) => {
      console.warn('Could not save candidate to Firestore:', err);
    });

    const trainingRecord: TrainingSessionRecord = {
      id: `train-${Date.now()}`,
      companyName: currentUser.organization || 'Civility Corporate HQ',
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

  // Determine effective active role based on auth mode
  const effectiveRole: UserRole =
    currentUser.role === 'corporate'
      ? 'business'
      : currentUser.role === 'candidate'
      ? 'candidate'
      : activeRole;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] font-sans flex flex-col selection:bg-white selection:text-black">
      {/* Navbar with Dual Portal Role Switcher & Auth Gateway */}
      <Navbar
        activeRole={effectiveRole}
        onRoleChange={(role) => {
          setActiveRole(role);
          setCurrentView('portal');
        }}
        candidateCount={candidates.length}
        topProspectCount={topProspectCount}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onShowPricing={() => setCurrentView('pricing')}
      />

      {/* Role Session Lock Banner */}
      <div className="bg-[#121212] border-b border-white/10 px-4 py-2.5 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            {currentUser.role === 'universal' ? (
              <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Universal Account Active ({currentUser.email})</span>
              </span>
            ) : currentUser.role === 'corporate' ? (
              <span className="inline-flex items-center gap-1.5 text-purple-300 font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Corporate HQ Session Active ({currentUser.organization || 'Civility Corp'})</span>
              </span>
            ) : currentUser.role === 'candidate' ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Employee / Candidate Session Active ({currentUser.email})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-blue-300 font-bold uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Guest Evaluator Mode (Viewing Both Portals)</span>
              </span>
            )}
            <span className="text-white/30 hidden md:inline">•</span>
            <span className="text-white/50 hidden md:inline">
              {currentUser.role === 'universal' || currentUser.role === 'guest'
                ? 'Universal access active: Toggle between Employer and Employee views at any time via navbar controls.'
                : currentUser.role === 'corporate'
                ? 'Candidate Chamber hidden. Full administrative & vault access enabled.'
                : 'Employer Dashboard locked. Candidate screening chamber active.'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {currentView === 'pricing' ? (
              <button
                onClick={() => setCurrentView('portal')}
                className="text-white underline hover:text-white/80 uppercase text-[10px] tracking-wider"
              >
                ← Return to {effectiveRole === 'business' ? 'Employer Portal' : 'Candidate Portal'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('pricing')}
                className="text-purple-300 hover:text-purple-200 underline uppercase text-[10px] tracking-wider flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>SaaS Pricing & Storage Tiers</span>
              </button>
            )}

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 border border-white/20 uppercase text-[10px] tracking-wider font-bold"
            >
              Switch Account Role
            </button>
          </div>
        </div>
      </div>

      {/* Main App Content View */}
      <main className="flex-1 pb-16 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* First Page Executive Audio Motto & T.H.I.S. System Banner */}
        <AudioVoiceBanner />

        {currentView === 'pricing' ? (
          <PricingCalculator
            currentPlan={currentUser.plan || 'Growth'}
            onSelectPlan={(plan) => {
              setCurrentUser((prev) => ({ ...prev, plan }));
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
      <footer className="bg-[#0A0A0A] border-t border-white/10 text-white/30 py-6 text-center text-[10px] uppercase tracking-widest font-mono mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Civility Corporate • Autonomous Candidate Intelligence Platform</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentView('pricing')} className="text-purple-400 hover:underline">
              Pricing & Storage Calculator
            </button>
            <span>•</span>
            <span className="text-white/20">Airtight Zero-Manpower Screening Systems</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

