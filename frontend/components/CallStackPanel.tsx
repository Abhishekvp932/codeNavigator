"use client";

import { useCodeStore } from '../store/useCodeStore';
import { Layers } from 'lucide-react';

export function CallStackPanel() {
  const callStack = useCodeStore((state) => state.executionState.callStack);

  return (
    <div className="cn-panel flex h-full flex-col rounded-none border-0 border-r">
      <div className="cn-panel-header">
        <span className="cn-icon-label"><Layers size={14} /> Call Stack</span>
        <span className="font-mono text-[10px]">{callStack.length}</span>
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto p-2 flex flex-col-reverse gap-2 custom-scrollbar">
        {callStack.length === 0 ? (
          <div className="text-muted-foreground text-[11px] text-center mt-6">No active stack frames</div>
        ) : (
          callStack.map((frame, idx) => (
            <div 
              key={idx} 
              className={`rounded-md border transition-colors overflow-hidden
                ${idx === callStack.length - 1 
                  ? 'border-primary/60 bg-background' 
                  : 'border-border bg-background/45 opacity-70'}
              `}
            >
              <div className={`px-2.5 py-1.5 border-b text-[11px] font-semibold flex justify-between items-center
                ${idx === callStack.length - 1 ? 'border-primary/20 bg-primary/10 text-primary' : 'border-border bg-muted/20 text-muted-foreground'}
              `}>
                <span className="font-mono">{frame.funcName}()</span>
                {idx === callStack.length - 1 && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary text-primary-foreground">Active</span>}
              </div>
              
              <div className="p-2.5">
                {Object.keys(frame.locals).length === 0 ? (
                  <div className="text-muted-foreground text-[11px]">No local variables</div>
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
                        <div key={key} className="grid grid-cols-[minmax(0,1fr)_minmax(70px,auto)] gap-2 text-[10px] font-mono py-0.5">
                          <span className="text-primary/85 truncate" title={key}>{key}</span>
                          <span className={`${valueClass} truncate text-right`} title={displayValue}>
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
