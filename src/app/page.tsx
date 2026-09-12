'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { PeerConnectProjectCard } from '@/components/PeerConnectProjectCard';
import { PeerConnectPeerCard } from '@/components/PeerConnectPeerCard';
import { TelegramBotModal } from '@/components/TelegramBotModal';
import { AuthModal } from '@/components/AuthModal';
import { ProfileModal } from '@/components/ProfileModal';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { ApplicationsDrawer } from '@/components/ApplicationsDrawer';
import { INITIAL_USERS, INITIAL_PROJECTS, INITIAL_APPLICATIONS, POPULAR_ROLES } from '@/data/peerConnectDb';
import { User, Project, Application, Campus } from '@/types';
import { Shield, Search, X, Sparkles, Plus, Users, Rocket, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PeerConnectApp() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Filter and view states
  const [currentCampus, setCurrentCampus] = useState<Campus>('All');
  const [activeTab, setActiveTab] = useState<'projects' | 'peers'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');

  // Modals
  const [isBotModalOpen, setIsBotModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize from LocalStorage and purge any legacy mock data
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('s21_users');
      const savedProjects = localStorage.getItem('s21_projects');
      const savedApps = localStorage.getItem('s21_applications');
      const savedCurrent = localStorage.getItem('s21_current_user');

      const mockProjectIds = ['proj-1', 'proj-2', 'proj-3'];
      const mockTelegramIds: (number | string)[] = [1042001, 1042002, 1042003, 1042004, '1042001', '1042002', '1042003', '1042004'];
      const mockAppIds = ['app-1', 'app-2', 'app-3'];

      if (savedUsers) {
        const parsed: User[] = JSON.parse(savedUsers);
        const real = parsed.filter((u) => !mockTelegramIds.includes(u.telegram_id));
        setUsers(real);
        localStorage.setItem('s21_users', JSON.stringify(real));
      } else {
        setUsers([]);
      }

      if (savedProjects) {
        const parsed: Project[] = JSON.parse(savedProjects);
        const real = parsed.filter((p) => !mockProjectIds.includes(p.project_id));
        setProjects(real);
        localStorage.setItem('s21_projects', JSON.stringify(real));
      } else {
        setProjects([]);
      }

      if (savedApps) {
        const parsed: Application[] = JSON.parse(savedApps);
        const real = parsed.filter((a) => !mockAppIds.includes(a.application_id));
        setApplications(real);
        localStorage.setItem('s21_applications', JSON.stringify(real));
      } else {
        setApplications([]);
      }

      if (savedCurrent) {
        const parsed: User = JSON.parse(savedCurrent);
        if (mockTelegramIds.includes(parsed.telegram_id) || parsed.anon_nick === 'silent_coder_42') {
          setCurrentUser(null);
          localStorage.removeItem('s21_current_user');
        } else {
          setCurrentUser(parsed);
        }
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('s21_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('s21_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('s21_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('s21_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('s21_current_user');
    }
  }, [currentUser]);

  const fetchLiveSync = async () => {
    try {
      const res = await fetch('/api/sync');
      const data = await res.json();
      if (data) {
        if (Array.isArray(data.users)) setUsers(data.users);
        if (Array.isArray(data.projects)) setProjects(data.projects);
        if (Array.isArray(data.applications)) setApplications(data.applications);
      }
    } catch {
      // ignore
    }
  };

  // Sync with real backend database & Telegram Bot every 3 seconds
  useEffect(() => {
    fetchLiveSync();
    const interval = setInterval(fetchLiveSync, 3000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Actions
  const handleRegisterFromBot = (newUser: User) => {
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast(`Xush kelibsiz! Sizga unikal anonim nik berildi: @${newUser.anon_nick}`);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showToast(`Xush kelibsiz, @${user.anon_nick}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Tizimdan chiqildi.');
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.anon_nick === updatedUser.anon_nick ? updatedUser : u)));
    setCurrentUser(updatedUser);
    showToast('Profilingiz muvaffaqiyatli saqlandi!');
  };

  const handleAddProject = async (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveTab('projects');
    showToast(`"${newProject.title}" loyihasi muvaffaqiyatli e'lon qilindi!`);

    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_project', project: newProject }),
      });
      fetchLiveSync();
    } catch {
      // ignore
    }
  };

  const handleApplyToProject = async (projectId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const existing = applications.find(
      (a) => a.project_id === projectId && a.applicant_nick.toLowerCase() === currentUser.anon_nick.toLowerCase()
    );

    if (existing) {
      showToast('Siz bu loyihaga allaqachon ariza yuborgansiz.');
      return;
    }

    const newApp: Application = {
      application_id: `app-${Date.now()}`,
      project_id: projectId,
      applicant_nick: currentUser.anon_nick,
      status: 'pending',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setApplications((prev) => [newApp, ...prev]);
    showToast('Arizangiz muallifga yuborildi. U qabul (Accept) qilganda kontaktlar ochiladi!');

    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply', application: newApp }),
      });
      fetchLiveSync();
    } catch {
      // ignore
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.application_id === applicationId ? { ...a, status: 'accepted' } : a))
    );
    showToast('Ariza qabul qilindi! Nomzodga Telegram orqali xabar yuborildi.');

    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept_application', application_id: applicationId }),
      });
      fetchLiveSync();
    } catch {
      // ignore
    }
  };

  const handleRejectApplication = async (applicationId: string, reason: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.application_id === applicationId ? { ...a, status: 'rejected', reject_reason: reason } : a))
    );
    showToast('Ariza rad etildi va nomzodga Telegram orqali xabar yuborildi.');

    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject_application', application_id: applicationId, reason }),
      });
      fetchLiveSync();
    } catch {
      // ignore
    }
  };

  // Incoming applications count for current user
  const incomingApplicationsCount = useMemo(() => {
    if (!currentUser) return 0;
    const myProjectIds = projects
      .filter((p) => p.owner_nick.toLowerCase() === currentUser.anon_nick.toLowerCase())
      .map((p) => p.project_id);
    return applications.filter((a) => myProjectIds.includes(a.project_id) && a.status === 'pending').length;
  }, [currentUser, projects, applications]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (currentCampus !== 'All' && p.campus && p.campus !== currentCampus && p.campus !== 'Cross-Campus') {
        return false;
      }
      if (selectedRole !== 'All Roles') {
        const matches = p.needed_roles.some(
          (r) => r.toLowerCase().includes(selectedRole.toLowerCase()) || selectedRole.toLowerCase().includes(r.toLowerCase())
        );
        if (!matches) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesOwner = p.owner_nick.toLowerCase().includes(q);
        const matchesRoles = p.needed_roles.some((r) => r.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesOwner && !matchesRoles) return false;
      }
      return true;
    });
  }, [projects, currentCampus, selectedRole, searchQuery]);

  // Filtered Peers
  const filteredPeers = useMemo(() => {
    return users.filter((u) => {
      if (currentCampus !== 'All' && u.campus && u.campus !== currentCampus) {
        return false;
      }
      if (selectedRole !== 'All Roles') {
        const matches = u.skills.some(
          (s) => s.toLowerCase().includes(selectedRole.toLowerCase()) || selectedRole.toLowerCase().includes(s.toLowerCase())
        );
        if (!matches) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNick = u.anon_nick.toLowerCase().includes(q);
        const matchesInterests = u.interests.toLowerCase().includes(q);
        const matchesSkills = u.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesNick && !matchesInterests && !matchesSkills) return false;
      }
      return true;
    });
  }, [users, currentCampus, selectedRole, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#080B11] text-slate-100 bg-mesh relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-900 border border-[#00F5A0]/50 text-white shadow-[0_0_25px_rgba(0,245,160,0.3)] animate-in slide-in-from-bottom-5 duration-300">
          <Sparkles className="w-4 h-4 text-[#00F5A0]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Modern Header */}
      <Header
        currentUser={currentUser}
        currentCampus={currentCampus}
        onCampusChange={setCurrentCampus}
        incomingApplicationsCount={incomingApplicationsCount}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenBotModal={() => setIsBotModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenApplicationsDrawer={() => setIsApplicationsOpen(true)}
        onOpenCreateProjectModal={() => setIsCreateProjectOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#00F5A0]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-52 h-52 bg-[#00D9F5]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00F5A0]/10 border border-[#00F5A0]/30 text-[#00F5A0] text-xs font-semibold mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>School 21 • Anonim Autentifikatsiya & Matchmaking</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
              Shaxsiy kontaktlarni oshkor qilmasdan{' '}
              <span className="text-gradient-emerald">jamoa shakllantiring</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
              Telegram bot orqali ro‘yxatdan o‘ting, unikal anonim nik oling va loyihalarga so‘rov yuboring. Haqiqiy telefon va Telegram kontaktlar faqat <strong className="text-[#00F5A0]">o‘zaro rozilik (Accept)</strong> orqali ochiladi.
            </p>

            {/* 3 Pillars info pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[#00F5A0] font-bold block mb-0.5">1. Telegram Bot</span>
                <span className="text-slate-400 text-[11px]">Unikal tasodifiy anon_nick va parol bilan ro‘yxatdan o‘tish</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[#00D9F5] font-bold block mb-0.5">2. Ochiq Loyihalar</span>
                <span className="text-slate-400 text-[11px]">Needed roles va bitta tugma bilan anonim ariza yuborish</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-purple-400 font-bold block mb-0.5">3. O‘zaro Rozilik</span>
                <span className="text-slate-400 text-[11px]">Accept qilinganda kontaktlar ochiladi, Reject majburiy sabab bilan</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab & Filter Bar */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Tab switchers */}
            <div className="flex p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner self-start w-full sm:w-auto">
              <button
                type="button"
                id="tab-projects-btn"
                onClick={() => setActiveTab('projects')}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-slate-950 shadow-[0_0_20px_rgba(0,245,160,0.25)] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Rocket className="w-4 h-4" />
                <span>Loyihalar Lentalari ({filteredProjects.length})</span>
              </button>

              <button
                type="button"
                id="tab-peers-btn"
                onClick={() => setActiveTab('peers')}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'peers'
                    ? 'bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-slate-950 shadow-[0_0_20px_rgba(0,245,160,0.25)] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Anonim Peerlar ({filteredPeers.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                id="main-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'projects'
                    ? 'Qidirish: loyiha nomi, zarur mutaxassislik...'
                    : 'Qidirish: anonim nik, stek, qiziqish...'
                }
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00F5A0]/50 focus:ring-2 focus:ring-[#00F5A0]/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Role Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-medium text-slate-500 shrink-0 mr-1">Mutaxassislik:</span>
            {POPULAR_ROLES.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(isSelected && role !== 'All Roles' ? 'All Roles' : role)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#00F5A0]/20 text-[#00F5A0] border border-[#00F5A0]/60 shadow-[0_0_10px_rgba(0,245,160,0.2)] font-bold'
                      : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section: Projects Feed or Peers Directory */}
        {activeTab === 'projects' ? (
          <div>
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project) => {
                  const application = currentUser
                    ? applications.find(
                        (a) =>
                          a.project_id === project.project_id &&
                          a.applicant_nick.toLowerCase() === currentUser.anon_nick.toLowerCase()
                      )
                    : undefined;

                  return (
                    <PeerConnectProjectCard
                      key={project.project_id}
                      project={project}
                      currentUser={currentUser}
                      application={application}
                      onApply={handleApplyToProject}
                      onOpenAuthModal={() => setIsAuthModalOpen(true)}
                      activeRoleFilter={selectedRole}
                      onRoleClick={(r) => setSelectedRole(r)}
                    />
                  );
                })}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 px-6 glass-card rounded-3xl border border-slate-800 space-y-4 max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F5A0]/20 to-[#00D9F5]/20 text-[#00F5A0] border border-[#00F5A0]/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,245,160,0.2)]">
                  <Rocket className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Hozircha loyihalar mavjud emas</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  School 21 kampusidagi birinchi startap yoki loyihani siz boshlab bering! Jamoangiz uchun kerakli mutaxassislarni topish maqsadida loyihangizni e&apos;lon qiling.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser) {
                        setIsCreateProjectOpen(true);
                      } else {
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-slate-950 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(0,245,160,0.3)] hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Birinchi bo‘lib loyiha yarating</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBotModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-[#0088cc] border border-[#0088cc]/40 text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>Telegram Bot orqali ro‘yxatdan o‘tish</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-base font-bold text-white">Mos keluvchi loyihalar topilmadi</h4>
                <p className="text-xs text-slate-400">Filtrni tozalab qaytadan urinib ko‘ring yoki birinchi bo‘lib loyiha yarating.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('All Roles');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 cursor-pointer"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredPeers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPeers.map((peer) => (
                  <PeerConnectPeerCard
                    key={peer.anon_nick}
                    peer={peer}
                    activeSkill={selectedRole}
                    onSkillClick={(s) => setSelectedRole(s)}
                    isCurrentUser={currentUser?.anon_nick.toLowerCase() === peer.anon_nick.toLowerCase()}
                  />
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 px-6 glass-card rounded-3xl border border-slate-800 space-y-4 max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F5A0]/20 to-[#00D9F5]/20 text-[#00F5A0] border border-[#00F5A0]/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,245,160,0.2)]">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Hozircha ro‘yxatdan o‘tgan peerlar yo‘q</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Telegram Bot orqali birinchi bo‘lib profilingizni faollashtiring, doimiy unikal anonim nik oling va platformadagi loyihalarga qo‘shiling.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBotModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0088cc] to-[#00F5A0] text-slate-950 text-xs sm:text-sm font-bold shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer inline-flex items-center space-x-2"
                  >
                    <span>🤖 Telegram Bot orqali qo‘shilish</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-base font-bold text-white">Mos keluvchi anonim peerlar topilmadi</h4>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('All Roles');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 cursor-pointer"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-[#00F5A0]">PeerConnect 21</span>
            <span>•</span>
            <span>School 21 Anonim Autentifikatsiya & Matchmaking Platformasi</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Telegram Bot Onboarding</span>
            <span>•</span>
            <span className="text-slate-400">Mutual Consent Contact Reveal</span>
            <span>•</span>
            <span className="text-[#00F5A0] font-mono">intra.21</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TelegramBotModal
        isOpen={isBotModalOpen}
        onClose={() => setIsBotModalOpen(false)}
        onRegisterSuccess={handleRegisterFromBot}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        onLoginSuccess={handleLogin}
        onOpenBotModal={() => setIsBotModalOpen(true)}
      />

      <ProfileModal
        user={currentUser}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateProfile={handleUpdateProfile}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        currentUser={currentUser}
        onAddProject={handleAddProject}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <ApplicationsDrawer
        isOpen={isApplicationsOpen}
        onClose={() => setIsApplicationsOpen(false)}
        currentUser={currentUser}
        users={users}
        projects={projects}
        applications={applications}
        onAcceptApplication={handleAcceptApplication}
        onRejectApplication={handleRejectApplication}
      />

    </div>
  );
}
