"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Eye, EyeOff, Github, Mail } from "lucide-react";

/* ─────────────────────────────────────────
   ANIMATION STYLES
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes floatA {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-30px) scale(1.08); }
    66%      { transform: translate(-20px,20px) scale(0.95); }
  }
  @keyframes floatB {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(-50px,30px) scale(1.1); }
    66%      { transform: translate(30px,-20px) scale(0.92); }
  }
  @keyframes floatC {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(15px,35px) scale(1.06); }
  }
  @keyframes gradientShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes cardEnter {
    from { opacity:0; transform: translateY(36px) scale(0.97); filter: blur(4px); }
    to   { opacity:1; transform: translateY(0)    scale(1);    filter: blur(0); }
  }
  @keyframes headerEnter {
    from { opacity:0; transform: translateY(-20px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes particle-rise {
    0%   { transform: translateY(0) scale(1);   opacity:.6; }
    100% { transform: translateY(-110px) scale(0); opacity:0; }
  }
  @keyframes pulse-glow {
    0%,100% { box-shadow: 0 0 24px rgba(99,102,241,.35); }
    50%      { box-shadow: 0 0 48px rgba(99,102,241,.6); }
  }
  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
  }
  @keyframes field-in {
    from { opacity:0; transform: translateX(-14px); }
    to   { opacity:1; transform: translateX(0); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
  @keyframes error-in {
    from { opacity:0; transform: translateY(-4px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes border-flow {
    0%,100% { border-color: rgba(99,102,241,.45); }
    50%      { border-color: rgba(34,211,238,.45); }
  }
  @keyframes grid-drift {
    from { transform: translate(0,0); }
    to   { transform: translate(48px,48px); }
  }

  /* ── Blobs ── */
  .lp-blob-a { animation: floatA 12s ease-in-out infinite; }
  .lp-blob-b { animation: floatB 15s ease-in-out infinite; }
  .lp-blob-c { animation: floatC 9s  ease-in-out infinite; }

  /* ── Gradient text ── */
  .lp-gradient-text {
    background: linear-gradient(270deg,#6366f1,#22d3ee,#a855f7,#6366f1);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 5s ease infinite;
  }

  /* ── Card entrance ── */
  .lp-card-enter { animation: cardEnter .75s cubic-bezier(.22,1,.36,1) both; }
  .lp-header-enter { animation: headerEnter .6s cubic-bezier(.22,1,.36,1) both; }

  /* ── Form fields ── */
  .lp-field-1 { animation: field-in .55s .55s cubic-bezier(.22,1,.36,1) both; }
  .lp-field-2 { animation: field-in .55s .68s cubic-bezier(.22,1,.36,1) both; }
  .lp-field-3 { animation: field-in .55s .80s cubic-bezier(.22,1,.36,1) both; }
  .lp-field-4 { animation: field-in .55s .92s cubic-bezier(.22,1,.36,1) both; }
  .lp-field-5 { animation: field-in .55s 1.04s cubic-bezier(.22,1,.36,1) both; }
  .lp-field-6 { animation: field-in .55s 1.16s cubic-bezier(.22,1,.36,1) both; }

  /* ── Input focus glow ── */
  .lp-input-wrap { position: relative; }
  .lp-input-wrap::after {
    content:'';
    position:absolute;
    inset:0;
    border-radius:8px;
    pointer-events:none;
    box-shadow: 0 0 0 0 rgba(99,102,241,0);
    transition: box-shadow .3s ease;
  }
  .lp-input-wrap:focus-within::after {
    box-shadow: 0 0 0 3px rgba(99,102,241,.2), 0 0 12px rgba(99,102,241,.15);
  }

  /* ── Error shake ── */
  .lp-shake { animation: shake .4s ease both; }

  /* ── Error message ── */
  .lp-error { animation: error-in .25s ease both; }

  /* ── Submit button shimmer ── */
  .lp-btn-submit {
    position: relative;
    overflow: hidden;
    transition: transform .2s, box-shadow .3s;
    animation: pulse-glow 3s ease infinite;
  }
  .lp-btn-submit::after {
    content:'';
    position:absolute;
    top:0; left:0;
    width:40%;
    height:100%;
    background: linear-gradient(120deg,rgba(255,255,255,0),rgba(255,255,255,.22),rgba(255,255,255,0));
    transform: translateX(-100%);
    transition: transform .6s ease;
  }
  .lp-btn-submit:not(:disabled):hover { transform: translateY(-2px); }
  .lp-btn-submit:not(:disabled):hover::after { transform: translateX(250%); }
  .lp-btn-submit:active { transform: scale(.98); }

  /* ── Social buttons ── */
  .lp-social-btn {
    position: relative;
    overflow: hidden;
    transition: transform .2s, background .25s, border-color .25s;
  }
  .lp-social-btn:hover { transform: translateY(-2px); border-color: rgba(99,102,241,.5) !important; background: rgba(99,102,241,.08) !important; }

  /* ── Particles ── */
  .lp-particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    animation: particle-rise var(--dur,3s) ease-out var(--delay,0s) infinite;
  }

  /* ── Spinning rings ── */
  .lp-ring-cw  { animation: spin-slow 16s linear infinite; }
  .lp-ring-ccw { animation: spin-slow 11s linear infinite reverse; }

  /* ── Animated grid ── */
  .lp-grid-bg {
    animation: grid-drift 8s linear infinite;
  }

  /* ── Floating card dots ── */
  .lp-dot-1 { animation: floatA 6s ease-in-out infinite; }
  .lp-dot-2 { animation: floatB 8s ease-in-out infinite; }
`;

/* ─────────────────────────────────────────
   PARTICLES
───────────────────────────────────────── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${50 + Math.random() * 50}%`,
  size: `${3 + Math.random() * 3.5}px`,
  dur: `${2.8 + Math.random() * 2.5}s`,
  delay: `${Math.random() * 4}s`,
  color: i % 2 === 0 ? 'rgba(99,102,241,0.55)' : 'rgba(34,211,238,0.45)',
}));

/* ─────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────── */
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePass, setShakePass]   = useState(false);

  /* ── Original validation (unchanged) ── */
  const validation = () => {
    const newError = { email: "", password: "" };
    let isValidate = true;
    if (!email) { newError.email = "Email is Required"; isValidate = false; }
    if (!password) { newError.password = "Password is Required"; isValidate = false; }
    setError(newError);
    return isValidate;
  };

  /* ── Original handleSubmit + shake on error ── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation()) {
      if (!email)    { setShakeEmail(true); setTimeout(() => setShakeEmail(false), 400); }
      if (!password) { setShakePass(true);  setTimeout(() => setShakePass(false),  400); }
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Login functionality coming soon!");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center px-4">
      <style>{STYLES}</style>

      {/* ── Animated grid background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="lp-grid-bg absolute -inset-12" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.06) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
      </div>

      {/* ── Blobs ── */}
      <div className="lp-blob-a absolute top-1/4 -left-16 w-80 h-80 rounded-full bg-indigo-500/20 filter blur-[72px] opacity-40 pointer-events-none" />
      <div className="lp-blob-b absolute bottom-1/4 -right-16 w-80 h-80 rounded-full bg-cyan-400/15 filter blur-[72px] opacity-35 pointer-events-none" />
      <div className="lp-blob-c absolute top-3/4 left-1/3 w-56 h-56 rounded-full bg-purple-500/15 filter blur-[56px] opacity-30 pointer-events-none" />

      {/* ── Particles ── */}
      {PARTICLES.map(p => (
        <span key={p.id} className="lp-particle" style={{
          left: p.left, top: p.top,
          width: p.size, height: p.size,
          background: p.color,
          ['--dur' as string]: p.dur,
          ['--delay' as string]: p.delay,
        }} />
      ))}

      {/* ── Decorative spinning rings (corners) ── */}
      <div className="lp-ring-cw  absolute top-10 right-10 w-32 h-32 rounded-full pointer-events-none opacity-10"
        style={{ border: '1.5px solid rgba(99,102,241,.7)', borderTopColor: 'transparent' }} />
      <div className="lp-ring-ccw absolute top-10 right-10 w-20 h-20 rounded-full pointer-events-none opacity-10"
        style={{ border: '1px dashed rgba(34,211,238,.6)' }} />
      <div className="lp-ring-cw  absolute bottom-10 left-10 w-24 h-24 rounded-full pointer-events-none opacity-10"
        style={{ border: '1.5px solid rgba(168,85,247,.6)', borderBottomColor: 'transparent' }} />

      {/* ── Floating dots (background depth) ── */}
      <div className="lp-dot-1 absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-indigo-400/40 pointer-events-none" />
      <div className="lp-dot-2 absolute bottom-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-cyan-400/40 pointer-events-none" />

      {/* ── Main content ── */}
      <div className="w-full max-w-md relative z-10">

        {/* Logo + heading */}
        <div className="lp-header-enter flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <div className="absolute inset-0 rounded-xl bg-indigo-500/30 blur-md group-hover:blur-lg transition-all" />
              <Image src="/cn-sm-logo.svg" alt="Code Navigator Logo" fill className="object-cover rounded-lg relative z-10" />
            </div>
            <span className="text-xl font-bold lp-gradient-text" style={{ fontFamily: "'Syne', sans-serif" }}>
              CodeNavigator
            </span>
          </Link>

          <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-center text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Sign in to continue visualizing your code
          </p>
        </div>

        {/* ── Login Card ── */}
        <div className="lp-card-enter">
          <Card className="border backdrop-blur-md p-8 shadow-2xl shadow-black/50 relative overflow-hidden"
            style={{ borderColor: 'rgba(99,102,241,.25)', background: 'rgba(var(--card),0.85)' }}>

            {/* Card inner glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)' }} />
            {/* Card corner accent */}
            <div className="absolute top-3 right-3 w-10 h-10 rounded-full pointer-events-none opacity-15 lp-ring-cw"
              style={{ border: '1px solid rgba(99,102,241,.8)' }} />

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className={`lp-field-1 ${shakeEmail ? 'lp-shake' : ''}`}>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="lp-input-wrap">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error.email) setError(v => ({ ...v, email: '' })); }}
                    className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground transition-colors duration-200"
                  />
                </div>
                {error.email && (
                  <p className="lp-error text-xs mt-1.5 flex items-center gap-1" style={{ color: '#f87171' }}>
                    <span>⚠</span> {error.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className={`lp-field-2 ${shakePass ? 'lp-shake' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors duration-200 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="lp-input-wrap relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error.password) setError(v => ({ ...v, password: '' })); }}
                    className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground pr-10 transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error.password && (
                  <p className="lp-error text-xs mt-1.5 flex items-center gap-1" style={{ color: '#f87171' }}>
                    <span>⚠</span> {error.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="lp-field-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="lp-btn-submit w-full text-white font-semibold py-2.5 rounded-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)' }}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : 'Sign In'}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="lp-field-4 relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'rgba(99,102,241,.2)' }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 text-muted-foreground" style={{ background: 'transparent' }}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="lp-field-5 grid grid-cols-2 gap-3">
              <button type="button" className="lp-social-btn flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium border transition-all duration-200"
                style={{ borderColor: 'rgba(99,102,241,.25)', background: 'rgba(99,102,241,.05)' }}>
                <Github size={16} />
                GitHub
              </button>
              <button type="button" className="lp-social-btn flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium border transition-all duration-200"
                style={{ borderColor: 'rgba(99,102,241,.25)', background: 'rgba(99,102,241,.05)' }}>
                <Mail size={16} />
                Google
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="lp-field-6 text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/user/signup" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline">
                Sign up here
              </Link>
            </p>

            {/* Card bottom glow line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,.35),transparent)' }} />
          </Card>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/user/home"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group inline-flex items-center gap-1">
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}