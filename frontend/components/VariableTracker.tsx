"use client";

import { useCodeStore } from '../store/useCodeStore';

export function VariableTracker() {
  const variables = useCodeStore((state) => state.executionState.variables);

  return (
    <div className="flex flex-col h-1/2 border-b border-[#313244]">
      <div className="p-3 bg-[#11111b] border-b border-[#313244] text-[#a6adc8] font-semibold text-sm">
        Variables Scope
      </div>
      <div className="flex-1 p-4 overflow-auto bg-[#181825]">
        {Object.entries(variables).length === 0 ? (
          <div className="text-[#6c7086] text-sm italic">No variables in scope.</div>
        ) : (
          <div className="space-y-2">
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center text-sm font-mono border border-[#313244] rounded bg-[#1e1e2e] py-2 px-3">
                <span className="text-[#89b4fa] truncate mr-2" title={key}>{key}</span>
                <span className="text-[#a6e3a1] truncate font-bold" title={String(value)}>
                  {value === null ? 'null' : typeof value === 'undefined' ? 'undefined' : String(value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
