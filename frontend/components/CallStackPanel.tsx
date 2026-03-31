"use client";

import { useCodeStore } from '../store/useCodeStore';
import { Layers } from 'lucide-react';

export function CallStackPanel() {
  const callStack = useCodeStore((state) => state.executionState.callStack);

  return (
    <div className="flex flex-col h-full bg-card border-b border-border">
      <div className="px-3 py-2 bg-secondary/50 border-b border-border text-muted-foreground font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
        <Layers size={14} className="text-primary" /> Call Stack
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 flex flex-col-reverse gap-2.5 custom-scrollbar">
        {callStack.length === 0 ? (
          <div className="text-muted-foreground/40 text-[11px] italic text-center mt-6">No active stack frames</div>
        ) : (
          callStack.map((frame, idx) => (
            <div 
              key={idx} 
              className={`rounded-md border shadow-sm transition-all duration-500 overflow-hidden
                ${idx === callStack.length - 1 
                  ? 'border-primary bg-background shadow-primary/10 ring-1 ring-primary/30 z-10' 
                  : 'border-border bg-card/30 opacity-60 grayscale-[0.2] scale-[0.98]'}
              `}
            >
              <div className={`px-2.5 py-1.5 border-b text-[11px] font-bold flex justify-between items-center transition-colors
                ${idx === callStack.length - 1 ? 'border-primary/20 bg-primary/5 text-primary' : 'border-border bg-muted/20 text-muted-foreground'}
              `}>
                <span className="font-mono">{frame.funcName}()</span>
                {idx === callStack.length - 1 && <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-primary text-primary-foreground">Active</span>}
              </div>
              
              <div className="p-3">
                {Object.keys(frame.locals).length === 0 ? (
                  <div className="text-[#6c7086] text-[11px] italic">No local variables</div>
                ) : (
                  <div className="space-y-1">
                    {Object.entries(frame.locals).map(([key, value]) => {
                      let displayValue = String(value);
                      let valueClass = "text-foreground";
                      
                      if (value && typeof value === 'object' && '__ref' in value) {
                        displayValue = `ref:${(value as any).__ref}`;
                        valueClass = "text-[#cba6f7] bg-[#cba6f7]/10 px-1 rounded font-bold";
                      } else if (typeof value === 'number') {
                        valueClass = "text-[#fab387]"; // Peach
                      } else if (typeof value === 'string') {
                        valueClass = "text-[#a6e3a1]"; // Green
                        displayValue = `'${value}'`;
                      } else if (typeof value === 'boolean') {
                        valueClass = "text-[#89b4fa] italic"; // Blue
                      }

                      return (
                        <div key={key} className="flex justify-between items-center text-[10px] font-mono group/var py-0.5">
                          <span className="text-[#89b4fa]/80 group-hover/var:text-[#89b4fa] transition-colors">{key}</span>
                          <span className={`${valueClass} truncate max-w-[140px] transition-all`} title={displayValue}>
                            {displayValue}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
