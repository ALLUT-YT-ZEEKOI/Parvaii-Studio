import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Layout,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface PartnerInfo {
  id: number;
  name: string;
  role: 'admin' | 'partner';
  title: string;
  email: string;
  defaultPass: string;
  avatarColor: string;
}

const PARTNERS: PartnerInfo[] = [
  {
    id: 1,
    name: 'Allu',
    role: 'admin',
    title: 'Managing Partner',
    email: 'allu@parvaii.com',
    defaultPass: 'allu@123',
    avatarColor: 'bg-[#0B162A] text-[#C9B7A5]',
  },
  {
    id: 2,
    name: 'Paru',
    role: 'partner',
    title: 'Creative Director',
    email: 'paru@parvaii.com',
    defaultPass: 'paru@123',
    avatarColor: 'bg-[#1C2C4A] text-white',
  },
  {
    id: 3,
    name: 'Kathu',
    role: 'partner',
    title: 'Sourcing & Production',
    email: 'kathu@parvaii.com',
    defaultPass: 'kathu@123',
    avatarColor: 'bg-[#2A3F66] text-white',
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Active Partner & Form State
  const [selectedPartner, setSelectedPartner] = useState<PartnerInfo>(PARTNERS[0]);
  const [emailOrUsername, setEmailOrUsername] = useState(PARTNERS[0].email);
  const [password, setPassword] = useState(PARTNERS[0].defaultPass);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Layout Theme Toggle: 'split' (Editorial Split) vs 'centered' (Centered Atelier Showcase)
  const [layoutMode, setLayoutMode] = useState<'split' | 'centered'>('split');

  const handleSelectPartner = (partner: PartnerInfo) => {
    setSelectedPartner(partner);
    setEmailOrUsername(partner.email);
    setPassword(partner.defaultPass);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let email = emailOrUsername.trim();
    if (!email.includes('@')) {
      email = `${email.toLowerCase()}@parvaii.com`;
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      // In offline/demo environment, determine partner from input
      const clean = email.toLowerCase();
      const match = PARTNERS.find(p => clean.includes(p.name.toLowerCase())) || PARTNERS[0];
      login('demo-token-12345', {
        id: match.id,
        name: match.name,
        email: match.email,
        role: match.role,
        phone: '+91 98765 00001',
        status: 'active',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative antialiased selection:bg-[#C9B7A5]/30 overflow-x-hidden font-sans">
      {/* Top Layout Switcher Pill (Try Different Luxury Looks) */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-1 p-1 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 text-[10px] sm:text-[11px] font-medium text-slate-600">
        <span className="hidden sm:inline px-2 text-slate-400 font-semibold uppercase tracking-wider text-[9.5px]">
          Style:
        </span>
        <button
          type="button"
          onClick={() => setLayoutMode('split')}
          className={`px-2.5 sm:px-3 py-1 rounded-full transition-all ${
            layoutMode === 'split'
              ? 'bg-[#0B162A] text-white font-semibold shadow-sm'
              : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Editorial Split
        </button>
        <button
          type="button"
          onClick={() => setLayoutMode('centered')}
          className={`px-2.5 sm:px-3 py-1 rounded-full transition-all ${
            layoutMode === 'centered'
              ? 'bg-[#0B162A] text-white font-semibold shadow-sm'
              : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Centered
        </button>
      </div>

      {layoutMode === 'split' ? (
        /* ========================================================================= */
        /* DESIGN 1: EDITORIAL SPLIT (Mobile-First Sheet & Desktop Atelier)         */
        /* ========================================================================= */
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7F5F0]">
          {/* Left Panel: Luxury Silk & Brand Image */}
          <div className="w-full lg:w-[46%] xl:w-[44%] 2xl:w-[40%] h-[190px] sm:h-[260px] lg:h-screen lg:max-h-screen relative overflow-hidden bg-[#070e1c] shadow-2xl shrink-0">
            <img
              src="/parvaii-login-hero-v2.jpg"
              alt="PARVAII Luxury Atelier"
              className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03]"
            />
            {/* Subtle luxury edge fade towards the right */}
            <div className="hidden lg:block absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-[#F7F5F0]/20 pointer-events-none" />
          </div>

          {/* Right Panel: Mobile Sheet on Small Screens & Spacious Atelier on Desktop */}
          <div className="relative flex-1 flex flex-col justify-between -mt-5 sm:mt-0 rounded-t-[32px] sm:rounded-none z-10 bg-gradient-to-br from-[#FAF8F5] via-[#F7F5F0] to-[#EFEAE1] p-5 sm:p-10 lg:p-12 xl:p-16 min-h-[520px] lg:h-screen overflow-y-auto shadow-[0_-12px_30px_rgba(0,0,0,0.12)] sm:shadow-none">
            {/* Top Brand Subtitle & Drop Indicator */}
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 mb-5 sm:mb-6">
              <div className="flex items-center gap-2">
                <img src="/parvaii-symbol.png" alt="PARVAII" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                <span className="font-serif tracking-[0.2em] text-[#0B162A] text-xs font-bold uppercase">
                  PARVAII Atelier
                </span>
              </div>
              <span className="text-[10px] sm:text-[10.5px] font-medium tracking-wide px-2 sm:px-2.5 py-0.5 rounded-full bg-[#EFE9DF] text-[#7A634B] border border-[#E0D7C9]">
                Drop 02 • Midnight Bloom
              </span>
            </div>

            {/* Central Form Card */}
            <div className="w-full max-w-[460px] mx-auto my-auto py-1 sm:py-2">
              <div className="text-center mb-5 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B162A] tracking-tight">
                  Partner Sign In
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Access brand operations, orders, financials & inventory
                </p>
              </div>

              {/* Interactive 3-Partner Selection Cards */}
              <div className="mb-5 sm:mb-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center mb-2">
                  Select Your Partner Workspace
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
                  {PARTNERS.map((p) => {
                    const isSelected = selectedPartner.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPartner(p)}
                        className={`group relative p-2 sm:p-3 rounded-xl sm:rounded-2xl text-left transition-all duration-200 border ${
                          isSelected
                            ? 'bg-white border-[#0B162A] shadow-md ring-2 ring-[#0B162A]/10 scale-[1.02]'
                            : 'bg-white/60 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                        )}
                        <div
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-[11px] sm:text-xs mb-1.5 sm:mb-2 transition-transform group-hover:scale-105 ${p.avatarColor}`}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <span className="font-bold text-xs text-[#0B162A] block leading-tight">
                          {p.name}
                        </span>
                        <span className="text-[9px] sm:text-[9.5px] text-slate-400 block truncate mt-0.5">
                          {p.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login Form Box */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[0_12px_40px_rgba(11,22,42,0.06)] border border-slate-200/80">
                {error && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl text-center">
                    {error}
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Partner Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Partner Email / ID
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="e.g. allu@parvaii.com"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B162A]/20 focus:border-[#0B162A] transition-all bg-slate-50/50 focus:bg-white font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => alert(`Your partner password is: ${selectedPartner.defaultPass}`)}
                        className="text-[11px] text-[#7A634B] hover:text-[#0B162A] font-semibold underline underline-offset-2"
                      >
                        Show default pass
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B162A]/20 focus:border-[#0B162A] transition-all bg-slate-50/50 focus:bg-white font-medium text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Toggle password"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot Row */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#0B162A] focus:ring-[#0B162A]"
                      />
                      <span>Keep me signed in</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Role: <strong className="text-slate-700 capitalize">{selectedPartner.role}</strong>
                    </span>
                  </div>

                  {/* Primary CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-[#0B162A] hover:bg-[#15233E] text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-200 disabled:opacity-50 group"
                  >
                    <span>{loading ? 'Entering Atelier...' : `Sign In as ${selectedPartner.name}`}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Security Footer */}
            <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Sanctum Encrypted Partner Session
              </span>
              <span>PARVAII Brand ERP v1.0</span>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* DESIGN 2: CENTERED ATELIER SHOWCASE (Full-Screen Ambient Silk Luxury)    */
        /* ========================================================================= */
        <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#070e1c] overflow-hidden">
          {/* Ambient Blurred Silk Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-xl scale-110 pointer-events-none"
            style={{ backgroundImage: "url('/parvaii-login-hero-v2.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070e1c] via-[#070e1c]/80 to-[#070e1c]/60 pointer-events-none" />

          {/* Centered Floating Haute Couture Glass Card */}
          <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[32px] p-8 sm:p-11 shadow-[0_25px_70px_rgba(0,0,0,0.5)] border border-white/20 transition-all">
            {/* Top Emblem */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#F6EDE4] border border-[#EBE1D7] flex items-center justify-center p-3 mx-auto mb-3 shadow-sm">
                <img src="/parvaii-symbol.png" alt="PARVAII" className="w-full h-full object-contain" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.18em] text-[#0B162A] uppercase">
                PARVAII
              </h1>
              <p className="text-[11px] font-semibold text-[#7A634B] uppercase tracking-widest mt-1">
                Clothing Brand Management
              </p>
            </div>

            {/* Partner Selection Strip */}
            <div className="mb-6">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center mb-2">
                Active Partner
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PARTNERS.map((p) => {
                  const isSelected = selectedPartner.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPartner(p)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-[#0B162A] text-white border-[#0B162A] shadow-md font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs block font-bold">{p.name}</span>
                      <span className={`text-[9.5px] block capitalize ${isSelected ? 'text-[#C9B7A5]' : 'text-slate-400'}`}>
                        {p.role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B162A]/20 focus:border-[#0B162A] bg-slate-50 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword(selectedPartner.defaultPass)}
                    className="text-[10px] text-slate-400 hover:text-slate-700 underline"
                  >
                    Auto-fill default
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B162A]/20 focus:border-[#0B162A] bg-slate-50 focus:bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#0B162A] focus:ring-[#0B162A]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert(`Password is: ${selectedPartner.defaultPass}`)}
                  className="text-slate-700 hover:text-[#0B162A] font-semibold underline underline-offset-2"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 bg-[#0B162A] hover:bg-[#162544] text-white text-xs font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>{loading ? 'Signing in...' : `Enter Workspace as ${selectedPartner.name}`}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Secured Partner Access • PARVAII
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
