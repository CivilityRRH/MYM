import React, { useState } from 'react';
import { AuthUser, AuthMode } from '../types';
import { googleSignIn } from '../lib/firebase';
import { MindYourMannersLogo } from './MindYourMannersLogo';
import { PIONEER_RONNIE_HILL_PROFILE } from '../data/initialData';
import {
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  Sparkles,
  KeyRound,
  Mail,
  UserPlus,
  LogIn,
  CheckCircle2,
  ArrowRight,
  Award,
  Users,
  HeartHandshake,
  Compass,
  Target,
  FileText,
  Volume2,
  Video,
  Check,
  Flame,
  Building,
  Zap,
  Eye
} from 'lucide-react';

interface LandingPageProps {
  onLogin: (user: AuthUser) => void;
  currentUser?: AuthUser | null;
  onNavigateToPortal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  currentUser,
  onNavigateToPortal
}) => {
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [signupType, setSignupType] = useState<'candidate' | 'corporate'>('candidate');
  const [activeInteractivePath, setActiveInteractivePath] = useState<'candidate' | 'corporate'>('candidate');

  // Sign Up Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCompany, setSignupCompany] = useState('');

  // Log In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<AuthMode>('candidate');

  // Safe Word State
  const [safeWordInput, setSafeWordInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPioneerModal, setShowPioneerModal] = useState(false);

  const isOwnerEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    return clean === 'ronniehillsugc@gmail.com' || clean === 'owner@hireup.io' || clean.includes('ronniehills');
  };

  // Safe Word Verification (Platform Owner Ronnie Hill VIP unlock)
  const handleVerifySafeWord = (codeOverride?: string) => {
    const code = (codeOverride !== undefined ? codeOverride : safeWordInput).trim().toLowerCase();
    if (code === 'stay frosty') {
      const ownerUser: AuthUser = {
        email: 'ronniehillsugc@gmail.com',
        role: 'universal',
        name: 'Ronnie Hill (Founder & Platform Owner)',
        organization: 'Mind Your Manners Global HQ',
        plan: 'Enterprise',
      };
      localStorage.setItem('mind_your_manners_auth_user', JSON.stringify(ownerUser));
      onLogin(ownerUser);
      setToastMessage('🔑 Founder Safe Word Verified! Welcome back, Ronnie Hill.');
      return true;
    } else if (code.length > 0) {
      setToastMessage('❌ Invalid Safe Word / Passphrase.');
      setTimeout(() => setToastMessage(null), 3000);
      return false;
    }
    return false;
  };

  // Quick Instant Test Drive (1-Click Guest Entry)
  const handleQuickGuestEntry = (role: 'candidate' | 'corporate') => {
    if (role === 'candidate') {
      const guestCandidate: AuthUser = {
        email: 'guest.candidate@mindyourmanners.io',
        role: 'candidate',
        name: 'Jordan Taylor (Candidate Preview)',
        organization: 'Job Seeker Candidate (Free Tier)',
        plan: 'Starter',
      };
      localStorage.setItem('mind_your_manners_auth_user', JSON.stringify(guestCandidate));
      onLogin(guestCandidate);
    } else {
      const guestCorporate: AuthUser = {
        email: 'executive@civilitycorp.io',
        role: 'corporate',
        name: 'Alexandra Chen (Corporate Executive)',
        organization: 'The Future Corp.',
        plan: 'Growth',
      };
      localStorage.setItem('mind_your_manners_auth_user', JSON.stringify(guestCorporate));
      onLogin(guestCorporate);
    }
  };

  // Google OAuth Auth
  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setToastMessage(null);
    try {
      const res = await googleSignIn();
      if (res && res.user) {
        const email = res.user.email || 'user@gmail.com';
        const name = res.user.displayName || email.split('@')[0] || 'Authenticated User';
        const isOwner = isOwnerEmail(email);
        const role: AuthMode = isOwner ? 'universal' : 'candidate';

        const authUser: AuthUser = {
          email,
          role,
          name: isOwner ? 'Ronnie Hill (Founder & Platform Owner)' : name,
          organization: isOwner ? 'Mind Your Manners Global HQ' : 'Google Authenticated Candidate',
          plan: isOwner ? 'Enterprise' : 'Starter',
        };

        localStorage.setItem('mind_your_manners_auth_user', JSON.stringify(authUser));
        onLogin(authUser);
      } else {
        setToastMessage('Google sign-in was cancelled.');
        setTimeout(() => setToastMessage(null), 2500);
      }
    } catch (err: any) {
      console.warn('Google sign-in handled:', err.message);
      setToastMessage(err.message || 'Google authentication encountered an issue.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupName) {
      setToastMessage('Please complete all required fields.');
      return;
    }

    const isOwner = isOwnerEmail(signupEmail);
    const role: AuthMode = isOwner ? 'universal' : signupType === 'candidate' ? 'candidate' : 'corporate';

    const newUser: AuthUser = {
      email: signupEmail.trim(),
      role,
      name: isOwner ? 'Ronnie Hill (Founder & Platform Owner)' : signupName.trim(),
      organization: signupType === 'corporate' ? signupCompany || 'Subscribing Enterprise' : 'Job Seeker Candidate',
      plan: isOwner ? 'Enterprise' : signupType === 'corporate' ? 'Growth' : 'Starter',
    };

    localStorage.setItem('mind_your_manners_auth_user', JSON.stringify(newUser));
    onLogin(newUser);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setToastMessage('Please enter your email.');
      return;
    }

    const isOwner = isOwnerEmail(loginEmail);
    const role: AuthMode = isOwner ? 'universal' : loginRole;

    const loggedInUser: AuthUser = {
      email: loginEmail.trim(),
      role,
      name: isOwner ? 'Ronnie Hill (Founder & Platform Owner)' : loginEmail.split('@')[0],
      organization: role === 'corporate' ? 'Corporate Partner' : 'Registered Candidate',
      plan: isOwner ? 'Enterprise' : role === 'corporate' ? 'Growth' : 'Starter',
    };

    localStorage.setItem('mind_your_manners_auth_user', JSON.stringify(loggedInUser));
    onLogin(loggedInUser);
  };

  const pioneer = PIONEER_RONNIE_HILL_PROFILE;

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 selection:bg-amber-400 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-amber-400 text-black px-4 py-2.5 rounded-full font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#080808]/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MindYourMannersLogo className="w-8 h-8 text-amber-400" />
            <div className="flex flex-col">
              <span className="font-serif italic font-bold text-base sm:text-lg text-white leading-none">
                Mind Your Manners
              </span>
              <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest mt-0.5">
                Candidates: Free • Companies: Subscription
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-mono uppercase tracking-wider text-zinc-400">
            <a href="#vision" className="hover:text-amber-300 transition-colors">Founder's Vision</a>
            <a href="#pioneer" className="hover:text-amber-300 transition-colors">Pioneer Benchmark</a>
            <a href="#pipeline" className="hover:text-amber-300 transition-colors">Zero-Interview Flow</a>
            <a href="#auth-chamber" className="hover:text-amber-300 transition-colors">Access Portal</a>
          </nav>

          <div className="flex items-center space-x-2.5">
            <a
              href="#auth-chamber"
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-extrabold uppercase tracking-wider rounded-full shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Streamlined Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        
        {/* HERO VALUE PROPOSITION */}
        <section className="text-center space-y-6 max-w-4xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 text-amber-300 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest rounded-full shadow-xs">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Autonomous Hiring & Lifelong Career Development</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic text-white tracking-tight leading-[1.12]">
            Where Companies Never Have to Interview Again.
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-2xl mx-auto">
            Candidates complete at-home ethics, vocal tone, and video scenario evaluations before companies discover them. Eliminating friction through verified character archetypes and true calling calibration.
          </p>

          {/* 2 Primary Path Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-left max-w-2xl mx-auto">
            {/* Candidate Card */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-black border border-emerald-500/40 rounded-3xl p-5 space-y-3 shadow-xl hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/30">
                    100% Free Forever
                  </span>
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white">For Job Seekers & Candidates</h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  Take opening video interviews, calculate your True Calling and palace of passion, discover unseen opportunities, and get hired without cold resumes.
                </p>
              </div>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => handleQuickGuestEntry('candidate')}
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-extrabold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>Launch Free Candidate Chamber</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Corporate Card */}
            <div className="bg-gradient-to-br from-amber-950/40 via-zinc-900 to-black border border-amber-500/40 rounded-3xl p-5 space-y-3 shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/30">
                    Subscription Tier
                  </span>
                  <Building2 className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white">For Corporate Employers</h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  Search pre-evaluated talent by personality type, review voice & crisis recordings, and support workers through retirement without bad hire turnover.
                </p>
              </div>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => handleQuickGuestEntry('corporate')}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-mono font-extrabold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>Launch Corporate Employer HQ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDER'S VISION & PIONEER PROFILE SPOTLIGHT */}
        <section id="vision" className="space-y-8">
          <div className="bg-gradient-to-br from-zinc-900 via-[#101010] to-black border border-amber-500/30 rounded-3xl p-6 sm:p-10 relative shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-serif font-bold text-xl">
                  RH
                </div>
                <div>
                  <h2 className="text-xl font-serif italic font-bold text-white">A Message from the Founder</h2>
                  <p className="text-xs font-mono text-amber-300">Ronnie Hill • Creator of Mind Your Manners</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-amber-400/10 text-amber-300 rounded-full border border-amber-400/30 font-bold">
                  Pioneer Standard
                </span>
              </div>
            </div>

            {/* Founder Quote */}
            <div className="space-y-4 font-serif text-base sm:text-lg text-zinc-200 leading-relaxed italic">
              <p>
                "I'm <span className="text-amber-300 font-bold not-italic">Ronnie Hill</span>. I've built a complete ecosystem for hiring and lifelong career development."
              </p>
              <p>
                "Candidates take ethics, vocal tone, and crisis scenario tests before companies ever find them. Companies can search for specific personality types that match their needs — this permanently eliminates bad hires caused by personality conflicts."
              </p>
              <p className="text-white font-semibold not-italic">
                "I envision a world where companies don’t interview anymore — they simply welcome a fully prepared professional and we all continue to build together until retirement."
              </p>
            </div>

            {/* PIONEER CANDIDATE #1 SHOWCASE (RONNIE HILL) */}
            <div id="pioneer" className="border-t border-zinc-800 pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                    Pioneer Candidate Profile #1 (Platform Benchmark)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  T.H.I.S. Score: 98.6% Certified
                </span>
              </div>

              <div className="bg-black/70 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                      <span>{pioneer.fullName}</span>
                      <span className="text-[10px] font-mono uppercase bg-amber-400 text-black px-2 py-0.5 rounded-full font-bold">
                        Lead Pioneer
                      </span>
                    </h5>
                    <p className="text-xs text-amber-300/80 font-mono mt-0.5">
                      {pioneer.archetypeProjection?.title} • {pioneer.locationCity}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPioneerModal(true)}
                      className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Pioneer Dossier & Calling Video</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block uppercase">Inner Calling Score</span>
                    <span className="text-base font-bold text-amber-400">99.4/100 • Zenith Peak</span>
                  </div>
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block uppercase">Vocal & Tone Poise</span>
                    <span className="text-base font-bold text-emerald-400">98.4% • Sovereign Resonance</span>
                  </div>
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block uppercase">Crisis Video Kinesics</span>
                    <span className="text-base font-bold text-sky-400">98.8% • Zero-Panic Anchor</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 font-sans italic border-t border-zinc-800/80 pt-3">
                  "{pioneer.submission?.callingVideoTranscript}"
                </p>
              </div>
            </div>

            {/* Safe Word Quick Unlock Bar */}
            <div className="border-t border-zinc-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <span className="text-zinc-400 text-[11px]">
                Platform Owner Ronnie Hill Quick Passkey Access:
              </span>
              <button
                type="button"
                onClick={() => handleVerifySafeWord('stay frosty')}
                className="text-amber-300 hover:text-amber-200 underline uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Founder Quick Unlock ("stay frosty")</span>
              </button>
            </div>
          </div>
        </section>

        {/* ZERO-INTERVIEW PIPELINE (COMPACT & INTUITIVE) */}
        <section id="pipeline" className="space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
              3-Stage Autonomous Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-white">How Zero-Interview Placement Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-2.5 hover:border-zinc-700 transition-all">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                01
              </div>
              <h3 className="font-serif font-bold text-base text-white">Autonomous Screening</h3>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Candidates complete opening calling interviews, ethics reflections, audio tone tests, and crisis video scenarios at home.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-2.5 hover:border-zinc-700 transition-all">
              <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs flex items-center justify-center">
                02
              </div>
              <h3 className="font-serif font-bold text-base text-white">Positive Archetype & Calling</h3>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Our profiler calculates working temperaments and inner potential, matching candidates with companies by personality synergy.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-2.5 hover:border-zinc-700 transition-all">
              <div className="w-7 h-7 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono font-bold text-xs flex items-center justify-center">
                03
              </div>
              <h3 className="font-serif font-bold text-base text-white">Zero-Interview Placement</h3>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Companies review verified Boardroom Dossiers and welcome fully prepared professionals without months of interviewing.
              </p>
            </div>
          </div>
        </section>

        {/* AUTHENTICATION / ACCESS CHAMBER */}
        <section id="auth-chamber" className="max-w-xl mx-auto space-y-6 pt-2">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="text-center space-y-1.5 border-b border-zinc-800 pb-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-300 uppercase tracking-widest font-bold">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>Enter Mind Your Manners</span>
              </div>
              <h3 className="text-xl font-serif italic text-white font-bold">
                Sign In or Create Your Account
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Candidates: Free Forever • Companies: Subscription
              </p>
            </div>

            {/* Founder Safe Word Box */}
            <div className="bg-black/80 border border-amber-500/30 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-300 font-bold flex items-center gap-1.5 uppercase">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Founder / VIP Safe Word</span>
                </span>
                <span className="text-[9px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 uppercase font-bold">
                  VIP
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={safeWordInput}
                  onChange={(e) => setSafeWordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleVerifySafeWord();
                    }
                  }}
                  placeholder="Enter Safe Word (e.g. stay frosty)"
                  className="flex-1 py-2 px-3.5 bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 font-mono text-xs rounded-full focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleVerifySafeWord()}
                  className="bg-amber-400 hover:bg-amber-300 text-black font-mono font-extrabold text-xs uppercase px-4 py-2 flex items-center gap-1 rounded-full cursor-pointer transition-all shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-black" />
                  <span>Unlock</span>
                </button>
              </div>
            </div>

            {/* Google OAuth Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isGoogleLoading}
                className="w-full bg-zinc-950 hover:bg-zinc-800 text-zinc-100 font-mono font-bold text-xs uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md border border-zinc-800 rounded-full disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.18 21.3 7.22 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 0 12s.43 3.87 1.19 5.4l4.08-3.16z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.18 2.7 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
                <span>{isGoogleLoading ? 'Connecting...' : 'Sign in with Google Account'}</span>
              </button>
            </div>

            {/* Sign Up / Sign In Tab Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-black border border-zinc-800 rounded-full font-mono text-xs">
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className={`py-2 px-4 font-bold flex items-center justify-center gap-1.5 transition-all rounded-full ${
                  authTab === 'signup'
                    ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`py-2 px-4 font-bold flex items-center justify-center gap-1.5 transition-all rounded-full ${
                  authTab === 'login'
                    ? 'bg-amber-400 text-black font-extrabold shadow-md'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>

            {/* SIGN UP FORM */}
            {authTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3 font-mono text-xs">
                <div className="flex border border-zinc-800 p-1 bg-black rounded-full gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupType('candidate')}
                    className={`flex-1 py-1.5 px-3 flex items-center justify-center gap-1.5 rounded-full font-bold transition-all cursor-pointer ${
                      signupType === 'candidate'
                        ? 'bg-emerald-500 text-black font-extrabold'
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Candidate (Free)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupType('corporate')}
                    className={`flex-1 py-1.5 px-3 flex items-center justify-center gap-1.5 rounded-full font-bold transition-all cursor-pointer ${
                      signupType === 'corporate'
                        ? 'bg-amber-400 text-black font-extrabold'
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Company (Sub)</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">
                    {signupType === 'candidate' ? 'Full Name' : 'Company Representative Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder={signupType === 'candidate' ? 'e.g. Jordan Taylor' : 'e.g. Ronnie Hill'}
                    className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {signupType === 'corporate' && (
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={signupCompany}
                      onChange={(e) => setSignupCompany(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-extrabold uppercase tracking-wider rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create {signupType === 'candidate' ? 'Free Candidate' : 'Corporate'} Account</span>
                </button>
              </form>
            )}

            {/* LOG IN FORM */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">Account Role</label>
                  <select
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value as AuthMode)}
                    className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:outline-none text-xs"
                  >
                    <option value="candidate">Candidate / Job Seeker (Free)</option>
                    <option value="corporate">Corporate Employer (Subscription)</option>
                    <option value="universal">Platform Owner / Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-mono font-extrabold uppercase tracking-wider rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Platform</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* PIONEER DOSSIER MODAL */}
      {showPioneerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-serif font-bold">
                  RH
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold text-white">{pioneer.fullName}</h4>
                  <p className="text-xs font-mono text-amber-300">{pioneer.archetypeProjection?.title}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPioneerModal(false)}
                className="text-zinc-400 hover:text-white font-mono text-xs uppercase px-3 py-1 bg-zinc-800 rounded-full"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="bg-black/60 p-4 rounded-xl border border-amber-500/20 space-y-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                  Opening Video Interview Reflection (Spoken on Camera):
                </span>
                <p className="text-zinc-200 italic font-serif text-sm leading-relaxed">
                  "{pioneer.submission?.callingVideoTranscript}"
                </p>
              </div>

              <div className="bg-black/60 p-4 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  True Calling & Palace of Passion Calculation:
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  {pioneer.submission?.trueCallingEvaluation?.callingSummary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase block">Compassion Gravity</span>
                  <span className="text-amber-400 font-bold text-sm">100/100</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase block">Resilient Integrity</span>
                  <span className="text-emerald-400 font-bold text-sm">100/100</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPioneerModal(false);
                  handleVerifySafeWord('stay frosty');
                }}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase rounded-full"
              >
                Log In As Pioneer Founder (Ronnie Hill)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sleek Minimalist Footer */}
      <footer className="border-t border-zinc-900 bg-black/60 py-8 text-center text-xs font-mono text-zinc-500">
        <p>© {new Date().getFullYear()} Mind Your Manners Global. Crafted for global human potential.</p>
        <p className="text-[10px] text-zinc-600 mt-1">
          Confidential & Protected • Zero-Interview Autonomous Placement System
        </p>
      </footer>
    </div>
  );
};
