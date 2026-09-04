import React from 'react';
import { UserRole, AuthUser } from '../types';
import { MindYourMannersLogo } from './MindYourMannersLogo';
import { ShieldCheck, UserCheck, Building2, Lock, LogIn, Sparkles, LogOut, Eye } from 'lucide-react';

interface NavbarProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  candidateCount: number;
  topProspectCount: number;
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onShowPricing: () => void;
  onShowLanding?: () => void;
  currentView?: 'landing' | 'portal' | 'pricing';
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleChange,
  candidateCount,
  topProspectCount,
  currentUser,
  onOpenAuthModal,
  onShowPricing,
  onShowLanding,
  currentView,
  onLogout,
}) => {
  return (
    <header id="app-navbar" className="bg-black/90 backdrop-blur-xl border-b border-zinc-900 text-zinc-100 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Platform Title (Clickable to open Landing / Overview) */}
          <div
            onClick={onShowLanding}
            className="flex items-center space-x-3 py-1 cursor-pointer group"
            title="Open Ecosystem Overview & Founder's Vision"
          >
            <MindYourMannersLogo size="sm" showTagline={false} variant="dark" />
            <div className="hidden sm:block border-l border-zinc-800/80 pl-3">
              <div className="flex items-center space-x-2">
                <span className="border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-[9px] font-semibold uppercase tracking-widest px-3 py-0.5 rounded-full font-mono flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Firestore Live
                </span>
                <span className="text-[9px] font-mono text-amber-300/80 group-hover:text-amber-300 transition-colors uppercase">
                  Overview ↗
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400 mt-1 font-mono">
                T.H.I.S. System • Score all testing to the truest grade.
              </p>
            </div>
          </div>

          {/* Navigation Hub Links */}
          <div className="flex items-center space-x-2">
            {onShowLanding && (
              <button
                onClick={onShowLanding}
                className={`flex items-center space-x-1.5 border px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer rounded-full ${
                  currentView === 'landing'
                    ? 'border-amber-400 bg-amber-400 text-black font-bold'
                    : 'border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300'
                }`}
                title="Founder Ronnie Hill's Vision & Navigation Guide"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Ecosystem Guide</span>
                <span className="sm:hidden">Guide</span>
              </button>
            )}

            {/* Pricing & SaaS Storage Calculator Trigger */}
            {currentUser?.role !== 'candidate' && (
              <button
                onClick={onShowPricing}
                className={`hidden lg:flex items-center space-x-2 border px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer rounded-full shadow-md ${
                  currentView === 'pricing'
                    ? 'border-amber-400 bg-amber-400 text-black font-bold'
                    : 'border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-amber-300'
                }`}
              >
                <span>Pricing & Storage</span>
              </button>
            )}
          </div>

          {/* Security & System Stats */}
          <div className="hidden md:flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2 border border-zinc-800 bg-zinc-900/90 px-4 py-1.5 rounded-full shadow-xs">
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">Vault:</span>
              <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">SECURE</span>
            </div>
            {currentUser?.role !== 'candidate' && (
              <>
                <div className="flex flex-col items-end px-3 py-1 bg-zinc-900/80 rounded-2xl border border-zinc-800/80">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono">Ledger</span>
                  <span className="text-xs font-mono tracking-tight font-bold text-zinc-100">{candidateCount}</span>
                </div>
                <div className="flex flex-col items-end px-3 py-1 bg-zinc-900/80 rounded-2xl border border-zinc-800/80">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono">Top Prospects</span>
                  <span className="text-xs font-mono tracking-tight font-bold text-emerald-400">{topProspectCount}</span>
                </div>
              </>
            )}
          </div>

          {/* Auth Session / Portal Switcher */}
          <div className="flex items-center space-x-3">
            {currentUser?.role === 'candidate' ? (
              /* Candidate Account */
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-mono rounded-full">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-left hidden sm:block">
                    <div className="text-emerald-300 font-bold text-[10px] uppercase">Candidate Portal</div>
                    <div className="text-zinc-400 text-[9px] truncate max-w-[130px]">{currentUser.email}</div>
                  </div>
                  <span className="text-[9px] bg-emerald-900/50 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 ml-1 uppercase rounded-full font-bold">
                    Active
                  </span>
                </div>

                <button
                  onClick={onOpenAuthModal}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 p-2.5 border border-zinc-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer rounded-full transition-all"
                  title="Switch or Upgrade Account"
                >
                  <LogIn className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider">Switch</span>
                </button>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 border border-rose-500/30 p-2.5 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer rounded-full"
                    title="Sign Out of Session"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider">Sign Out</span>
                  </button>
                )}
              </div>
            ) : (
              /* Subscribed Companies / Universal / Corporate */
              <div className="flex items-center space-x-2">
                {currentUser?.role === 'corporate' && (
                  <div className="hidden xl:flex flex-col text-right mr-1 font-mono">
                    <span className="text-[9px] text-sky-300 font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
                      <Building2 className="w-3 h-3 text-sky-400" />
                      Subscribed Company
                    </span>
                    <span className="text-[9px] text-zinc-400 truncate max-w-[120px]">{currentUser.organization || currentUser.email}</span>
                  </div>
                )}

                {currentUser?.role === 'universal' && (
                  <div className="hidden xl:flex flex-col text-right mr-1 font-mono">
                    <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Universal Admin
                    </span>
                    <span className="text-[9px] text-zinc-400">{currentUser.email}</span>
                  </div>
                )}

                {/* Dual View Switcher Bubble */}
                <div className="flex items-center p-1 border border-zinc-800 bg-zinc-900/90 rounded-full shadow-lg">
                  <button
                    id="btn-nav-business"
                    onClick={() => onRoleChange('business')}
                    className={`flex items-center space-x-2 px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] font-bold transition-all cursor-pointer rounded-full ${
                      activeRole === 'business'
                        ? 'bg-amber-400 text-black font-extrabold shadow-md'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                    title="Employer HQ Dashboard"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Employer HQ</span>
                    <span className="sm:hidden">Employer</span>
                  </button>
                  <button
                    id="btn-nav-candidate"
                    onClick={() => onRoleChange('candidate')}
                    className={`flex items-center space-x-2 px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] font-bold transition-all cursor-pointer rounded-full ${
                      activeRole === 'candidate'
                        ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                    title="Employee / Candidate Evaluation View"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Employee View</span>
                    <span className="sm:hidden">Employee</span>
                  </button>
                </div>

                <button
                  onClick={onOpenAuthModal}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 p-2.5 border border-zinc-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer rounded-full transition-all"
                  title="Role Authentication Gateway"
                >
                  <LogIn className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider">Account</span>
                </button>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 border border-rose-500/30 p-2.5 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer rounded-full"
                    title="Sign Out of Session"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider">Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


