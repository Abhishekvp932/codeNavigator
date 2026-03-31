"use client";

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useCodeStore } from '../store/useCodeStore';

export function DirectOutput() {
  const code = useCodeStore((state) => state.code);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleInstantRun = () => {
    setIsRunning(true);
    // Give UI a tick to update
    setTimeout(() => {
      const capturedOutput: string[] = [];
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      // Mock console
      console.log = (...args) => {
        capturedOutput.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        originalLog(...args);
      };
      console.error = (...args) => {
        capturedOutput.push(`Error: ` + args.map(a => String(a)).join(' '));
        originalError(...args);
      };
      console.warn = (...args) => {
        capturedOutput.push(`Warn: ` + args.map(a => String(a)).join(' '));
        originalWarn(...args);
      };

      try {
        // Execute code in browser context safely
        const fn = new Function(code);
        const result = fn();
        if (result !== undefined) {
          capturedOutput.push(`Returned: ${typeof result === 'object' ? JSON.stringify(result) : String(result)}`);
        }
        if (capturedOutput.length === 0) {
          capturedOutput.push('Execution completed with no output.');
        }
      } catch (e: any) {
        capturedOutput.push(`Exception: ${e.message}`);
      } finally {
        // Restore
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        setOutputLines(capturedOutput);
        setIsRunning(false);
      }
    }, 50);
  };

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="flex justify-between items-center px-3 py-1.5 bg-secondary/50 border-b border-border shrink-0">
        <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 pl-1">
          Instant Runner
        </span>
        <button 
          onClick={handleInstantRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-sm"
        >
          <Play size={10} fill="currentColor" /> {isRunning ? 'Running' : 'Instant Run'}
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto text-[13px] font-mono space-y-1.5 bg-card/30 custom-scrollbar">
        {outputLines.length === 0 ? (
          <div className="text-muted-foreground/30 italic text-[11px] font-sans">Run code to see immediate results...</div>
        ) : (
          outputLines.map((msg, idx) => (
            <div key={idx} className={`pb-1.5 border-b border-border/30 flex gap-3 transition-colors hover:bg-white/5 px-2 -mx-2 rounded ${msg.startsWith('Error') || msg.startsWith('Exception') ? 'text-destructive/90' : 'text-foreground/90'}`}>
              <span className="text-accent opacity-50 shrink-0 select-none">❯</span>
              <span className="break-all">{msg}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
