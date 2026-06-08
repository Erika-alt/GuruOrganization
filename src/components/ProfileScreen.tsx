import React, { useState } from 'react';
import { 
  Menu, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Lock, 
  Check, 
  LogOut, 
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  User,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSession } from '../types';

interface ProfileScreenProps {
  userSession: UserSession;
  onUpdateSession: (session: UserSession) => void;
  onLogout: () => void;
  onMenuClick: () => void;
}

const AVATAR_SEEDS = [
  { id: 'avatar-leaf', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&auto=format&fit=crop&q=80', label: 'Lótus' },
  { id: 'avatar-eco', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=150&auto=format&fit=crop&q=80', label: 'Zen' },
  { id: 'avatar-bamboo', url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=150&auto=format&fit=crop&q=80', label: 'Orvalho' },
  { id: 'avatar-stone', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&auto=format&fit=crop&q=80', label: 'Harmonia' }
];

export default function ProfileScreen({
  userSession,
  onUpdateSession,
  onLogout,
  onMenuClick
}: ProfileScreenProps) {
  // Input fields for Screen 2 Welcome card
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle local credential submission
  const handleSubmitCredential = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form validations
    if (!username.trim()) {
      setErrorMsg('Insira um nome de usuário válido.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('A senha precisa ter pelo menos 4 caracteres.');
      return;
    }

    // Success login mapping
    onUpdateSession({
      username: username.trim(),
      email: email.trim() || `${username.trim().toLowerCase()}@example.com`,
      isLoggedIn: true,
      avatarUrl: AVATAR_SEEDS[0].url
    });
  };

  // Quick social register simulators
  const simulateSocialLogin = (provider: string) => {
    onUpdateSession({
      username: `Erika ${provider}`,
      email: `erika.${provider.toLowerCase()}@gmail.com`,
      isLoggedIn: true,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' // premium real profile mock
    });
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#f9f9fc] flex flex-col relative pb-32 pt-2" id="profile-screen">
      
      {/* Top Header */}
      <header className="flex justify-between items-center px-6 py-4" id="profile-header">
        <span className="font-sans font-bold text-lg tracking-tight text-[#0c3d5e]" id="profile-brand">
          Guru Organização
        </span>
        <button 
          onClick={onMenuClick}
          className="p-2 -mr-2 rounded-xl hover:bg-neutral-200/50 transition-colors"
          aria-label="Menu"
          id="btn-profile-menu"
        >
          <Menu size={24} className="text-[#0c3d5e]" />
        </button>
      </header>

      {/* Dynamic profile content based on Auth state */}
      <AnimatePresence mode="wait">
        {!userSession.isLoggedIn ? (
          /* =========================================================
             SCREEN 2: Auth / Welcome / "Bem vindo(a)" Login Form Screen
             ========================================================= */
          <motion.main 
            key="auth-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex-1 px-6 flex flex-col items-center"
            id="auth-view-container"
          >
            {/* Top botanical leaf circle badge */}
            <div className="mt-6 mb-5 flex justify-center" id="botanical-badge-group">
              <div 
                className="w-20 h-20 bg-[#6fd1d7]/20 text-[#0c3d5e] rounded-[24px] flex items-center justify-center shadow-inner"
                style={{ transform: 'rotate(-5deg)' }}
              >
                {/* Seed/leaf vector shape mimicking screen 2 launcher logo */}
                <svg viewBox="0 0 48 48" className="w-11 h-11 fill-[#0c3d5e]">
                  <path d="M24,2C12,12,12,24,24,46C36,24,36,12,24,2 M24,19c3.2,0,5.8,2.6,5.8,5.8S27.2,30.6,24,30.6S18.2,28,18.2,24.8S20.8,19,24,19Z" />
                </svg>
              </div>
            </div>

            {/* Greetings titles */}
            <div className="text-center mb-6" id="welcome-headings">
              <h1 className="font-sans text-[30px] font-extrabold leading-[38px] tracking-[-0.01em] text-[#0c3d5e]" id="lbl-bem-vindo">
                Bem vindo(a)
              </h1>
              <p className="text-sm font-semibold leading-relaxed text-[#42474e] mt-1.5 max-w-[280px] mx-auto opacity-80" id="desc-bem-vindo">
                Sua jornada para uma mente clara e produtiva começa aqui.
              </p>
            </div>

            {/* Main Login / Register Credentials Card */}
            <form 
              onSubmit={handleSubmitCredential}
              className="w-full bg-white p-7 rounded-[24px] border border-neutral-100 flex flex-col gap-4 shadow-sm"
              style={{ boxShadow: '0 12px 35px rgba(12, 61, 94, 0.04)' }}
              id="credentials-auth-card"
            >
              {errorMsg && (
                <p className="text-xs font-bold text-[#ba1a1a] bg-red-55/60 p-2.5 rounded-lg border border-red-200">
                  {errorMsg}
                </p>
              )}

              {/* Login input */}
              <div className="flex flex-col gap-1.5" id="group-auth-user">
                <label className="text-xs font-bold text-[#0c3d5e] uppercase tracking-wide px-1" htmlFor="input-username">
                  Login
                </label>
                <div className="bg-[#f3f3f6] rounded-2xl flex items-center px-4 py-3.5 shadow-inner">
                  <User size={16} className="text-neutral-400 mr-2.5" />
                  <input
                    id="input-username"
                    type="text"
                    required
                    placeholder="Seu usuário ou e-mail"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-transparent border-none text-sm font-semibold text-[#1a1c1e] placeholder-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email input field activated conditionally on register screen */}
              {isRegisterMode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-col gap-1.5"
                  id="group-auth-email"
                >
                  <label className="text-xs font-bold text-[#0c3d5e] uppercase tracking-wide px-1" htmlFor="input-email-reg">
                    E-mail de Contato
                  </label>
                  <div className="bg-[#f3f3f6] rounded-2xl flex items-center px-4 py-3.5 shadow-inner">
                    <Mail size={16} className="text-neutral-400 mr-2.5" />
                    <input
                      id="input-email-reg"
                      type="email"
                      placeholder="erikahonoratos@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent border-none text-sm font-semibold text-[#1a1c1e] placeholder-neutral-400 focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* Senha input */}
              <div className="flex flex-col gap-1.5" id="group-auth-pass">
                <label className="text-xs font-bold text-[#0c3d5e] uppercase tracking-wide px-1" htmlFor="input-password">
                  Senha
                </label>
                <div className="bg-[#f3f3f6] rounded-2xl flex items-center px-4 py-3.5 shadow-inner">
                  <Lock size={16} className="text-neutral-400 mr-2.5" />
                  <input
                    id="input-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent border-none text-sm font-semibold text-[#1a1c1e] placeholder-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cadastrar submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-[#0c3d5e] text-white rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-[#002740] active:scale-[0.98] transition-all shadow-md shadow-[#0c3d5e]/20 mt-2"
                id="btn-auth-submit"
              >
                {isRegisterMode ? 'Criar Nova Conta' : 'Cadastrar'}
              </button>

              {/* Bottom Forgot password / Mode Switcher links */}
              <div className="flex flex-col items-center gap-2 mt-2 text-xs font-semibold" id="auth-links">
                <button
                  type="button"
                  onClick={() => alert('Recuperação de login enviada! Por favor, cheque sua caixa de entrada mockup.')}
                  className="text-[#2e90c9] hover:underline"
                  id="btn-forgot-password"
                >
                  Esqueceu sua senha?
                </button>
                <div className="h-px w-full bg-neutral-100 my-1" />
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-neutral-500 hover:text-[#0c3d5e]"
                >
                  {isRegisterMode ? 'Já possui login? Acessar conta' : 'Novo por aqui? Criar conta com senha'}
                </button>
              </div>
            </form>

            {/* DIVIDER: "LOGIN SOCIAL" row */}
            <div className="w-full flex items-center gap-4 my-6" id="social-divider">
              <div className="h-px flex-1 bg-neutral-200"></div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
                LOGIN SOCIAL
              </span>
              <div className="h-px flex-1 bg-neutral-200"></div>
            </div>

            {/* Social List buttons stacking matching mockup layout perfectly */}
            <div className="w-full flex flex-col gap-3" id="social-channels">
              {/* Google login Button */}
              <button
                type="button"
                onClick={() => simulateSocialLogin('Google')}
                className="w-full bg-white border border-neutral-100 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:bg-neutral-50 active:scale-98 transition-all"
                style={{ boxShadow: '0 8px 20px rgba(12, 61, 94, 0.02)' }}
                id="social-btn-google"
              >
                <div className="flex items-center gap-4">
                  {/* Styled simulated Google mini logo inside canvas frame */}
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center p-1.5" id="social-icon-google">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.518 5.518 0 0 1 8.5 13a5.518 5.518 0 0 1 5.491-5.514c2.254 0 4.295 1.205 5.254 3.031l3.33-2.545C20.627 4.545 16.591 2 13.991 2 7.37 2 2 7.37 2 13s5.37 11 11.991 11c6.545 0 11.455-4.545 11.455-11 0-.745-.091-1.35-.227-1.714h-12.98Z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-neutral-700">Google</span>
                </div>
                <ChevronRight size={18} className="text-neutral-400" />
              </button>

              {/* Apple ID login Button */}
              <button
                type="button"
                onClick={() => simulateSocialLogin('Apple')}
                className="w-full bg-white border border-neutral-100 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:bg-neutral-50 active:scale-98 transition-all"
                style={{ boxShadow: '0 8px 20px rgba(12, 61, 94, 0.02)' }}
                id="social-btn-apple"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center" id="social-icon-apple">
                    <span className="font-mono text-base font-bold select-none leading-none"></span>
                  </div>
                  <span className="text-sm font-bold text-neutral-700">Apple ID</span>
                </div>
                <ChevronRight size={18} className="text-neutral-400" />
              </button>

              {/* E-mail login Button */}
              <button
                type="button"
                onClick={() => {
                  setUsername('Erika Honorato');
                  setEmail('erikahonoratos@gmail.com');
                  setIsRegisterMode(true);
                }}
                className="w-full bg-white border border-neutral-100 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:bg-neutral-50 active:scale-98 transition-all"
                style={{ boxShadow: '0 8px 20px rgba(12, 61, 94, 0.02)' }}
                id="social-btn-email"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#eeedf1] flex items-center justify-center text-neutral-600" id="social-icon-email">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-bold text-neutral-700">E-mail</span>
                </div>
                <ChevronRight size={18} className="text-neutral-400" />
              </button>
            </div>
          </motion.main>
        ) : (
          /* =========================================================
             LOGGED-IN VIEW: Profile editor / Botanical dashboard
             ========================================================= */
          <motion.main
            key="profile-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex-1 px-6 flex flex-col gap-6"
            id="profile-view-container"
          >
            {/* Mindful user statistics card */}
            <div className="bg-white p-6 rounded-[24px] border border-neutral-100 flex flex-col items-center text-center shadow-lg" style={{ boxShadow: '0 12px 35px rgba(12, 61, 94, 0.03)' }}>
              
              {/* User photo frame */}
              <div className="relative mb-4">
                <img 
                  src={userSession.avatarUrl || AVATAR_SEEDS[0].url} 
                  alt="Erika Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#6fd1d7]/30 shadow-md referrer-policy='no-referrer'"
                />
                <span className="absolute bottom-1 right-1 bg-[#6fd1d7] text-[#0c3d5e] p-1.5 rounded-full shadow-md z-10 border-2 border-white">
                  <Sparkles size={14} className="animate-spin-slow" />
                </span>
              </div>

              <h2 className="font-sans text-xl font-extrabold text-[#0c3d5e]" id="logged-username">
                {userSession.username}
              </h2>
              <p className="text-xs font-semibold text-neutral-400 mt-1" id="logged-email">
                {userSession.email}
              </p>

              {/* Tonal badge count */}
              <div className="mt-5 flex gap-1.5 items-center bg-[#f3f3f6] px-5 py-2.5 rounded-full" id="daily-streak-badge">
                <Heart className="text-[#2e90c9]" size={15} fill="#2e90c9" />
                <span className="text-xs font-bold text-[#0c3d5e]">
                  Visualizador Cognitivo Ativo
                </span>
              </div>
            </div>

            {/* Botanical / Zen Avatar Seed Customizer */}
            <section className="bg-white p-5 rounded-2xl border border-neutral-100" style={{ boxShadow: '0 8px 25px rgba(12, 61, 94, 0.02)' }} id="avatar-seeds-customizer">
              <h3 className="text-xs font-bold text-[#0c3d5e] uppercase tracking-wider mb-3 block">
                Escolha o seu Foco de Fundo (Avatar)
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_SEEDS.map((avatar) => {
                  const isSelected = userSession.avatarUrl === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => onUpdateSession({ ...userSession, avatarUrl: avatar.url })}
                      className={`relative flex flex-col items-center p-1.5 rounded-xl border-2 transition-all ${
                        isSelected ? 'border-[#2e90c9] bg-[#2e90c9]/5' : 'border-transparent hover:bg-neutral-50'
                      }`}
                    >
                      <img 
                        src={avatar.url} 
                        alt={avatar.label} 
                        className="w-12 h-12 rounded-lg object-cover shadow-sm referrer-policy='no-referrer'"
                      />
                      <span className="text-[10px] font-bold text-neutral-500 mt-1">{avatar.label}</span>
                      {isSelected && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-[#2e90c9] text-white rounded-full flex items-center justify-center p-0.5">
                          <Check size={8} strokeWidth={4} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Simulated System metadata */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-4 text-xs font-medium text-neutral-500 flex flex-col gap-3" id="system-metadata-group">
              <div className="flex justify-between items-center py-1">
                <span>Versão do Mecanismo</span>
                <span className="font-bold text-[#0c3d5e]">v1.2.4-Serene</span>
              </div>
              <div className="h-px bg-neutral-100" />
              <div className="flex justify-between items-center py-1">
                <span>Armazenamento</span>
                <span className="font-bold text-[#2e90c9] flex items-center gap-1">
                  Nuvem Local Sincronizada
                </span>
              </div>
            </div>

            {/* Logout trigger button */}
            <button
              onClick={onLogout}
              className="py-4 bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/15 text-[#ba1a1a] rounded-full font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95"
              id="btn-logout"
            >
              <LogOut size={16} />
              SAIR DA CONTA
            </button>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
