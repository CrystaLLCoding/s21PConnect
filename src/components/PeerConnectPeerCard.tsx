'use client';

import React from 'react';
import { User } from '@/types';
import { Shield, MapPin, Sparkles, Lock } from 'lucide-react';

interface PeerConnectPeerCardProps {
  peer: User;
  activeSkill?: string;
  onSkillClick?: (skill: string) => void;
  isCurrentUser: boolean;
}

export const PeerConnectPeerCard: React.FC<PeerConnectPeerCardProps> = ({
  peer,
  activeSkill,
  onSkillClick,
  isCurrentUser,
}) => {
  const getLevelBadge = (level?: string) => {
    const l = (level || '').toLowerCase();
    if (l.includes('pooler')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
          🏊 Pooler
        </span>
      );
    }
    if (l.includes('common core')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00F5A0]/15 text-[#00F5A0] border border-[#00F5A0]/40">
          ⚡ {level}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/40">
        🏆 {level || 'Cadet'}
      </span>
    );
  };

  return (
    <div className={`glass-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative border ${
      isCurrentUser ? 'border-[#00F5A0]/50 shadow-[0_0_20px_rgba(0,245,160,0.15)]' : 'border-slate-700/80'
    }`}>
      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-[#00D9F5]" />
              <span>{peer.campus || 'Tashkent'}</span>
            </span>
            {getLevelBadge(peer.level)}
          </div>

          {isCurrentUser && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00F5A0] text-slate-950">
              Siz
            </span>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex items-center space-x-3 mb-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg font-mono font-black text-[#00F5A0] shadow-inner">
            {peer.anon_nick.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-[#00F5A0]" />
              <h3 className="font-mono text-sm font-bold text-white truncate">
                @{peer.anon_nick}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">Anonim School 21 Kadeti</p>
          </div>
        </div>

        {/* Interests */}
        <p className="text-xs text-slate-300/90 leading-relaxed mb-4 line-clamp-3 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60 italic">
          &ldquo;{peer.interests}&rdquo;
        </p>

        {/* Skills */}
        <div className="mb-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Dasturlash steklari (Skills):
          </div>
          <div className="flex flex-wrap gap-1">
            {peer.skills.map((skill) => {
              const isActive = activeSkill?.toLowerCase() === skill.toLowerCase();
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    if (onSkillClick) onSkillClick(skill);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#00F5A0]/20 text-[#00F5A0] border-[#00F5A0]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-[#00F5A0]/30'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer info: Privacy Notice */}
      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center space-x-1">
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Kontaktlar yashirin</span>
        </span>
        <span className="text-slate-400">Faqat Accept paytida ochiladi</span>
      </div>
    </div>
  );
};
