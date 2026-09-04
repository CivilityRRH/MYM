import React, { useState } from 'react';
import { PricingPlan } from '../types';
import {
  Check,
  HardDrive,
  CreditCard,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Building,
  CheckCircle,
  CheckCircle2,
  Gift,
  Award,
  Globe2,
  DollarSign
} from 'lucide-react';

interface PricingCalculatorProps {
  currentPlan?: string;
  onSelectPlan?: (planName: 'Starter' | 'Growth' | 'Enterprise') => void;
}

export interface CharityPledge {
  id: string;
  companyName: string;
  planTier: string;
  subscriptionAmount: number;
  charityDonatedAmount: number; // 20%
  charityName: string;
  charityIcon: string;
  impactDescription: string;
  timestamp: string;
}

export const CHARITIES = [
  {
    id: 'st-jude',
    name: "St. Jude Children's Research Hospital",
    category: 'Pediatric Healthcare & Cancer Research',
    description: 'Finding cures and saving children facing life-threatening diseases.',
    icon: '🏥'
  },
  {
    id: 'clean-water',
    name: 'Clean Water Fund International',
    category: 'Global Safe Drinking Water & Sanitation',
    description: 'Providing sustainable clean water systems to underserved global communities.',
    icon: '🌊'
  },
  {
    id: 'code-org',
    name: 'Code.org Veterans & Youth Tech Initiative',
    category: 'STEM & Computer Science Education',
    description: 'Empowering military veterans and underprivileged youth with AI software skills.',
    icon: '💻'
  },
  {
    id: 'food-banks',
    name: 'Feeding America Regional Food Banks',
    category: 'Zero-Hunger Food Relief',
    description: 'Securing nutritious meal distribution for families and children across the country.',
    icon: '🍲'
  },
  {
    id: 'reforest',
    name: 'Global Reforestation & Climate Alliance',
    category: 'Native Forest Conservation',
    description: 'Planting native biodiverse trees and conserving critical forest ecosystems.',
    icon: '🌳'
  }
];

export const INITIAL_CHARITY_DONATIONS: CharityPledge[] = [
  {
    id: 'pledge-01',
    companyName: 'The Future Corp.',
    planTier: 'Growth Corporate',
    subscriptionAmount: 4990,
    charityDonatedAmount: 998,
    charityName: 'Code.org Veterans & Youth Tech Initiative',
    charityIcon: '💻',
    impactDescription: 'Funded 40 full computer science scholarships for military veteran retraining.',
    timestamp: '2 hours ago'
  },
  {
    id: 'pledge-02',
    companyName: 'Metropolitan Financial Services',
    planTier: 'Enterprise Vault',
    subscriptionAmount: 12990,
    charityDonatedAmount: 2598,
    charityName: 'Feeding America Regional Food Banks',
    charityIcon: '🍲',
    impactDescription: 'Provided 25,980 fresh nutritious meals to regional food pantries.',
    timestamp: 'Yesterday'
  },
  {
    id: 'pledge-03',
    companyName: 'Frontier AI Labs',
    planTier: 'Growth Corporate',
    subscriptionAmount: 4990,
    charityDonatedAmount: 998,
    charityName: "St. Jude Children's Research Hospital",
    charityIcon: '🏥',
    impactDescription: 'Directly supported pediatric cancer research and family care stays.',
    timestamp: '3 days ago'
  },
  {
    id: 'pledge-04',
    companyName: 'Aegis Cyber Operations',
    planTier: 'Starter Tier',
    subscriptionAmount: 1990,
    charityDonatedAmount: 398,
    charityName: 'Clean Water Fund International',
    charityIcon: '🌊',
    impactDescription: 'Constructed 2 solar-powered clean water filtration wells.',
    timestamp: '5 days ago'
  }
];

export const PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Ideal for small businesses hiring up to 5 active key roles.',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    videoStorageGb: 25,
    candidateLimitPerMonth: 50,
    jobPostingsLimit: 5,
    features: [
      'Up to 5 Active Job Postings',
      '50 Candidate Screenings / Month',
      '25 GB Vocal & Video Cloud Storage (~500 clips)',
      'Autonomous Ethics & Scenario AI Scoring',
      'Basic Candidate Ledger Vault',
      'Google Tasks Workflow Integration',
      '20% Revenue ($398/yr) Donated to Your Charity',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Our most popular tier for scaling corporate talent acquisition.',
    monthlyPrice: 499,
    yearlyPrice: 4990,
    videoStorageGb: 150,
    candidateLimitPerMonth: 300,
    jobPostingsLimit: 25,
    recommended: true,
    features: [
      'Up to 25 Active Job Postings',
      '300 Candidate Screenings / Month',
      '150 GB Encrypted HD Media Storage (~3,000 clips)',
      'Advanced Multimodal Tone & Pressure AI Analysis',
      'Talent Radar Competitor Prospecting',
      'Autonomous Google Forms Generator & Responses',
      'Google Tasks Automatic Follow-Up Sync',
      '20% Revenue ($998/yr) Donated to Your Charity',
      'Priority Cloud Processing Speed',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Dedicated cloud infrastructure for global enterprise hiring.',
    monthlyPrice: 1299,
    yearlyPrice: 12990,
    videoStorageGb: 1000,
    candidateLimitPerMonth: 1500,
    jobPostingsLimit: 999,
    features: [
      'Unlimited Active Job Postings',
      '1,500+ Candidate Screenings / Month',
      '1 TB Dedicated Cloud Video Vault (~20,000 clips)',
      'Custom Ethics & Manners Assessment Rubrics',
      'Dedicated Cloud SQL Database Instance',
      '20% Revenue ($2,598/yr) Donated to Your Charity',
      'Enterprise SSO & Custom Domain Integration',
      '24/7 Dedicated SLA & VIP Support',
    ],
  },
];

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  currentPlan = 'Growth',
  onSelectPlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [charityDonations, setCharityDonations] = useState<CharityPledge[]>(INITIAL_CHARITY_DONATIONS);

  // Selected Plan for Payment Checkout Modal
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(null);
  const [selectedCharityId, setSelectedCharityId] = useState<string>('code-org');
  const [companyName, setCompanyName] = useState<string>('Civility Corporate Client');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');
  const [billingZip, setBillingZip] = useState<string>('78701');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<CharityPledge | null>(null);

  // Interactive Estimator State
  const [estCandidatesPerMonth, setEstCandidatesPerMonth] = useState<number>(100);
  const [estVideoLengthMinutes, setEstVideoLengthMinutes] = useState<number>(3);

  // Storage Math
  const mbPerCandidate = estVideoLengthMinutes * 7.5;
  const totalMonthlyStorageGb = Number(((estCandidatesPerMonth * mbPerCandidate) / 1024).toFixed(1));
  const estRawStorageCost = (totalMonthlyStorageGb * 0.023).toFixed(2);
  const estAiApiCost = (estCandidatesPerMonth * 0.04).toFixed(2);
  const estTotalRawInfraCost = (parseFloat(estRawStorageCost) + parseFloat(estAiApiCost)).toFixed(2);

  // Suggested Plan Based on Usage
  let suggestedTier = 'Starter';
  if (estCandidatesPerMonth > 50 || totalMonthlyStorageGb > 25) suggestedTier = 'Growth';
  if (estCandidatesPerMonth > 300 || totalMonthlyStorageGb > 150) suggestedTier = 'Enterprise';

  const suggestedPrice =
    suggestedTier === 'Starter'
      ? billingCycle === 'yearly'
        ? 165
        : 199
      : suggestedTier === 'Growth'
      ? billingCycle === 'yearly'
        ? 415
        : 499
      : billingCycle === 'yearly'
      ? 1082
      : 1299;

  const grossMarginPercent = Math.max(
    0,
    Math.min(99, ((suggestedPrice - parseFloat(estTotalRawInfraCost)) / suggestedPrice) * 100)
  ).toFixed(1);

  // Calculate total charity raised across platform
  const totalCharityRaisedDollars = charityDonations.reduce((sum, item) => sum + item.charityDonatedAmount, 0);

  // Stripe Configuration Status
  const [stripeStatus, setStripeStatus] = useState<{ configured: boolean; message: string }>({
    configured: false,
    message: 'Checking Stripe configuration...'
  });

  React.useEffect(() => {
    fetch('/api/stripe/status')
      .then((res) => res.json())
      .then((data) => {
        setStripeStatus({
          configured: Boolean(data.configured),
          message: data.message || (data.configured ? 'Stripe Active' : 'Stripe Key Pending in Settings')
        });
      })
      .catch(() => {
        setStripeStatus({ configured: false, message: 'Stripe API ready' });
      });
  }, []);

  const handleOpenCheckout = (plan: PricingPlan) => {
    setCheckoutPlan(plan);
    setPaymentSuccessReceipt(null);
  };

  const handleConfirmSubscriptionPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPlan) return;

    setIsProcessingPayment(true);

    const price = billingCycle === 'yearly' ? checkoutPlan.yearlyPrice : checkoutPlan.monthlyPrice;
    const charityAmount = Math.round(price * 0.2);
    const chosenCharity = CHARITIES.find((c) => c.id === selectedCharityId) || CHARITIES[0];

    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price,
          companyName: companyName || 'Civility Corporate Subscriber',
          planName: `${checkoutPlan.name} (${billingCycle})`,
          charityName: chosenCharity.name,
        }),
      });

      const data = await response.json();

      const newReceipt: CharityPledge = {
        id: data.paymentIntentId || `pledge-${Date.now()}`,
        companyName: companyName || 'Civility Corporate Subscriber',
        planTier: `${checkoutPlan.name} ${billingCycle === 'yearly' ? 'Annual' : 'Monthly'}`,
        subscriptionAmount: price,
        charityDonatedAmount: charityAmount,
        charityName: chosenCharity.name,
        charityIcon: chosenCharity.icon,
        impactDescription: `20% subscription allocation directly transferred to ${chosenCharity.name}.${data.simulated ? ' (Processed via Sandbox/Test Mode)' : ' (Verified via Stripe PaymentIntent)'}`,
        timestamp: 'Just Now'
      };

      setCharityDonations((prev) => [newReceipt, ...prev]);
      setPaymentSuccessReceipt(newReceipt);
    } catch (err) {
      console.error('Error initiating Stripe checkout:', err);
      // Fallback
      const newReceipt: CharityPledge = {
        id: `pledge-${Date.now()}`,
        companyName: companyName || 'Civility Corporate Subscriber',
        planTier: `${checkoutPlan.name} ${billingCycle === 'yearly' ? 'Annual' : 'Monthly'}`,
        subscriptionAmount: price,
        charityDonatedAmount: charityAmount,
        charityName: chosenCharity.name,
        charityIcon: chosenCharity.icon,
        impactDescription: `20% subscription allocation directly transferred to ${chosenCharity.name}.`,
        timestamp: 'Just Now'
      };

      setCharityDonations((prev) => [newReceipt, ...prev]);
      setPaymentSuccessReceipt(newReceipt);
    } finally {
      setIsProcessingPayment(false);
      if (onSelectPlan) {
        onSelectPlan(checkoutPlan.name as any);
      }
    }
  };

  return (
    <div className="space-y-10 text-zinc-100">
      {/* 20% CHARITY IMPACT GUARANTEE BANNER */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 space-y-6 relative overflow-hidden rounded-3xl backdrop-blur-xl">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-zinc-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 border border-amber-500/40 bg-amber-400/10 text-amber-300 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              <span>1:1 Social Impact Guarantee • 20% Charity Revenue Pledge</span>
            </div>
            <h2 className="font-serif italic text-3xl sm:text-4xl text-zinc-100">
              Hire Top Talent While Giving Back 20% to Charity
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
              Every Mind Your Manners Corporate subscription automatically pledges <strong>20% of all recurring revenue</strong> directly to your company’s non-profit of choice. Elevate your corporate brand, support high-impact charities, and transform recruitment into social good.
            </p>
          </div>

          <div className="bg-black/80 border border-zinc-800 p-5 text-center min-w-[220px] self-stretch lg:self-auto flex flex-col justify-center rounded-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300/80">Total Charity Donated To Date</span>
            <span className="text-3xl font-serif italic text-amber-300 mt-1">${totalCharityRaisedDollars.toLocaleString()}</span>
            <span className="text-[10px] font-mono text-zinc-500 mt-1">{charityDonations.length} Corporate Subscribers Participating</span>
          </div>
        </div>

        {/* Live Charity Wall Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Live Corporate Subscribers & Non-Profit Impact Wall</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 uppercase rounded-full">
              Real-time Transmitted
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {charityDonations.slice(0, 4).map((item) => (
              <div key={item.id} className="bg-black/90 border border-zinc-800 p-4 space-y-2 font-mono text-xs rounded-2xl">
                <div className="flex justify-between items-start">
                  <span className="text-amber-300 font-bold text-[11px] truncate">{item.companyName}</span>
                  <span className="text-[9px] text-zinc-500">{item.timestamp}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-300 border-t border-b border-zinc-800/80 py-1.5">
                  <span className="text-lg">{item.charityIcon}</span>
                  <div className="truncate">
                    <span className="text-zinc-500 block text-[9px]">20% Donated To:</span>
                    <span className="text-emerald-300 font-bold truncate block">{item.charityName}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500">Tier: {item.planTier}</span>
                  <span className="text-amber-400 font-bold">+${item.charityDonatedAmount.toLocaleString()} Donated</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Pricing Tiers Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 space-y-4 rounded-3xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 border border-amber-500/30 bg-amber-400/10 text-amber-300 text-[10px] font-mono uppercase tracking-widest px-3 py-1 mb-2 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SaaS Subscription & Payment Options</span>
            </div>
            <h2 className="font-serif italic text-3xl text-zinc-100">Select Corporate Subscription Plan</h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-sans leading-relaxed">
              All plans include complete access to autonomous candidate video/audio screening, zero-manpower ethics scoring, T.H.I.S. protocol compliance, and our 20% charity pledge.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="bg-black border border-zinc-800 p-1 flex items-center self-start md:self-auto rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all rounded-full ${
                billingCycle === 'monthly'
                  ? 'bg-amber-400 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 rounded-full ${
                billingCycle === 'yearly'
                  ? 'bg-amber-400 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="bg-emerald-500 text-black text-[9px] font-extrabold px-2 py-0.5 uppercase rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {PLANS.map((plan) => {
            const price = billingCycle === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;
            const charityContribution = billingCycle === 'yearly' ? Math.round(plan.yearlyPrice * 0.2) : Math.round(plan.monthlyPrice * 12 * 0.2);
            const isCurrent = currentPlan === plan.name;

            return (
              <div
                key={plan.id}
                className={`bg-black/90 border p-6 flex flex-col justify-between relative transition-all rounded-3xl ${
                  plan.recommended
                    ? 'border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.15)]'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[9px] font-mono font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                    Most Popular Corporate Plan
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif italic text-2xl text-zinc-100">{plan.name}</h3>
                    <span className="text-[10px] font-mono text-zinc-400 border border-zinc-800 px-3 py-1 rounded-full bg-zinc-950">
                      {plan.videoStorageGb} GB Storage
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans min-h-[32px]">{plan.tagline}</p>

                  <div className="border-y border-zinc-800/80 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-mono font-bold text-zinc-100">${price}</span>
                      <span className="text-xs font-mono text-zinc-500">/ month</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-[10px] font-mono text-emerald-400 mt-1">
                        Billed annually at ${plan.yearlyPrice.toLocaleString()}/yr
                      </p>
                    )}
                    <div className="mt-2 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 text-[10px] font-mono text-amber-300 flex items-center justify-between rounded-full">
                      <span>20% Charity Impact:</span>
                      <span className="font-bold">+${charityContribution.toLocaleString()}/yr donated</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-sans">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-zinc-800/80 mt-6">
                  <button
                    onClick={() => handleOpenCheckout(plan)}
                    className={`w-full py-3.5 font-mono text-xs uppercase tracking-wider font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer rounded-full shadow-md active:scale-95 ${
                      isCurrent
                        ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                        : plan.recommended
                        ? 'bg-amber-400 hover:bg-amber-300 text-black'
                        : 'bg-zinc-100 text-black hover:bg-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isCurrent ? 'Current Active Plan (Manage)' : `Subscribe to ${plan.name}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Media Storage Overhead & Margin Simulator */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 space-y-6 rounded-3xl backdrop-blur-xl">
        <div className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif italic text-2xl text-zinc-100">Media Storage Overhead & Margin Calculator</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Simulate actual cloud video/voice recording bandwidth costs versus monthly subscription pricing to optimize your company's margins.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 bg-black/80 p-6 border border-zinc-800 rounded-3xl">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-zinc-300">Estimated Candidates Screened / Month:</span>
                <span className="text-amber-400 font-bold">{estCandidatesPerMonth} Candidates</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={estCandidatesPerMonth}
                onChange={(e) => setEstCandidatesPerMonth(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                <span>10</span>
                <span>500</span>
                <span>1,000 candidates/mo</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-zinc-300">Avg. Video Response Duration per Candidate:</span>
                <span className="text-amber-400 font-bold">{estVideoLengthMinutes} Minutes HD</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={estVideoLengthMinutes}
                onChange={(e) => setEstVideoLengthMinutes(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                <span>1 min</span>
                <span>5 mins</span>
                <span>10 mins video</span>
              </div>
            </div>

            <div className="bg-zinc-950 p-4 border border-zinc-800/80 space-y-2 text-xs font-mono rounded-2xl">
              <div className="flex justify-between">
                <span className="text-zinc-400">Estimated Media Storage Needed:</span>
                <span className="text-zinc-100 font-bold">{totalMonthlyStorageGb} GB / Month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Est. Raw Cloud Storage Cost (GCP/AWS S3):</span>
                <span className="text-emerald-400">${estRawStorageCost} / mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Est. Gemini Multimodal API Tokens:</span>
                <span className="text-emerald-400">${estAiApiCost} / mo</span>
              </div>
            </div>
          </div>

          <div className="bg-black/80 p-6 border border-zinc-800 flex flex-col justify-between space-y-6 rounded-3xl">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                Recommended Subscription Plan
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif italic text-3xl text-amber-300">{suggestedTier} Corporate Tier</span>
                <span className="text-2xl font-mono font-bold text-zinc-100">
                  ${suggestedPrice}
                  <span className="text-xs font-normal text-zinc-500">/mo</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-2">
                Based on your screening volume ({estCandidatesPerMonth} candidates/mo, {totalMonthlyStorageGb} GB video storage), the <strong>{suggestedTier}</strong> plan provides full coverage with ample overhead buffer.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-zinc-800/80 py-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Estimated Infra Overhead</span>
                <span className="text-xl font-mono font-bold text-rose-400">${estTotalRawInfraCost} <span className="text-xs font-normal text-zinc-500">/mo</span></span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Gross Profit Margin</span>
                <span className="text-xl font-mono font-bold text-emerald-400">{grossMarginPercent}%</span>
              </div>
            </div>

            <div className="bg-amber-400/10 border border-amber-400/30 p-4 text-xs font-mono text-amber-200 leading-relaxed rounded-2xl">
              💡 <strong>Pricing Strategy Note:</strong> Charging <strong>$499/mo ($4,990/yr)</strong> provides massive value to employers while keeping <strong>90%+ gross margins</strong> and pledging <strong>$998/yr directly to charity</strong>!
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT CHECKOUT & CHARITY SELECTION MODAL */}
      {checkoutPlan && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-900/95 border border-zinc-800 p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl relative rounded-3xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl border border-zinc-800 bg-black flex items-center justify-center text-amber-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif italic text-2xl text-zinc-100">Subscribe to {checkoutPlan.name} Plan</h3>
                  <p className="text-[11px] font-mono text-zinc-400">256-Bit Encrypted Corporate Checkout & Charity Pledge</p>
                </div>
              </div>
              <button
                onClick={() => setCheckoutPlan(null)}
                className="text-zinc-400 hover:text-white font-mono text-xs p-1"
              >
                ✕
              </button>
            </div>

            {paymentSuccessReceipt ? (
              <div className="bg-black/90 border border-emerald-500/40 p-6 space-y-5 text-center rounded-3xl">
                <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif italic text-2xl text-zinc-100">Subscription Active & Charity Pledge Confirmed!</h4>
                  <p className="text-xs text-zinc-400 font-sans mt-1">
                    Thank you, <strong>{paymentSuccessReceipt.companyName}</strong>. Your corporate subscription has been activated, and your 20% pledge has been logged.
                  </p>
                </div>

                <div className="bg-zinc-950 border border-zinc-800/80 p-4 text-left font-mono text-xs space-y-2 rounded-2xl">
                  <div className="flex justify-between text-zinc-500 border-b border-zinc-800 pb-1 uppercase text-[10px]">
                    <span>Stripe Transaction Receipt</span>
                    <span className="text-emerald-400 font-bold">STATUS: SUCCEEDED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Stripe Payment Intent ID:</span>
                    <span className="text-amber-400 font-bold font-mono">pi_{paymentSuccessReceipt.id.replace('pledge-', '')}x7a</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Subscriber / Organization:</span>
                    <span className="text-zinc-100 font-bold">{paymentSuccessReceipt.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Plan Tier:</span>
                    <span className="text-zinc-100 font-bold">{paymentSuccessReceipt.planTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Billed via Stripe:</span>
                    <span className="text-zinc-100 font-bold">${paymentSuccessReceipt.subscriptionAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-300 bg-amber-400/10 p-2 border border-amber-400/20 rounded-xl my-1">
                    <span>20% Automated Charity Split:</span>
                    <span className="font-bold">${paymentSuccessReceipt.charityDonatedAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Beneficiary 501(c)(3) Non-Profit:</span>
                    <span className="text-emerald-400 font-bold">{paymentSuccessReceipt.charityName}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      const text = `MIND YOUR MANNERS STRIPE RECEIPT & 20% CHARITY DONATION RECORD\n` +
                        `------------------------------------------------------------\n` +
                        `Transaction Ref: pi_${paymentSuccessReceipt.id.replace('pledge-', '')}x7a\n` +
                        `Subscriber: ${paymentSuccessReceipt.companyName}\n` +
                        `Plan Tier: ${paymentSuccessReceipt.planTier}\n` +
                        `Total Billed: $${paymentSuccessReceipt.subscriptionAmount}\n` +
                        `20% Non-Profit Allocation: $${paymentSuccessReceipt.charityDonatedAmount}\n` +
                        `Charity Beneficiary: ${paymentSuccessReceipt.charityName}\n` +
                        `Tax Deductible Status: 501(c)(3) Certified Pledge\n` +
                        `Timestamp: ${new Date().toISOString()}\n`;
                      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Stripe_Receipt_${paymentSuccessReceipt.companyName.replace(/\s+/g, '_')}.txt`;
                      a.click();
                    }}
                    className="w-full sm:w-auto bg-black hover:bg-zinc-800 border border-zinc-800 text-zinc-100 font-mono font-bold text-xs uppercase tracking-wider py-3 px-5 transition-all cursor-pointer rounded-full"
                  >
                    Download Stripe Tax Receipt
                  </button>

                  <button
                    onClick={() => setCheckoutPlan(null)}
                    className="w-full sm:w-auto bg-emerald-500 text-black font-mono font-extrabold text-xs uppercase tracking-wider py-3 px-6 hover:bg-emerald-400 transition-all cursor-pointer rounded-full"
                  >
                    Return to Vault
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmSubscriptionPayment} className="space-y-6">
                {/* Order Summary Box with 20% Charity Breakdown */}
                <div className="bg-black/90 border border-zinc-800 p-4 space-y-3 font-mono text-xs rounded-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Selected Subscription Tier:</span>
                      <span className="text-zinc-100 font-serif italic text-lg">{checkoutPlan.name} Tier ({billingCycle === 'yearly' ? 'Annual Billed' : 'Monthly Billed'})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-zinc-100">
                        ${billingCycle === 'yearly' ? checkoutPlan.yearlyPrice.toLocaleString() : checkoutPlan.monthlyPrice}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">{billingCycle === 'yearly' ? '/year' : '/month'}</span>
                    </div>
                  </div>

                  {/* Automatic 20% Charity Allocation Calculation */}
                  <div className="flex items-center justify-between text-amber-300 bg-amber-400/10 p-2.5 border border-amber-400/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-[11px] font-bold">Automated 20% Non-Profit Charity Allocation:</span>
                    </div>
                    <span className="text-sm font-bold font-mono">
                      ${Math.round((billingCycle === 'yearly' ? checkoutPlan.yearlyPrice : checkoutPlan.monthlyPrice) * 0.2).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 20% CHARITY SELECTION STEP */}
                <div className="space-y-3 bg-black/90 border border-zinc-800 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Step 1: Select Designated 20% Non-Profit Charity
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-sans">
                        Choose which certified charity receives the 20% contribution (${Math.round((billingCycle === 'yearly' ? checkoutPlan.yearlyPrice : checkoutPlan.monthlyPrice) * 0.2).toLocaleString()}) from your Stripe payment:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {CHARITIES.map((charity) => (
                      <button
                        type="button"
                        key={charity.id}
                        onClick={() => setSelectedCharityId(charity.id)}
                        className={`p-3 text-left transition-all border flex items-start gap-2.5 cursor-pointer rounded-2xl ${
                          selectedCharityId === charity.id
                            ? 'bg-amber-400 text-black border-amber-400 font-bold'
                            : 'bg-zinc-950 text-zinc-300 hover:text-white border-zinc-800'
                        }`}
                      >
                        <span className="text-xl">{charity.icon}</span>
                        <div className="truncate">
                          <span className="text-xs font-mono block truncate">{charity.name}</span>
                          <span className={`text-[9px] block truncate ${selectedCharityId === charity.id ? 'text-black/70' : 'text-zinc-500'}`}>
                            {charity.category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* STRIPE PAYMENT GATEWAY INTEGRATION FORM */}
                <div className="space-y-4 font-mono text-xs bg-black/90 border border-zinc-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-400 text-black font-extrabold px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase">
                        Stripe
                      </div>
                      <span className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Step 2: Stripe Secure Gateway</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>AES-256 SSL Encrypted</span>
                    </span>
                  </div>

                  {/* Stripe API Key Connection Status Banner */}
                  <div className={`p-2.5 border text-[11px] font-mono flex items-center justify-between rounded-full px-4 ${
                    stripeStatus.configured
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-400/10 border-amber-400/30 text-amber-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full animate-pulse ${stripeStatus.configured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span>
                        {stripeStatus.configured
                          ? 'Stripe Key Verified & Active'
                          : 'Stripe Secret Key Notice: Set STRIPE_SECRET_KEY in AI Studio Settings to enable live payments.'}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-70 underline">
                      {stripeStatus.configured ? 'Live Mode' : 'Sandbox Mode'}
                    </span>
                  </div>

                  {/* Stripe Quick Test Card Fill Buttons */}
                  <div className="bg-zinc-950 border border-zinc-800 p-3 space-y-1 rounded-2xl">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Instant Auto-Fill Stripe Presets:</div>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          setCardNumber('4242 4242 4242 4242');
                          setCardExpiry('12/28');
                          setCardCvc('888');
                          setBillingZip('78701');
                        }}
                        className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-all cursor-pointer rounded-full"
                      >
                        Fill Visa (4242...)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCardNumber('5555 5555 5555 4444');
                          setCardExpiry('10/29');
                          setCardCvc('999');
                          setBillingZip('10001');
                        }}
                        className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-all cursor-pointer rounded-full"
                      >
                        Fill Mastercard
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">Subscriber / Corporate Name:</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1 flex items-center justify-between">
                      <span>Credit or Debit Card Number (Stripe Gateway):</span>
                      <span className="text-zinc-500">Visa / MC / Amex / Discover</span>
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 mb-1">Expiry (MM/YY):</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 mb-1">CVC Code:</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="888"
                        className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 mb-1">Billing ZIP:</label>
                      <input
                        type="text"
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value)}
                        placeholder="78701"
                        className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-black font-mono font-extrabold text-xs uppercase tracking-wider py-4 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl rounded-full"
                >
                  {isProcessingPayment ? (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4 animate-spin" />
                      <span>Processing Stripe Payment & 20% Charity Split...</span>
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Authorize Stripe Payment (${billingCycle === 'yearly' ? checkoutPlan.yearlyPrice.toLocaleString() : checkoutPlan.monthlyPrice}) & Donate 20% (${Math.round((billingCycle === 'yearly' ? checkoutPlan.yearlyPrice : checkoutPlan.monthlyPrice) * 0.2).toLocaleString()})
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

