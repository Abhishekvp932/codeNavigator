"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Eye, EyeOff, Github, Mail, User, AtSign, Lock, ShieldCheck } from "lucide-react";
import { Signup } from "@/service/auth";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/utils/handleApiError";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
  @keyframes spin-slow  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
  @keyframes particle-rise {
    0%   { transform: translateY(0) scale(1);      opacity:.6; }
    100% { transform: translateY(-110px) scale(0); opacity:0;  }
  }
  @keyframes pulse-glow {
    0%,100% { box-shadow: 0 0 24px rgba(99,102,241,.35); }
    50%      { box-shadow: 0 0 48px rgba(99,102,241,.6);  }
  }
  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%);  }
  }
  @keyframes field-in {
    from { opacity:0; transform: translateX(-14px); }
    to   { opacity:1; transform: translateX(0); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px);  }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px);  }
  }
  @keyframes error-in {
    from { opacity:0; transform: translateY(-4px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes grid-drift {
    from { transform: translate(0,0); }
    to   { transform: translate(48px,48px); }
  }
  @keyframes strength-fill {
    from { width: 0; }
    to   { width: var(--target-width); }
  }
  @keyframes badge-pop {
    0%   { transform: scale(0.7); opacity:0; }
    60%  { transform: scale(1.1); }
    100% { transform: scale(1);   opacity:1; }
  }

  /* ── Blobs ── */
  .sg-blob-a { animation: floatA 12s ease-in-out infinite; }
  .sg-blob-b { animation: floatB 15s ease-in-out infinite; }
  .sg-blob-c { animation: floatC 9s  ease-in-out infinite; }

  /* ── Gradient text ── */
  .sg-gradient-text {
    background: linear-gradient(270deg,#6366f1,#22d3ee,#a855f7,#6366f1);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 5s ease infinite;
  }

  /* ── Entrances ── */
  .sg-card-enter   { animation: cardEnter   .75s cubic-bezier(.22,1,.36,1) both; }
  .sg-header-enter { animation: headerEnter .6s  cubic-bezier(.22,1,.36,1) both; }

  /* ── Staggered fields ── */
  .sg-f1 { animation: field-in .55s .50s cubic-bezier(.22,1,.36,1) both; }
  .sg-f2 { animation: field-in .55s .62s cubic-bezier(.22,1,.36,1) both; }
  .sg-f3 { animation: field-in .55s .74s cubic-bezier(.22,1,.36,1) both; }
  .sg-f4 { animation: field-in .55s .86s cubic-bezier(.22,1,.36,1) both; }
  .sg-f5 { animation: field-in .55s .98s cubic-bezier(.22,1,.36,1) both; }
  .sg-f6 { animation: field-in .55s 1.10s cubic-bezier(.22,1,.36,1) both; }
  .sg-f7 { animation: field-in .55s 1.22s cubic-bezier(.22,1,.36,1) both; }
  .sg-f8 { animation: field-in .55s 1.34s cubic-bezier(.22,1,.36,1) both; }

  /* ── Input glow on focus ── */
  .sg-input-wrap { position: relative; }
  .sg-input-wrap::after {
    content:''; position:absolute; inset:0; border-radius:8px; pointer-events:none;
    box-shadow: 0 0 0 0 rgba(99,102,241,0); transition: box-shadow .3s ease;
  }
  .sg-input-wrap:focus-within::after {
    box-shadow: 0 0 0 3px rgba(99,102,241,.2), 0 0 12px rgba(99,102,241,.15);
  }

  /* ── Input icon ── */
  .sg-input-icon {
    position:absolute; left:10px; top:50%; transform:translateY(-50%);
    color: rgba(99,102,241,.5); pointer-events:none; transition: color .2s;
  }
  .sg-input-wrap:focus-within .sg-input-icon { color: rgba(99,102,241,.9); }

  /* ── Shake on error ── */
  .sg-shake { animation: shake .4s ease both; }

  /* ── Error messages ── */
  .sg-error { animation: error-in .25s ease both; }

  /* ── Submit button ── */
  .sg-btn-submit {
    position:relative; overflow:hidden;
    transition: transform .2s, box-shadow .3s;
    animation: pulse-glow 3s ease infinite;
  }
  .sg-btn-submit::after {
    content:''; position:absolute; top:0; left:0; width:40%; height:100%;
    background: linear-gradient(120deg,rgba(255,255,255,0),rgba(255,255,255,.22),rgba(255,255,255,0));
    transform: translateX(-100%); transition: transform .6s ease;
  }
  .sg-btn-submit:not(:disabled):hover { transform: translateY(-2px); }
  .sg-btn-submit:not(:disabled):hover::after { transform: translateX(250%); }
  .sg-btn-submit:active { transform: scale(.98); }

  /* ── Social buttons ── */
  .sg-social-btn {
    position:relative; overflow:hidden;
    transition: transform .2s, background .25s, border-color .25s;
  }
  .sg-social-btn:hover {
    transform: translateY(-2px);
    border-color: rgba(99,102,241,.5) !important;
    background: rgba(99,102,241,.08) !important;
  }

  /* ── Particles ── */
  .sg-particle {
    position:absolute; border-radius:50%; pointer-events:none;
    animation: particle-rise var(--dur,3s) ease-out var(--delay,0s) infinite;
  }

  /* ── Rings ── */
  .sg-ring-cw  { animation: spin-slow 16s linear infinite; }
  .sg-ring-ccw { animation: spin-slow 11s linear infinite reverse; }

  /* ── Drifting grid ── */
  .sg-grid-bg { animation: grid-drift 8s linear infinite; }

  /* ── Floating depth dots ── */
  .sg-dot-1 { animation: floatA 6s ease-in-out infinite; }
  .sg-dot-2 { animation: floatB 8s ease-in-out infinite; }

  /* ── Password strength bar ── */
  .sg-strength-bar {
    height:3px; border-radius:99px; transition: background .4s;
    animation: strength-fill .5s ease both;
  }

  /* ── Strength badge ── */
  .sg-strength-badge { animation: badge-pop .35s cubic-bezier(.22,1,.36,1) both; }

  /* ── Match indicator ── */
  .sg-match-dot {
    width:7px; height:7px; border-radius:50%;
    transition: background .3s, transform .3s;
  }
`;

/* ─────────────────────────────────────────
   PARTICLES (stable, no re-render jitter)
───────────────────────────────────────── */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left:  `${(i * 6.5 + 3) % 100}%`,
  top:   `${50 + (i * 3.1) % 48}%`,
  size:  `${3 + (i % 4) * 0.9}px`,
  dur:   `${2.8 + (i % 5) * 0.5}s`,
  delay: `${(i * 0.27) % 4}s`,
  color: i % 2 === 0 ? 'rgba(99,102,241,0.55)' : 'rgba(34,211,238,0.45)',
}));

/* ─────────────────────────────────────────
   PASSWORD STRENGTH HELPER
───────────────────────────────────────── */
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw)           return { score: 0, label: '',        color: 'transparent' };
  let s = 0;
  if (pw.length >= 8)           s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw))  s++;
  const map = [
    { label: 'Weak',   color: '#f87171' },
    { label: 'Fair',   color: '#fb923c' },
    { label: 'Good',   color: '#facc15' },
    { label: 'Strong', color: '#34d399' },
  ];
  return { score: s, ...map[s - 1] ?? map[0] };
}

/* ─────────────────────────────────────────
   SIGNUP PAGE
───────────────────────────────────────── */
export default function SignupPage() {
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError]       = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [shakeFields, setShakeFields] = useState<Record<string,boolean>>({});
  const router = useRouter()


    const user = useSelector((state:RootState)=> state.user.user);

    useEffect(()=>{
    if(user){
      router.push('/user/home');
    }
  },[router,user]);
  /* ── Original validation (unchanged) ── */
  const validation = () => {
    const newError = { fullName: "", email: "", password: "", confirmPassword: "" };
    let isValidate = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName)                               { newError.fullName = "Name is Required";       isValidate = false; }
    if (!formData.email)                                  { newError.email    = "Email is Required";      isValidate = false; }
    else if (!emailRegex.test(formData.email))            { newError.email    = "Enter Valid Email id";   isValidate = false; }
    if (!formData.password)                               { newError.password = "Password is Required";   isValidate = false; }
    if (formData.password !== formData.confirmPassword)   { newError.confirmPassword = "Password Must Be Same"; isValidate = false; }

    setError(newError);
    return isValidate;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error[name as keyof typeof error]) setError(prev => ({ ...prev, [name]: '' }));
  };

  /* ── Original handleSubmit + shake decoration ── */
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validation()) {
    const fails: Record<string, boolean> = {};

    if (!formData.fullName) fails.fullName = true;
    if (!formData.email) fails.email = true;
    if (!formData.password) fails.password = true;
    if (formData.password !== formData.confirmPassword)
      fails.confirmPassword = true;

    setShakeFields(fails);
    setTimeout(() => setShakeFields({}), 450);
    return;
  }

  setIsLoading(true);

  try {
    const res = await Signup(
      formData.fullName,
      formData.email,
      formData.password
    );

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.push('/user/home');

  } catch (error) {
    // console.log('signup error', error);
   toast.error(handleApiError(error));
  } finally {
    setIsLoading(false);
  }
};

  const strength = getStrength(formData.password);
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center px-4 py-10">
      <style>{STYLES}</style>

      {/* ── Animated grid ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="sg-grid-bg absolute -inset-12" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.06) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
      </div>

      {/* ── Blobs ── */}
      <div className="sg-blob-a absolute top-1/4 -left-16 w-80 h-80 rounded-full bg-indigo-500/20 filter blur-[72px] opacity-40 pointer-events-none" />
      <div className="sg-blob-b absolute bottom-1/4 -right-16 w-80 h-80 rounded-full bg-cyan-400/15 filter blur-[72px] opacity-35 pointer-events-none" />
      <div className="sg-blob-c absolute top-2/3 left-1/3 w-56 h-56 rounded-full bg-purple-500/15 filter blur-[56px] opacity-30 pointer-events-none" />

      {/* ── Particles ── */}
      {PARTICLES.map(p => (
        <span key={p.id} className="sg-particle" style={{
          left: p.left, top: p.top, width: p.size, height: p.size, background: p.color,
          ['--dur' as string]: p.dur, ['--delay' as string]: p.delay,
        }} />
      ))}

      {/* ── Decorative rings ── */}
      <div className="sg-ring-cw  absolute top-10 right-10 w-32 h-32 rounded-full pointer-events-none opacity-10"
        style={{ border: '1.5px solid rgba(99,102,241,.7)', borderTopColor: 'transparent' }} />
      <div className="sg-ring-ccw absolute top-10 right-10 w-20 h-20 rounded-full pointer-events-none opacity-10"
        style={{ border: '1px dashed rgba(34,211,238,.6)' }} />
      <div className="sg-ring-cw  absolute bottom-10 left-10 w-24 h-24 rounded-full pointer-events-none opacity-10"
        style={{ border: '1.5px solid rgba(168,85,247,.6)', borderBottomColor: 'transparent' }} />

      {/* ── Depth dots ── */}
      <div className="sg-dot-1 absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-indigo-400/40 pointer-events-none" />
      <div className="sg-dot-2 absolute bottom-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-cyan-400/40 pointer-events-none" />

      {/* ── Main content ── */}
      <div className="w-full max-w-md relative z-10">

        {/* Header */}
        <div className="sg-header-enter flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <div className="absolute inset-0 rounded-xl bg-indigo-500/30 blur-md group-hover:blur-lg transition-all" />
              <Image src="/cn-sm-logo.svg" alt="Code Navigator Logo" fill className="object-cover rounded-lg relative z-10" />
            </div>
            <span className="text-xl font-bold sg-gradient-text" style={{ fontFamily: "'Syne', sans-serif" }}>
              CodeNavigator
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            Create Account
          </h1>
          <p className="text-muted-foreground text-center text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Join developers visualizing code smarter
          </p>
        </div>

        {/* ── Card ── */}
        <div className="sg-card-enter">
          <Card className="border backdrop-blur-md p-8 shadow-2xl shadow-black/50 relative overflow-hidden"
            style={{ borderColor: 'rgba(99,102,241,.25)', background: 'rgba(var(--card),0.85)' }}>

            {/* Card top glow line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)' }} />
            {/* Corner ring */}
            <div className="absolute top-3 right-3 w-10 h-10 rounded-full pointer-events-none opacity-15 sg-ring-cw"
              style={{ border: '1px solid rgba(99,102,241,.8)' }} />

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div className={`sg-f1 ${shakeFields.fullName ? 'sg-shake' : ''}`}>
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <div className="sg-input-wrap">
                  <User size={15} className="sg-input-icon" />
                  <Input id="fullName" name="fullName" type="text" placeholder="John Doe"
                    value={formData.fullName} onChange={handleChange}
                    className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground pl-8" />
                </div>
                {error.fullName && <p className="sg-error text-xs mt-1.5 flex items-center gap-1" style={{ color: '#f87171' }}><span>⚠</span> {error.fullName}</p>}
              </div>

              {/* Email */}
              <div className={`sg-f2 ${shakeFields.email ? 'sg-shake' : ''}`}>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <div className="sg-input-wrap">
                  <AtSign size={15} className="sg-input-icon" />
                  <Input id="email" name="email" type="email" placeholder="you@example.com"
                    value={formData.email} onChange={handleChange}
                    className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground pl-8" />
                </div>
                {error.email && <p className="sg-error text-xs mt-1.5 flex items-center gap-1" style={{ color: '#f87171' }}><span>⚠</span> {error.email}</p>}
              </div>

              {/* Password */}
              <div className={`sg-f3 ${shakeFields.password ? 'sg-shake' : ''}`}>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="sg-input-wrap relative">
                  <Lock size={15} className="sg-input-icon" />
                  <Input id="password" name="password" type={showPassword ? "text" : "password"}
                    placeholder="••••••••" value={formData.password} onChange={handleChange}
                    className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground pr-10 pl-8" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error.password && <p className="sg-error text-xs mt-1.5 flex items-center gap-1" style={{ color: '#f87171' }}><span>⚠</span> {error.password}</p>}

                {/* ── Password strength bar ── */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,.1)' }}>
                          <div className="sg-strength-bar h-full rounded-full"
                            style={{ background: i <= strength.score ? strength.color : 'transparent', ['--target-width' as string]: '100%' }} />
                        </div>
                      ))}
                    </div>
                    {strength.label && (
                      <p key={strength.label} className="sg-strength-badge text-xs font-medium" style={{ color: strength.color }}>
                        {strength.label} password
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`sg-f4 ${shakeFields.confirmPassword ? 'sg-shake' : ''}`}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <div className="sg-input-wrap relative">
                  <ShieldCheck size={15} className="sg-input-icon" />
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange}
                    className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground pr-10 pl-8" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error.confirmPassword && <p className="sg-error text-xs mt-1.5 flex items-center gap-1" style={{ color: '#f87171' }}><span>⚠</span> {error.confirmPassword}</p>}

                {/* ── Match indicator ── */}
                {formData.confirmPassword && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="sg-match-dot" style={{ background: passwordsMatch ? '#34d399' : '#f87171', transform: passwordsMatch ? 'scale(1.2)' : 'scale(1)' }} />
                    <span className="text-xs transition-colors duration-300" style={{ color: passwordsMatch ? '#34d399' : '#f87171' }}>
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="sg-f5 pt-2">
                <button type="submit" disabled={isLoading}
                  className="sg-btn-submit w-full text-white font-semibold py-2.5 rounded-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)' }}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Creating Account…
                    </span>
                  ) : 'Create Account'}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="sg-f6 relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'rgba(99,102,241,.2)' }} />
              </div>
              {/* <div className="relative flex justify-center text-xs">
                <span className="px-3 text-muted-foreground">Or sign up with</span>
              </div> */}
            </div>

            {/* Social Buttons */}
            {/* <div className="sg-f7 grid grid-cols-2 gap-3">
              <button type="button" className="sg-social-btn flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium border transition-all duration-200"
                style={{ borderColor: 'rgba(99,102,241,.25)', background: 'rgba(99,102,241,.05)' }}>
                <Github size={16} /> GitHub
              </button>
              <button type="button" className="sg-social-btn flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium border transition-all duration-200"
                style={{ borderColor: 'rgba(99,102,241,.25)', background: 'rgba(99,102,241,.05)' }}>
                <Mail size={16} /> Google
              </button>
            </div> */}

            {/* Login link */}
            <p className="sg-f8 text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href="/user/login" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline">
                Sign in here
              </Link>
            </p>

            {/* Card bottom glow line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,.35),transparent)' }} />
          </Card>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group inline-flex items-center gap-1">
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            Back to home
          </Link>
        </div>
      </div>
      <ToastContainer autoClose={250}/>
    </div>
  );
}