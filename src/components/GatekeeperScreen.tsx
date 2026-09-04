import React, { useState } from 'react';
import { AuthUser, AuthMode } from '../types';
import { googleSignIn } from '../lib/firebase';
import { MindYourMannersLogo } from './MindYourMannersLogo';
import { ShieldCheck, UserCheck, Lock, Sparkles, KeyRound, Mail, UserPlus, LogIn, Building, CheckCircle2, ArrowRight, Award, GraduationCap, Users, HeartHandshake, RefreshCw } from 'lucide-react';

interface GatekeeperScreenProps {
  onLogin: (user: AuthUser) => void;
}

export const GatekeeperScreen: React.FC<GatekeeperScreenProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [signupType, setSignupType] = useState<'candidate' | 'corporate'>('candidate');

  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupPlan, setSignupPlan] = useState<'Starter' | 'Growth' | 'Enterprise'>('Growth');
  const [signupSafeWord, setSignupSafeWord] = useState('');

  // Log In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<AuthMode>('candidate');
  const [loginSafeWord, setLoginSafeWord] = useState('');

  // Safe Word Quick Access
  const [safeWordInput, setSafeWordInput] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check if an email belongs to the Platform Owner
  const isOwnerEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    return clean === 'ronniehillsugc@gmail.com' || clean === 'owner@hireup.io' || clean.includes('ronniehills');
  };

  // Safe word validation
  const handleVerifySafeWord = (codeOverride?: string) => {
    const code = (codeOverride !== undefined ? codeOverride : safeWordInput).trim().toLowerCase();
    if (code === 'stay frosty') {
      const ownerUser: AuthUser = {
        email: 'ronniehillsugc@gmail.com',
        role: 'universal',
        name: 'Ronnie Hills (Platform Owner)',
        organization: 'Mind Your Manners Global HQ',
        plan: 'Enterprise',
      };
      localStorage.setItem('mind_your_manners_auth_user', JSON.stringify(ownerUser));
      onLogin(ownerUser);
      setToastMessage('🔑 Investor Safe Word Verified! Platform Owner Universal Access Granted.');
      return true;
    } else if (code.length > 0) {
      setToastMessage('❌ Invalid Safe Word / Passphrase.');
      setTimeout(() => setToastMessage(null), 3000);
      return false;
    }
    return false;
  };

  // Google Authentication
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
          name,
          organization: isOwner ? 'Mind Your Manners HQ' : 'Google Authenticated Candidate',
          plan: isOwner ? 'Enterprise' : 'Starter',
        };

        localStorage.setItem('mind_your_manners_auth_user', JSON.stringify(authUser));
        onLogin(authUser);
      } else {
        setToastMessage('Google sign-in was cancelled.');
        setTimeout(() => setToastMessage(null), 2500);
      }
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setToastMessage(`Google Sign-In error: ${err.message || 'Cancelled'}`);
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Submit Sign Up
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (signupSafeWord.trim().toLowerCase() === 'stay frosty') {
      handleVerifySafeWord('stay frosty');
      return;
    }

    if (!signupEmail.trim() || !signupPassword.trim() || !signupName.trim()) {
      setToastMessage('Please fill in all required fields.');
      return;
    }

    const emailClean = signupEmail.trim();
    const isOwner = isOwnerEmail(emailClean);

    let authUser: AuthUser;

    if (isOwner) {
      authUser = {
        email: emailClean,
        role: 'universal',
        name: signupName.trim() || 'Ronnie Hills',
        organization: 'Mind Your Manners Global HQ',
        plan: 'Enterprise',
      };
      setToastMessage(`Welcome Platform Owner ${authUser.name}! Universal Admin Access Activated.`);
    } else if (signupType === 'candidate') {
      authUser = {
        email: emailClean,
        role: 'candidate',
        name: signupName.trim(),
        organization: 'Job Seeker Candidate',
        plan: 'Starter',
      };
      setToastMessage(`Account Created! Welcome to Mind Your Manners, ${signupName}.`);
    } else {
      authUser = {
        email: emailClean,
        role: 'corporate',
        name: signupName.trim(),
        organization: signupCompany.trim() || 'Subscribed Enterprise',
        plan: signupPlan,
      };
      setToastMessage(`Corporate Subscriber Account Activated on ${signupPlan} Tier! Welcome ${signupCompany || signupName}.`);
    }

    localStorage.setItem('mind_your_manners_auth_user', JSON.stringify(authUser));
    setTimeout(() => {
      onLogin(authUser);
    }, 800);
  };

  // Submit Log In
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loginSafeWord.trim().toLowerCase() === 'stay frosty') {
      handleVerifySafeWord('stay frosty');
      return;
    }

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setToastMessage('Please enter your email and password.');
      return;
    }

    const emailClean = loginEmail.trim();
    const isOwner = isOwnerEmail(emailClean);

    let role: AuthMode = loginRole;
    let plan: 'Starter' | 'Growth' | 'Enterprise' = 'Growth';
    let name = emailClean.split('@')[0] || 'Subscriber';

    if (isOwner) {
      role = 'universal';
      plan = 'Enterprise';
      name = 'Ronnie Hills (Platform Owner)';
      setToastMessage('Platform Owner Admin Access Granted!');
    } else if (loginRole === 'universal') {
      role = 'corporate';
      setToastMessage('Universal Admin role is restricted to platform owner. Logged in as Corporate Subscriber.');
    } else if (loginRole === 'corporate') {
      role = 'corporate';
      plan = 'Growth';
      name = `${name} (Corporate Executive)`;
    } else {
      role = 'candidate';
      name = `${name} (Job Seeker Candidate)`;
    }

    const authUser: AuthUser = {
      email: emailClean,
      role,
      name,
      organization: role === 'universal' ? 'Mind Your Manners HQ' : role === 'corporate' ? 'Subscribed Enterprise' : 'Job Candidate',
      plan,
    };

    localStorage.setItem('mind_your_manners_auth_user', JSON.stringify(authUser));
    setTimeout(() => {
      onLogin(authUser);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans relative overflow-hidden">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full bg-zinc-900/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-2xl relative z-10 my-auto">
        
        {/* Brand Header with Gold Handshake Logo */}
        <div className="text-center space-y-3 border-b border-zinc-800/80 pb-5">
          <div className="pt-2 pb-1 flex justify-center">
            <MindYourMannersLogo size="lg" showTagline={true} variant="dark" />
          </div>

          <div className="inline-flex items-center gap-2 border border-amber-400/30 bg-amber-400/10 text-amber-300 px-4 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-full shadow-xs">
            <Award className="w-4 h-4 text-amber-400" />
            <span>T.H.I.S. System Standard</span>
          </div>

          <p className="text-xs font-mono text-emerald-400 font-bold tracking-widest uppercase">
            Train • Hire • Impress • Sustain
          </p>
          <p className="text-[11px] font-mono text-zinc-400 italic max-w-md mx-auto">
            "Score all testing to the truest grade."
          </p>
        </div>

        {/* Security Notification Banner */}
        <div className="bg-black/80 border border-zinc-800 rounded-2xl p-4 text-xs font-mono space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-zinc-100 font-bold">
            <span className="flex items-center gap-1.5 uppercase text-sky-400">
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>Authentication Gatekeeper</span>
            </span>
            <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/30 font-bold">
              Secure Sign In
            </span>
          </div>
          <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
            Welcome to Mind Your Manners. Candidate & Corporate portals are secure. Universal Admin controls are reserved for the Platform Owner (<span className="text-amber-300 font-mono font-bold">ronniehillsugc@gmail.com</span>).
          </p>
        </div>

        {toastMessage && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2 rounded-full animate-fadeIn px-5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Investor / Owner Safe Word Bar */}
        <div className="bg-black/90 border border-zinc-800 rounded-2xl p-4 space-y-2.5 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-300 font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Owner / VIP Safe Word Passphrase</span>
            </span>
            <span className="text-[10px] text-amber-300 bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/30 uppercase font-bold">
              VIP Access
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
              placeholder="Enter Owner Safe Word (e.g. stay frosty)"
              className="flex-1 py-2.5 px-4 bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 font-mono text-xs rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleVerifySafeWord()}
              className="bg-amber-400 hover:bg-amber-300 text-black font-mono font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 rounded-full shadow-md active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Unlock Admin</span>
            </button>
          </div>
        </div>

        {/* OAuth Provider Sign In Options */}
        <div className="space-y-2.5">
          <div>
            <button
              type="button"
              id="gatekeeper-btn-google"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full bg-zinc-950 hover:bg-zinc-800 text-zinc-100 font-mono font-bold text-xs uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md border border-zinc-800 rounded-full disabled:opacity-50 active:scale-98"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.18 21.3 7.22 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 0 12s.43 3.87 1.19 5.4l4.08-3.16z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.18 2.7 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <span className="truncate">{isGoogleLoading ? 'Connecting...' : 'Sign in with Google Account'}</span>
            </button>
          </div>

          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono uppercase text-zinc-500">or use email account</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>
        </div>

        {/* Tab Switcher: Sign Up vs Log In */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black border border-zinc-800 rounded-full font-mono text-xs">
          <button
            type="button"
            id="gatekeeper-tab-signup"
            onClick={() => setActiveTab('signup')}
            className={`py-2.5 px-4 font-bold flex items-center justify-center gap-1.5 transition-all rounded-full ${
              activeTab === 'signup'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>

          <button
            type="button"
            id="gatekeeper-tab-login"
            onClick={() => setActiveTab('login')}
            className={`py-2.5 px-4 font-bold flex items-center justify-center gap-1.5 transition-all rounded-full ${
              activeTab === 'login'
                ? 'bg-amber-400 text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>

        {/* TAB 1: SIGN UP FORM */}
        {activeTab === 'signup' && (
          <div className="space-y-4">
            {/* T.H.I.S. System Pledge & Score Box */}
            <div className="bg-black/90 border border-zinc-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-amber-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>The T.H.I.S. Evaluation Protocol</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-3 py-0.5 border border-emerald-500/30 uppercase font-bold rounded-full">
                  Truest Grade
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                By creating an account, you enroll into our 4-pillar evaluation engine: <strong className="text-amber-300">T</strong>rain (scenarios), <strong className="text-amber-300">H</strong>ire (matching), <strong className="text-amber-300">I</strong>mpress (etiquette & tone), and <strong className="text-amber-300">S</strong>ustain (refresher modules).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px] text-center">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-200">
                  <span className="font-bold block text-amber-400">TRAIN</span>
                  <span className="text-zinc-400 text-[9px]">Scenario Drills</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-200">
                  <span className="font-bold block text-amber-400">HIRE</span>
                  <span className="text-zinc-400 text-[9px]">Civility Match</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-200">
                  <span className="font-bold block text-amber-400">IMPRESS</span>
                  <span className="text-zinc-400 text-[9px]">Manners & Tone</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-200">
                  <span className="font-bold block text-amber-400">SUSTAIN</span>
                  <span className="text-zinc-400 text-[9px]">Truest Grade</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex border border-zinc-800 p-1 bg-black rounded-full gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setSignupType('candidate')}
                  className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-full font-bold transition-all cursor-pointer ${
                    signupType === 'candidate'
                      ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignupType('corporate')}
                  className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-full font-bold transition-all cursor-pointer ${
                    signupType === 'corporate'
                      ? 'bg-amber-400 text-black shadow-md font-extrabold'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Corporate Employer</span>
                </button>
              </div>

              <div className="p-3 bg-black/80 border border-zinc-800 rounded-2xl font-mono text-[10px] text-zinc-300 flex items-center gap-2">
                {signupType === 'candidate' ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong className="text-emerald-300">Candidate Account:</strong> Access limited to Employee/Candidate Evaluation Portal.</span>
                  </>
                ) : (
                  <>
                    <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong className="text-amber-300">Corporate Subscriber Role:</strong> All-Access Pass to BOTH Employer HQ & Employee Portal.</span>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">
                  {signupType === 'candidate' ? 'Full Name' : 'Contact Person Name'}
                </label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder={signupType === 'candidate' ? 'e.g. Jordan Taylor' : 'e.g. Ronnie Hills'}
                  className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-zinc-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="your-email@domain.com"
                  className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-zinc-400" />
                  <span>Choose Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create account password"
                  className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                />
              </div>

              {signupType === 'candidate' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+1 (512) 555-0192"
                      className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">City / State</label>
                    <input
                      type="text"
                      value={signupCity}
                      onChange={(e) => setSignupCity(e.target.value)}
                      placeholder="e.g. Austin, TX"
                      className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      value={signupCompany}
                      onChange={(e) => setSignupCompany(e.target.value)}
                      placeholder="e.g. The Future Corp."
                      className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">Subscription Plan</label>
                    <select
                      value={signupPlan}
                      onChange={(e: any) => setSignupPlan(e.target.value)}
                      className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                    >
                      <option value="Starter">Starter ($199/mo)</option>
                      <option value="Growth">Growth ($399/mo)</option>
                      <option value="Enterprise">Enterprise ($899/mo)</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                id="btn-gatekeeper-signup"
                className={`w-full font-mono font-extrabold text-xs uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer rounded-full shadow-lg ${
                  signupType === 'candidate'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                    : 'bg-amber-400 hover:bg-amber-300 text-black'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Enter Platform</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: LOG IN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 font-mono text-xs">
            <div>
              <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3 text-zinc-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="ronniehillsugc@gmail.com or candidate@gmail.com"
                className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-zinc-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">Account Role Type:</label>
              <select
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value as AuthMode)}
                className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
              >
                <option value="candidate" className="bg-black">Job Seeker / Candidate Account</option>
                <option value="corporate" className="bg-black">Subscribed Corporate Employer</option>
                <option value="universal" className="bg-black">Platform Owner / Universal Admin (Restricted)</option>
              </select>
            </div>

            <button
              type="submit"
              id="btn-gatekeeper-login"
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-mono font-extrabold text-xs uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer rounded-full shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to Account</span>
            </button>
          </form>
        )}

        <div className="border-t border-zinc-800/80 pt-4 text-center">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Mind Your Manners Platform • Secure Candidate & Employer Authentication
          </p>
        </div>
      </div>
    </div>
  );
};
