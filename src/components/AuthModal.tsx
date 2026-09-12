'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { X, Lock, Shield, ArrowRight, Bot } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onLoginSuccess: (user: User) => void;
  onOpenBotModal: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
  onOpenBotModal,
}) => {
  const [anonNick, setAnonNick] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanNick = anonNick.trim().replace(/^@+/, '');
    const user = users.find(
      (u) => u.anon_nick.toLowerCase() === cleanNick.toLowerCase() && u.password_hash === password
    );

    if (user) {
      onLoginSuccess(user);
      onClose();
    } else {
      setError('Anonim nik yoki parol noto‘g‘ri kiritildi.');
    }
  };


  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md glass-card rounded-2xl border border-slate-700/80 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#00F5A0]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00F5A0]/20 to-[#00D9F5]/20 text-[#00F5A0] border border-[#00F5A0]/30 shadow-[0_0_15px_rgba(0,245,160,0.2)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Veb-platformaga kirish</h2>
            <p className="text-xs text-slate-400">Telegram Bot bergan anonim nik va parol bilan kiring</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Anonim nik (anon_nick) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-mono text-xs">@</span>
              <input
                type="text"
                required
                id="login-anon-nick"
                value={anonNick}
                onChange={(e) => setAnonNick(e.target.value)}
                placeholder="masalan: silent_coder_42"
                className="w-full pl-7 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5A0] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Parol *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <input
                type="password"
                required
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Botda o‘rnatgan parolingiz"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5A0]"
              />
            </div>
          </div>

          <button
            type="submit"
            id="submit-login-btn"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,245,160,0.3)] hover:opacity-95 active:scale-98 transition-all cursor-pointer"
          >
            <span>Platformaga kirish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Register via Telegram Bot trigger */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Profilingiz yo‘qmi?</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBotModal();
            }}
            className="text-[#0088cc] hover:text-[#00c2ff] font-bold flex items-center space-x-1 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Telegram Bot orqali ro‘yxatdan o‘tish</span>
          </button>
        </div>

      </div>
    </div>
  );
};
