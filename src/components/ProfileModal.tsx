'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { X, Lock, Shield, Sparkles, Check, Phone, Send, Plus } from 'lucide-react';

interface ProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (updatedUser: User) => void;
}

const COMMON_SKILLS = ['C/C++', 'Python', 'AI/ML', 'Frontend (React)', 'C Backend', 'Go', 'Docker', 'UI/UX', 'Rust', 'Telegram MiniApp'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateProfile,
}) => {
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [interests, setInterests] = useState(user?.interests || '');
  const [campus, setCampus] = useState<'Tashkent' | 'Samarkand'>(user?.campus || 'Tashkent');
  const [level, setLevel] = useState(user?.level || 'Common Core Lvl 4');

  if (!isOpen || !user) return null;

  const handleAddSkill = (skillToAdd: string) => {
    const clean = skillToAdd.trim();
    if (clean && !skills.some(s => s.toLowerCase() === clean.toLowerCase())) {
      setSkills([...skills, clean]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      skills,
      interests,
      campus,
      level,
    };
    onUpdateProfile(updated);
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-xl bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/30 shadow-[0_0_15px_rgba(0,245,160,0.2)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Mening profilim</h2>
            <p className="text-xs text-slate-400">Ko‘nikmalar va qiziqishlaringizni to‘ldiring</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Read-Only anon_nick (Requirement 3.B) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Anonim nik (anon_nick)
              </label>
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 flex items-center space-x-1">
                <Lock className="w-2.5 h-2.5" />
                <span>O‘zgarmas (Read-Only)</span>
              </span>
            </div>

            <div className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/60 font-mono text-sm text-[#00F5A0]">
              <span className="text-slate-500">@</span>
              <span className="font-bold">{user.anon_nick}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Bu nik Telegram bot orqali bir marta beriladi va xavfsizlik uchun tahrirlanmaydi.
            </p>
          </div>

          {/* Hidden Real Credentials note */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 flex items-center justify-between">
              <span>Shaxsiy ma&apos;lumotlar:</span>
              <span className="text-emerald-400 font-medium">Faqat Accept paytida ochiladi</span>
            </div>
            <div className="text-slate-300 font-mono text-[11px] flex items-center justify-between">
              <span>{user.full_name} • {user.phone_number}</span>
              <span className="text-sky-400">@{user.telegram_username}</span>
            </div>
          </div>

          {/* Skills (Dasturlash tillari, stek) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Dasturlash tillari va stek (skills) *
            </label>

            {/* Add skill input */}
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (skillInput.trim()) {
                      handleAddSkill(skillInput);
                      setSkillInput('');
                    }
                  }
                }}
                placeholder="Yangi ko‘nikma yozing..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5A0]"
              />
              <button
                type="button"
                onClick={() => {
                  if (skillInput.trim()) {
                    handleAddSkill(skillInput);
                    setSkillInput('');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold cursor-pointer"
              >
                + Qo‘shish
              </button>
            </div>

            {/* Selected skills pills */}
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/30"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="hover:text-white ml-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Common skills recommendations */}
            <div className="flex flex-wrap gap-1">
              {COMMON_SKILLS.map((cs) => {
                if (skills.includes(cs)) return null;
                return (
                  <button
                    key={cs}
                    type="button"
                    onClick={() => handleAddSkill(cs)}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  >
                    + {cs}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests (Qiziqishlar, yo'nalish) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Qiziqishlar va yo‘nalish (interests) *
            </label>
            <textarea
              rows={2}
              required
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Qanday loyihalarga qiziqasiz? Masalan: AI agentlar, Web3 yoki past darajali tizimlar..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5A0] resize-none"
            />
          </div>

          {/* Campus and Level */}
          <div className="grid grid-cols-2 gap-3">
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
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Daraja (Level)
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#00F5A0] cursor-pointer"
              >
                <option value="Pooler">Pooler</option>
                <option value="Common Core Lvl 4">Common Core Lvl 4</option>
                <option value="Common Core Lvl 8">Common Core Lvl 8</option>
                <option value="Lvl 10">Lvl 10</option>
                <option value="Lvl 11">Lvl 11</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Yopish
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,245,160,0.3)] hover:opacity-95 cursor-pointer"
            >
              Saqlash
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
