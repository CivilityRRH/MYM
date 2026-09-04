import React, { useState, useEffect } from 'react';
import {
  CompanyJobAd,
  AdApplication,
  CommissionInvoiceRecord,
  AuthUser,
  CandidateProfile
} from '../types';
import {
  INITIAL_COMPANY_ADS,
  INITIAL_AD_APPLICATIONS,
  INITIAL_COMMISSION_INVOICES
} from '../data/initialData';
import {
  subscribeToCompanyAds,
  saveCompanyAdToFirestore,
  deleteCompanyAdFromFirestore,
  subscribeToAdApplications,
  saveAdApplicationToFirestore,
  subscribeToCommissionInvoices,
  saveCommissionInvoiceToFirestore
} from '../services/firestoreService';
import {
  Briefcase,
  DollarSign,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Plus,
  ArrowRight,
  Clock,
  Building,
  Users,
  Eye,
  FileText,
  CreditCard,
  AlertCircle,
  Search,
  Filter,
  Check,
  Send,
  Download,
  Building2,
  Percent,
  Calculator,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface CompanyAdsMarketplaceProps {
  currentUser?: AuthUser | null;
  mode?: 'employer' | 'candidate';
  candidates?: CandidateProfile[];
  onOpenCandidateDossier?: (candidate: CandidateProfile) => void;
}

export const CompanyAdsMarketplace: React.FC<CompanyAdsMarketplaceProps> = ({
  currentUser,
  mode = 'employer',
  candidates = [],
  onOpenCandidateDossier
}) => {
  // Active Tab View
  const [activeTab, setActiveTab] = useState<'ads' | 'create-ad' | 'applications' | 'invoices' | 'candidate-browse'>(
    mode === 'candidate' ? 'candidate-browse' : 'ads'
  );

  // Firestore Synced State
  const [companyAds, setCompanyAds] = useState<CompanyJobAd[]>(INITIAL_COMPANY_ADS);
  const [applications, setApplications] = useState<AdApplication[]>(INITIAL_AD_APPLICATIONS);
  const [invoices, setInvoices] = useState<CommissionInvoiceRecord[]>(INITIAL_COMMISSION_INVOICES);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterWorkplace, setFilterWorkplace] = useState('All');

  // New Ad Form State ($0 Upfront to Post)
  const [newCompanyName, setNewCompanyName] = useState(currentUser?.organization || 'The Future Corp.');
  const [newTitle, setNewTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('Cyber Operations & Infrastructure');
  const [newLocationCity, setNewLocationCity] = useState('Austin, TX');
  const [newWorkplaceType, setNewWorkplaceType] = useState<'Remote' | 'Hybrid' | 'On-Site'>('Hybrid');
  const [newEmploymentType, setNewEmploymentType] = useState<'Full-Time' | 'Part-Time' | 'Contract'>('Full-Time');
  const [newSalaryMin, setNewSalaryMin] = useState(140000);
  const [newSalaryMax, setNewSalaryMax] = useState(180000);
  const [newCommissionRate, setNewCommissionRate] = useState(12); // Standard 12% success commission
  const [newTargetArchetypes, setNewTargetArchetypes] = useState<string[]>(['Crisis Resilient Leader', 'Ethical Sentinel']);
  const [newMinCivilityScore, setNewMinCivilityScore] = useState(88);
  const [newDescription, setNewDescription] = useState('');
  const [newKeyResponsibilities, setNewKeyResponsibilities] = useState<string[]>([
    'Drive core strategic outcomes while maintaining calm, de-escalating team communication',
    'Uphold company ethics and professional compliance across all operational workflows',
    'Collaborate seamlessly in cross-functional crisis and incident response drills'
  ]);
  const [newEthicsMandate, setNewEthicsMandate] = useState('Zero tolerance for compliance shortcuts and dedicated empathy for team members.');
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hire Confirmation & Commission Modal State
  const [selectedAppForHire, setSelectedAppForHire] = useState<AdApplication | null>(null);
  const [hireAgreedSalary, setHireAgreedSalary] = useState(160000);
  const [hireCommissionRate, setHireCommissionRate] = useState(12);
  const [isConfirmingHire, setIsConfirmingHire] = useState(false);

  // Candidate 1-Click Apply State
  const [applyingAd, setApplyingAd] = useState<CompanyJobAd | null>(null);
  const [candidateNameInput, setCandidateNameInput] = useState(currentUser?.name || 'Jordan Taylor');
  const [candidateEmailInput, setCandidateEmailInput] = useState(currentUser?.email || 'jordan.taylor@candidate.io');
  const [candidateLocationInput, setCandidateLocationInput] = useState('Austin, TX');
  const [candidateScoreInput, setCandidateScoreInput] = useState(94);
  const [candidateArchetypeInput, setCandidateArchetypeInput] = useState('Crisis Resilient Leader');

  // Real-time Firestore subscriptions
  useEffect(() => {
    const unsubAds = subscribeToCompanyAds((remoteAds) => {
      if (remoteAds) {
        setCompanyAds(remoteAds);
      }
    });

    const unsubApps = subscribeToAdApplications((remoteApps) => {
      if (remoteApps) {
        setApplications(remoteApps);
      }
    });

    const unsubInvoices = subscribeToCommissionInvoices((remoteInvoices) => {
      if (remoteInvoices) {
        setInvoices(remoteInvoices);
      }
    });

    return () => {
      unsubAds();
      unsubApps();
      unsubInvoices();
    };
  }, []);

  // AI Generator for Free Ad Descriptions
  const handleGenerateAiAdContent = async () => {
    if (!newTitle.trim()) {
      alert('Please enter a Role Title first to generate AI ad description.');
      return;
    }
    setIsGeneratingWithAi(true);
    try {
      const res = await fetch('/api/ads/create-ai-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: newCompanyName,
          roleTitle: newTitle,
          department: newDepartment,
          locationCity: newLocationCity,
          workplaceType: newWorkplaceType,
          salaryMin: newSalaryMin,
          salaryMax: newSalaryMax,
          targetArchetypes: newTargetArchetypes,
          requiredMinCivilityScore: newMinCivilityScore,
          commissionRate: newCommissionRate
        })
      });
      const data = await res.json();
      if (data.description) setNewDescription(data.description);
      if (data.keyResponsibilities && Array.isArray(data.keyResponsibilities)) {
        setNewKeyResponsibilities(data.keyResponsibilities);
      }
      if (data.ethicsMandate) setNewEthicsMandate(data.ethicsMandate);
      setToastMessage('✨ AI Job Ad Outline generated successfully!');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Error generating AI ad:', err);
    } finally {
      setIsGeneratingWithAi(false);
    }
  };

  // Publish Free Ad ($0 Upfront)
  const handlePublishFreeAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('Please provide a Role Title and Job Description.');
      return;
    }

    const newAd: CompanyJobAd = {
      id: `ad-${Date.now()}`,
      companyName: newCompanyName || 'Civility Corporate Partner',
      companyLogoUrl: '🏢',
      title: newTitle.trim(),
      department: newDepartment,
      locationCity: newLocationCity,
      workplaceType: newWorkplaceType,
      employmentType: newEmploymentType,
      salaryMin: Number(newSalaryMin),
      salaryMax: Number(newSalaryMax),
      currency: 'USD',
      commissionRate: Number(newCommissionRate),
      commissionModel: 'percentage',
      targetArchetypes: newTargetArchetypes,
      requiredMinCivilityScore: Number(newMinCivilityScore),
      description: newDescription,
      keyResponsibilities: newKeyResponsibilities.filter((r) => r.trim().length > 0),
      ethicsMandate: newEthicsMandate,
      adPricingType: 'free_with_commission',
      status: 'active',
      metrics: {
        impressions: 1,
        views: 1,
        applicantsCount: 0,
        shortlistedCount: 0,
        commissionPaymentStatus: 'unbilled'
      },
      createdAt: new Date().toISOString()
    };

    try {
      await saveCompanyAdToFirestore(newAd);
      setCompanyAds((prev) => [newAd, ...prev]);
      setToastMessage('🎉 Free Job Ad published live at $0 upfront! Commission agreement active.');
      setActiveTab('ads');
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error('Failed to publish ad:', err);
      alert('Failed to publish ad to Firestore.');
    }
  };

  // 1-Click Candidate Apply
  const handleCandidateApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingAd) return;

    const newApp: AdApplication = {
      id: `app-${Date.now()}`,
      adId: applyingAd.id,
      jobTitle: applyingAd.title,
      companyName: applyingAd.companyName,
      candidateId: currentUser?.email ? `cand-${currentUser.email.replace(/[^a-zA-Z0-9]/g, '')}` : `cand-${Date.now()}`,
      candidateName: candidateNameInput,
      candidateEmail: candidateEmailInput,
      candidateLocation: candidateLocationInput,
      candidateCivilityScore: Number(candidateScoreInput),
      candidateArchetype: candidateArchetypeInput,
      candidateResumeHighlights: [
        `Verified T.H.I.S. Score: ${candidateScoreInput}/100`,
        `Positive Character Archetype: ${candidateArchetypeInput}`,
        `Location: ${candidateLocationInput}`
      ],
      status: 'submitted',
      appliedAt: new Date().toISOString()
    };

    try {
      await saveAdApplicationToFirestore(newApp);
      // Increment ad metrics
      const updatedAd: CompanyJobAd = {
        ...applyingAd,
        metrics: {
          ...applyingAd.metrics,
          applicantsCount: applyingAd.metrics.applicantsCount + 1,
          views: applyingAd.metrics.views + 1
        }
      };
      await saveCompanyAdToFirestore(updatedAd);

      setToastMessage(`✅ Application submitted to ${applyingAd.companyName} for ${applyingAd.title}!`);
      setApplyingAd(null);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error('Failed to submit application:', err);
    }
  };

  // Confirm Hire & Generate Commission Invoice
  const handleExecuteHireAndInvoice = async () => {
    if (!selectedAppForHire) return;
    setIsConfirmingHire(true);

    try {
      const parentAd = companyAds.find((a) => a.id === selectedAppForHire.adId);
      const rate = parentAd?.commissionRate || hireCommissionRate || 12;
      const salary = Number(hireAgreedSalary) || 150000;
      const totalCommission = Math.round(salary * (rate / 100));
      const agencyFee25 = Math.round(salary * 0.25);
      const savings = Math.max(0, agencyFee25 - totalCommission);

      const invoiceDate = new Date().toISOString().split('T')[0];
      const dueDateObj = new Date();
      dueDateObj.setDate(dueDateObj.getDate() + 30);
      const dueDate = dueDateObj.toISOString().split('T')[0];

      const newInvoice: CommissionInvoiceRecord = {
        id: `inv-${Date.now()}`,
        adId: selectedAppForHire.adId,
        companyName: selectedAppForHire.companyName,
        candidateName: selectedAppForHire.candidateName,
        candidateEmail: selectedAppForHire.candidateEmail,
        roleTitle: selectedAppForHire.jobTitle,
        agreedSalary: salary,
        commissionPercentage: rate,
        totalCommission,
        savingsVsAgency: savings,
        invoiceDate,
        dueDate,
        status: 'pending',
        invoiceNumber: `MYM-COMM-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: 'Corporate Success Settlement (Net 30 Days)'
      };

      // 1. Save Commission Invoice
      await saveCommissionInvoiceToFirestore(newInvoice);

      // 2. Update Application Status to Hired
      const updatedApp: AdApplication = {
        ...selectedAppForHire,
        status: 'hired',
        offerAcceptedAt: new Date().toISOString(),
        finalHiringSalary: salary,
        calculatedCommission: totalCommission
      };
      await saveAdApplicationToFirestore(updatedApp);

      // 3. Update Parent Ad Status to Filled & Record Placement
      if (parentAd) {
        const updatedAd: CompanyJobAd = {
          ...parentAd,
          status: 'filled',
          metrics: {
            ...parentAd.metrics,
            hiredCandidateId: selectedAppForHire.candidateId,
            hiredCandidateName: selectedAppForHire.candidateName,
            hiredDate: invoiceDate,
            agreedHireSalary: salary,
            commissionAmountBilled: totalCommission,
            commissionPaymentStatus: 'invoiced'
          }
        };
        await saveCompanyAdToFirestore(updatedAd);
      }

      setToastMessage(`🎉 Placement verified! Success Commission invoice generated for $${totalCommission.toLocaleString()} (Saved $${savings.toLocaleString()} vs agency fees!).`);
      setSelectedAppForHire(null);
      setActiveTab('invoices');
      setTimeout(() => setToastMessage(null), 6000);
    } catch (err) {
      console.error('Error confirming hire & calculating commission:', err);
      alert('Failed to process hire confirmation.');
    } finally {
      setIsConfirmingHire(false);
    }
  };

  // Filtered ads
  const filteredAds = companyAds.filter((ad) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.locationCity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDepartment === 'All' || ad.department === filterDepartment;
    const matchesWorkplace = filterWorkplace === 'All' || ad.workplaceType === filterWorkplace;
    return matchesSearch && matchesDept && matchesWorkplace;
  });

  // Calculate totals
  const totalCommissionBilled = invoices.reduce((sum, inv) => sum + inv.totalCommission, 0);
  const totalClientSavings = invoices.reduce((sum, inv) => sum + inv.savingsVsAgency, 0);
  const activeAdsCount = companyAds.filter((a) => a.status === 'active').length;
  const totalPlacementsCount = invoices.length;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black px-6 py-3 rounded-none shadow-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-emerald-300 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Model Overview Banner: $0 Upfront Free Ads & Success Commission */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-400/40 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-black font-mono text-[11px] font-black uppercase px-2.5 py-0.5 tracking-wider">
                100% $0 Upfront Free Ad Posting
              </span>
              <span className="border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 tracking-wider">
                Contingency Commission Model
              </span>
              <span className="border border-white/20 bg-white/5 text-zinc-300 font-mono text-[11px] uppercase px-2 py-0.5 tracking-wider">
                Zero Risk • Zero Listing Fees
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
              Run Hiring Ads for Free — Pay Commission Only Upon Verified Placement
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              Post unlimited open roles and run high-visibility hiring campaigns with <span className="text-amber-300 font-semibold">$0 upfront budget</span>. Applicants are screened autonomously with T.H.I.S. Truest Grade evaluations and Positive Character Archetypes. You only pay a transparent <span className="text-emerald-400 font-semibold">10%–12% success commission</span> when you extend an offer and confirm a hire.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-auto">
            <div className="bg-black/60 border border-zinc-800 p-3 text-center">
              <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Active Free Ads</div>
              <div className="text-xl font-mono font-bold text-amber-400 mt-0.5">{activeAdsCount}</div>
            </div>
            <div className="bg-black/60 border border-zinc-800 p-3 text-center">
              <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Verified Hires</div>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">{totalPlacementsCount}</div>
            </div>
            <div className="bg-black/60 border border-zinc-800 p-3 text-center">
              <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Upfront Cost</div>
              <div className="text-xl font-mono font-bold text-sky-400 mt-0.5">$0.00</div>
            </div>
            <div className="bg-black/60 border border-zinc-800 p-3 text-center">
              <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Employer Savings</div>
              <div className="text-xl font-mono font-bold text-purple-400 mt-0.5">${(totalClientSavings / 1000).toFixed(1)}k</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-[#121212] border border-white/10 flex flex-wrap items-center justify-between px-4 py-2 gap-2">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-3.5 py-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'ads'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Free Ads ({companyAds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create-ad')}
            className={`px-3.5 py-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'create-ad'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-amber-400/90 hover:text-amber-300 hover:bg-zinc-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post $0 Free Ad Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'applications'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Ad Applicants ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3.5 py-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'invoices'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Commission Ledger ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('candidate-browse')}
            className={`px-3.5 py-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'candidate-browse'
                ? 'bg-sky-500 text-black font-bold'
                : 'text-sky-400 hover:text-sky-300 hover:bg-zinc-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Candidate Direct-Hire Board</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-zinc-400 hidden md:block">
          ⚡ Standard Placement Commission: <span className="text-emerald-400 font-bold">10% - 12%</span> upon verified start date.
        </div>
      </div>

      {/* ============================================================
          VIEW 1: ACTIVE FREE COMPANY ADS
      ============================================================ */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="bg-[#141414] border border-white/10 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search active role ads, companies, locations..."
                className="w-full bg-black/60 border border-zinc-700 pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={filterWorkplace}
                onChange={(e) => setFilterWorkplace(e.target.value)}
                className="bg-black/60 border border-zinc-700 px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-amber-400"
              >
                <option value="All">All Workplace Types</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-Site">On-Site</option>
              </select>

              <button
                onClick={() => setActiveTab('create-ad')}
                className="bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post New Free Ad</span>
              </button>
            </div>
          </div>

          {/* Ads Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAds.map((ad) => {
              const adApplicants = applications.filter((app) => app.adId === ad.id);
              const isFilled = ad.status === 'filled';

              return (
                <div
                  key={ad.id}
                  className={`border transition-all flex flex-col justify-between ${
                    isFilled
                      ? 'bg-zinc-950/80 border-emerald-500/40'
                      : 'bg-[#141414] border-zinc-800 hover:border-amber-400/50'
                  }`}
                >
                  <div className="p-6 space-y-4">
                    {/* Header: Company & Status */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl">{ad.companyLogoUrl || '🏢'}</span>
                          <span className="text-xs font-mono uppercase text-zinc-400 font-bold">{ad.companyName}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-xs font-mono text-zinc-400">{ad.locationCity}</span>
                          <span className="bg-zinc-800 text-zinc-300 text-[10px] font-mono px-2 py-0.5 uppercase">
                            {ad.workplaceType}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-mono font-bold text-white tracking-tight">
                          {ad.title}
                        </h3>
                      </div>

                      {isFilled ? (
                        <span className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Placed & Invoiced
                        </span>
                      ) : (
                        <span className="bg-amber-400/10 border border-amber-400/30 text-amber-300 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                          $0 Upfront • {ad.commissionRate}% Commission
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-3">
                      {ad.description}
                    </p>

                    {/* Requirements & Target Archetypes */}
                    <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-400">Compensation:</span>
                        <span className="text-white font-bold">
                          ${ad.salaryMin.toLocaleString()} - ${ad.salaryMax.toLocaleString()} / yr
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-400">Min Civility Threshold:</span>
                        <span className="text-amber-300 font-bold">{ad.requiredMinCivilityScore}% T.H.I.S. Score</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[11px] font-mono text-zinc-400">Target Archetypes:</span>
                        {ad.targetArchetypes.map((arch) => (
                          <span
                            key={arch}
                            className="bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[10px] font-mono px-2 py-0.5"
                          >
                            {arch}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Live Metrics Row */}
                    <div className="bg-black/50 border border-zinc-800 p-3 grid grid-cols-3 gap-2 text-center font-mono">
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Impressions</div>
                        <div className="text-sm font-bold text-white mt-0.5">{ad.metrics.impressions}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Applicants</div>
                        <div className="text-sm font-bold text-amber-400 mt-0.5">{adApplicants.length}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Commission</div>
                        <div className="text-sm font-bold text-emerald-400 mt-0.5">
                          {isFilled && ad.metrics.commissionAmountBilled
                            ? `$${ad.metrics.commissionAmountBilled.toLocaleString()}`
                            : `${ad.commissionRate}% on Hire`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex items-center justify-between gap-3">
                    <div className="text-[11px] font-mono text-zinc-400">
                      {isFilled ? (
                        <span className="text-emerald-400 font-bold">
                          🎉 Placed: {ad.metrics.hiredCandidateName}
                        </span>
                      ) : (
                        <span>Posted {new Date(ad.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveTab('applications');
                          setSearchQuery(ad.title);
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Users className="w-3 h-3 text-amber-400" />
                        <span>View Applicants ({adApplicants.length})</span>
                      </button>

                      {!isFilled && (
                        <button
                          onClick={() => setApplyingAd(ad)}
                          className="bg-sky-500 hover:bg-sky-400 text-black text-xs font-mono font-bold px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>Apply as Candidate</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 2: POST $0 FREE AD STUDIO (AI GENERATED)
      ============================================================ */}
      {activeTab === 'create-ad' && (
        <div className="bg-[#141414] border border-white/10 p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
          <div className="border-b border-zinc-800 pb-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-black font-mono text-[10px] font-bold uppercase px-2 py-0.5">
                  $0 Upfront Ad Builder
                </span>
                <span className="text-zinc-400 font-mono text-xs">No Credit Card Required to Post</span>
              </div>
              <h3 className="text-xl font-mono font-bold text-white mt-1">
                Create & Run a Free Company Hiring Campaign
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Mind Your Manners distributes your ad globally. You only pay the agreed contingency commission when you make a verified hire.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateAiAdContent}
              disabled={isGeneratingWithAi}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2 transition-colors cursor-pointer border border-purple-400/40"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingWithAi ? 'AI Drafting Ad...' : 'Auto-Generate with AI'}</span>
            </button>
          </div>

          <form onSubmit={handlePublishFreeAd} className="space-y-6">
            {/* Row 1: Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. The Future Corp."
                  className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Role Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Distributed Systems Architect"
                  className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            {/* Row 2: Department & Location & Workplace Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Department</label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="e.g. Cyber Operations"
                  className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Location / City</label>
                <input
                  type="text"
                  value={newLocationCity}
                  onChange={(e) => setNewLocationCity(e.target.value)}
                  placeholder="e.g. Austin, TX or Remote"
                  className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Workplace Type</label>
                <select
                  value={newWorkplaceType}
                  onChange={(e) => setNewWorkplaceType(e.target.value as any)}
                  className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-Site">On-Site</option>
                </select>
              </div>
            </div>

            {/* Row 3: Salary Range & Commission Agreement */}
            <div className="bg-zinc-950 border border-amber-400/30 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                    Compensation & Contingency Success Commission Agreement
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/30 uppercase">
                  Upfront Fee: $0.00
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Min Base Salary (USD)</label>
                  <input
                    type="number"
                    step="5000"
                    value={newSalaryMin}
                    onChange={(e) => setNewSalaryMin(Number(e.target.value))}
                    className="w-full bg-black/70 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Max Base Salary (USD)</label>
                  <input
                    type="number"
                    step="5000"
                    value={newSalaryMax}
                    onChange={(e) => setNewSalaryMax(Number(e.target.value))}
                    className="w-full bg-black/70 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-amber-300 uppercase font-bold">
                      Success Commission ({newCommissionRate}%)
                    </label>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="18"
                    step="1"
                    value={newCommissionRate}
                    onChange={(e) => setNewCommissionRate(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
                    <span>8% (High Vol)</span>
                    <span className="text-amber-400 font-bold">{newCommissionRate}% Standard</span>
                    <span>18% (Exec)</span>
                  </div>
                </div>
              </div>

              {/* Commission Calculation Preview */}
              <div className="bg-black/60 border border-zinc-800 p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
                <div className="text-zinc-400">
                  Estimated commission on mid-salary hire (${((newSalaryMin + newSalaryMax) / 2).toLocaleString()}):
                  <span className="text-emerald-400 font-bold ml-1.5">
                    ${Math.round(((newSalaryMin + newSalaryMax) / 2) * (newCommissionRate / 100)).toLocaleString()}
                  </span>
                </div>
                <div className="text-purple-300 text-[11px]">
                  💡 Traditional Agency would charge $
                  {Math.round(((newSalaryMin + newSalaryMax) / 2) * 0.25).toLocaleString()} (Save ~52%)
                </div>
              </div>
            </div>

            {/* Row 4: Minimum Civility & Target Archetypes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                  Min Required T.H.I.S. Civility Score ({newMinCivilityScore}%)
                </label>
                <input
                  type="range"
                  min="75"
                  max="98"
                  value={newMinCivilityScore}
                  onChange={(e) => setNewMinCivilityScore(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <p className="text-[10px] font-mono text-zinc-400">
                  Only candidates scoring {newMinCivilityScore}%+ on voice & video de-escalation are fast-tracked.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                  Target Positive Archetypes
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Crisis Resilient Leader',
                    'Ethical Sentinel',
                    'Executive Strategist',
                    'Adaptive Catalyst',
                    'Pragmatic Operator'
                  ].map((arch) => {
                    const isSelected = newTargetArchetypes.includes(arch);
                    return (
                      <button
                        type="button"
                        key={arch}
                        onClick={() => {
                          if (isSelected) {
                            setNewTargetArchetypes(newTargetArchetypes.filter((a) => a !== arch));
                          } else {
                            setNewTargetArchetypes([...newTargetArchetypes, arch]);
                          }
                        }}
                        className={`text-[10px] font-mono px-2.5 py-1 border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-black font-bold border-amber-400'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        {arch} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Job Description Outline</label>
              <textarea
                rows={4}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe role mission and how your team prioritizes ethics and culture..."
                className="w-full bg-black/60 border border-zinc-700 p-3 text-xs font-mono text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                required
              />
            </div>

            {/* Key Responsibilities */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                Key Responsibilities (Bullet Points)
              </label>
              {newKeyResponsibilities.map((resp, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={resp}
                  onChange={(e) => {
                    const updated = [...newKeyResponsibilities];
                    updated[idx] = e.target.value;
                    setNewKeyResponsibilities(updated);
                  }}
                  className="w-full bg-black/60 border border-zinc-700 px-3.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              ))}
              <button
                type="button"
                onClick={() => setNewKeyResponsibilities([...newKeyResponsibilities, ''])}
                className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
              >
                <Plus className="w-3 h-3" /> Add Responsibility Line
              </button>
            </div>

            {/* Ethics Mandate */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Team Ethics & Integrity Mandate</label>
              <input
                type="text"
                value={newEthicsMandate}
                onChange={(e) => setNewEthicsMandate(e.target.value)}
                placeholder="e.g. Absolute transparency in audit disclosures and zero tolerance for harassment."
                className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between flex-wrap gap-4">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>You agree to Mind Your Manners $0 Upfront / {newCommissionRate}% Success Placement Terms.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('ads')}
                  className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-black px-6 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Free Ad Live ($0 Upfront)</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================
          VIEW 3: AD APPLICANTS & 1-CLICK PLACEMENT
      ============================================================ */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="bg-[#141414] border border-white/10 p-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-mono font-bold text-white">
                Ad Applicants & Fast-Track Placement Pipeline
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Review candidate applications submitted to your free hiring ads. Fast-track offers with 1-click hire confirmation and commission invoicing.
              </p>
            </div>
            <div className="text-xs font-mono text-amber-300">
              Total Applicants: <span className="font-bold">{applications.length}</span>
            </div>
          </div>

          <div className="space-y-4">
            {applications.map((app) => {
              const isHired = app.status === 'hired';

              return (
                <div
                  key={app.id}
                  className={`border p-6 transition-all ${
                    isHired
                      ? 'bg-zinc-950 border-emerald-500/40'
                      : 'bg-[#141414] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-mono font-bold text-white">{app.candidateName}</h4>
                        <span className="text-zinc-500 font-mono">•</span>
                        <span className="text-xs font-mono text-zinc-400">{app.candidateEmail}</span>
                        <span className="text-zinc-500 font-mono">•</span>
                        <span className="text-xs font-mono text-zinc-400">{app.candidateLocation}</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-amber-300 font-bold">
                          Applied for: {app.jobTitle} ({app.companyName})
                        </span>
                        <span className="bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[10px] font-mono px-2 py-0.5">
                          {app.candidateArchetype}
                        </span>
                        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono px-2 py-0.5 font-bold">
                          {app.candidateCivilityScore}% T.H.I.S. Truest Grade
                        </span>
                      </div>

                      {app.candidateResumeHighlights && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {app.candidateResumeHighlights.map((h, idx) => (
                            <span key={idx} className="bg-black/50 text-zinc-400 text-[10px] font-mono px-2 py-0.5 border border-zinc-800">
                              {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions & Status */}
                    <div className="flex items-center gap-3 self-end lg:self-center">
                      {isHired ? (
                        <div className="text-right font-mono">
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Placed ($
                            {app.finalHiringSalary?.toLocaleString()})
                          </span>
                          <div className="text-[10px] text-zinc-400 mt-1">
                            Commission: ${app.calculatedCommission?.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAppForHire(app);
                              setHireAgreedSalary(160000);
                            }}
                            className="bg-emerald-400 hover:bg-emerald-300 text-black px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm Hire & Bill Commission</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 4: COMMISSION INVOICES & ROI SAVINGS LEDGER
      ============================================================ */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="bg-[#141414] border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-400 text-black font-mono text-[10px] font-bold uppercase px-2 py-0.5">
                  Contingency Commission Ledger
                </span>
                <span className="text-zinc-400 font-mono text-xs">Net 30 Settlement</span>
              </div>
              <h3 className="text-xl font-mono font-bold text-white mt-1">
                Placement Commission Invoices & Client Savings Tracker
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Every verified hire is billed on Net 30 terms. Zero upfront ad spend, zero retainers.
              </p>
            </div>

            <div className="flex items-center gap-4 text-center">
              <div className="bg-black/60 border border-zinc-800 p-3 min-w-[130px]">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Total Billed</div>
                <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                  ${totalCommissionBilled.toLocaleString()}
                </div>
              </div>
              <div className="bg-black/60 border border-purple-500/30 p-3 min-w-[130px]">
                <div className="text-[10px] font-mono text-purple-300 uppercase">Agency Savings</div>
                <div className="text-lg font-mono font-bold text-purple-300 mt-0.5">
                  ${totalClientSavings.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-[#141414] border border-zinc-800 p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-white">{inv.invoiceNumber}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-xs font-mono text-amber-300">{inv.companyName}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-xs font-mono text-zinc-400">Placed: {inv.candidateName}</span>
                  </div>

                  <div className="text-sm font-mono text-zinc-200">
                    Role: <span className="font-bold text-white">{inv.roleTitle}</span>
                  </div>

                  <div className="text-xs font-mono text-zinc-400 flex items-center gap-4 flex-wrap">
                    <span>Agreed Salary: ${inv.agreedSalary.toLocaleString()}</span>
                    <span>Rate: {inv.commissionPercentage}%</span>
                    <span>Due Date: {inv.dueDate}</span>
                    <span className="text-purple-300 font-bold">
                      Saved vs Headhunter: ${inv.savingsVsAgency.toLocaleString()} (52% Saved!)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end lg:self-center">
                  <div className="text-right font-mono">
                    <div className="text-lg font-bold text-emerald-400">
                      ${inv.totalCommission.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-zinc-400 uppercase">
                      Status: <span className="text-amber-300 font-bold uppercase">{inv.status}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Invoice ${inv.invoiceNumber}\nCompany: ${inv.companyName}\nCandidate Placed: ${inv.candidateName}\nTotal Due: $${inv.totalCommission.toLocaleString()}\nTerms: Net 30 Days from Start Date`);
                    }}
                    className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-3 py-1.5 text-xs font-mono uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Statement</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 5: CANDIDATE DIRECT-HIRE JOB BOARD (1-CLICK APPLY)
      ============================================================ */}
      {activeTab === 'candidate-browse' && (
        <div className="space-y-6">
          <div className="bg-[#141414] border border-sky-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-sky-500 text-black font-mono text-[10px] font-bold uppercase px-2 py-0.5">
                  Candidate Direct-Hire Board
                </span>
                <span className="text-emerald-400 font-mono text-xs font-bold">100% Free For Job Seekers</span>
              </div>
              <h3 className="text-xl font-mono font-bold text-white">
                Featured Verified Company Hiring Ads
              </h3>
              <p className="text-xs text-zinc-300 font-sans">
                Companies post these roles for free and hire strictly on verified T.H.I.S. Truest Grade assessments. Apply with 1-click using your character profile.
              </p>
            </div>

            <div className="text-xs font-mono text-zinc-300 bg-black/60 border border-zinc-800 px-4 py-2">
              Showing <span className="text-sky-400 font-bold">{companyAds.filter(a => a.status === 'active').length}</span> Open Free-Hire Roles
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companyAds.filter((a) => a.status === 'active').map((ad) => (
              <div
                key={ad.id}
                className="bg-[#141414] border border-zinc-800 hover:border-sky-400/60 p-6 flex flex-col justify-between transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{ad.companyLogoUrl || '🏢'}</span>
                        <span className="text-xs font-mono font-bold text-zinc-400 uppercase">{ad.companyName}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-xs font-mono text-zinc-400">{ad.locationCity}</span>
                      </div>
                      <h4 className="text-lg font-mono font-bold text-white mt-1">{ad.title}</h4>
                    </div>

                    <span className="bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[10px] font-mono font-bold uppercase px-2 py-0.5">
                      {ad.workplaceType}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-3">
                    {ad.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-zinc-800 text-xs font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Salary Range:</span>
                      <span className="text-white font-bold">${ad.salaryMin.toLocaleString()} - ${ad.salaryMax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Required Civility Score:</span>
                      <span className="text-amber-300 font-bold">{ad.requiredMinCivilityScore}%+</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ad.targetArchetypes.map((arch) => (
                      <span key={arch} className="bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[10px] font-mono px-2 py-0.5">
                        {arch}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-zinc-400">
                    Direct-Hire Ad • $0 Screening Cost
                  </div>

                  <button
                    onClick={() => setApplyingAd(ad)}
                    className="bg-sky-500 hover:bg-sky-400 text-black px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <span>1-Click Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 1: 1-CLICK CANDIDATE APPLY TO FREE AD
      ============================================================ */}
      {applyingAd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-sky-400/50 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="border-b border-zinc-800 pb-4">
              <div className="text-[10px] font-mono uppercase text-sky-400 font-bold">1-Click Direct Application</div>
              <h3 className="text-lg font-mono font-bold text-white mt-1">
                Apply to {applyingAd.title}
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                {applyingAd.companyName} • {applyingAd.locationCity} (${applyingAd.salaryMin.toLocaleString()} - ${applyingAd.salaryMax.toLocaleString()})
              </p>
            </div>

            <form onSubmit={handleCandidateApply} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 uppercase">Your Full Name</label>
                <input
                  type="text"
                  value={candidateNameInput}
                  onChange={(e) => setCandidateNameInput(e.target.value)}
                  className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 uppercase">Email Address</label>
                <input
                  type="email"
                  value={candidateEmailInput}
                  onChange={(e) => setCandidateEmailInput(e.target.value)}
                  className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 uppercase">Your T.H.I.S. Score</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={candidateScoreInput}
                    onChange={(e) => setCandidateScoreInput(Number(e.target.value))}
                    className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-amber-300 font-bold focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 uppercase">Location</label>
                  <input
                    type="text"
                    value={candidateLocationInput}
                    onChange={(e) => setCandidateLocationInput(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 uppercase">Your Character Archetype</label>
                <select
                  value={candidateArchetypeInput}
                  onChange={(e) => setCandidateArchetypeInput(e.target.value)}
                  className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="Crisis Resilient Leader">Crisis Resilient Leader</option>
                  <option value="Ethical Sentinel">Ethical Sentinel</option>
                  <option value="Executive Strategist">Executive Strategist</option>
                  <option value="Adaptive Catalyst">Adaptive Catalyst</option>
                  <option value="Pragmatic Operator">Pragmatic Operator</option>
                </select>
              </div>

              <div className="bg-black/50 border border-zinc-800 p-3 text-[11px] font-mono text-zinc-400">
                ⚡ Mind Your Manners passes your verified credentials directly to {applyingAd.companyName}. There are zero interview fees for candidates.
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyingAd(null)}
                  className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-black px-6 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: CONFIRM HIRE & BILL COMMISSION MODAL
      ============================================================ */}
      {selectedAppForHire && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-emerald-500/60 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="border-b border-zinc-800 pb-4">
              <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                Placement Verification & Success Commission
              </div>
              <h3 className="text-lg font-mono font-bold text-white mt-1">
                Confirm Hire: {selectedAppForHire.candidateName}
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Role: {selectedAppForHire.jobTitle} • Company: {selectedAppForHire.companyName}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 uppercase">Agreed Annual Starting Salary (USD)</label>
                <input
                  type="number"
                  step="5000"
                  value={hireAgreedSalary}
                  onChange={(e) => setHireAgreedSalary(Number(e.target.value))}
                  className="w-full bg-black/60 border border-zinc-700 px-3.5 py-2 text-sm font-mono text-white font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Real-Time Commission Math Breakdown */}
              <div className="bg-zinc-950 border border-emerald-500/30 p-4 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Starting Salary:</span>
                  <span className="text-white">${hireAgreedSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Commission Rate:</span>
                  <span className="text-amber-300 font-bold">{hireCommissionRate}% Success Fee</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Due Date:</span>
                  <span className="text-zinc-300">Net 30 Days from Start Date</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold">
                  <span className="text-white">Total Commission Invoiced:</span>
                  <span className="text-emerald-400">
                    ${Math.round(hireAgreedSalary * (hireCommissionRate / 100)).toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-purple-300 pt-1">
                  🎉 You save ${Math.round(hireAgreedSalary * 0.25 - hireAgreedSalary * (hireCommissionRate / 100)).toLocaleString()} compared to traditional 25% agency retainers!
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAppForHire(null)}
                  className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteHireAndInvoice}
                  disabled={isConfirmingHire}
                  className="bg-emerald-400 hover:bg-emerald-300 text-black px-6 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isConfirmingHire ? 'Issuing Invoice...' : 'Confirm Hire & Generate Invoice'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
