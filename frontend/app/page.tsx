'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Footer from '@/layout/Footer'
import LandingHeader from '@/layout/LandingHeader'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Eye, GitBranch, Zap, Brain, Database, Lightbulb } from 'lucide-react'

/* ─────────────────────────────────────────
   ANIMATION STYLES (injected once)
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --anim-primary: #6366f1;
    --anim-accent:  #22d3ee;
    --anim-glow:    rgba(99,102,241,0.35);
  }

  /* ── Keyframes ── */
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
    50%      { transform: translate(20px,40px) scale(1.06); }
  }
  @keyframes gradientShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes textReveal {
    from { opacity:0; transform: translateY(28px); filter: blur(4px); }
    to   { opacity:1; transform: translateY(0);    filter: blur(0); }
  }
  @keyframes fadeSlideUp {
    from { opacity:0; transform: translateY(40px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes fadeSlideLeft {
    from { opacity:0; transform: translateX(-30px); }
    to   { opacity:1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity:0; transform: scale(0.85); }
    to   { opacity:1; transform: scale(1); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);    opacity:.6; }
    100% { transform: scale(1.6);  opacity:0; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes cursor-blink {
    0%,100% { opacity:1; }
    50%      { opacity:0; }
  }
  @keyframes particle-rise {
    0%   { transform: translateY(0) scale(1);   opacity:.7; }
    100% { transform: translateY(-120px) scale(0); opacity:0; }
  }
  @keyframes card-glow-enter {
    from { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
    to   { box-shadow: 0 0 32px 4px rgba(99,102,241,0.25); }
  }
  @keyframes border-spin {
    from { --angle: 0deg; }
    to   { --angle: 360deg; }
  }
  @keyframes counter-up {
    from { transform: translateY(20px); opacity:0; }
    to   { transform: translateY(0);    opacity:1; }
  }

  /* ── Blobs ── */
  .lp-blob-a { animation: floatA 12s ease-in-out infinite; }
  .lp-blob-b { animation: floatB 15s ease-in-out infinite; }
  .lp-blob-c { animation: floatC 10s ease-in-out infinite; }

  /* ── Animated gradient text ── */
  .lp-gradient-text {
    background: linear-gradient(270deg, #6366f1, #22d3ee, #a855f7, #6366f1);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 5s ease infinite;
  }

  /* ── Reveal helpers (JS toggles .revealed) ── */
  .lp-reveal       { opacity:0; }
  .lp-reveal.revealed { animation: fadeSlideUp   0.7s cubic-bezier(.22,1,.36,1) forwards; }
  .lp-reveal-left  { opacity:0; }
  .lp-reveal-left.revealed { animation: fadeSlideLeft 0.7s cubic-bezier(.22,1,.36,1) forwards; }
  .lp-scale-in     { opacity:0; }
  .lp-scale-in.revealed { animation: scaleIn      0.6s cubic-bezier(.22,1,.36,1) forwards; }

  /* ── Ticker ── */
  .lp-ticker-track {
    display:flex;
    width: max-content;
    animation: ticker 22s linear infinite;
  }

  /* ── Feature card hover ── */
  .lp-feature-card {
    transition: transform .3s ease, box-shadow .3s ease;
    position: relative;
    overflow: hidden;
  }
  .lp-feature-card::before {
    content:'';
    position:absolute;
    inset:0;
    background: radial-gradient(circle at 50% 0%, rgba(99,102,241,.12), transparent 70%);
    opacity:0;
    transition: opacity .35s ease;
  }
  .lp-feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(99,102,241,0.18); }
  .lp-feature-card:hover::before { opacity:1; }

  /* ── Icon ring ── */
  .lp-icon-wrap {
    position:relative;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    width:52px; height:52px;
    border-radius:14px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.25);
    transition: background .3s, transform .3s;
  }
  .lp-feature-card:hover .lp-icon-wrap {
    background: rgba(99,102,241,0.22);
    transform: rotate(-6deg) scale(1.1);
  }
  .lp-icon-ring {
    position:absolute;
    inset:-6px;
    border-radius:20px;
    border: 1.5px solid rgba(99,102,241,0.35);
    opacity:0;
    transition: opacity .3s;
  }
  .lp-feature-card:hover .lp-icon-ring { opacity:1; animation: pulse-ring .9s ease-out infinite; }

  /* ── CTA glow button ── */
  .lp-btn-glow {
    position:relative;
    overflow:hidden;
    transition: transform .2s;
  }
  .lp-btn-glow::after {
    content:'';
    position:absolute;
    inset:0;
    background: linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 70%);
    transform: translateX(-100%);
    transition: transform .55s ease;
  }
  .lp-btn-glow:hover { transform: scale(1.04); }
  .lp-btn-glow:hover::after { transform: translateX(100%); }

  /* ── Cursor blink ── */
  .lp-cursor {
    display:inline-block;
    width:3px; height:1em;
    background: currentColor;
    vertical-align: text-bottom;
    animation: cursor-blink .75s step-end infinite;
  }

  /* ── Particle dots ── */
  .lp-particle {
    position:absolute;
    border-radius:50%;
    pointer-events:none;
    animation: particle-rise var(--dur,3s) ease-out var(--delay,0s) infinite;
  }

  /* ── Stats counter ── */
  .lp-stat {
    animation: counter-up .6s ease both;
  }

  /* ── Spinning ring decoration ── */
  .lp-spin-ring {
    animation: spin-slow 18s linear infinite;
  }

  /* ── CTA section shimmer background ── */
  .lp-cta-bg {
    background: linear-gradient(135deg, rgba(99,102,241,.15), rgba(34,211,238,.08), rgba(168,85,247,.12));
    background-size: 300% 300%;
    animation: gradientShift 8s ease infinite;
  }
`;

/* ─────────────────────────────────────────
   TYPEWRITER HOOK
───────────────────────────────────────── */
function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, speed);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx(c => c - 1);
      }, speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useScrollReveal(selector: string, staggerMs = 100) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = el.dataset.delay ?? '0';
          setTimeout(() => el.classList.add('revealed'), parseInt(delay));
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [selector, staggerMs]);
}

/* ─────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let start = 0;
      const step = Math.ceil(target / 50);
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        setVal(start);
        if (start >= target) clearInterval(timer);
      }, 30);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────
   PARTICLES
───────────────────────────────────────── */
function Particles({ count = 18 }: { count?: number }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${60 + Math.random() * 40}%`,
      size: `${3 + Math.random() * 4}px`,
      dur: `${2.5 + Math.random() * 3}s`,
      delay: `${Math.random() * 4}s`,
      color: Math.random() > 0.5 ? 'rgba(99,102,241,0.6)' : 'rgba(34,211,238,0.5)',
    }))
  );
  return (
    <>
      {particles.current.map(p => (
        <span
          key={p.id}
          className="lp-particle"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: p.color,
            ['--dur' as string]: p.dur,
            ['--delay' as string]: p.delay,
          }}
        />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const features = [
  { icon: <Eye className="w-5 h-5" />, title: 'Visual Code Explanation', description: 'See what your code does with interactive visual representations and highlighted execution paths.' },
  { icon: <GitBranch className="w-5 h-5" />, title: 'Code Flowchart Generator', description: 'Automatically generate flowcharts that visualize the logic and control flow of your code.' },
  { icon: <Zap className="w-5 h-5" />, title: 'Step-by-Step Execution', description: 'Watch your code execute line-by-line with variable values, memory state, and program flow visualization.' },
  { icon: <Brain className="w-5 h-5" />, title: 'AI Code Explanations', description: 'Get detailed AI-powered explanations and intelligent suggestions for improvements and best practices.' },
  { icon: <Database className="w-5 h-5" />, title: 'Data Structure Visualizer', description: 'Visualize arrays, linked lists, trees, graphs, and complex data structures as they change in real-time.' },
  { icon: <Lightbulb className="w-5 h-5" />, title: 'Smart Suggestions', description: 'Get AI-powered recommendations for optimization, refactoring, and best practices in your code.' },
];

const TICKER_ITEMS = ['Visual Flowcharts', 'AI Explanations', 'Step-by-Step Execution', 'Data Structures', 'Smart Suggestions', 'Code Insights'];
const TYPEWRITER_WORDS = ['Visual Insights', 'AI Explanations', 'Live Flowcharts', 'Deep Understanding'];

const STATS = [
  { value: 50000, suffix: '+', label: 'Developers' },
  { value: 98,    suffix: '%', label: 'Satisfaction' },
  { value: 120,   suffix: 'ms', label: 'Avg. Analysis' },
  { value: 12,    suffix: 'x', label: 'Faster Learning' },
];

export default function LandingPage() {
  const typewriter = useTypewriter(TYPEWRITER_WORDS, 75, 2200);
  useScrollReveal('.lp-reveal');
  useScrollReveal('.lp-reveal-left');
  useScrollReveal('.lp-scale-in');

  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <style>{STYLES}</style>

      <LandingHeader />

      {/* ── HERO ─────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-36 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">

        {/* Animated blobs */}
        <div className="lp-blob-a absolute top-1/4 -left-20 w-[520px] h-[520px] rounded-full bg-indigo-500/20 filter blur-[80px] opacity-40 pointer-events-none" />
        <div className="lp-blob-b absolute bottom-1/4 -right-20 w-[520px] h-[520px] rounded-full bg-cyan-400/15 filter blur-[80px] opacity-35 pointer-events-none" />
        <div className="lp-blob-c absolute top-3/4 left-1/2 w-[300px] h-[300px] rounded-full bg-purple-500/15 filter blur-[60px] opacity-30 pointer-events-none" />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px)',
          backgroundSize: '48px 48px'
        }} />

        <Particles />

        {/* Spinning decorative ring */}
        <div className="lp-spin-ring absolute right-[-80px] top-1/4 w-64 h-64 opacity-10 pointer-events-none" style={{
          border: '1.5px solid rgba(99,102,241,.6)',
          borderRadius: '50%',
          borderTopColor: 'transparent',
        }} />
        <div className="absolute right-[-48px] top-[calc(25%+24px)] w-40 h-40 opacity-10 pointer-events-none" style={{
          border: '1px dashed rgba(34,211,238,.5)',
          borderRadius: '50%',
          animation: 'spin-slow 12s linear infinite reverse',
        }} />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <div className="lp-reveal inline-block mb-8" data-delay="0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.3)' }}>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              🚀 For Developers & Learners
            </span>
          </div>

          {/* Headline */}
          <h1 className="lp-reveal text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
            data-delay="100"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Paste Code, Get
            <span className="block lp-gradient-text mt-1">
              {typewriter}<span className="lp-cursor" />
            </span>
          </h1>

          <p className="lp-reveal text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            data-delay="200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Understand any code through visual flowcharts, step-by-step execution flows, AI explanations, and interactive data structure visualizations. Perfect for learning, debugging, and teaching.
          </p>

          {/* CTA buttons */}
          <div className="lp-reveal flex flex-col sm:flex-row gap-4 justify-center mb-16" data-delay="300">
            <button className="lp-btn-glow inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base"
              style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 0 32px rgba(99,102,241,.45)' }}>
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button className="lp-btn-glow inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base"
              style={{ border: '1px solid rgba(99,102,241,.4)', backdropFilter: 'blur(8px)' }}>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          {/* <div className="lp-reveal grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto" data-delay="400">
            {STATS.map((s, i) => (
              <div key={i} className="lp-stat text-center p-4 rounded-2xl"
                style={{ background: 'rgba(99,102,241,.07)', border: '1px solid rgba(99,102,241,.15)', animationDelay: `${i * 80}ms` }}>
                <div className="text-3xl font-extrabold lp-gradient-text" style={{ fontFamily: "'Syne', sans-serif" }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── TICKER ───────────────────────────── */}
      <div className="py-4 overflow-hidden border-y" style={{ borderColor: 'rgba(99,102,241,.2)', background: 'rgba(99,102,241,.04)' }}>
        <div className="lp-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-4 px-6 text-sm font-medium text-muted-foreground whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────── */}
      <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="lp-blob-a absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-500/10 filter blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="lp-reveal text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3" data-delay="0">Features</p>
            <h2 className="lp-reveal text-4xl md:text-5xl font-extrabold mb-4" data-delay="100"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              Understand Code Like Never Before
            </h2>
            <p className="lp-reveal text-lg text-muted-foreground max-w-2xl mx-auto" data-delay="200">
              From visual flowcharts to AI-powered explanations, explore every aspect of your code with powerful visualization tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="lp-reveal lp-feature-card rounded-2xl p-6 cursor-default"
                data-delay={`${i * 80}`}
                style={{ background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.18)' }}>
                <div className="mb-5">
                  <div className="lp-icon-wrap text-indigo-400">
                    <span className="lp-icon-ring" />
                    {feat.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(99,102,241,.04)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="lp-reveal text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3" data-delay="0">How It Works</p>
          <h2 className="lp-reveal text-4xl md:text-5xl font-extrabold mb-16" data-delay="100"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Three Steps to Clarity
          </h2>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px"
              style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0), rgba(99,102,241,.4), rgba(99,102,241,0))' }} />

            {[
              { step: '01', title: 'Paste Your Code', desc: 'Drop any snippet — Python, JS, Rust, Go — into the editor.' },
              { step: '02', title: 'Instant Analysis', desc: 'AI parses, visualizes, and maps every execution path in milliseconds.' },
              { step: '03', title: 'Visual Insight', desc: 'Explore interactive charts, step-by-step flows, and smart suggestions.' },
            ].map((item, i) => (
              <div key={i} className="lp-scale-in flex flex-col items-center text-center" data-delay={`${i * 150}`}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-5 relative"
                  style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.25),rgba(34,211,238,.1))', border: '1px solid rgba(99,102,241,.3)', fontFamily: "'Syne', sans-serif" }}>
                  <span className="lp-gradient-text">{item.step}</span>
                  <span className="absolute -inset-2 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{ border: '1px solid rgba(99,102,241,.25)', animation: 'pulse-ring 1.4s ease-out infinite' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ───────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="lp-reveal text-sm text-muted-foreground mb-8" data-delay="0">Trusted by developers at</p>
          <div className="flex flex-wrap justify-center gap-10 items-center">
            {['GitHub', 'GitLab', 'Vercel', 'Stripe', 'Linear'].map((brand, i) => (
              <span key={i}
                className="lp-reveal font-bold text-lg transition-all duration-300 hover:text-indigo-400 cursor-default"
                data-delay={`${i * 60}`}
                style={{ opacity: 0.45 }}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      {/* <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="lp-blob-b absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-indigo-500/15 filter blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto">
          <div className="lp-scale-in lp-cta-bg border rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
            style={{ borderColor: 'rgba(99,102,241,.3)' }}>
          
            <div className="absolute top-4 right-4 w-20 h-20 opacity-20" style={{
              border: '1px solid rgba(99,102,241,.6)', borderRadius: '50%',
              animation: 'spin-slow 10s linear infinite'
            }} />
            <div className="absolute bottom-4 left-4 w-12 h-12 opacity-20" style={{
              border: '1px dashed rgba(34,211,238,.6)', borderRadius: '50%',
              animation: 'spin-slow 7s linear infinite reverse'
            }} />

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
              Ready to Master Your Codebase?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of developers who are already visualizing and understanding their code faster and smarter with Code Navigator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="lp-btn-glow inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-white font-semibold text-base"
                style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 0 40px rgba(99,102,241,.5)' }}>
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </button>
              <button className="lp-btn-glow inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold text-base"
                style={{ border: '1px solid rgba(99,102,241,.4)', backdropFilter: 'blur(8px)' }}>
                Talk to Sales
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">No credit card required · 7-day free trial</p>
          </div>
        </div>
      </section> */}

      <Footer />
    </main>
  );
}