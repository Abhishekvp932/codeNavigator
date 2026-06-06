"use client";

import React, { useEffect, useRef } from "react";
import { useCodeStore } from "../store/useCodeStore";

export function ConsoleOutput() {
  const consoleOutput = useCodeStore((state) => state.executionState.consoleOutput);
  const endOfOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfOutputRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleOutput]);

  return (
    <div className="cn-panel flex h-full flex-col rounded-none border-0">
      <div className="cn-panel-header">
        <span className="cn-icon-label">
          <span className="cn-status-dot" />
          Console
        </span>
        <span className="font-mono text-[10px]">{consoleOutput.length}</span>
      </div>
      <div className="flex-1 min-h-0 overflow-auto bg-[#0b1017] p-2 font-mono text-[12px] custom-scrollbar">
        {consoleOutput.length === 0 ? (
          <div className="flex items-center gap-2 text-[11px] font-sans text-muted-foreground">
            <span className="size-1.5 rounded-full bg-muted-foreground/30" />
            Ready
          </div>
        ) : (
          <div className="space-y-1">
            {consoleOutput.map((msg, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[36px_minmax(0,1fr)] gap-2 rounded border-b border-border/25 px-1.5 py-1 text-foreground/90 hover:bg-white/[0.03]"
              >
                <span className="select-none text-right text-muted-foreground">{idx + 1}</span>
                <span className="break-words">{msg}</span>
              </div>
            ))}
          </div>
        )}
        <div ref={endOfOutputRef} />
      </div>
    </div>
  );
}
