import React, { useState } from 'react';
import { AuthUser, AuthMode } from '../types';
import { googleSignIn } from '../lib/firebase';
import { Building2, UserCheck, ShieldCheck, ArrowRight, Sparkles, KeyRound, Mail, Lock, CheckCircle2, UserPlus, LogIn, Building } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
  currentUser: AuthUser | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [activeAuthTab, setActiveAuthTab] = useState<'signup' | 'login'>('signup');
  const [signupType, setSignupType] = useState<'candidate' | 'corporate'>('candidate');

  // Sign Up Form State (Job Seekers & Subscribers)
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupPlan, setSignupPlan] = useState<'Starter' | 'Growth' | 'Enterprise'>('Growth');
  const [signupSafeWord, setSignupSafeWord] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('subscriber@hireup.io');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [loginRole, setLoginRole] = useState<AuthMode>('corporate');
  const [loginSafeWord, setLoginSafeWord] = useState('');

  // Investor Safe Word State
  const [investorSafeWord, setInvestorSafeWord] = useState('');

  const [authToast, setAuthToast] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Investor Safe Word Verification
  const handleApplySafeWord = (overrideCode?: string) => {
    const code = (overrideCode !== undefined ? overrideCode : investorSafeWord).trim();
    if (code.toLowerCase() === 'stay frosty') {
      const authUser: AuthUser = {
        email: 'investor.vip@mindyourmanners.io',
        role: 'universal',
        name: 'VIP Investor & Partner',
        organization: 'Mind Your Manners Enterprise Board',
        plan: 'Enterprise',
      };
      onLogin(authUser);
      setAuthToast('🔑 Investor Safe Word Verified! Full Universal VIP Access Granted.');
      setTimeout(() => {
        setAuthToast(null);
        onClose();
      }, 1000);
      return true;
    } else if (code.length > 0) {
      setAuthToast('❌ Invalid safe word / promo code.');
      return false;
    }
    return false;
  };

  // Handle Google Sign In / Sign Up via Firebase
  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setAuthToast(null);
    try {
      const res = await googleSignIn();
      if (res && res.user) {
        const email = res.user.email || 'user@gmail.com';
        const name = res.user.displayName || email.split('@')[0] || 'Google User';
        const isOwner = email.includes('owner') || email.includes('ronnie') || email.includes('admin');
        const role: AuthMode = isOwner ? 'universal' : 'candidate';
        
        const authUser: AuthUser = {
          email,
          role,
          name,
          organization: isOwner ? 'Mind Your Manners HQ' : 'Google Authenticated Candidate',
          plan: isOwner ? 'Enterprise' : 'Starter',
        };

        onLogin(authUser);
        setAuthToast(`Successfully authenticated with Google as ${name}!`);
        setTimeout(() => {
          setAuthToast(null);
          onClose();
        }, 1000);
      } else {
        // User closed or cancelled sign-in popup
        setAuthToast('Google sign-in was cancelled or closed.');
        setTimeout(() => setAuthToast(null), 2500);
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        setAuthToast('Google sign-in was cancelled or closed.');
        setTimeout(() => setAuthToast(null), 2500);
      } else {
        console.error('Google Auth error:', err);
        setAuthToast(`Google Sign-In failed: ${err.message || 'Popup blocked or cancelled'}`);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if investor safe word was supplied in sign up
    if (signupSafeWord.trim().toLowerCase() === 'stay frosty') {
      handleApplySafeWord('stay frosty');
      return;
    }

    if (!signupEmail.trim() || !signupPassword.trim() || !signupName.trim()) return;

    if (signupType === 'candidate') {
      // Employee / Candidate side sign-up is always open & free
      const authUser: AuthUser = {
        email: signupEmail.trim(),
        role: 'candidate',
        name: signupName.trim(),
        organization: 'Job Seeker Candidate',
        plan: 'Starter',
      };
      onLogin(authUser);
      setAuthToast(`Account Created Successfully! Welcome to Mind your manners, ${signupName}. Logged in as Candidate (Always Free).`);
    } else {
      // Corporate Subscriber side sign-up
      const authUser: AuthUser = {
        email: signupEmail.trim(),
        role: 'corporate',
        name: signupName.trim(),
        organization: signupCompany.trim() || 'Subscribed Corporate Account',
        plan: signupPlan,
      };
      onLogin(authUser);
      setAuthToast(`Corporate Subscriber Account Activated! Welcome ${signupCompany || signupName} on the ${signupPlan} Tier.`);
    }

    setTimeout(() => {
      setAuthToast(null);
      onClose();
    }, 1200);
  };

  const isOwnerEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    return clean === 'ronniehillsugc@gmail.com' || clean === 'owner@hireup.io' || clean.includes('ronniehills');
  };

  // Handle Log In
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if investor safe word was supplied in login
    if (loginSafeWord.trim().toLowerCase() === 'stay frosty') {
      handleApplySafeWord('stay frosty');
      return;
    }

    if (!loginEmail.trim() || !loginPassword.trim()) return;

    const emailClean = loginEmail.trim();
    const isOwner = isOwnerEmail(emailClean);

    let userRole: AuthMode = loginRole;
    let plan: 'Starter' | 'Growth' | 'Enterprise' = 'Growth';
    let name = emailClean.split('@')[0] || 'Subscriber Account';

    if (isOwner) {
      userRole = 'universal';
      plan = 'Enterprise';
      name = 'Ronnie Hills (Platform Owner)';
    } else if (loginRole === 'universal') {
      userRole = 'corporate';
      setAuthToast('⚠ Universal Admin role is restricted to platform owner (ronniehillsugc@gmail.com). Signed in as Corporate Subscriber.');
    } else if (loginRole === 'corporate') {
      userRole = 'corporate';
      plan = 'Growth';
      name = `${name} (Corporate Executive)`;
    } else {
      userRole = 'candidate';
      name = `${name} (Job Seeker Candidate)`;
    }

    const authUser: AuthUser = {
      email: emailClean,
      role: userRole,
      name,
      organization: userRole === 'universal' ? 'Mind Your Manners HQ' : userRole === 'corporate' ? 'Subscribed Enterprise HQ' : 'Job Candidate',
      plan,
    };

    localStorage.setItem('mind_your_manners_auth_user', JSON.stringify(authUser));
    onLogin(authUser);
    if (userRole !== 'corporate' || !loginRole.includes('universal')) {
      setAuthToast(`Welcome back, ${name}! Logged in securely.`);
    }
    setTimeout(() => {
      setAuthToast(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-zinc-900/95 border border-zinc-800 p-6 sm:p-8 max-w-xl w-full my-8 space-y-6 shadow-2xl relative text-zinc-100 rounded-3xl backdrop-blur-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif italic text-2xl text-zinc-100">Mind Your Manners Auth Gateway</h2>
              <p className="text-[11px] font-mono text-zinc-400">Job Seekers & Corporate Subscriber Registration & Login</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white font-mono text-xs p-1"
          >
            ✕
          </button>
        </div>

        {authToast && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2 rounded-full px-5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{authToast}</span>
          </div>
        )}

        {/* Investor Safe Word Quick Gateway Passphrase Box */}
        <div className="bg-black/90 border border-zinc-800 p-4 space-y-2.5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-300 font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Investor Safe Word / Promo Code Passphrase</span>
            </span>
            <span className="text-[10px] text-amber-300 bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/30 uppercase font-bold">
              VIP Gateway
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={investorSafeWord}
              onChange={(e) => setInvestorSafeWord(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApplySafeWord();
                }
              }}
              placeholder="Enter Investor Safe Word or Promo Code"
              className="flex-1 py-2.5 px-4 bg-zinc-950 border border-zinc-800 text-amber-200 placeholder-zinc-500 font-mono text-xs rounded-full focus:border-amber-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleApplySafeWord()}
              className="bg-amber-400 hover:bg-amber-300 text-black font-mono font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 rounded-full shadow-md active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Unlock VIP Access</span>
            </button>
          </div>
        </div>

        {/* OAuth Authentication Buttons */}
        <div className="space-y-2.5">
          <div>
            <button
              type="button"
              id="btn-auth-google"
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
              <span className="truncate">{isGoogleLoading ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          </div>

          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono uppercase text-zinc-500">or use account login</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>
        </div>

        {/* Tab Switcher: Sign Up vs Log In */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black border border-zinc-800 rounded-full font-mono text-xs">
          <button
            type="button"
            id="btn-tab-signup"
            onClick={() => setActiveAuthTab('signup')}
            className={`py-2.5 px-4 font-bold flex items-center justify-center gap-1.5 transition-all rounded-full ${
              activeAuthTab === 'signup'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>

          <button
            type="button"
            id="btn-tab-login"
            onClick={() => setActiveAuthTab('login')}
            className={`py-2.5 px-4 font-bold flex items-center justify-center gap-1.5 transition-all rounded-full ${
              activeAuthTab === 'login'
                ? 'bg-amber-400 text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
        </div>

        {/* TAB 1: SIGN UP FORM */}
        {activeAuthTab === 'signup' && (
          <div className="space-y-4">
            {/* Choose Sign Up Type */}
            <div className="space-y-2">
              <div className="flex border border-zinc-800 p-1 bg-black rounded-full gap-2 font-mono text-xs">
                <button
                  type="button"
                  id="btn-signup-candidate-type"
                  onClick={() => setSignupType('candidate')}
                  className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-full font-bold transition-all cursor-pointer ${
                    signupType === 'candidate'
                      ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-black" />
                  <span>Candidate Sign Up (Free)</span>
                </button>
                <button
                  type="button"
                  id="btn-signup-corporate-type"
                  onClick={() => setSignupType('corporate')}
                  className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-full font-bold transition-all cursor-pointer ${
                    signupType === 'corporate'
                      ? 'bg-amber-400 text-black shadow-md font-extrabold'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <Building className="w-4 h-4 text-black" />
                  <span>Company Subscriber</span>
                </button>
              </div>

              <div className="p-3 bg-black/80 border border-zinc-800 rounded-2xl font-mono text-[10px] text-zinc-300 flex items-center gap-2">
                {signupType === 'candidate' ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong className="text-emerald-300">Candidate Role:</strong> Access limited to Employee/Candidate Evaluation Portal.</span>
                  </>
                ) : (
                  <>
                    <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong className="text-amber-300">Corporate Subscriber Role:</strong> All-Access Pass to BOTH Employer HQ & Employee Portal.</span>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                  {signupType === 'candidate' ? 'Full Name' : 'Company Contact Person Name'}
                </label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder={signupType === 'candidate' ? 'e.g. Jordan Taylor' : 'e.g. Ronnie Hills'}
                  className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-zinc-400" />
                  <span>{signupType === 'candidate' ? 'Personal Email Address' : 'Corporate Work Email'}</span>
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder={signupType === 'candidate' ? 'j.taylor@gmail.com' : 'subscriber@company.com'}
                  className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-zinc-400" />
                  <span>Choose Account Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create password (min 6 characters)"
                  className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                />
              </div>

              {signupType === 'candidate' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+1 (512) 555-0192"
                      className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">City / Location</label>
                    <input
                      type="text"
                      value={signupCity}
                      onChange={(e) => setSignupCity(e.target.value)}
                      placeholder="e.g. Austin, TX"
                      className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">Company / Organization Name</label>
                    <input
                      type="text"
                      required
                      value={signupCompany}
                      onChange={(e) => setSignupCompany(e.target.value)}
                      placeholder="e.g. The Future Corp."
                      className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">Subscription Tier Plan</label>
                    <select
                      value={signupPlan}
                      onChange={(e: any) => setSignupPlan(e.target.value)}
                      className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                    >
                      <option value="Starter">Starter Tier ($199/mo)</option>
                      <option value="Growth">Growth Tier ($399/mo)</option>
                      <option value="Enterprise">Enterprise Tier ($899/mo)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase text-amber-300 font-bold mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Investor Safe Word / Promo Code (Optional)</span>
                  </span>
                  <span className="text-[9px] text-amber-400/80 font-normal">VIP Passphrase Access</span>
                </label>
                <input
                  type="text"
                  value={signupSafeWord}
                  onChange={(e) => setSignupSafeWord(e.target.value)}
                  placeholder="Enter Investor Safe Word or Promo Code"
                  className="w-full py-2.5 px-4 bg-black border border-amber-500/40 text-amber-200 placeholder-zinc-500 focus:border-amber-400 rounded-full focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                id="btn-submit-signup"
                className={`w-full font-mono font-extrabold text-xs uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer rounded-full shadow-lg ${
                  signupType === 'candidate'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                    : 'bg-amber-400 hover:bg-amber-300 text-black'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {signupType === 'candidate' ? 'Create Job Seeker Account & Enter Chamber' : 'Activate Corporate Subscription & Account'}
                </span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: LOG IN FORM */}
        {activeAuthTab === 'login' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="bg-black/80 border border-zinc-800 p-4 space-y-1 rounded-2xl">
              <div className="text-amber-300 font-bold flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Existing User Password Login</span>
              </div>
              <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                Log in with your email and password to access your corporate dashboard or candidate profile.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-zinc-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. owner@hireup.io or candidate@gmail.com"
                  className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-zinc-400" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1">Account Role Type:</label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value as AuthMode)}
                  className="w-full py-2.5 px-4 bg-black border border-zinc-800 text-zinc-100 focus:border-amber-400 rounded-full focus:outline-none"
                >
                  <option value="corporate" className="bg-black">Subscribed Corporate Employer</option>
                  <option value="candidate" className="bg-black">Job Seeker / Candidate Account</option>
                  <option value="universal" className="bg-black">Platform Owner / Universal Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-amber-300 font-bold mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Investor Safe Word / Promo Code (Optional)</span>
                  </span>
                  <span className="text-[9px] text-amber-400/80 font-normal">VIP Passphrase Access</span>
                </label>
                <input
                  type="text"
                  value={loginSafeWord}
                  onChange={(e) => setLoginSafeWord(e.target.value)}
                  placeholder="Enter Investor Safe Word or Promo Code"
                  className="w-full py-2.5 px-4 bg-black border border-amber-500/40 text-amber-200 placeholder-zinc-500 focus:border-amber-400 rounded-full focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-mono font-extrabold text-xs uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer rounded-full shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In to Account Vault</span>
              </button>
            </form>
          </div>
        )}

        <div className="border-t border-zinc-800/80 pt-4 text-center">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Mind Your Manners Platform • Job Seekers & Corporate Subscribers Protected
          </p>
        </div>
      </div>
    </div>
  );
};


