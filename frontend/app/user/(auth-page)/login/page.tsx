'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempt:', { email, password });
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-blue-950/20" />

      {/* Floating code particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-accent/10 font-mono text-sm animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              fontSize: `${10 + Math.random() * 12}px`,
            }}
          >
            {['const', 'function', 'return', 'if', 'else', 'async', 'await'][
              i % 7
            ]}
          </div>
        ))}
      </div>

      {/* Animated grid background */}
      <svg  
        className="absolute inset-0 w-full h-full opacity-20"
        preserveAspectRatio="none"
        viewBox="0 0 1024 1024"
      >
        {/* Horizontal lines with glow */}
        {[100, 250, 400, 550, 700, 850].map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="1024"
            y2={y}
            stroke="url(#gridGradient)"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
        {/* Vertical lines with glow */}
        {[100, 250, 400, 550, 700, 850].map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="1024"
            stroke="url(#gridGradient)"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
        {/* Glowing connection nodes */}
        {[
          { cx: 100, cy: 100 },
          { cx: 250, cy: 250 },
          { cx: 400, cy: 100 },
          { cx: 700, cy: 550 },
          { cx: 850, cy: 700 },
          { cx: 100, cy: 700 },
          { cx: 550, cy: 850 },
          { cx: 900, cy: 900 },
          { cx: 150, cy: 400 },
        ].map((node, i) => (
          <circle
            key={`node-${i}`}
            cx={node.cx}
            cy={node.cy}
            r="6"
            fill="url(#nodeGradient)"
            opacity="0.6"
            className="animate-pulseGlow"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d9ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00d9ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00d9ff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#00d9ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#00d9ff" stopOpacity="0.3" />
          </radialGradient>
        </defs>
      </svg>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-2xl" />

        {/* Login card */}
        <div className="relative backdrop-blur-md border border-accent/30 rounded-2xl p-8 md:p-10 bg-card/40 animate-slideUp">
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full blur-md" />

          {/* Animated logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20 animate-float">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                fill="none"
                stroke="#00d9ff"
                strokeWidth="2"
              >
                {/* Outer circle */}
                <circle
                  cx="50"
                  cy="25"
                  r="12"
                  className="animate-codeFlow"
                  style={{ animationDelay: '0s' }}
                />
                <circle
                  cx="35"
                  cy="50"
                  r="10"
                  className="animate-codeFlow"
                  style={{ animationDelay: '0.3s' }}
                />
                <circle
                  cx="65"
                  cy="50"
                  r="10"
                  className="animate-codeFlow"
                  style={{ animationDelay: '0.6s' }}
                />
                <circle
                  cx="50"
                  cy="75"
                  r="12"
                  className="animate-codeFlow"
                  style={{ animationDelay: '0.9s' }}
                />

                {/* Center element */}
                <circle cx="50" cy="50" r="6" fill="#00d9ff" opacity="0.8" />

                {/* Connecting lines with animation */}
                <line
                  x1="50"
                  y1="37"
                  x2="50"
                  y2="44"
                  className="animate-codeFlow"
                  style={{ animationDelay: '0.1s' }}
                />
                <line
                  x1="50"
                  y1="56"
                  x2="50"
                  y2="63"
                  className="animate-codeFlow"
                  style={{ animationDelay: '0.2s' }}
                />
                <line
                  x1="42"
                  y1="50"
                  x2="48"
                  y2="50"
                  className="animate-codeFlow"
                  style={{ animationDelay: '0.3s' }}
                />
                <line
                  x1="52"
                  y1="50"
                  x2="58"
                  y2="50"
                  className="animate-codeFlow"
                  style={{ animationDelay: '0.4s' }}
                />
              </svg>

              {/* Glow ring around logo */}
              <div className="absolute inset-0 border-2 border-accent/30 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Title with gradient */}
          <div className="text-center mb-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              <span className="text-foreground">Code</span>
              <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                Navigator
              </span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Visualize Your Code Flow
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div
              className="space-y-2 animate-slideUp"
              style={{ animationDelay: '0.2s' }}
            >
              <label htmlFor="email" className="block text-sm text-muted-foreground">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="dev@codenavigator.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-input/50 border border-accent/30 rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-accent/50"
              />
            </div>

            {/* Password Input */}
            <div
              className="space-y-2 animate-slideUp"
              style={{ animationDelay: '0.3s' }}
            >
              <label htmlFor="password" className="block text-sm text-muted-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input/50 border border-accent/30 rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-accent/50"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-accent to-blue-400 hover:from-accent hover:to-blue-300 disabled:from-accent/50 disabled:to-blue-400/50 text-background font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 relative overflow-hidden group animate-slideUp"
              style={{ animationDelay: '0.4s' }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

              <span className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  'Log In to Navigator'
                )}
              </span>
            </button>
          </form>

          {/* Footer Links */}
          <div
            className="flex justify-between items-center mt-8 text-sm animate-slideUp"
            style={{ animationDelay: '0.5s' }}
          >
            <a
              href="#"
              className="text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              Forgot password?
            </a>
            <Link
              href="/user/signup"
              className="text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              Create account
            </Link>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full blur-md" />
        </div>

        {/* Decorative floating elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}
