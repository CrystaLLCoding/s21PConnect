'use client';

import React, { useState } from 'react';
import { Project, User } from '@/types';
import { X, Rocket, Plus, Shield } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAddProject: (newProject: Project) => void;
  onOpenAuthModal: () => void;
}

const POPULAR_ROLES = [
  'Frontend (React)',
  'C Backend',
  'Python',
  'AI/ML',
  'UI/UX',
  'Go',
  'Docker',
  'Telegram MiniApp',
  'Algorithms',
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddProject,
  onOpenAuthModal,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [neededRoles, setNeededRoles] = useState<string[]>([]);
  const [roleError, setRoleError] = useState('');
  const [campus, setCampus] = useState<'Tashkent' | 'Samarkand' | 'Cross-Campus'>('Tashkent');

  if (!isOpen) return null;

  const handleAddRole = (roleToAdd: string) => {
    const clean = roleToAdd.trim();
    if (clean && !neededRoles.some((r) => r.toLowerCase() === clean.toLowerCase())) {
      setNeededRoles([...neededRoles, clean]);
      setRoleError('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setNeededRoles(neededRoles.filter((r) => r !== roleToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }
    if (!title.trim() || !description.trim()) return;

    if (neededRoles.length === 0) {
      setRoleError('Iltimos, loyihangiz uchun kamida bitta kerakli mutaxassislikni qo‘shing.');
      return;
    }

    const newProject: Project = {
      project_id: `proj-${Date.now()}`,
      owner_nick: currentUser.anon_nick,
      title: title.trim(),
      description: description.trim(),
      needed_roles: neededRoles,
      status: 'open',
      campus,
      created_at: new Date().toISOString().split('T')[0],
    };

    onAddProject(newProject);
    setTitle('');
    setDescription('');
    setNeededRoles([]);
    setRoleError('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg glass-card rounded-2xl border border-slate-700/80 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00F5A0]/20 to-[#00D9F5]/20 text-[#00F5A0] border border-[#00F5A0]/30 shadow-[0_0_15px_rgba(0,245,160,0.2)]">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Yangi startap loyihasi yaratish</h2>
            <p className="text-xs text-slate-400">School 21 anonim kadetlarini jamoangizga jalb qiling</p>
          </div>
        </div>

        {currentUser ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Owner identity indicator */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Loyiha muallifi:</span>
              <span className="font-mono font-bold text-[#00F5A0] flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>@{currentUser.anon_nick}</span>
              </span>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Loyiha nomi *
              </label>
              <input
                type="text"
                required
                id="create-project-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="masalan: PeerReview Bot yoki AlgoVisualizer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5A0]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Loyiha tavsifi (description) *
              </label>
              <textarea
                rows={3}
                required
                id="create-project-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Loyiha maqsadi, School 21 da qanday muammoni hal qilishi va talablar..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5A0] resize-none"
              />
            </div>

            {/* Needed Roles (Zarur mutaxassisliklar) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Kerakli mutaxassisliklar (needed_roles) *
                </label>
                <span className="text-[11px] text-slate-500">{neededRoles.length} ta kiritildi</span>
              </div>

              {/* Role input */}
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (roleInput.trim()) {
                        handleAddRole(roleInput);
                        setRoleInput('');
                      }
                    }
                  }}
                  placeholder="masalan: C Backend, Frontend (React)..."
                  className="flex-1 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9F5]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (roleInput.trim()) {
                      handleAddRole(roleInput);
                      setRoleInput('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold cursor-pointer"
                >
                  + Qo‘shish
                </button>
              </div>

              {/* Roles pills */}
              <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
                {neededRoles.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#00D9F5]/10 text-[#00D9F5] border border-[#00D9F5]/30"
                  >
                    <span>{r}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(r)}
                      className="hover:text-white ml-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Quick role suggestions */}
              <div className="flex flex-wrap gap-1">
                {POPULAR_ROLES.map((pr) => {
                  if (neededRoles.includes(pr)) return null;
                  return (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => handleAddRole(pr)}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                    >
                      + {pr}
                    </button>
                  );
                })}
              </div>

              {roleError && (
                <p className="text-xs text-rose-400 mt-2 font-medium">{roleError}</p>
              )}
            </div>

            {/* Campus selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Kampus
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#00F5A0] cursor-pointer"
              >
                <option value="Tashkent">Tashkent</option>
                <option value="Samarkand">Samarkand</option>
                <option value="Cross-Campus">Cross-Campus</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                id="submit-create-project-btn"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,245,160,0.3)] hover:opacity-95 active:scale-98 cursor-pointer"
              >
                Loyihani e&apos;lon qilish
              </button>
            </div>
          </form>
        ) : (
          /* If not logged in */
          <div className="text-center py-8 space-y-3">
            <p className="text-xs text-slate-300">
              Loyiha yaratish uchun avval platformaga <strong>anon_nick</strong> orqali kiring.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuthModal();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-slate-950 font-bold text-xs shadow cursor-pointer"
            >
              Kirish / Ro‘yxatdan o‘tish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
