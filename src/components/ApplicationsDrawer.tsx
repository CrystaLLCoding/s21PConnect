'use client';

import React, { useState } from 'react';
import { User, Project, Application } from '@/types';
import { X, Check, CheckCircle2, AlertTriangle, Send, Phone, Shield, ExternalLink, Inbox, MessageSquare, Sparkles } from 'lucide-react';

interface ApplicationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  users: User[];
  projects: Project[];
  applications: Application[];
  onAcceptApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string, reason: string) => void;
}

export const ApplicationsDrawer: React.FC<ApplicationsDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  projects,
  applications,
  onAcceptApplication,
  onRejectApplication,
}) => {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectError, setRejectError] = useState<string>('');

  if (!isOpen || !currentUser) return null;

  // Projects owned by current user
  const myProjectIds = projects
    .filter((p) => p.owner_nick.toLowerCase() === currentUser.anon_nick.toLowerCase())
    .map((p) => p.project_id);

  // Incoming applications to projects owned by current user
  const incomingApplications = applications.filter((a) => myProjectIds.includes(a.project_id));

  // Outgoing applications sent by current user
  const outgoingApplications = applications.filter(
    (a) => a.applicant_nick.toLowerCase() === currentUser.anon_nick.toLowerCase()
  );

  const handleStartReject = (appId: string) => {
    setRejectingAppId(appId);
    setRejectReason('');
    setRejectError('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      setRejectError('Iltimos, nomzodga rad etish sababini batafsil yozib bering.');
      return;
    }
    if (rejectingAppId) {
      onRejectApplication(rejectingAppId, rejectReason.trim());
      setRejectingAppId(null);
      setRejectReason('');
    }
  };

  const getUser = (nick: string) => users.find((u) => u.anon_nick.toLowerCase() === nick.toLowerCase());
  const getProject = (projId: string) => projects.find((p) => p.project_id === projId);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl h-full bg-[#0d121d] border-l border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#00D9F5]/10 text-[#00D9F5] border border-[#00D9F5]/30">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Jamoa & Matchmaking Paneli</h2>
              <p className="text-xs text-slate-400">O‘zaro rozilik (Accept) orqali kontaktlar almashinuvi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers: Incoming vs Outgoing */}
        <div className="p-3 bg-slate-900/50 border-b border-slate-800/80 flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('incoming')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'incoming'
                ? 'bg-gradient-to-r from-[#00F5A0]/20 to-[#00D9F5]/20 text-[#00F5A0] border border-[#00F5A0]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>Mening loyihalarimga tushgan ({incomingApplications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outgoing')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'outgoing'
                ? 'bg-gradient-to-r from-[#00F5A0]/20 to-[#00D9F5]/20 text-[#00F5A0] border border-[#00F5A0]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>Mening arizalarim ({outgoingApplications.length})</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Rejection Modal/Inline Form */}
          {rejectingAppId && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Arizani rad etish sababi (Majburiy)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                School 21 peeriga nima sababdan rad etilganini tushuntiring (masalan: boshqa nomzod tanlandi, ko‘nikma mos kelmadi):
              </p>

              <form onSubmit={handleConfirmReject} className="space-y-2">
                <textarea
                  rows={2}
                  required
                  autoFocus
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Rad etish sababini yozing..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-500/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                />

                {rejectError && (
                  <p className="text-[11px] text-rose-400">{rejectError}</p>
                )}

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRejectingAppId(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow cursor-pointer"
                  >
                    Rad etishni tasdiqlash
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'incoming' ? (
            incomingApplications.length > 0 ? (
              incomingApplications.map((app) => {
                const project = getProject(app.project_id);
                const applicant = getUser(app.applicant_nick);

                return (
                  <div
                    key={app.application_id}
                    className={`p-4 rounded-2xl glass-card border transition-all ${
                      app.status === 'accepted'
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : app.status === 'rejected'
                        ? 'border-slate-800 opacity-60'
                        : 'border-slate-700/80 hover:border-[#00D9F5]/40'
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium">Loyiha:</span>
                        <h4 className="text-sm font-bold text-white">{project?.title || 'Loyiha'}</h4>
                      </div>

                      {/* Status badge */}
                      <div>
                        {app.status === 'pending' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Kutilmoqda (Pending)
                          </span>
                        )}
                        {app.status === 'accepted' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Qabul qilingan (Accepted)</span>
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            Rad etilgan
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Applicant Info (ANONYMOUS BEFORE ACCEPT) */}
                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs mb-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <Shield className="w-3.5 h-3.5 text-[#00F5A0]" />
                          <span className="font-mono font-bold text-white">@{app.applicant_nick}</span>
                          <span className="text-[10px] text-slate-500">({applicant?.level || 'Cadet'})</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{applicant?.campus || 'Tashkent'}</span>
                      </div>

                      {/* Skills */}
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">Ko‘nikmalar:</span>
                        <div className="flex flex-wrap gap-1">
                          {applicant?.skills.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {applicant?.interests && (
                        <p className="text-[11px] text-slate-400 italic pt-0.5">
                          &ldquo;{applicant.interests}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Real contacts revealed upon mutual accept */}
                    {app.status === 'accepted' && applicant && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/40 mb-3 space-y-2 animate-in zoom-in-95">
                        <div className="flex items-center space-x-1 text-emerald-400 font-bold text-xs">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>O‘zaro rozilik (Accept) natijasida kontaktlar ochildi:</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-500 text-[10px] block">Haqiqiy ismi:</span>
                            <strong className="text-white">{applicant.full_name}</strong>
                          </div>
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-500 text-[10px] block">Telefon:</span>
                            <span className="text-white font-mono">{applicant.phone_number}</span>
                          </div>
                        </div>
                        <div className="pt-1">
                          <a
                            href={`https://t.me/${applicant.telegram_username}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2 rounded-lg bg-[#0088cc] hover:bg-[#0099e6] text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Telegramda bog‘lanish (@{applicant.telegram_username})</span>
                            <ExternalLink className="w-3 h-3 opacity-80" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Rejection reason displayed if rejected */}
                    {app.status === 'rejected' && app.reject_reason && (
                      <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300">
                        <span className="font-semibold block mb-0.5">Rad etish sababi:</span>
                        <span>{app.reject_reason}</span>
                      </div>
                    )}

                    {/* Action buttons (Accept & Reject) */}
                    {app.status === 'pending' && !rejectingAppId && (
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleStartReject(app.application_id)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-semibold border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
                        >
                          Rad etish (Reject)
                        </button>
                        <button
                          type="button"
                          onClick={() => onAcceptApplication(app.application_id)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Qabul qilish (Accept)</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Loyihalaringizga hozircha yangi arizalar kelib tushmagan.
              </div>
            )
          ) : (
            /* Outgoing applications */
            outgoingApplications.length > 0 ? (
              outgoingApplications.map((app) => {
                const project = getProject(app.project_id);
                const owner = project ? getUser(project.owner_nick) : null;

                return (
                  <div
                    key={app.application_id}
                    className={`p-4 rounded-2xl glass-card border transition-all ${
                      app.status === 'accepted'
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : app.status === 'rejected'
                        ? 'border-rose-900/30 opacity-70'
                        : 'border-slate-700/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] text-slate-400">Loyiha nomi:</span>
                        <h4 className="text-sm font-bold text-white">{project?.title || 'Loyiha'}</h4>
                        <span className="text-[11px] text-slate-500 font-mono">Muallif: @{project?.owner_nick}</span>
                      </div>

                      {/* Status */}
                      <div>
                        {app.status === 'pending' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Kutilmoqda
                          </span>
                        )}
                        {app.status === 'accepted' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Qabul qilindingiz!</span>
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            Rad etildi
                          </span>
                        )}
                      </div>
                    </div>

                    {/* UNLOCKED OWNER CONTACTS IF ACCEPTED (Mutual Consent) */}
                    {app.status === 'accepted' && owner && (
                      <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/40 space-y-2 animate-in zoom-in-95">
                        <div className="flex items-center space-x-1 text-emerald-400 font-bold text-xs">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Loyiha egasi sizni qabul qildi! Uning kontaktlari:</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-500 text-[10px] block">FIO:</span>
                            <strong className="text-white">{owner.full_name}</strong>
                          </div>
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-500 text-[10px] block">Telefon:</span>
                            <span className="text-white font-mono">{owner.phone_number}</span>
                          </div>
                        </div>
                        <a
                          href={`https://t.me/${owner.telegram_username}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2 rounded-lg bg-[#0088cc] hover:bg-[#0099e6] text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Telegramda yozish (@{owner.telegram_username})</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </a>
                      </div>
                    )}

                    {/* Rejection reason displayed if rejected */}
                    {app.status === 'rejected' && app.reject_reason && (
                      <div className="mt-3 p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300">
                        <span className="font-semibold block mb-0.5">Rad etish sababi:</span>
                        <span>{app.reject_reason}</span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Siz hozircha birorta loyihaga ariza yubormagansiz.
              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
};
