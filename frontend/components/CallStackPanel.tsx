"use client";

import { useCodeStore } from '../store/useCodeStore';
import { Layers } from 'lucide-react';

export function CallStackPanel() {
  const callStack = useCodeStore((state) => state.executionState.callStack);

  return (
    <div className="flex flex-col h-full bg-[#181825] border-b border-[#313244]">
      <div className="p-2 bg-[#11111b] border-b border-[#313244] text-[#a6adc8] font-semibold text-xs flex items-center gap-2">
        <Layers size={14} className="text-[#89b4fa]" /> Call Stack
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-3">
        {callStack.length === 0 ? (
          <div className="text-[#6c7086] text-xs italic text-center mt-4">No active frames</div>
        ) : (
          callStack.map((frame, idx) => (
            <div 
              key={idx} 
              className={`rounded-lg border shadow-sm transition-all duration-300 transform
                ${idx === callStack.length - 1 
                  ? 'border-[#a6e3a1] bg-[#1e1e2e]/50 shadow-[#a6e3a1]/10 scale-100 opacity-100 ring-1 ring-[#a6e3a1] z-10' 
                  : 'border-[#313244] bg-[#11111b]/50 scale-[0.98] opacity-70'}
              `}
            >
              <div className={`px-3 py-1.5 border-b text-xs font-bold rounded-t-lg flex justify-between items-center
                ${idx === callStack.length - 1 ? 'border-[#a6e3a1] bg-[#a6e3a1]/10 text-[#a6e3a1]' : 'border-[#313244] bg-[#1e1e2e] text-[#a6adc8]'}
              `}>
                <span>{frame.funcName}()</span>
                {idx === callStack.length - 1 && <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#a6e3a1]/20">Active</span>}
              </div>
              
              <div className="p-3">
                {Object.keys(frame.locals).length === 0 ? (
                  <div className="text-[#6c7086] text-[11px] italic">No local variables</div>
                ) : (
                  <div className="space-y-1.5">
                    {Object.entries(frame.locals).map(([key, value]) => {
                      let displayValue = String(value);
                      let valueColor = "text-[#cdd6f4]";
                      
                      if (value && typeof value === 'object' && '__ref' in value) {
                        displayValue = `[ref: ${value.__ref}]`;
                        valueColor = "text-[#f9e2af]"; // yellow for references
                      } else if (typeof value === 'number') {
                        valueColor = "text-[#fab387]"; // orange for numbers
                      } else if (typeof value === 'string') {
                        valueColor = "text-[#a6e3a1]"; // green for strings
                        displayValue = `"${value}"`;
                      }

                      return (
                        <div key={key} className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[#89b4fa]">{key}</span>
                          <span className={`${valueColor} truncate max-w-[120px]`} title={displayValue}>
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
