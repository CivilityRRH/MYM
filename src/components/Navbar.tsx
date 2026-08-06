import React from 'react';
import { UserRole, AuthUser } from '../types';
import { ShieldCheck, UserCheck, Building2, Lock, LogIn, Sparkles, LogOut, Eye } from 'lucide-react';

interface NavbarProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  candidateCount: number;
  topProspectCount: number;
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onShowPricing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleChange,
  candidateCount,
  topProspectCount,
  currentUser,
  onOpenAuthModal,
  onShowPricing,
}) => {
  return (
    <header id="app-navbar" className="bg-[#0A0A0A] border-b border-white/10 text-[#F5F5F0] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <span className="font-serif italic text-2xl font-light tracking-tighter text-white">Mind Your Manners</span>
                <span className="border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Cloud Firestore
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-0.5 hidden sm:block font-mono">
                T.H.I.S. System • Train, Hire, Impress, Sustain • Score all testing to the truest grade.
              </p>
            </div>
          </div>

          {/* Pricing & SaaS Storage Calculator Trigger */}
          <button
            onClick={onShowPricing}
            className="hidden lg:flex items-center space-x-2 border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Pricing & Storage Calculator</span>
          </button>

          {/* Security & System Stats */}
          <div className="hidden md:flex items-center space-x-6 text-xs">
            <div className="flex items-center space-x-2 border border-white/10 bg-white/5 px-3 py-1.5 rounded-none">
              <Lock className="w-3.5 h-3.5 text-white/60" />
              <span className="text-[10px] uppercase tracking-widest text-white/40">Vault:</span>
              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">SECURE</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-widest text-white/40">Ledger Roster</span>
              <span className="text-base font-mono tracking-tight text-white">{candidateCount}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-widest text-white/40">Top Prospects</span>
              <span className="text-base font-mono tracking-tight text-emerald-400">{topProspectCount}</span>
            </div>
          </div>

          {/* Auth Session / Portal Switcher */}
          <div className="flex items-center space-x-3">
            {currentUser?.role === 'corporate' ? (
              <div className="flex items-center space-x-2 border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-xs font-mono">
                <Building2 className="w-4 h-4 text-purple-400" />
                <div className="text-left hidden sm:block">
                  <div className="text-purple-200 font-bold text-[10px] uppercase">Corporate Session</div>
                  <div className="text-white/60 text-[9px] truncate max-w-[120px]">{currentUser.email}</div>
                </div>
                <button
                  onClick={onOpenAuthModal}
                  className="ml-2 text-white/40 hover:text-white p-1 text-[10px] underline uppercase tracking-wider"
                  title="Switch Auth Mode"
                >
                  Switch
                </button>
              </div>
            ) : currentUser?.role === 'candidate' ? (
              <div className="flex items-center space-x-2 border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-mono">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <div className="text-left hidden sm:block">
                  <div className="text-emerald-200 font-bold text-[10px] uppercase">Candidate Chamber</div>
                  <div className="text-white/60 text-[9px] truncate max-w-[120px]">{currentUser.email}</div>
                </div>
                <button
                  onClick={onOpenAuthModal}
                  className="ml-2 text-white/40 hover:text-white p-1 text-[10px] underline uppercase tracking-wider"
                  title="Switch Auth Mode"
                >
                  Switch
                </button>
              </div>
            ) : (
              /* Universal / Guest / Dual View Mode -> Show Dual Portal Switcher */
              <div className="flex items-center space-x-2">
                {currentUser?.role === 'universal' && (
                  <div className="hidden xl:flex flex-col text-right mr-1 font-mono">
                    <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Universal Account
                    </span>
                    <span className="text-[8px] text-white/50">{currentUser.email}</span>
                  </div>
                )}
                <div className="flex items-center p-1 border border-white/20 bg-white/5">
                  <button
                    id="btn-nav-business"
                    onClick={() => onRoleChange('business')}
                    className={`flex items-center space-x-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold transition-all ${
                      activeRole === 'business'
                        ? 'bg-white text-black font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Employer View</span>
                    <span className="sm:hidden">Employer</span>
                  </button>
                  <button
                    id="btn-nav-candidate"
                    onClick={() => onRoleChange('candidate')}
                    className={`flex items-center space-x-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold transition-all ${
                      activeRole === 'candidate'
                        ? 'bg-white text-black font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Employee View</span>
                    <span className="sm:hidden">Employee</span>
                  </button>
                </div>

                <button
                  onClick={onOpenAuthModal}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 border border-white/20 text-xs font-mono flex items-center gap-1.5"
                  title="Role Authentication Gateway"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider">Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


