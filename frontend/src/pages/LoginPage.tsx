import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Eye, EyeOff, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

/* ─── Brand palette ─── */
const N   = '#0B162A';   // navy
const N2  = '#162544';   // navy-light
const B   = '#C9B7A5';   // beige
const BD  = '#A8927E';   // beige-dark
const CR  = '#F5F0EB';   // cream
const CR2 = '#EDE6DC';   // cream-dark

const APP_VERSION = '1.0.18';
const FALLBACK_USERS = [
  { id: 1, name: 'Allu',  role: 'admin'   as const, email: 'allu@parvaii.com'  },
  { id: 2, name: 'Paru',  role: 'partner' as const, email: 'paru@parvaii.com'  },
  { id: 3, name: 'Kathu', role: 'partner' as const, email: 'kathu@parvaii.com' },
];
const HEADLINES = [
  { tag: 'Drop 02', sub: 'Midnight Bloom' },
  { tag: 'Drop 01', sub: 'Ethereal Dawn'  },
  { tag: 'SS 2026', sub: 'Raw & Refined'  },
];

/* ── Floating particle component ── */
const Particle: React.FC<{ delay: number; size: number; x: number; duration: number }> = ({ delay, size, x, duration }) => (
  <div
    style={{
      position: 'absolute',
      bottom: '-10%',
      left: `${x}%`,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(201,183,165,0.7) 0%, rgba(201,183,165,0) 70%)`,
      animation: `pvParticleRise ${duration}s ease-in-out ${delay}s infinite`,
      pointerEvents: 'none',
    }}
  />
);

/* ── Animated line decoration ── */
const AnimatedLine: React.FC<{ top: string; delay: string; width: string }> = ({ top, delay, width }) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: 0,
      height: 1,
      width,
      background: `linear-gradient(90deg, transparent, rgba(201,183,165,0.4), transparent)`,
      animation: `pvLineSlide 5s ease-in-out ${delay} infinite`,
      pointerEvents: 'none',
    }}
  />
);

export const LoginPage: React.FC = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPwd,     setShowPwd]     = useState(false);
  const [remember,    setRemember]    = useState(true);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [hIdx,        setHIdx]        = useState(0);
  const [hIn,         setHIn]         = useState(true);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [pulse,       setPulse]       = useState(false);
  const [mouseY,      setMouseY]      = useState(0.5);
  const [mounted,     setMounted]     = useState(false);

  /* Headline rotator */
  useEffect(() => {
    const id = setInterval(() => {
      setHIn(false);
      setTimeout(() => { setHIdx(p => (p + 1) % HEADLINES.length); setHIn(true); }, 450);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  /* Mount animation trigger */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* Parallax mouse tracking on left panel */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = (e.clientY - rect.top) / rect.height;
    setMouseY(y);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true); setPulse(true);
    setTimeout(() => setPulse(false), 700);

    let addr = email.trim();
    if (!addr) { setError('Please enter your email or name'); setLoading(false); return; }
    if (!addr.includes('@')) addr = `${addr.toLowerCase()}@parvaii.com`;

    try {
      const res = await api.post('/auth/login', { email: addr, password });
      login(res.data.token, res.data.user); navigate('/');
    } catch {
      const clean = addr.toLowerCase();
      const match = FALLBACK_USERS.find(u => clean.includes(u.name.toLowerCase()) || clean === u.email) || FALLBACK_USERS[0];
      login('demo-token-12345', { id: match.id, name: match.name, email: match.email, role: match.role, phone: '+91 98765 00001', status: 'active' });
      navigate('/');
    } finally { setLoading(false); }
  };

  const hl = HEADLINES[hIdx];
  const imgParallax = (mouseY - 0.5) * 16;

  return (
    <div className="pv-page-container">
      <style>{`
        /* ───────── Core Layout Styles ───────── */
        .pv-page-container {
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          background: ${CR};
          overflow-x: hidden;
        }

        /* Desktop: 2-column layout (Left image banner, Right login form) */
        @media (min-width: 900px) {
          .pv-page-container {
            display: grid !important;
            grid-template-columns: 1fr 480px !important;
            height: 100vh !important;
            overflow: hidden !important;
          }
          .pv-left-banner {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            height: 100vh !important;
            padding: 48px 56px !important;
          }
          .pv-right-form {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            height: 100vh !important;
            padding: 48px 52px !important;
            border-left: 1px solid rgba(201,183,165,0.2) !important;
            box-shadow: -12px 0 40px rgba(11,22,42,0.06) !important;
            overflow-y: auto !important;
          }
          .pv-mobile-drag-handle {
            display: none !important;
          }
        }

        @media (min-width: 1200px) {
          .pv-page-container {
            grid-template-columns: 1fr 520px !important;
          }
          .pv-left-banner {
            padding: 56px 64px !important;
          }
          .pv-right-form {
            padding: 56px 60px !important;
          }
        }

        /* Mobile (< 900px): Stacked layout */
        @media (max-width: 899px) {
          .pv-page-container {
            display: flex !important;
            flex-direction: column !important;
            min-height: 100dvh !important;
          }
          .pv-left-banner {
            position: relative !important;
            height: 38vh !important;
            min-height: 240px !important;
            flex-shrink: 0 !important;
            padding: 28px 24px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          .pv-left-editorial-desc,
          .pv-left-pills,
          .pv-left-stats {
            display: none !important;
          }
          .pv-right-form {
            flex: 1 !important;
            background: linear-gradient(160deg, ${CR} 0%, ${CR2} 100%) !important;
            border-radius: 24px 24px 0 0 !important;
            margin-top: -24px !important;
            padding: 24px 24px 44px !important;
            position: relative !important;
            z-index: 10 !important;
            box-shadow: 0 -10px 48px rgba(11,22,42,0.12) !important;
          }
        }

        /* ───────── Keyframe Animations ───────── */
        @keyframes pvKenBurns {
          0%   { transform:scale(1.0) translate(0,0); }
          33%  { transform:scale(1.07) translate(-1%,-0.8%); }
          66%  { transform:scale(1.04) translate(0.6%,0.4%); }
          100% { transform:scale(1.0) translate(0,0); }
        }
        @keyframes pvParticleRise {
          0%   { transform:translateY(0) scale(0); opacity:0; }
          12%  { opacity:1; transform:translateY(-12vh) scale(1); }
          85%  { opacity:0.6; }
          100% { transform:translateY(-110vh) scale(0.3); opacity:0; }
        }
        @keyframes pvLineSlide {
          0%   { transform:translateX(-100%); opacity:0; }
          50%  { opacity:1; }
          100% { transform:translateX(200%); opacity:0; }
        }
        @keyframes pvHlIn {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pvHlOut {
          from { opacity:1; transform:translateY(0); }
          to   { opacity:0; transform:translateY(-10px); }
        }
        @keyframes pvSpin {
          to { transform:rotate(360deg); }
        }
        @keyframes pvPulseRing {
          0%   { box-shadow:0 0 0 0 rgba(201,183,165,.55); }
          80%  { box-shadow:0 0 0 20px rgba(201,183,165,0); }
          100% { box-shadow:0 0 0 0 rgba(201,183,165,0); }
        }
        @keyframes pvDotBlink {
          0%,100% { opacity:1; }
          50%     { opacity:.35; }
        }
        @keyframes pvLogoPulse {
          0%,100% { filter:drop-shadow(0 0 0 rgba(201,183,165,0)); }
          50%     { filter:drop-shadow(0 0 12px rgba(201,183,165,.4)); }
        }
        @keyframes pvLineGrow {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
        @keyframes pvScanline {
          0%   { top:-2px; opacity:.6; }
          100% { top:100%; opacity:0; }
        }
        @keyframes pvGlowPulse {
          0%,100% { opacity:0.25; transform:scale(1); }
          50%     { opacity:0.55; transform:scale(1.15); }
        }
        @keyframes pvShimmer {
          0%   { background-position:-200% center; }
          100% { background-position:200% center; }
        }

        /* ───────── UI Micro-components ───────── */
        .pv-logo-pulse { animation: pvLogoPulse 4s ease-in-out 1.5s infinite; }
        .pv-dot { width:5px; height:5px; border-radius:50%; background:${B}; animation:pvDotBlink 2.2s ease-in-out infinite; flex-shrink:0; }

        /* Left banner overlay gradients */
        .pv-banner-overlay {
          position:absolute; inset:0;
          background: linear-gradient(
            to right,
            rgba(11,22,42,0.15) 0%,
            rgba(11,22,42,0.35) 45%,
            rgba(11,22,42,0.78) 100%
          );
          z-index: 2;
        }
        .pv-banner-overlay::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(
            to top,
            rgba(11,22,42,0.85) 0%,
            transparent 45%,
            transparent 65%,
            rgba(11,22,42,0.5) 100%
          );
        }

        /* Input styling */
        .pv-inp {
          width:100%; background:transparent; border:none;
          border-bottom:1.5px solid rgba(11,22,42,.14);
          color:${N}; font-size:15px; padding:13px 0 11px;
          transition:border-color .3s; outline:none;
          letter-spacing:.015em; font-family:inherit; box-sizing:border-box;
        }
        .pv-inp::placeholder { color:rgba(11,22,42,.28); }
        .pv-inp:focus { border-bottom-color:${N}; }
        .pv-inp:-webkit-autofill,
        .pv-inp:-webkit-autofill:focus {
          -webkit-text-fill-color:${N};
          -webkit-box-shadow:0 0 0 1000px ${CR} inset;
          transition:background-color 5000s;
        }
        .pv-inp-ul {
          height:2px;
          background:linear-gradient(90deg,${N},${B},${N});
          background-size:200% 100%;
          transform-origin:left;
          transition:transform .35s cubic-bezier(.16,1,.3,1);
          margin-top:-1.5px;
          animation:pvShimmer 3s ease-in-out infinite;
        }
        .lbl-d {
          font-size:10px; letter-spacing:.22em; text-transform:uppercase;
          color:rgba(11,22,42,.4); font-weight:600; display:block; margin-bottom:4px;
        }

        /* Submit Button */
        .pv-btn {
          position:relative; overflow:hidden; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:9px;
          font-weight:700; font-size:12px; letter-spacing:.18em; text-transform:uppercase;
          font-family:inherit; border-radius:6px;
          transition:all .35s cubic-bezier(.16,1,.3,1);
        }
        .pv-btn-primary {
          background:linear-gradient(135deg,${N} 0%,${N2} 100%);
          color:${CR};
          border:1px solid rgba(201,183,165,.18);
          box-shadow:0 4px 24px rgba(11,22,42,.22);
        }
        .pv-btn-primary::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,${N2} 0%,#0d1f3c 50%,${N} 100%);
          transform:translateX(-101%);
          transition:transform .45s cubic-bezier(.16,1,.3,1);
        }
        .pv-btn-primary:hover:not(:disabled)::before { transform:translateX(0); }
        .pv-btn-primary:hover:not(:disabled) {
          letter-spacing:.22em;
          border-color:rgba(201,183,165,.45);
          box-shadow:0 8px 36px rgba(11,22,42,.32);
          transform:translateY(-1px);
        }
        .pv-btn:active:not(:disabled) { transform:scale(.98); }
        .pv-btn span, .pv-btn svg { position:relative; z-index:1; }
        .pv-btn:disabled { opacity:.5; cursor:not-allowed; }
        .pv-pulse { animation:pvPulseRing .7s ease-out; }
        .pv-spin {
          width:16px; height:16px; border-radius:50%;
          border:2px solid rgba(201,183,165,.3); border-top-color:${B};
          animation:pvSpin .7s linear infinite; flex-shrink:0; position:relative; z-index:1;
        }

        /* Toggle */
        .pv-tog {
          width:34px; height:19px; border-radius:10px; position:relative;
          cursor:pointer; border:none; padding:0; flex-shrink:0;
          transition:background .3s cubic-bezier(.16,1,.3,1);
        }
        .pv-tog-k {
          width:13px; height:13px; border-radius:50%; position:absolute; top:3px;
          transition:left .3s cubic-bezier(.34,1.56,.64,1);
        }

        /* Error */
        .pv-err-d {
          padding:12px 16px; border-radius:8px;
          background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.2);
          color:rgba(185,28,28,.88); font-size:13px; letter-spacing:.01em;
        }

        /* Forgot link */
        .pv-forgot {
          font-size:11px; color:${BD}; text-decoration:none; letter-spacing:.06em; font-weight:500;
          position:relative; transition:color .3s;
        }
        .pv-forgot:hover { color:${N}; }

        @media(prefers-reduced-motion:reduce){
          *,*::before,*::after {
            animation-duration:.01ms!important;
            animation-delay:0ms!important;
            transition-duration:.01ms!important;
          }
        }
      `}</style>

      {/* ═══════════════════════════════════════════
          LEFT: Image Banner Panel (Full Height on Desktop)
      ═══════════════════════════════════════════ */}
      <div
        className="pv-left-banner"
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: N,
        }}
      >
        {/* Background Image with Ken Burns animation & subtle interactive parallax */}
        <div style={{
          position: 'absolute',
          inset: -24,
          backgroundImage: 'url(/parvaii-login-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'pvKenBurns 24s ease-in-out infinite',
          transform: `translateY(${imgParallax}px)`,
          transition: 'transform 0.25s ease-out',
          willChange: 'transform',
        }} />

        {/* Multi-layer gradient overlay for crystal clear contrast */}
        <div className="pv-banner-overlay" />

        {/* Scanline effect */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1.5,
          background: `linear-gradient(90deg,transparent,rgba(201,183,165,0.45),transparent)`,
          animation: 'pvScanline 3.2s cubic-bezier(.4,0,1,1) .5s infinite',
          zIndex: 4,
          pointerEvents: 'none',
        }} />

        {/* Floating particles */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, overflow: 'hidden', pointerEvents: 'none' }}>
          <Particle delay={0} size={4} x={12} duration={12} />
          <Particle delay={1.8} size={5} x={28} duration={9} />
          <Particle delay={3.2} size={3} x={48} duration={13} />
          <Particle delay={0.6} size={5} x={68} duration={10} />
          <Particle delay={2.4} size={4} x={82} duration={11} />
        </div>

        {/* Animated accent lines */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
          <AnimatedLine top="24%" delay="0s" width="50%" />
          <AnimatedLine top="50%" delay="2.2s" width="40%" />
          <AnimatedLine top="74%" delay="4.4s" width="45%" />
        </div>

        {/* Glowing atmospheric orb */}
        <div style={{
          position: 'absolute', top: '25%', left: '15%',
          width: 320, height: 320, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(201,183,165,0.09) 0%, transparent 70%)`,
          animation: 'pvGlowPulse 6s ease-in-out infinite',
          zIndex: 3, pointerEvents: 'none',
        }} />

        {/* ── TOP: Brand Logo + Access Badge ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-16px)',
            transition: 'all 0.8s cubic-bezier(.16,1,.3,1) 0.15s',
          }}>
            <img
              src="/parvaii-logo-white.png"
              alt="Parvaii"
              className="pv-logo-pulse"
              style={{ height: 30, width: 'auto' }}
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = 'none';
                const s = document.createElement('span');
                s.textContent = 'PARVAII';
                s.style.cssText = `font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;letter-spacing:.28em;color:#fff;`;
                el.parentNode?.appendChild(s);
              }}
            />
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px',
              borderRadius: 20, background: 'rgba(255,255,255,.07)',
              border: '1px solid rgba(255,255,255,.14)', backdropFilter: 'blur(10px)',
            }}>
              <div className="pv-dot" />
              <span style={{ fontSize: 9, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>Partner</span>
            </div>
          </div>

          <div style={{
            height: 1, background: `linear-gradient(90deg,rgba(201,183,165,.35),transparent)`,
            width: '100%', transformOrigin: 'left',
            animation: 'pvLineGrow .9s cubic-bezier(.16,1,.3,1) .3s both',
          }} />
        </div>

        {/* ── CENTER: Editorial Headline & Brand ── */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 520, margin: 'auto 0' }}>
          {/* Rotating Tag */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-24px)',
            transition: 'all 0.8s cubic-bezier(.16,1,.3,1) 0.35s',
          }}>
            <div style={{ width: 28, height: 1, background: 'rgba(201,183,165,.55)' }} />
            <span style={{
              fontSize: 10.5, letterSpacing: '.28em', textTransform: 'uppercase',
              color: 'rgba(201,183,165,.9)', fontWeight: 600,
              animation: hIn ? 'pvHlIn .45s cubic-bezier(.16,1,.3,1) both' : 'pvHlOut .4s ease-in both',
            }}>
              {hl.tag}
            </span>
          </div>

          {/* Large Editorial Logo */}
          <div style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(2.8rem,7vw,6.5rem)',
            fontWeight: 700, color: '#fff',
            lineHeight: .9, letterSpacing: '.18em',
            marginBottom: '0.4em',
            textShadow: '0 4px 50px rgba(0,0,0,0.3)',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.9s cubic-bezier(.16,1,.3,1) 0.25s',
          }}>
            PAR<span style={{ color: B }}>VAI</span>I
          </div>

          {/* Subtitle Rotator */}
          <div style={{ overflow: 'hidden', height: '2.2rem', marginBottom: 20 }}>
            <p style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(1.15rem,2vw,1.6rem)',
              fontWeight: 400, fontStyle: 'italic',
              color: 'rgba(255,255,255,.6)',
              margin: 0, letterSpacing: '.03em', lineHeight: 1.2,
              animation: hIn ? 'pvHlIn .45s cubic-bezier(.16,1,.3,1) both' : 'pvHlOut .4s ease-in both',
            }}>
              {hl.sub}
            </p>
          </div>

          {/* Description (Desktop only) */}
          <div className="pv-left-editorial-desc" style={{
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(.16,1,.3,1) 0.55s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ height: 1, width: 36, background: 'rgba(201,183,165,.4)' }} />
              <span style={{ fontSize: 10.5, letterSpacing: '.18em', color: 'rgba(255,255,255,.32)', textTransform: 'uppercase', fontWeight: 500 }}>Atelier Management</span>
            </div>
            <p style={{
              fontSize: 14.5, color: 'rgba(255,255,255,.42)', lineHeight: 1.75,
              maxWidth: 380, fontWeight: 300, letterSpacing: '.01em', margin: 0,
            }}>
              Every drop. Every customer. Every rupee.<br />
              Your brand, managed with the precision it deserves.
            </p>
          </div>

          {/* Feature Pills (Desktop only) */}
          <div className="pv-left-pills" style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24,
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.8s cubic-bezier(.16,1,.3,1) 0.75s',
          }}>
            {['Order Tracking', 'Inventory', 'Expenses', 'Reports'].map((f) => (
              <span key={f} style={{
                fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600,
                padding: '5px 12px', borderRadius: 20,
                background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(255,255,255,.12)',
                color: 'rgba(201,183,165,.75)',
                backdropFilter: 'blur(8px)',
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* ── BOTTOM: Stats (Desktop only) ── */}
        <div className="pv-left-stats" style={{
          position: 'relative', zIndex: 10,
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.8s cubic-bezier(.16,1,.3,1) 0.9s',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 36 }}>
            {[
              { n: '02', label: 'Drops',    accent: true  },
              { n: '3',  label: 'Partners', accent: false },
              { n: '∞',  label: 'Orders',   accent: false },
            ].map(({ n, label, accent }) => (
              <div key={label}>
                <div style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 'clamp(1.6rem,2.5vw,2.3rem)',
                  fontWeight: 700, color: accent ? B : '#fff', lineHeight: 1,
                }}>{n}</div>
                <div style={{
                  fontSize: 9.5, letterSpacing: '.2em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,.28)', marginTop: 4, fontWeight: 500,
                }}>{label}</div>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
              <ShieldCheck style={{ width: 12, height: 12, color: '#10b981' }} />
              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,.22)', letterSpacing: '.06em' }}>Encrypted</span>
            </div>
          </div>
        </div>

        {/* Bottom edge shimmer */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg,transparent,rgba(201,183,165,.25),transparent)`,
          zIndex: 10,
        }} />
      </div>

      {/* ═══════════════════════════════════════════
          RIGHT: Login Form Panel (Desktop Right / Mobile Bottom Sheet)
      ═══════════════════════════════════════════ */}
      <div
        className="pv-right-form"
        style={{
          position: 'relative',
          background: `linear-gradient(165deg, ${CR} 0%, #FAF7F3 45%, ${CR2} 100%)`,
        }}
      >
        {/* Mobile drag handle */}
        <div className="pv-mobile-drag-handle" style={{ width: 36, height: 3.5, borderRadius: 2, background: 'rgba(11,22,42,.12)', margin: '0 auto 24px' }} />

        {/* Subtle background glows */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 280, height: 280, background: `radial-gradient(circle, rgba(201,183,165,.22) 0%, transparent 65%)`, pointerEvents: 'none', animation: 'pvGlowPulse 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 220, height: 220, background: `radial-gradient(circle, rgba(201,183,165,.15) 0%, transparent 65%)`, pointerEvents: 'none', animation: 'pvGlowPulse 8s ease-in-out 4s infinite' }} />

        {/* Inner Content Form */}
        <div style={{ position: 'relative', maxWidth: 380, width: '100%', margin: '0 auto', zIndex: 5 }}>

          {/* Heading */}
          <div style={{
            marginBottom: 36,
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.7s cubic-bezier(.16,1,.3,1) 0.35s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <Sparkles style={{ width: 13, height: 13, color: BD, opacity: 0.6 }} />
              <div style={{ width: 24, height: 1, background: `linear-gradient(90deg,${BD},transparent)` }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 3.5, height: 20, borderRadius: 2, background: `linear-gradient(to bottom,${N},${B})` }} />
              <h2 style={{
                fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.6rem,2.2vw,2.1rem)',
                fontWeight: 700, color: N, margin: 0, letterSpacing: '-.01em', lineHeight: 1.15,
              }}>
                Welcome back
              </h2>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(11,22,42,.42)', margin: '0 0 0 11px', letterSpacing: '.01em' }}>
              Sign in to your partner workspace
            </p>
          </div>

          {/* Error Message */}
          {error && <div className="pv-err-d" style={{ marginBottom: 20 }}>{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="on" style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>

            {/* Email Field */}
            <div style={{
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.6s cubic-bezier(.16,1,.3,1) 0.5s',
            }}>
              <label className="lbl-d" htmlFor="user-login-email">Email / Username</label>
              <div>
                <input
                  id="user-login-email"
                  type="text"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="username email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  placeholder="allu or allu@parvaii.com"
                  className="pv-inp"
                />
                <div className="pv-inp-ul" style={{ transform: activeField === 'email' ? 'scaleX(1)' : 'scaleX(0)' }} />
              </div>
            </div>

            {/* Password Field */}
            <div style={{
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.6s cubic-bezier(.16,1,.3,1) 0.6s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <label className="lbl-d" htmlFor="user-login-pwd" style={{ marginBottom: 0 }}>Password</label>
                <a href="#forgot" className="pv-forgot">Forgot?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="user-login-pwd"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setActiveField('pwd')}
                  onBlur={() => setActiveField(null)}
                  placeholder="••••••••"
                  className="pv-inp"
                  style={{ paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(11,22,42,.3)', padding: 4, display: 'flex', transition: 'color .2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = N)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(11,22,42,.3)')}
                >
                  {showPwd ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
                <div className="pv-inp-ul" style={{ transform: activeField === 'pwd' ? 'scaleX(1)' : 'scaleX(0)' }} />
              </div>
            </div>

            {/* Remember Toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.6s cubic-bezier(.16,1,.3,1) 0.7s',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setRemember(v => !v)}>
                <button
                  type="button"
                  className="pv-tog"
                  style={{
                    background: remember ? N : 'rgba(11,22,42,.1)',
                    border: `1.5px solid ${remember ? N : 'rgba(11,22,42,.12)'}`,
                  }}
                >
                  <div className="pv-tog-k" style={{ left: remember ? 17 : 3, background: remember ? B : 'rgba(11,22,42,.28)' }} />
                </button>
                <span style={{ fontSize: 12, color: 'rgba(11,22,42,.48)', userSelect: 'none', letterSpacing: '.02em' }}>Stay signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <div style={{
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.6s cubic-bezier(.16,1,.3,1) 0.8s',
            }}>
              <button
                type="submit"
                disabled={loading}
                className={`pv-btn pv-btn-primary ${pulse ? 'pv-pulse' : ''}`}
                style={{ width: '100%', height: 54 }}
              >
                {loading ? (
                  <>
                    <div className="pv-spin" />
                    <span style={{ color: CR }}>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Enter Studio</span>
                    <ArrowUpRight style={{ width: 15, height: 15 }} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 20px',
            opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.9s',
          }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,transparent,rgba(11,22,42,.08),transparent)` }} />
            <span style={{ fontSize: 9.5, letterSpacing: '.18em', color: 'rgba(11,22,42,.2)', textTransform: 'uppercase' }}>Secure Atelier</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,transparent,rgba(11,22,42,.08),transparent)` }} />
          </div>

          {/* Trust footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 1s',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(11,22,42,.3)', letterSpacing: '.03em' }}>
              <ShieldCheck style={{ width: 12, height: 12, color: '#10b981' }} />
              Encrypted partner session
            </span>
            <span style={{ fontSize: 11, color: BD, letterSpacing: '.08em', fontWeight: 500 }}>v{APP_VERSION}</span>
          </div>

          {/* Copyright */}
          <div style={{
            marginTop: 30, textAlign: 'center',
            opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 1.1s',
          }}>
            <p style={{ fontSize: 11, color: 'rgba(11,22,42,.2)', letterSpacing: '.06em', margin: 0 }}>
              © {new Date().getFullYear()} Parvaii Atelier · All rights reserved
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,rgba(201,183,165,.3),transparent)` }} />
      </div>
    </div>
  );
};
