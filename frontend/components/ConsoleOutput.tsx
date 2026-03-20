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
    <div className="flex flex-col h-1/2 bg-[#1e1e2e]">
      <div className="p-3 bg-[#11111b] border-b border-[#313244] text-[#a6adc8] font-semibold text-sm flex justify-between">
        <span>Console</span>
      </div>
      <div className="flex-1 p-4 overflow-auto text-sm font-mono space-y-1 bg-[#181825]">
        {consoleOutput.length === 0 ? (
          <div className="text-[#6c7086] italic">Ready...</div>
        ) : (
          consoleOutput.map((msg, idx) => (
            <div key={idx} className="text-[#cdd6f4] border-b border-[#313244] py-1 border-opacity-50">
              <span className="text-[#a6adc8] mr-2 opacity-50">&gt;</span>
              {msg}
            </div>
          ))
        )}
        <div ref={endOfOutputRef} />
      </div>
    </div>
  );
}
