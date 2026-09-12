'use client';

import React from 'react';
import { Project, User, Application } from '@/types';
import { Shield, ArrowRight, CheckCircle2, Clock, XCircle, Users } from 'lucide-react';

interface PeerConnectProjectCardProps {
  project: Project;
  currentUser: User | null;
  application: Application | undefined;
  onApply: (projectId: string) => void;
  onOpenAuthModal: () => void;
  activeRoleFilter?: string;
  onRoleClick?: (role: string) => void;
}

export const PeerConnectProjectCard: React.FC<PeerConnectProjectCardProps> = ({
  project,
  currentUser,
  application,
  onApply,
  onOpenAuthModal,
  activeRoleFilter,
  onRoleClick,
}) => {
  const isOwner = currentUser?.anon_nick.toLowerCase() === project.owner_nick.toLowerCase();

  const handleAction = () => {
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }
    if (isOwner || application) return;
    onApply(project.project_id);
  };

  return (
    <div className="group glass-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border border-slate-700/80">
      {/* Top Accent line glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F5A0]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header row: Campus, Status, and Owner */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
              {project.campus || 'School 21'}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ochiq (Open)</span>
            </span>
          </div>

          {/* Owner anon_nick */}
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <Shield className="w-3.5 h-3.5 text-[#00F5A0]" />
            <span className="font-mono text-slate-300 font-bold">@{project.owner_nick}</span>
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-[#00F5A0] transition-colors mb-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-300/90 leading-relaxed mb-4 line-clamp-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
          {project.description}
        </p>

        {/* Needed Roles (Zarur mutaxassisliklar) */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Zarur mutaxassisliklar (needed_roles):</span>
            <span className="text-slate-500 text-[10px]">{project.needed_roles.length} ta mutaxassis</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.needed_roles.map((role) => {
              const isActive = activeRoleFilter && (
                role.toLowerCase().includes(activeRoleFilter.toLowerCase()) ||
                activeRoleFilter.toLowerCase().includes(role.toLowerCase())
              );
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    if (onRoleClick) onRoleClick(role);
                  }}
                  title={`Filtr: ${role}`}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00F5A0]/25 text-[#00F5A0] border-[#00F5A0] shadow-[0_0_10px_rgba(0,245,160,0.3)] font-bold'
                      : 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/25 hover:bg-[#00D9F5]/20'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        {/* Status display */}
        <div>
          {isOwner ? (
            <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
              <span>👑 Sizning loyihangiz</span>
            </span>
          ) : application ? (
            application.status === 'pending' ? (
              <span className="text-xs text-amber-400 font-semibold flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Ariza kutilmoqda</span>
              </span>
            ) : application.status === 'accepted' ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Qabul qilingansiz!</span>
              </span>
            ) : (
              <span className="text-xs text-rose-400 font-semibold flex items-center space-x-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>Rad etilgan</span>
              </span>
            )
          ) : (
            <span className="text-[11px] text-slate-500">
              Anonim ariza yuboring
            </span>
          )}
        </div>

        {/* Button */}
        {!isOwner && !application && (
          <button
            type="button"
            onClick={handleAction}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-slate-950 shadow-[0_0_15px_rgba(0,245,160,0.3)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <span>Ariza topshirish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
