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
    <div className="flex flex-col h-full bg-[#181825]">
      <div className="flex justify-between items-center p-2 bg-[#11111b] border-b border-[#313244]">
        <span className="text-[#a6adc8] font-semibold text-sm px-2">Instant Output</span>
        <button 
          onClick={handleInstantRun}
          disabled={isRunning}
          className="flex items-center gap-1 bg-[#89b4fa] hover:bg-opacity-90 text-[#11111b] px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Play size={14} fill="currentColor" /> {isRunning ? 'Running...' : 'Run Instant'}
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto text-sm font-mono space-y-1 bg-[#181825]">
        {outputLines.length === 0 ? (
          <div className="text-[#6c7086] italic text-xs">Click "Run Instant" to see the direct javascript output...</div>
        ) : (
          outputLines.map((msg, idx) => (
            <div key={idx} className={`py-1 border-opacity-50 ${msg.startsWith('Error') || msg.startsWith('Exception') ? 'text-[#f38ba8]' : 'text-[#cdd6f4]'}`}>
              <span className="text-[#a6adc8] mr-2 opacity-50">&gt;</span>
              {msg}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
