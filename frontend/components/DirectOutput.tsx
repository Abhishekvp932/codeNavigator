"use client";

import React, { useState } from "react";
import { Play, Zap } from "lucide-react";
import { useCodeStore } from "../store/useCodeStore";

export function DirectOutput() {
  const code = useCodeStore((state) => state.code);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleInstantRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const capturedOutput: string[] = [];
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      console.log = (...args) => {
        capturedOutput.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
        originalLog(...args);
      };
      console.error = (...args) => {
        capturedOutput.push(`Error: ${args.map((a) => String(a)).join(" ")}`);
        originalError(...args);
      };
      console.warn = (...args) => {
        capturedOutput.push(`Warn: ${args.map((a) => String(a)).join(" ")}`);
        originalWarn(...args);
      };

      try {
        const fn = new Function(code);
        const result = fn();
        if (result !== undefined) {
          capturedOutput.push(`Returned: ${typeof result === "object" ? JSON.stringify(result) : String(result)}`);
        }
        if (capturedOutput.length === 0) capturedOutput.push("Execution completed with no output.");
      } catch (e: any) {
        capturedOutput.push(`Exception: ${e.message}`);
      } finally {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        setOutputLines(capturedOutput);
        setIsRunning(false);
      }
    }, 50);
  };

  return (
    <div className="cn-panel flex h-full flex-col rounded-none border-0">
      <div className="cn-panel-header">
        <span className="cn-icon-label">
          <Zap size={13} />
          Instant Runner
        </span>
        <button
          onClick={handleInstantRun}
          disabled={isRunning}
          className="inline-flex h-6 items-center gap-1.5 rounded-md bg-accent px-2 text-[10px] font-semibold text-accent-foreground transition-colors hover:brightness-110 disabled:opacity-40"
        >
          <Play size={10} fill="currentColor" />
          {isRunning ? "Running" : "Run"}
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-auto bg-[#0b1017] p-2 font-mono text-[12px] custom-scrollbar">
        {outputLines.length === 0 ? (
          <div className="text-[11px] font-sans text-muted-foreground">
            Run code to see immediate results.
          </div>
        ) : (
          <div className="space-y-1">
            {outputLines.map((msg, idx) => {
              const isError = msg.startsWith("Error") || msg.startsWith("Exception");
              return (
                <div
                  key={idx}
                  className={`grid grid-cols-[36px_minmax(0,1fr)] gap-2 rounded border-b border-border/25 px-1.5 py-1 hover:bg-white/[0.03] ${
                    isError ? "text-destructive" : "text-foreground/90"
                  }`}
                >
                  <span className="select-none text-right text-muted-foreground">{idx + 1}</span>
                  <span className="break-words">{msg}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
