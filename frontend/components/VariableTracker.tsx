"use client";

import { useCodeStore } from '../store/useCodeStore';

export function VariableTracker() {
  const variables = useCodeStore((state) => state.executionState.variables);

  return (
    <div className="flex flex-col h-1/2 bg-card border-b border-border overflow-hidden">
      <div className="px-3 py-2 bg-secondary/50 border-b border-border text-muted-foreground font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        Global Scope
      </div>
      <div className="flex-1 p-3 overflow-auto bg-card/30 custom-scrollbar">
        {Object.entries(variables).length === 0 ? (
          <div className="text-muted-foreground/30 italic text-[11px] font-sans text-center mt-4">No global variables</div>
        ) : (
          <div className="space-y-1.5">
            {Object.entries(variables).map(([key, value]) => {
              let displayValue = String(value);
              let valueClass = "text-foreground";
              
              if (value && typeof value === 'object' && '__ref' in value) {
                displayValue = `ref:${(value as any).__ref}`;
                valueClass = "text-[#cba6f7] bg-[#cba6f7]/10 px-1 rounded font-bold";
              } else if (typeof value === 'number') {
                valueClass = "text-[#fab387]"; // Peach/Orange
              } else if (typeof value === 'string') {
                valueClass = "text-[#a6e3a1]"; // Green
                displayValue = `'${value}'`;
              } else if (typeof value === 'boolean') {
                valueClass = "text-[#89b4fa] italic"; // Blue
              } else if (value === null) {
                displayValue = 'null';
                valueClass = "text-[#f38ba8]/70"; // Red
              } else if (typeof value === 'undefined') {
                displayValue = 'undefined';
                valueClass = "text-[#9399b2] italic"; // Overlay
              }

              return (
                <div key={key} className="flex justify-between items-center text-[11px] font-mono border border-border/30 rounded-md bg-background/50 py-1.5 px-2.5 group/var transition-all hover:border-border/60">
                  <span className="text-[#89b4fa]/80 group-hover/var:text-[#89b4fa] transition-colors truncate mr-2" title={key}>{key}</span>
                  <span className={`${valueClass} truncate font-bold max-w-[120px] transition-all`} title={displayValue}>
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
