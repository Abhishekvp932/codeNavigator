"use client";

import React, { useEffect, useRef } from 'react';
import { useCodeStore } from '../store/useCodeStore';

export function ConsoleOutput() {
  const consoleOutput = useCodeStore((state) => state.executionState.consoleOutput);
  const endOfOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfOutputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleOutput]);

  return (
    <div className="flex flex-col h-1/2 bg-card overflow-hidden">
      <div className="px-3 py-2 bg-secondary/50 border-b border-border text-muted-foreground font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Console
      </div>
      <div className="flex-1 p-4 overflow-auto text-[13px] font-mono space-y-1.5 bg-card/30 custom-scrollbar">
        {consoleOutput.length === 0 ? (
          <div className="text-muted-foreground/30 italic text-[11px] font-sans flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
            Ready
          </div>
        ) : (
          consoleOutput.map((msg, idx) => (
            <div key={idx} className="text-foreground/90 border-b border-border/30 pb-1.5 flex gap-3 transition-colors hover:bg-white/5 px-2 -mx-2 rounded">
              <span className="text-primary opacity-50 shrink-0 select-none">❯</span>
              <span className="break-all">{msg}</span>
            </div>
          ))
        )}
        <div ref={endOfOutputRef} />
      </div>
    </div>
  );
}
