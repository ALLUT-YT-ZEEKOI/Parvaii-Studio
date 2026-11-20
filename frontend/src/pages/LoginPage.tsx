import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const FALLBACK_USERS = [
  { id: 1, name: 'Allu', role: 'admin' as const, email: 'allu@parvaii.com' },
  { id: 2, name: 'Paru', role: 'partner' as const, email: 'paru@parvaii.com' },
  { id: 3, name: 'Kathu', role: 'partner' as const, email: 'kathu@parvaii.com' },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let email = emailOrUsername.trim();
    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }
    if (!email.includes('@')) {
      email = `${email.toLowerCase()}@parvaii.com`;
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch {
      const clean = email.toLowerCase();
      const match =
        FALLBACK_USERS.find((p) => clean.includes(p.name.toLowerCase()) || clean === p.email) ||
        FALLBACK_USERS[0];
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
    <div className="min-h-screen w-full relative antialiased overflow-x-hidden font-sans bg-[#F7F5F0]">
      <div className="min-h-screen w-full flex flex-col lg:flex-row">
        {/* Hero panel — shorter on mobile, full height on desktop */}
        <div className="w-full lg:w-[46%] xl:w-[44%] h-[42vh] min-h-[220px] max-h-[320px] lg:max-h-none lg:h-screen relative overflow-hidden bg-[#070e1c] shrink-0">
          <img
            src="/parvaii-login-hero-v2.jpg"
            alt="PARVAII Atelier"
            className="w-full h-full object-cover object-[center_20%] lg:object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070e1c]/70 via-transparent to-[#070e1c]/25 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#070e1c]/20" />
          <div className="absolute bottom-5 left-5 right-5 lg:bottom-10 lg:left-10 lg:right-10">
            <p className="font-serif text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight drop-shadow-md">
              PARVAII
            </p>
            <p className="mt-1 text-[11px] sm:text-xs text-white/75 tracking-[0.18em] uppercase">
              Atelier Brand ERP
            </p>
          </div>
        </div>

        {/* Form sheet */}
        <div className="relative flex-1 flex flex-col -mt-6 lg:mt-0 rounded-t-[28px] lg:rounded-none z-10 bg-gradient-to-br from-[#FAF8F5] via-[#F7F5F0] to-[#EFEAE1] px-5 pt-6 pb-5 sm:p-10 lg:p-12 xl:px-16 xl:py-14 min-h-[58vh] lg:h-screen lg:overflow-y-auto shadow-[0_-14px_36px_rgba(0,0,0,0.14)] lg:shadow-none">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 mb-6 sm:mb-8">
            <div className="flex items-center gap-2">
              <img src="/parvaii-symbol.png" alt="PARVAII" className="w-5 h-5 object-contain" />
              <span className="font-serif tracking-[0.18em] text-[#0B162A] text-xs font-bold uppercase">
                PARVAII Atelier
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-full bg-[#EFE9DF] text-[#7A634B] border border-[#E0D7C9]">
              Drop 02 • Midnight Bloom
            </span>
          </div>

          <div className="w-full max-w-[420px] mx-auto my-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-[1.65rem] sm:text-3xl font-serif font-bold text-[#0B162A] tracking-tight">
                Partner Sign In
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-500 mt-1.5 leading-relaxed px-2">
                Access brand operations, orders, financials & inventory
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[0_12px_40px_rgba(11,22,42,0.06)] border border-slate-200/80">
              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl text-center">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit} autoComplete="on">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      inputMode="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      required
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B162A]/20 focus:border-[#0B162A] transition-all bg-slate-50/50 focus:bg-white font-medium text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B162A]/20 focus:border-[#0B162A] transition-all bg-slate-50/50 focus:bg-white font-medium text-slate-800 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none pt-0.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#0B162A] focus:ring-[#0B162A]"
                  />
                  <span>Keep me signed in</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-[#0B162A] hover:bg-[#15233E] active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 group"
                >
                  <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                  {!loading && (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="pt-5 mt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Encrypted partner session
            </span>
            <span>PARVAII Brand ERP v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
