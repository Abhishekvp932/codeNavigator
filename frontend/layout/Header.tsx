import React from 'react';

export default function Header() {
  return (
    <header className="h-[48px] bg-card border-b border-border flex items-center px-6 shrink-0 z-[100] shadow-sm">
      <div className="flex items-center gap-2 group cursor-default">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
          <span className="text-[10px] font-black text-primary-foreground italic">CN</span>
        </div>
        <h1 className="text-sm font-black tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          CODE NAVIGATOR
        </h1>
        <div className="ml-4 px-2 py-0.5 rounded bg-secondary/50 border border-border/50 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
          IDE v2.5
        </div>
      </div>
    </header>
  );
}