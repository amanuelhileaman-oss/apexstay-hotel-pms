import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Smartphone, 
  Plus, 
  Lock, 
  KeyRound, 
  Layers, 
  Users, 
  Receipt, 
  Radio, 
  ShieldAlert 
} from 'lucide-react';
import { SecurityStatus } from '../../types/hotel';

export type ActiveTab = 'overview' | 'inventory' | 'guests' | 'billing' | 'channels' | 'security';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  security: SecurityStatus;
  onOpenMobileView: (mode: 'staff' | 'guest') => void;
  onOpenNewReservation: () => void;
  onOpenMfaModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  security,
  onOpenMobileView,
  onOpenNewReservation,
  onOpenMfaModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark / Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Building2 className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <button 
              onClick={() => setActiveTab('overview')}
              className="text-left cursor-pointer focus:outline-none"
            >
              <span className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap block">
                ApexStay Hospitality Cloud
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line prose links) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('overview')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeTab === 'inventory'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              Room Inventory
            </button>
            <button
              onClick={() => setActiveTab('guests')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeTab === 'guests'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              Guest Analytics
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeTab === 'billing'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              Automated Billing
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeTab === 'channels'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              Channel Manager
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeTab === 'security'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              Security & Audit
            </button>
          </nav>

          {/* Zone 3: Primary Actions & Security Status */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Interface Launcher */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
              <button
                onClick={() => onOpenMobileView('staff')}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/70 rounded transition-colors whitespace-nowrap flex items-center gap-1.5"
                title="Launch mobile companion for housekeeping and desk staff"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Staff Mobile</span>
              </button>
              <button
                onClick={() => onOpenMobileView('guest')}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/70 rounded transition-colors whitespace-nowrap flex items-center gap-1.5"
                title="Launch mobile digital key and in-room portal for guests"
              >
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Guest Key</span>
              </button>
            </div>

            {/* MFA Security Status Button */}
            <button
              onClick={onOpenMfaModal}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/90 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              title="Verified session with MFA and AES-256 E2EE"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">{security.activeStaffRole}</span>
              <span className="inline md:hidden">MFA Active</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewReservation}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm shadow-amber-400/20 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Reservation</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar for smaller viewports */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-slate-800 text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'overview' ? 'bg-amber-400/10 text-amber-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'inventory' ? 'bg-amber-400/10 text-amber-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'guests' ? 'bg-amber-400/10 text-amber-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Guests
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'billing' ? 'bg-amber-400/10 text-amber-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Billing
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'channels' ? 'bg-amber-400/10 text-amber-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Channels
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'security' ? 'bg-amber-400/10 text-amber-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Security & Audit
          </button>
        </div>
      </div>
    </header>
  );
};
