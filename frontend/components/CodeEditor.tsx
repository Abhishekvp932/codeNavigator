"use client";

import React, { useEffect } from 'react';
import { useCodeStore } from '../store/useCodeStore';
import { generateFlowGraph } from '../utils/astParser';

export function CodeEditor() {
  const code = useCodeStore((state) => state.code);
  const setCode = useCodeStore((state) => state.setCode);
  const setFlowGraph = useCodeStore((state) => state.setFlowGraph);
  const isRunning = useCodeStore((state) => state.executionState.isRunning);

  // Re-generate flow graph whenever code changes, unless running
  useEffect(() => {
    if (!isRunning) {
      const { nodes, edges } = generateFlowGraph(code);
      setFlowGraph(nodes, edges);
    }
  }, [code, isRunning, setFlowGraph]);

  return (
    <div className="flex flex-col h-full bg-[#181825] border-r border-[#313244]">
      <div className="p-3 bg-[#11111b] border-b border-[#313244] text-[#a6adc8] font-semibold text-sm">
        Source Code
      </div>
      <textarea
        className="flex-1 p-4 bg-transparent text-[#cdd6f4] font-mono text-sm resize-none outline-none focus:ring-0"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={isRunning}
        spellCheck={false}
      />
    </div>
  );
}
