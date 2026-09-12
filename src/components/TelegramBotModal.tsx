'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { X, Send, Phone, CheckCircle2, Shield, Sparkles, ExternalLink, ArrowRight, Bot, RefreshCw } from 'lucide-react';

interface TelegramBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (newUser: User) => void;
  onOpenAuthModal?: () => void;
}

export const TelegramBotModal: React.FC<TelegramBotModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onOpenAuthModal,
}) => {
  const [activeMode, setActiveMode] = useState<'real_bot' | 'web_simulator'>('real_bot');
  const [checking, setChecking] = useState(false);
  const [checkStatus, setCheckStatus] = useState<string | null>(null);

  // Web simulator states (for fallback)
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [anonNick, setAnonNick] = useState(`silent_coder_${Math.floor(Math.random() * 90 + 10)}`);
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState<'Tashkent' | 'Samarkand'>('Tashkent');
  const [level, setLevel] = useState('Common Core Lvl 4');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['C/C++', 'Python']);
  const [interests, setInterests] = useState('');

  if (!isOpen) return null;

  const handleCheckRegistration = async () => {
    setChecking(true);
    setCheckStatus(null);
    try {
      const res = await fetch('/api/sync');
      const data = await res.json();
      if (data && data.users && data.users.length > 0) {
        setCheckStatus(`Bazada ${data.users.length} ta ro‘yxatdan o‘tgan peer topildi!`);
      } else {
        setCheckStatus("Hozircha yangi foydalanuvchi topilmadi. Telegramda @s21Regbot ga /start yuboring.");
      }
    } catch {
      setCheckStatus("Ulanishda xatolik yuz berdi.");
    } finally {
      setChecking(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSimulatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    const newUser: User = {
      telegram_id: Math.floor(Math.random() * 8000000 + 1000000),
      full_name: fullName.trim(),
      phone_number: phoneNumber.trim(),
      telegram_username: telegramHandle.replace('@', '').trim() || anonNick,
      anon_nick: anonNick,
      password_hash: password.trim(),
      skills: selectedSkills.length > 0 ? selectedSkills : ['C/C++'],
      interests: interests.trim() || 'School 21 campus startap loyihalarida jamoa tuzish',
      campus,
      level,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${anonNick}`,
    };

    setStep(5);
    setTimeout(() => {
      onRegisterSuccess(newUser);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0e1621] rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Telegram Header */}
        <div className="bg-[#17212b] px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0088cc] to-[#00F5A0] flex items-center justify-center text-white font-bold shadow-md">
              🤖
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">@s21Regbot</span>
                <span className="px-2 py-0.5 text-[9px] bg-[#0088cc]/30 text-sky-400 font-bold rounded">
                  RASMIY BOT
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>online • Telegram Bot xizmati</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="p-3 bg-[#131d2a] border-b border-slate-800/80 flex space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveMode('real_bot')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeMode === 'real_bot'
                ? 'bg-[#0088cc] text-white shadow-lg'
                : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Real Telegram Bot (@s21Regbot)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('web_simulator')}
            className={`py-2 px-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeMode === 'web_simulator'
                ? 'bg-[#0088cc] text-white shadow-lg'
                : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            <span>Veb orqali</span>
          </button>
        </div>

        {/* Real Bot View */}
        {activeMode === 'real_bot' ? (
          <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
            {/* Bot highlight card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#182533] to-[#17212b] border border-[#0088cc]/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-white text-sm">Real Telegram Bot Faol</span>
                </div>
                <span className="font-mono text-sky-400 font-semibold text-xs">@s21Regbot</span>
              </div>

              <p className="text-slate-300 leading-relaxed text-xs">
                Ushbu bot School 21 talabalarini shaxsiy kontaktlarini oshkor qilmasdan ro‘yxatdan o‘tkazadi, unikal anonim nik va veb-parol beradi.
              </p>

              {/* Big Direct Action Button */}
              <a
                href="https://t.me/s21Regbot"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0088cc] to-[#00a2e8] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,136,204,0.4)] cursor-pointer active:scale-98 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Telegramda Ochish (@s21Regbot)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 ml-1" />
              </a>
            </div>

            {/* Instruction Steps */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Ro‘yxatdan o‘tish bosqichlari:
              </h4>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#182533] border border-slate-800 flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-[#0088cc]/20 text-[#0088cc] flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-white block">Botga /start yuboring</strong>
                    <span className="text-slate-400 text-[11px]">
                      Telegramda @s21Regbot ni oching va /start buyrug‘ini bosing.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#182533] border border-slate-800 flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-[#0088cc]/20 text-[#0088cc] flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-white block">«📱 Telefon raqamni yuborish» tugmasini bosing</strong>
                    <span className="text-slate-400 text-[11px]">
                      Telegram sizning haqiqiy telefon raqamingizni botga tasdiqlab beradi.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#182533] border border-slate-800 flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-[#0088cc]/20 text-[#0088cc] flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-white block">Anonim nik oling va parol o‘rnating</strong>
                    <span className="text-slate-400 text-[11px]">
                      Bot sizga o‘zgarmas unikal nik beradi (masalan: @silent_coder_42) va parol so‘raydi.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#182533] border border-slate-800 flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-[#0088cc]/20 text-[#0088cc] flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </span>
                  <div>
                    <strong className="text-white block">Veb-saytga kiring</strong>
                    <span className="text-slate-400 text-[11px]">
                      Bot bergan anonim nik va parolingiz bilan ushbu saytda «Kirish» tugmasini bosing.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Check button & Go to Login */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCheckRegistration}
                disabled={checking}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                <span>Tekshirish</span>
              </button>

              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-slate-950 text-xs font-bold shadow cursor-pointer"
                >
                  <span>Saytga Kirish (Login)</span>
                </button>
              )}
            </div>

            {checkStatus && (
              <p className="text-center text-xs text-sky-400 bg-sky-950/30 p-2 rounded-xl border border-sky-800/40">
                {checkStatus}
              </p>
            )}
          </div>
        ) : (
          /* Web Simulator View */
          <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
            <div className="flex items-start space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#0088cc] flex items-center justify-center text-xs shrink-0">
                🤖
              </div>
              <div className="bg-[#182533] p-3 rounded-2xl rounded-tl-sm border border-slate-800/80 max-w-[85%] space-y-1.5">
                <p className="font-semibold text-[#00F5A0]">Veb orqali tezkor ro‘yxatdan o‘tish</p>
                <p className="text-slate-300 leading-relaxed">
                  Agar Telegramingiz hozir qo‘lingizda bo‘lmasa, bu yerda ma&apos;lumotlarni to‘ldirib profil yaratishingiz mumkin.
                </p>
              </div>
            </div>

            {step === 1 && (
              <div className="pt-2 text-center space-y-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#0088cc] text-white font-bold text-xs flex items-center space-x-2 mx-auto shadow-lg cursor-pointer"
                >
                  <span>/start</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {step >= 2 && (
              <div className="flex justify-end">
                <div className="bg-[#2b5278] text-white px-3 py-1.5 rounded-2xl rounded-tr-sm">
                  /start
                </div>
              </div>
            )}

            {step === 2 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (fullName.trim()) setStep(3);
                }}
                className="pt-2 flex space-x-2"
              >
                <input
                  type="text"
                  required
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ism va Familiyangiz"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#242f3d] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#0088cc]"
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#0088cc] text-white font-bold cursor-pointer">
                  Keyingisi
                </button>
              </form>
            )}

            {step >= 3 && (
              <div className="flex justify-end">
                <div className="bg-[#2b5278] text-white px-3 py-1.5 rounded-2xl rounded-tr-sm">
                  {fullName}
                </div>
              </div>
            )}

            {step === 3 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (phoneNumber.trim()) setStep(4);
                }}
                className="space-y-2 pt-1"
              >
                <input
                  type="tel"
                  required
                  autoFocus
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#242f3d] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#0088cc]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow cursor-pointer"
                >
                  📱 Telefonni tasdiqlash
                </button>
              </form>
            )}

            {step >= 4 && (
              <div className="flex justify-end">
                <div className="bg-[#2b5278] text-white px-3 py-1.5 rounded-2xl rounded-tr-sm flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{phoneNumber}</span>
                </div>
              </div>
            )}

            {step === 4 && (
              <form onSubmit={handleSimulatorSubmit} className="space-y-3 pt-1 bg-[#182533] p-3 rounded-2xl border border-slate-800">
                <div className="p-2 rounded-xl bg-slate-900 border border-[#00F5A0]/40 flex items-center justify-between">
                  <span className="font-mono font-bold text-[#00F5A0] text-xs">@{anonNick}</span>
                  <span className="text-[10px] text-slate-400">Unikal anonim nik</span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Telegram Username (kontakt uchun):</label>
                  <input
                    type="text"
                    required
                    value={telegramHandle}
                    onChange={(e) => setTelegramHandle(e.target.value.replace('@', ''))}
                    placeholder="masalan: sherzod_21"
                    className="w-full px-3 py-2 rounded-xl bg-[#242f3d] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#0088cc]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Veb-parol *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Parol kiriting"
                      className="w-full px-3 py-2 rounded-xl bg-[#242f3d] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#0088cc]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Kampus:</label>
                    <select
                      value={campus}
                      onChange={(e) => setCampus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#242f3d] border border-slate-700 text-white text-xs focus:outline-none focus:border-[#0088cc]"
                    >
                      <option value="Tashkent">Tashkent</option>
                      <option value="Samarkand">Samarkand</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!password.trim() || !telegramHandle.trim()}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#0088cc] to-[#00F5A0] text-slate-950 shadow-lg cursor-pointer"
                >
                  Ro‘yxatdan o‘tishni yakunlash
                </button>
              </form>
            )}

            {step === 5 && (
              <div className="p-4 text-center space-y-2 bg-[#182533] rounded-2xl border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-white">Muvaffaqiyatli saqlandi!</h4>
                <p className="text-[11px] text-slate-300">
                  Anonim nikingiz: <strong className="text-[#00F5A0] font-mono">@{anonNick}</strong>. Kirilmoqda...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
