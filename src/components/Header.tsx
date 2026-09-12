'use client';

import React from 'react';
import { User, Campus } from '@/types';
import { Shield, Plus, LogOut, Bot, Inbox } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  currentCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  incomingApplicationsCount: number;
  onOpenAuthModal: () => void;
  onOpenBotModal: () => void;
  onOpenProfileModal: () => void;
  onOpenApplicationsDrawer: () => void;
  onOpenCreateProjectModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentCampus,
  onCampusChange,
  incomingApplicationsCount,
  onOpenAuthModal,
  onOpenBotModal,
  onOpenProfileModal,
  onOpenApplicationsDrawer,
  onOpenCreateProjectModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all duration-200">
      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#00F5A0]/20 to-[#00D9F5]/20 border border-[#00F5A0]/40 shadow-[0_0_20px_rgba(0,245,160,0.2)]">
              <Shield className="w-6 h-6 text-[#00F5A0]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00F5A0] rounded-full ring-4 ring-[#080B11] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  PeerConnect <span className="text-gradient-emerald">21</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/25">
                  School 21
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Anonim Autentifikatsiya & Matchmaking Platformasi
              </p>
            </div>
          </div>

          {/* Campus Switcher */}
          <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {(['All', 'Tashkent', 'Samarkand'] as Campus[]).map((c) => {
              const isActive = currentCampus === c;
              return (
                <button
                  key={c}
                  onClick={() => onCampusChange(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00F5A0]/20 to-[#00D9F5]/20 text-[#00F5A0] border border-[#00F5A0]/40 shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c === 'All' ? 'Barcha Kampuslar' : c}
                </button>
              );
            })}
          </div>

          {/* Right Action Section */}
          <div className="flex items-center space-x-3">
            
            {currentUser ? (
              /* Logged In State */
              <div className="flex items-center space-x-2">
                
                {/* Incoming Applications Drawer Trigger */}
                <button
                  type="button"
                  id="open-applications-btn"
                  onClick={onOpenApplicationsDrawer}
                  className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Jamoa va arizalar paneli"
                >
                  <Inbox className="w-5 h-5" />
                  {incomingApplicationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold rounded-full text-[10px] flex items-center justify-center animate-bounce">
                      {incomingApplicationsCount}
                    </span>
                  )}
                </button>

                {/* User Profile Pill */}
                <button
                  type="button"
                  id="open-profile-btn"
                  onClick={onOpenProfileModal}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-[#00F5A0]/50 transition-all cursor-pointer"
                  title="Mening profilim"
                >
                  <div className="w-6 h-6 rounded-full bg-[#00F5A0]/20 text-[#00F5A0] flex items-center justify-center text-xs font-mono font-bold">
                    {currentUser.anon_nick.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="font-mono text-xs font-bold text-white block truncate max-w-[120px]">
                      @{currentUser.anon_nick}
                    </span>
                    <span className="text-[10px] text-[#00F5A0] block">Profil</span>
                  </div>
                </button>

                {/* Create Project Button */}
                <button
                  type="button"
                  id="create-project-btn"
                  onClick={onOpenCreateProjectModal}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-slate-950 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(0,245,160,0.3)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Loyiha</span>
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Tizimdan chiqish"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Logged Out State */
              <div className="flex items-center space-x-2">
                {/* Telegram Bot Onboarding Trigger */}
                <button
                  type="button"
                  id="open-bot-modal-btn"
                  onClick={onOpenBotModal}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-[#0088cc] border border-[#0088cc]/40 text-xs font-bold transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Telegram Bot</span>
                </button>

                {/* Login Button */}
                <button
                  type="button"
                  id="open-auth-modal-btn"
                  onClick={onOpenAuthModal}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-slate-950 text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(0,245,160,0.3)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Kirish</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
