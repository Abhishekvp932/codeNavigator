"use client";

import { useCodeStore } from '../store/useCodeStore';

export function VariableTracker() {
  const variables = useCodeStore((state) => state.executionState.variables);

  return (
    <div className="cn-panel flex h-full flex-col rounded-none border-0 overflow-hidden">
      <div className="cn-panel-header">
        <span className="cn-icon-label">
          <span className="cn-status-dot" />
          Global Scope
        </span>
      </div>
      <div className="flex-1 min-h-0 p-2 overflow-auto bg-[#0b1017] custom-scrollbar">
        {Object.entries(variables).length === 0 ? (
          <div className="text-muted-foreground text-[11px] font-sans text-center mt-4">No global variables</div>
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
                <div key={key} className="grid grid-cols-[minmax(0,1fr)_minmax(70px,auto)] gap-2 text-[11px] font-mono border border-border/40 rounded-md bg-background/70 py-1.5 px-2">
                  <span className="text-primary/85 truncate" title={key}>{key}</span>
                  <span className={`${valueClass} truncate font-semibold text-right`} title={displayValue}>
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
